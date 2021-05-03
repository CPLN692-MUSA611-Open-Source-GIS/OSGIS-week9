// /* =====================
//   Global Variables
// ===================== */
// var crimeData;
// var crimeFilters;
// var hexGrid;
// var mappedGrid;
var zipcodeData
var zipcodePopData
var barchart
var piechart
// var baseHexStyle = { stroke: false }
//
/* =====================
  Map Setup
===================== */
// Notice that we've been using an options object since week 1 without realizing it
var mapOpts = {
  center: [40.000, -75.1090],
  zoom: 11
};
var map = L.map('map', mapOpts);

// Another options object
var tileOpts = {
  attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  subdomains: 'abcd',
  minZoom: 0,
  maxZoom: 20,
  ext: 'png'
};
var Stamen_TonerLite = L.tileLayer('http://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}.{ext}', tileOpts).addTo(map);


var zipcodeURL = "https://raw.githubusercontent.com/CPLN692-MUSA611-Open-Source-GIS/datasets/master/geojson/Zipcodes_Poly.geojson"
var zipcodeVaccURL = "https://raw.githubusercontent.com/CPLN692-MUSA611-Open-Source-GIS/OSGIS-week9/master/assignment/vaccination_by_zip.json"
var zipcodePopURL = "https://gist.githubusercontent.com/tybradf/1211e46083b9109d0433c40e10b4908e/raw/9ca5cdd8b0ded8c8f487fa0de7c71a1f1efafa20/pa_population_by_zip.json"

var createBarChart = function(vaccData) {
  var ctx = document.getElementById('myBarChart').getContext('2d');
  barchart = new Chart(ctx, {
      type: 'bar',
      data: {
          labels: '# of Votes',
          datasets: [{
              label: ['Red', 'Blue'],
              data: [vaccData.partially_vaccinated, vaccData.fully_vaccinated],
              backgroundColor: [
                  'rgba(255, 99, 132, 0.2)',
                  'rgba(54, 162, 235, 0.2)',
                  // 'rgba(255, 206, 86, 0.2)',
                  // 'rgba(75, 192, 192, 0.2)',
                  // 'rgba(153, 102, 255, 0.2)',
                  // 'rgba(255, 159, 64, 0.2)'
              ],
              borderColor: [
                  'rgba(255, 99, 132, 1)',
                  'rgba(54, 162, 235, 1)',
                  // 'rgba(255, 206, 86, 1)',
                  // 'rgba(75, 192, 192, 1)',
                  // 'rgba(153, 102, 255, 1)',
                  // 'rgba(255, 159, 64, 1)'
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
  })
};

var updateBarChart = function(vaccData){
  barchart.data.datasets[0].data[0]=vaccData.partially_vaccinated
  barchart.data.datasets[0].data[1]=vaccData.fully_vaccinated
  barchart.update()
}

var createPieChart = function(popData, vaccData){
  var unvaccinated = popData.pop - vaccData.partially_vaccinated - vaccData.fully_vaccinated
  var ctx = document.getElementById('myPieChart').getContext('2d');
  var piechart = new Chart(ctx, {
      type: 'doughnut',
      data: {
          labels: ['Unvaccinated','Partial', 'Full'],
          datasets: [{
              label: 'Vaccinations',
              data: [unvaccinated, vaccData.partially_vaccinated, vaccData.fully_vaccinated],
              backgroundColor: [
                  'rgba(255, 99, 132, 0.2)',
                  'rgba(54, 162, 235, 0.2)',
                  'rgba(255, 206, 86, 0.2)'
                  // 'rgba(75, 192, 192, 0.2)',
                  // 'rgba(153, 102, 255, 0.2)',
                  // 'rgba(255, 159, 64, 0.2)'
              ],
              // borderColor: [
              //     'rgba(255, 99, 132, 1)',
              //     'rgba(54, 162, 235, 1)',
              //     'rgba(255, 206, 86, 1)'
              //     // 'rgba(75, 192, 192, 1)',
              //     // 'rgba(153, 102, 255, 1)',
              //     // 'rgba(255, 159, 64, 1)'
              // ],
              //borderWidth: 1
              hoverOffset: 4
          }]
      },
      // options: {
      //     scales: {
      //         y: {
      //             beginAtZero: true
      //         }
      //     }
      // }
  })
}

var updatePieChart = function(popData, vaccData){
  var unvaccinated = popData.pop - vaccData.partially_vaccinated - vaccData.fully_vaccinated
  piechart.data.datasets[0].data[0]=vaccData.unvaccinated
  piechart.data.datasets[0].data[1]=vaccData.fully_vaccinated
  piechart.data.datasets[0].data[3]=vaccData.partially_vaccinated
  piechart.update()
}

$.when($.ajax(zipcodeURL), $.ajax(zipcodeVaccURL), $.ajax(zipcodePopURL)).then(function(zipcodeRes, zipcodeVaccRes, zipcodePopRes) {
  zipcodeData = JSON.parse(zipcodeRes[0])
  zipcodeVaccData = JSON.parse(zipcodeVaccRes[0])
  zipcodePopData = JSON.parse(zipcodePopRes[0])

  L.geoJSON(zipcodeData, {
    onEachFeature: function(feat, layer){
      layer.on('click', function(e){
        var zipcode = feat.properties.CODE
        var vaccinationData = zipcodeVaccData[zipcode]
        var populationData = zipcodePopData.filter(function(datum){
          return datum.zip === Number(zipcode)
        })[0]

        //set uup for the bar chart
        if (barchart){
          updateBarChart(vaccinationData)
        } else {
          createBarChart(vaccinationData)
        }

        //set up bar chart
        if (piechart){
          updatePieChart(populationData, vaccinationData)
        } else {
          createPieChart(populationData, vaccinationData)
        }
      })
    }
  }).addTo(map)
})

// $.ajax(zipcodes).done(function(res){
//   $.ajax("https://raw.githubusercontent.com/CPLN692-MUSA611-Open-Source-GIS/OSGIS-week9/master/assignment/vaccination_by_zip.json").done(function(pipZipData){
//     $.ajax().done(function(){
//     })
//     L.geojson(zipcodeData).addTo(map)
// })
//
//   dataset.on('click', function() {
//     console.log(feature.properties.CODE)
//   })





// $.ajax('https://raw.githubusercontent.com/CPLN692-MUSA611-Open-Source-GIS/datasets/master/geojson/philadelphia-crime-points.geojson').done(function(data) {
//   crimeData = JSON.parse(data);
//   // Fixing an AWFUL bug caused by BAD data: Features *NEED* to have geometries...
//   crimeData.features = _.filter(crimeData.features, function(f) { return f.geometry; });
//
//   // The data includes some strange outliers - let's limit it to the area with lots of data
//   // The spatial filter produced here was produced on geojson.io (which uses leaflet draw!)
//   var spatialFilter = {"type":"FeatureCollection","features":[{"type":"Feature","properties":{},"geometry":{"type":"Polygon","coordinates":[[[-75.22218704223633,39.885108787598114],[-75.22218704223633,39.9380402756277],[-75.13412475585938,39.9380402756277],[-75.13412475585938,39.885108787598114],[-75.22218704223633,39.885108787598114]]]}}]};
//   crimeData = turf.within(crimeData, spatialFilter);

  // Fit map to data bounds
//   var mapBoundary = L.geoJson(turf.envelope(crimeData)).getBounds();
//   map.fitBounds(mapBoundary);
//
//   // We'll place a hexagonal grid over the entire mapped area (hexagons are better than
//   // squares because square east/west and north/south distance is less than diagonal distance
//   var turfFriendlyBoundary = [mapBoundary.getWest(), mapBoundary.getSouth(), mapBoundary.getEast(), mapBoundary.getNorth()];
//   hexGrid = turf.hexGrid(turfFriendlyBoundary, 0.15, 'miles');
//
//   // Update the HTML DOM to reflect all the unique crime types
//   // Map over crimeData features for 'properties.text_general_code' and get the unique results
//   var uniqueCrimeTypes = _.unique(_.map(crimeData.features, function(f) { return f.properties.text_general_code; }));
//
//   // For each unique text, create a  checkbox
//   _.each(uniqueCrimeTypes, function(crimeText, index) {
//     $('#checkboxes').append('<label><input type="checkbox" />' + crimeText + '</label></br>');
//   });
//
//   $('#doFilter').click(function() {
//     // Here, we're using jQuery's `map` function; it works very much like underscore's
//     // We want true if checked, false if not
//     var checkboxValues = $('input[type=checkbox]').map(function(_, element) {
//           return $(element).prop('checked');
//     }).get();
//
//     // Let's "zip" checkbox values and checkbox text up together so that we can see values next to text
//     // Zipping takes two arrays (e.g. ['a', 'b', 'c'] and [1, 2, 3]) and produces an output
//     // (for this example, that output would be [['a', 1], ['b', 2], ['c', 3]])
//     // This is a nifty trick for functionally manipulating data
//     var zippedCrimeTypes = _.zip(checkboxValues, uniqueCrimeTypes);
//
//     // Our data, at this point, looks something like this: [[true, 'aCrimeType], [false, 'unwantedCrimeType']]
//     // Now, we want to return all and only crime types whose "zipped" values are true
//     // This involves filtering for true values at index 0 and getting the text at index 1
//     crimeFilters = _.chain(zippedCrimeTypes)
//       .filter(function(zip) { return zip[0]; })
//       .map(function(zip) { return zip[1]; })
//       .value();
//
//     // Carry out filter
//     var filteredCrimeData = _.clone(crimeData); // Cloning here so we don't overwrite data on the original object
//     filteredCrimeData.features = _.filter(filteredCrimeData.features, function(f) {
//       return _.contains(crimeFilters, f.properties.text_general_code);
//     });
//
//     // Remove any outdated data
//     if (mappedGrid) { map.removeLayer(mappedGrid); }
//     mappedGrid = L.geoJson(turf.count(hexGrid, filteredCrimeData, 'captured'), {
//       style: function(feature) {
//         return {
//           stroke: false,
//           fillColor: '#ff0000',
//           fillOpacity: (feature.properties.captured * 0.05)
//         };
//       },
//       onEachFeature: function(feature, layer) {
//         layer.bindPopup("Crimes reported: " + feature.properties.captured);
//       }
//     }).addTo(map);
//   });
// });
