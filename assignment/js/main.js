var zipgons;
var zipgon;
var vccData;
var zipcode;
var popObj; 
var percentage;


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

var zipgonClick = function(e) {
    // Change style
    if(zipgon){resetHighlight(zipgon)};
    zipgon = e.target;
    highlightFeature(zipgon)

    // Get zip code
    zipcode = zipgon.feature.properties.CODE;
    console.log(zipcode)
    $('#zipcode').text(zipcode);
    $('#pop').text(popObj[zipcode])

    // vaccination data
    var fullyVcc = vccData[zipcode]["fully_vaccinated"]
    var partiallyVcc = vccData[zipcode]["partially_vaccinated"]

    // bar chart
    Chart.defaults.font.size = 14;
    $('#barChart').remove();
    $('#bar').append('<canvas id="barChart"></canvas>')
    var ctx = document.getElementById('barChart').getContext('2d');
    var barChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['fully', 'partially'],
            datasets: [{
                label: '# of vaccinated People',
                data: [fullyVcc, partiallyVcc],
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

    // Pie chart
    var vccPeo = fullyVcc + partiallyVcc;
    var nonVccPeo = popObj[zipcode] - vccPeo;
    console.log(nonVccPeo)

    $('#pieChart').remove();
    $('#pie').append('<canvas id="pieChart"></canvas>')
    ctx = document.getElementById('pieChart').getContext('2d');
    if(pieChart) {pieChart.destroy()}
    var pieChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['vaccinated', "not vaccinated"],
            datasets: [{
                data: [vccPeo, nonVccPeo],
                backgroundColor: [
                    'rgba(253,141,60,0.7)',
                    'rgba(255, 237, 160,0.7)'
                  ],
                hoverOffset: 4 
            }]      
        }
    })
}

function onEachFeature(feature, layer) {
    layer.on({
        click: zipgonClick
    });
}

$.ajax('https://raw.githubusercontent.com/CPLN692-MUSA611-Open-Source-GIS/datasets/master/geojson/Zipcodes_Poly.geojson').done(function(data) {
    var parsedData = JSON.parse(data);
    console.log(parsedData)

    $.ajax('https://raw.githubusercontent.com/CPLN692-MUSA611-Open-Source-GIS/OSGIS-week9/master/assignment/vaccination_by_zip.json').done(function(data) {
        vccData = JSON.parse(data);
        // console.log(vccData);
        $('#date').text(vccData[Object.keys(vccData)[0]]['etl_timestamp'].substr(0,10));

        var url = 'http://www.whateverorigin.org/get?url=' + encodeURIComponent("http://zipatlas.com/us/pa/philadelphia/zip-code-comparison/population-density.htm") + '&callback=?';
        
        $.getJSON(url, function(data){
            // Crawl population by zipcode
            var tempDom = $('<output>').append($.parseHTML(data.contents));
            var popTable = $('td.report_header', tempDom).parent().siblings();
            var zipcodes = popTable.map(function(_, element){
                return $(':nth-child(2)',element).text().substr(0,5);
            }).get();
            var pop = popTable.map(function(_, element){
                return  parseInt($(':nth-child(5)',element).text().replace(/,/g, ''));
            }).get();
        
            // Population and percentage
            popObj = {};
            percentage = {};
            zipcodes.forEach((key, i) => {
                popObj[key] = pop[i];
                if(vccData[key]) {
                    percentage[key] = (vccData[key]["fully_vaccinated"] + vccData[key]["partially_vaccinated"]) / pop[i];
                }
            });

            // console.log(popObj)
            // console.log(percentage)

            parsedData.features.forEach((z) => {
                var i = z.properties.CODE
                z.properties.percentage = percentage[i]
                z.properties.population = popObj[i] 
            })
            
            console.log(parsedData)

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

        });
    })
})