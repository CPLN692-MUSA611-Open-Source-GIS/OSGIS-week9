/* =====================
  Global Variables
===================== */
var Zipcodes_Poly
var hexGrid
var mappedGrid
var lookup_table
var barChart
var pieChart

/* =====================
  Map Setup
===================== */
var mapOpts = {
  center: [39.9522, -75.1639],
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
var Stamen_TonerLite = L.tileLayer('http://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}.{ext}', tileOpts).addTo(map);

// Main
$.ajax('https://raw.githubusercontent.com/CPLN692-MUSA611-Open-Source-GIS/datasets/master/geojson/Zipcodes_Poly.geojson').done(function(data) {
  Zipcodes_Poly = JSON.parse(data);

// Construct Bar Chart
  var constr_barChart = function () {
    var ctx_bar = document.getElementById('barChart').getContext('2d');
    barChart = new Chart(ctx_bar, {
        type: 'bar',
        data: {
            labels: ['Partially Vaccinated','Fully Vaccinated','Total Population'],
            datasets: [{
                label: 'Vaccination Progress in Current Zipcode Area',
                data: [par_vac, full_vac, pop],
                backgroundColor: [
                    'rgba(54, 162, 235, 0.4)',
                    'rgba(75, 192, 192, 0.4)',
                    'rgba(255, 206, 86, 0.4)'
                ],
                borderColor: [
                    'rgba(54, 162, 235, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(255, 206, 86, 1)'
                ],
                borderWidth: 0.5
            }]
        }
    });
  }

  // Construct Pie Chart
  var constr_pieChart = function () {
    var ctx_pie = document.getElementById('pieChart').getContext('2d');
    pieChart = new Chart(ctx_pie, {
        type: 'pie',
        data: {
            labels: ['Partially Vaccinated','Fully Vaccinated','Unvaccinated'],
            datasets: [{
                label: 'Vaccination Progress in Current Zipcode Area',
                data: [par_vac, full_vac, un_vac],
                backgroundColor: [
                    'rgba(54, 162, 235, 0.4)',
                    'rgba(75, 192, 192, 0.4)',
                    'rgba(153, 102, 255, 0.4)'
                ],
                borderColor: [
                    'rgba(54, 162, 235, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)'
                ],
                borderWidth: 0.5
            }]
        }
    });
  }

  // Plot polygons + click events
  L.geoJson(Zipcodes_Poly, {
    onEachFeature: function (feature, layer) {
      layer.on('click', function () {
        par_vac = lookup_table[layer.feature.properties.CODE].partially_vaccinated
        full_vac = lookup_table[layer.feature.properties.CODE].fully_vaccinated
        pop = lookup_table[layer.feature.properties.CODE].pop
        un_vac = pop - par_vac - full_vac
        console.log(layer.feature.properties.CODE)
        console.log(par_vac)
        console.log(full_vac)
        console.log(pop)
        if (barChart != null) {barChart.destroy()}
        constr_barChart()
        if (pieChart != null) {pieChart.destroy()}
        constr_pieChart()
      })
    }
  }).addTo(map)

  // Load lookup table
  $.ajax("https://raw.githubusercontent.com/kelly5265/OSGIS-week9/master/assignment/vaccination_by_zip.json").done(function(data){
    lookup_table = JSON.parse(data)
  })
}) 
