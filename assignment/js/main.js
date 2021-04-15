/* =====================
  Global Variables
===================== */

var zipInfo = [];
var ctx = document.getElementById('myChart').getContext('2d');
var myChart;

vaccinationPath = 'https://raw.githubusercontent.com/zjalexzhou/OSGIS-week9/master/assignment/data/vaccination_by_zip.json'
zipcodePath = 'https://raw.githubusercontent.com/CPLN692-MUSA611-Open-Source-GIS/datasets/master/geojson/Zipcodes_Poly.geojson'
populationPath = 'https://raw.githubusercontent.com/zjalexzhou/OSGIS-week9/master/assignment/data/population_by_zip.json'

var doughnutChart = function(data){
  myChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
          labels: ['Fully Vaccinated', 'Partially Vaccinated', 'Unvaccinated'],
          datasets: [{
              label: 'Vaccination Information for Zipcode' + toString(data.zipcode),
              data: [data.fully_vaccinated, data.partially_vaccinated, data.unvaccianted],
              backgroundColor: [
                  'rgba(54, 162, 235, 0.2)',
                  'rgba(255, 206, 86, 0.2)',
                  'rgba(255, 99, 132, 0.2)',
                  // 'rgba(75, 192, 192, 0.2)',
                  // 'rgba(153, 102, 255, 0.2)',
                  // 'rgba(255, 159, 64, 0.2)'
              ],
              borderColor: [
                  'rgba(54, 162, 235, 1)',
                  'rgba(255, 206, 86, 1)',
                  'rgba(255, 99, 132, 1)',
                  // 'rgba(75, 192, 192, 1)',
                  // 'rgba(153, 102, 255, 1)',
                  // 'rgba(255, 159, 64, 1)'
              ],
              hoverOffset: 10
          }]
      },
  });
}

var removeChart = function() {
  if(_.isUndefined(myChart)){}
  else{
    myChart.destroy();
  }
}

var eachFeatureFunction = function(layer) {
    layer.on('click', function (event) {
      removeChart();
        // Zoom to a particular feature when clicked
        map.fitBounds(event.target.getBounds())
        let zip = event.target.feature.properties.CODE
        chartData = _.filter(zipInfo, function(e){
          return (e.zipcode == zip)
        })
        if(chartData[0].vaccinated_ratio >= 0){
          doughnutChart(chartData[0])
        }
    });
  };

var vaccinated_ratio_style = function(feature){
}

$(document).ready(function() {

    // Request zipcode data (with polygon features)
    $.ajax(zipcodePath).done(function(data) {
        let zipcode = JSON.parse(data);
        console.log(zipcode)
        // Fixing an AWFUL bug caused by BAD data: Features *NEED* to have geometries...
        zipcode.features = _.filter(zipcode.features, function(f) { return f.geometry; });
        // Generate a list of all zipcodes in Philly
        let zipList = [];
        _.each(zipcode.features, function(e){
          zipList.push(e.properties.CODE)
        })
        // console.log(ziplist)
        // Plot zipcode polygons
        let polygon  = L.geoJson(zipcode, {
          style: vaccinated_ratio_style
          }).addTo(map);
        console.log(polygon)
        polygon.eachLayer(eachFeatureFunction)
        // Request vaccination data
        $.ajax(vaccinationPath).done(function(data) {
          let vaccination = JSON.parse(data);
          // console.log(Object.keys(vaccination))
          // Request population data
          $.ajax(populationPath).done(function(data){
            let population = JSON.parse(data);
            // console.log(Object.keys(population))
            _.each(zipList, function(eachZip){
              if(_.isUndefined(vaccination[eachZip])){
                eachZipInfo = {
                  "zipcode": eachZip, 
                  "total_population": 'Unavailable',
                  "fully_vaccinated": 'Unavailable',
                  "partially_vaccinated": 'Unavailable',
                  "unvaccianted": 'Unavailable',
                  "vaccinated_ratio": 'Unavailable'
                }
              } else {
                eachZipInfo = {
                  "zipcode": eachZip, 
                  "total_population": population[eachZip].population,
                  "fully_vaccinated": vaccination[eachZip].fully_vaccinated,
                  "partially_vaccinated": vaccination[eachZip].partially_vaccinated,
                  "unvaccianted": population[eachZip].population - vaccination[eachZip].fully_vaccinated - vaccination[eachZip].partially_vaccinated,
                  "vaccinated_ratio": (vaccination[eachZip].fully_vaccinated + vaccination[eachZip].partially_vaccinated) / population[eachZip].population
                }
              }
              zipInfo.push(eachZipInfo)
            })
          })
        })
      })
})
