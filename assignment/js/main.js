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


var createBarChart = function(datum){
  var ctx = document.getElementById('myChart');
  barChart = new Chart(ctx, {
    type: 'bar',
    data: datum,
    options: {
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});
}

var updateBarChart = function(vaccData){
  barChart.data.datasets[0].data[0] = vaccData.partially_vaccinated
  barChart.data.datasets[0].data[0] = vaccData.fully_vaccinated
  barChart.update()
}

$.when($.ajax(zipcodeURL),$.ajax(zipcodePopURL)).then(function(zipcodeRes, zipcodePopRes, third){
  zipcodeData = JSON.parse(zipcodeRes[0])
  zipcodePopData = JSON.parse(zipcodePopRes[0])
  zipcodeVaccData = JSON.parse(zipcodePopRes[0])
  console.log(zipcodePopData[0])

  L.geoJson(zipcodeData,{
    oneEachFeature: function(feat, layer){
      layer.on('click',function(e){
        console.log(feat,layer)
        var zipcode = feat.properties.CODE
        console.log(zipcode, zipcodePopData[zipcode])
        if(barChart){
          updateBarChart(zipcodeVaccData[zipcode])
        }else{
          createBarChart(zipcodePopData[zipcode])
        }
        console.log(zipcodePopData.filter(function(datum){
          datum.zip === zipcode
        }))
      })
    },
    style: {color: "white", weight: 2.5}
  }).addTo(map)
})
