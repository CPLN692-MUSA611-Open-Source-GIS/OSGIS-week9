/* =====================
Leaflet Configuration
===================== */

var mapOpts = {
  center: [40.000, -75.1090],
  zoom: 11
};
var map = L.map('map', mapOpts);

var tileOpts = {
  attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  subdomains: 'abcd',
  minZoom: 0,
  maxZoom: 20,

  ext: 'png'
};
var Stamen_TonerLite = L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png', tileOpts).addTo(map);


var zipcodeURL = "https://raw.githubusercontent.com/CPLN692-MUSA611-Open-Source-GIS/datasets/master/geojson/Zipcodes_Poly.geojson"
var zipcodeVaccURL = "https://raw.githubusercontent.com/CPLN692-MUSA611-Open-Source-GIS/OSGIS-week9/master/assignment/vaccination_by_zip.json"
var zipcodePopURL = "https://gist.githubusercontent.com/tybradf/1211e46083b9109d0433c40e10b4908e/raw/9ca5cdd8b0ded8c8f487fa0de7c71a1f1efafa20/pa_population_by_zip.json"


var createBarChart = function(){
  var ctx = document.getElementById('myChart');
  barChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
        datasets: [{
            label: '# of Votes',
            data: [12, 19, 3, 5, 2, 3],
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 333, 64, 1)'
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

$.when($.ajax(zipcodeURL),$.ajax(zipcodePopURL)).then(function(zipcodeRes, zipcodePopRes, third){
  zipcodeData = JSON.parse(zipcodeRes[0])
  zipcodePopData = JAON.parse(zipcodePopRes[0])

  L.geoJSON(zipcodeData,{
    oneEachFeature: function(feat, layer){
      layer.on('click',function(e){
        console.log(feat,layer)
        var zipcode = feat.properties.CODE
        console.log(zipcode, zipcodePopData[zipcode])
        createBarChart(zipcodePopData[zipcode])
      })
    }
  }).addTo(map)
})


createBarChart()
