/* =====================
Leaflet Configuration
===================== */

var map = L.map('map', {
  center: [40.000, -75.1090],
  zoom: 11
});
var Stamen_TonerLite = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
  attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  subdomains: 'abcd',
  minZoom: 0,
  maxZoom: 20,
  ext: 'png'
}).addTo(map);



var polygon = "https://raw.githubusercontent.com/CPLN692-MUSA611-Open-Source-GIS/datasets/master/geojson/Zipcodes_Poly.geojson"
var vaccination = "https://raw.githubusercontent.com/CPLN692-MUSA611-Open-Source-GIS/OSGIS-week9/master/assignment/vaccination_by_zip.json"
var featureGroup;
var myBarChart;
var population = "https://raw.githubusercontent.com/hqiao97/data_test/main/zip_pop.json";
var pop;
var parsedvac;

var color = chroma.scale(['#fafa6e','#2A4858']).mode('lch').colors(6)


//find total population
var getTotalPop = function(pop, zip){
    for(var i in pop){
        if(pop[i].Zip==zip){
            var totalPop = pop[i].Population
        }
    }
    return totalPop
}

var myStyle = function(feature) {
    var zip = feature.properties.CODE

    if (parsedvac[zip] === undefined){

        return {fillOpacity: 0}
    }else{
        var partial = parsedvac[zip].partially_vaccinated
        var full = parsedvac[zip].fully_vaccinated

        var totalPop = getTotalPop(pop, zip)
        vacPer = (partial + full)/totalPop

        var parsedcolor = color[parseInt(vacPer*10)-1]
        return {fillColor: parsedcolor}

    }
};

var showResults = function() {
  $('#results').show();
};


var eachFeatureFunction = function(layer) {
  layer.on('click', function (event) {
    /* =====================
    The following code will run every time a layer on the map is clicked.
    Check out layer.feature to see some useful data about the layer that
    you can use in your application.
    ===================== */
    console.log(layer.feature);

    var zip = layer.feature.properties.CODE
    console.log(zip)

    map.fitBounds(event.target.getBounds());


    $('.zip').each(function() {
        console.log(zip)
        $(this).text(zip);
    });

    var totalPop = getTotalPop(pop, zip)
    console.log(totalPop)

    $.ajax(vaccination).done(function(data){
        var parsedvac = JSON.parse(data);
        console.log(parsedvac)
        console.log(zip)
        console.log(parsedvac[zip])
        var partial = parsedvac[zip].partially_vaccinated
        var full = parsedvac[zip].fully_vaccinated
        console.log(partial)

        //construct chart
        plotChart(totalPop, partial, full);

    })



    showResults();
  });
};



//plot charts
var plotChart = function(totalPop, partial, full){
    var unvaccinated = totalPop - partial - full
    //Bar Chart
    const labelsBar = ["partially vaccinated", "fully vaccinated"];
    const dataBar = {
        labels: labelsBar,
        datasets:[{
            label: 'Vaccination Information',
            data: [partial, full],
            backgroundColor: [
                'rgba(255, 159, 64, 0.2)',
                'rgba(153, 102, 255, 0.2)'
            ],
            borderColor: [
                'rgb(255, 159, 64)',
                'rgb(153, 102, 255)',
            ],
            borderWidth: 1
        }]
    };

    const config = {
        type: 'bar',
        data: dataBar,
        options: {
            scales:{
                y:{
                    beginAtZero: true
                }
            }
        }
    };

    //Pie chart
    const dataPie = {
        labels: [
            'Unvaccinated',
            'Partially Vaccinated',
            'Fully Vaccinated'
        ],
        datasets: [{
            label: 'Unvaccinated Information',
            data: [unvaccinated, partial, full],
            backgroundColor: [
                'rgb(255, 99, 132)',
                'rgb(255, 159, 64)',
                'rgb(153, 102, 255)',
                ],
                hoverOffset: 4
            }]
    };

    const configPie = {
        type: 'doughnut',
        data: dataPie,
    };

    if (myBarChart !== undefined){
        myBarChart.destroy()
        myPieChart.destroy()

    }

    myBarChart = new Chart(
        document.getElementById('myBarChart'),
        config
    );

    myPieChart = new Chart(
        document.getElementById('myPieChart'),
        configPie
    )


}


$(document).ready(function() {
  $.ajax(polygon).done(function(data) {
    var parsedData = JSON.parse(data);


    $.ajax(population).done(function(popdat){
        pop = JSON.parse(popdat);
        console.log("Population data set below")

        $.ajax(vaccination).done(function(datavac){

            parsedvac = JSON.parse(datavac);

            featureGroup = L.geoJson(parsedData, {
                style: myStyle
            }).addTo(map);

        featureGroup.eachLayer(eachFeatureFunction);

    })

    })




  });
});
