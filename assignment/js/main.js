/* =====================
  Global Variables
===================== */
var vaccination;
var zipcode;
var population;
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
              hoverOffset: 3
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
        // Retrieve zipcode-level population and vaccination info.
        let zipInfo = {zipcode: zip};
        zipInfo['total_population'] = population[zip].population;
        zipInfo['fully_vaccinated'] = vaccination[zip].fully_vaccinated;
        zipInfo['partially_vaccinated'] = vaccination[zip].partially_vaccinated;
        zipInfo['unvaccianted'] = population[zip].population - vaccination[zip].fully_vaccinated - vaccination[zip].partially_vaccinated;
        zipInfo['vaccinated_ratio'] = (vaccination[zip].fully_vaccinated + vaccination[zip].partially_vaccinated) / population[zip].population;
        console.log(zipInfo)
        doughnutChart(zipInfo)
    });
  };

$(document).ready(function() {

    // Request vaccination data
    $.ajax(vaccinationPath).done(function(data) {
        vaccination = JSON.parse(data);
        console.log(vaccination)
      })
    // Request zipcode data (with polygon features)
    $.ajax(zipcodePath).done(function(data) {
        zipcode = JSON.parse(data);
        console.log(zipcode)

        // Fixing an AWFUL bug caused by BAD data: Features *NEED* to have geometries...
        zipcode.features = _.filter(zipcode.features, function(f) { return f.geometry; });
        // Plot zipcode polygons
        let polygon  = L.geoJson(zipcode, {
          }).addTo(map);
        console.log(polygon)

        polygon.eachLayer(eachFeatureFunction)
      })
    $.ajax(populationPath).done(function(data){
        population = JSON.parse(data);
        console.log(population)
      })
        // // Note: the code lines kept in comments below are intended for wrangling .csv file
        //   var allTextLines = data.split(/\r\n|\n/);
        //   var headers = allTextLines[0].split(',');
        //   let zipcode_population = []
        //   allTextLines.shift()
        //   _.each(allTextLines, function(e){
        //       zipcode_population.push({
        //           zipcode: e.split(',')[1],
        //           population: parseInt(e.split(',')[2])
        //         })
        //   })
        //   console.log(zipcode_population)
        // })
        // //   for (var i=1; i<allTextLines.length; i++){
        // //     zipcode_population.push({
        // //         zipcode: allTextLines[i].split(',')[1],
        // //         population: parseInt(allTextLines[i].split(',')[2])})
        // //   }
})
