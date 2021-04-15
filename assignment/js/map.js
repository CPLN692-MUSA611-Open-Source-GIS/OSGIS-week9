var map = L.map('map', {
    center: [40.000, -75.1090],
    zoom: 10
  });
  
  var Stamen_TonerLite = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
    attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    subdomains: 'abcd',
    minZoom: 0,
    maxZoom: 20,
    ext: 'png'
  }).addTo(map);

  //data
var phillyPoly = "https://raw.githubusercontent.com/CPLN692-MUSA611-Open-Source-GIS/datasets/master/geojson/Zipcodes_Poly.geojson"
var vaccination = "https://raw.githubusercontent.com/jiaxuanlyu/OSGIS-week9/master/assignment/vaccination_by_zip.json"
var featureGroup;

var vaccinationData;

var ctx = document.getElementById("myChart");
var myChart;


//click event
var eachFeatureFunction = function(layer) {
    layer.on('click', function (event) {
      /* =====================
      The following code will run every time a layer on the map is clicked.
      Check out layer.feature to see some useful data about the layer that
      you can use in your application.
      ===================== */
      map.fitBounds(event.target.getBounds());


      //console.log(event.target.feature.properties.CODE)
      var zipcode = event.target.feature.properties.CODE
      var vaccinationInfo = vaccinationData[zipcode]
      console.log(`There are ${vaccinationInfo.partially_vaccinated} people being partially vaccinated, and there are ${vaccinationInfo.fully_vaccinated} people being fully vaccinated.`)
      var showData = [vaccinationInfo.partially_vaccinated, vaccinationInfo.fully_vaccinated]

      const vaccinationPlotData = {
        labels: ['partially vaccinated', 'fully vaccinated'],
        datasets: [{
          label: `Vaccination Statistics in the zipcode ${zipcode}`,
          data: showData,
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(255, 159, 64, 0.2)'
          ],
          borderColor: [
            'rgb(255, 99, 132)',
            'rgb(255, 159, 64)'
          ],
          borderWidth: 1
        }]
      }

      myChart = new Chart(ctx, {
        type: 'bar',
        data: vaccinationPlotData,
        options: {
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      })
      

    });
  };





  


  


$(document).ready(function() {

    //read vaccination data
    $.ajax(vaccination).done(function(data) {
        vaccinationData = JSON.parse(data)
    })

    //read polygons
    $.ajax(phillyPoly).done(function(data) {
        var parsedData = JSON.parse(data);
        
        featureGroup = L.geoJson(parsedData, {
        }).bindPopup(function (layer) {
            return `ZIP CODE: ${layer.feature.properties.CODE}`;
        }).addTo(map);

        // quite similar to _.each
        featureGroup.eachLayer(eachFeatureFunction);

    });
    


})