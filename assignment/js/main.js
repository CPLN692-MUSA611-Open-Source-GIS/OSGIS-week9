var parsedData;
var popData;
var vccData;
var zipgons;
var zipgon;
var zipcode;
var popObj; 
var percentage;
var barchart;
var piechart;


function getColor(d) {
    return d > 0.7 ? '#800026' :
           d > 0.6  ? '#BD0026' :
           d > 0.5  ? '#E31A1C' :
           d > 0.4  ? '#FC4E2A' :
           d > 0.3   ? '#FD8D3C' :
           d > 0.2   ? '#FEB24C' :
           d > 0.1   ? '#FED976' :
                      '#FFEDA0';
}

function style(feature) {
    return {
        fillColor: getColor(feature.properties.percentage),
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7
    };
}

function highlightFeature(layer) {
    layer.setStyle({
        weight: 6,
        // color: '#666',
        dashArray: '',
        fillOpacity: 0.7
    });

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
    }
}

function resetHighlight(layer) {
    zipgons.resetStyle(layer);
}

var createBarchart = function(data) {
    var ctx = document.getElementById('barChart').getContext('2d');
    barchart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['fully', 'partially'],
            datasets: [{
                label: '# of vaccinated People',
                data: data,
                backgroundColor: [
                    'rgba(227,26,28,0.7)',
                    'rgba(253,141,60,0.7)'
                ],
                borderColor: [
                    'rgb(128,0,38)',
                    'rgb(227,26,28)'
                ],
                borderWidth: 1
            }]
        },
        options: {               
            scales: {
                y: {
                    beginAtZero: true
                }
            }

        }
    });
}

var updateBarchart = function(data) {
    barchart.data.datasets[0].data = data
    barchart.update();
}

var createPiechart = function(data) {
    var ctx = document.getElementById('pieChart').getContext('2d');
    piechart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['vaccinated', "not vaccinated"],
            datasets: [{
                data: data,
                backgroundColor: [
                    'rgba(253,141,60,0.7)',
                    'rgba(255, 237, 160,0.7)'
                  ],
                hoverOffset: 4 
            }]      
        }
    })
}

var updatePiechart = function(data) {
    piechart.data.datasets[0].data = data
    piechart.update();
}

var zipgonClick = function(e) {
    // Change style
    if(zipgon){resetHighlight(zipgon)};
    zipgon = e.target;
    highlightFeature(zipgon)

    // Get zip code
    zipcode = zipgon.feature.properties.CODE;
    console.log(zipcode)
    $('#zipcode').text(zipcode);
    $('#pop').text(zipgon.feature.properties.population)

    // vaccination data
    var fullyVcc = vccData[zipcode]["fully_vaccinated"]
    var partiallyVcc = vccData[zipcode]["partially_vaccinated"]

    // bar chart
    Chart.defaults.font.size = 14;
    if(barchart){ 
        updateBarchart([fullyVcc, partiallyVcc]);
    } else {
        createBarchart([fullyVcc, partiallyVcc]);
    }
    

    // Pie chart
    var vccPeo = fullyVcc + partiallyVcc;
    var nonVccPeo = zipgon.feature.properties.population - vccPeo;
    if(piechart){ 
        updatePiechart([vccPeo, nonVccPeo]);
    } else {
        createPiechart([vccPeo, nonVccPeo]);
    }

}

function onEachFeature(feature, layer) {
    layer.on({
        click: zipgonClick
    });
}

zipgonsURL = 'https://raw.githubusercontent.com/CPLN692-MUSA611-Open-Source-GIS/datasets/master/geojson/Zipcodes_Poly.geojson'

vccURL = 'https://raw.githubusercontent.com/CPLN692-MUSA611-Open-Source-GIS/OSGIS-week9/master/assignment/vaccination_by_zip.json'

popURL = "https://gist.githubusercontent.com/tybradf/1211e46083b9109d0433c40e10b4908e/raw/9ca5cdd8b0ded8c8f487fa0de7c71a1f1efafa20/pa_population_by_zip.json";


$.when($.ajax(zipgonsURL)).then(function(data){
    parsedData = JSON.parse(data);
    return $.ajax(vccURL);

}).then(function(data) {

    vccData = JSON.parse(data);
    // console.log(vccData);
    $('#date').text(vccData[Object.keys(vccData)[0]]['etl_timestamp'].substr(0,10));
    return $.ajax(popURL);

}).then(function(data){

    popData = JSON.parse(data);
    parsedData.features.forEach((z) => {
        var i = z.properties.CODE
        
        z.properties.population = popData.filter((zipPop) => {
            return zipPop.zip === parseInt(i)
        })[0].pop
        if(vccData[i]){
            z.properties.percentage = (vccData[i]["fully_vaccinated"] + vccData[i]["partially_vaccinated"]) / z.properties.population
        }        
    })

    zipgons = L.geoJson(parsedData, {
        style: style,
        onEachFeature: onEachFeature
    }).addTo(map);
    
    // Add legend
    var legend = L.control({position: 'bottomright'});

    legend.onAdd = function (map) {

        var div = L.DomUtil.create('div', 'info legend'),
            grades = [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7],
            labels = [];

        // loop through our density intervals and generate a label with a colored square for each interval
        for (var i = 0; i < grades.length; i++) {
            div.innerHTML +=
                '<i style="background:' + getColor(grades[i] + 0.1) + '"></i> ' +
                grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
        }

        return div;
    };

    legend.addTo(map);


})
