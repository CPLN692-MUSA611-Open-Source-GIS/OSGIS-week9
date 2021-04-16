/* =====================
  Global Variables
===================== */

var zipInfo = [];
var ctx1 = document.getElementById('chart-bar').getContext('2d');
var ctx2 = document.getElementById('chart-doughnut').getContext('2d');
var bar_chart;
var doughnut_chart;
var stats = [];
var found = {};

vaccinationPath = 'https://raw.githubusercontent.com/zjalexzhou/OSGIS-week9/master/assignment/data/vaccination_by_zip.json'
zipcodePath = 'https://raw.githubusercontent.com/CPLN692-MUSA611-Open-Source-GIS/datasets/master/geojson/Zipcodes_Poly.geojson'
populationPath = 'https://raw.githubusercontent.com/zjalexzhou/OSGIS-week9/master/assignment/data/population_by_zip.json'

var doughnutChart = function(data){
  var myChart = new Chart(ctx2, {
      type: 'doughnut',
      data: {
          labels: ['Fully Vaccinated', 'Partially Vaccinated', 'Unvaccinated'],
          datasets: [{
              label: 'Vaccination Information for zipcode ' + data.zipcode,
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

var barChart = function(data){
  var myChart = new Chart(ctx1, {
      type: 'bar',
      data: {
          labels: ['Fully Vaccinated', 'Partially Vaccinated', 'Unvaccinated'],
          datasets: [{
              label: 'Vaccination Information for zipcode ' + data.zipcode,
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
          }]
      },
  });
}

var removeChart = function() {
  if(_.isUndefined(doughnut_chart)){}
  else{
    doughnut_chart.destroy();
  }
  if(_.isUndefined(bar_chart)){}
  else{
    bar_chart.destroy();
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
          barChart(chartData[0])
          $('#text-for-NA-data').text('Hover your mouse over the chart elements for details.')
        } else {
          $('#text-for-NA-data').text('Sorry, we currently do not have vaccination information for regions represented by this zipcode.')
        }
        $('h2').text(`For zipcode ${zip}`);
        $('#data-brief').show();
        $('#population').text(chartData[0].total_population)
        if(_.isNumber(chartData[0].vaccinated_ratio)){
          $('#vaccinated-ratio').text(math.round(chartData[0].vaccinated_ratio,3)*100 + '%')
        } else {
          $('#vaccinated-ratio').text(chartData[0].vaccinated_ratio)
        }
        $('#fully-vaccinated').text(chartData[0].fully_vaccinated)
        $('#partially-vaccinated').text(chartData[0].partially_vaccinated)
        $('#unvaccinated').text(chartData[0].unvaccianted)
    });
  };
  
var getDesStats = function(property_name){
  let stats_dataset = []
  _.each(zipInfo, function(e){
    if(e[property_name] >= 0){
      stats_dataset.push(e[property_name])
    } else {
      stats_dataset.push(0)
    }
  })
  min_elem = math.min(stats_dataset)
  median_elem = math.median(stats_dataset)
  // median_elem = stats_dataset[stats_dataset.length/2]
  max_elem = math.max(stats_dataset)
  return [min_elem, median_elem, max_elem]
}

var getColorRamp = function(dat, min, median, max){
  startColor = '#000000'
  medColor = '#ffff00'
  endColor = '#0000ff'
  colorRamp = chroma.scale([startColor, medColor, endColor]).domain([min, median, max]);
  return colorRamp(dat).hex();
} 

var vaccinated_ratio_style = function(feature){
  stats = getDesStats('vaccinated_ratio');
  found = zipInfo.find(x => x.zipcode == feature.properties.CODE);
  // console.log(found)
  if (found != undefined) {
    val = found.vaccinated_ratio;
  } else {
    val = 0
  }
  // console.log(val)
  // console.log(String(getColorRamp(zipInfo[feature.properties.CODE], stats[0], stats[1], stats[2])))
  return {fillOpacity: 0.9,
    color: String(getColorRamp(val, stats[0], stats[1], stats[2])),
    fillColor: String(getColorRamp(val, stats[0], stats[1], stats[2]))}
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
              // Plot zipcode polygons
              let polygon  = L.geoJson(zipcode, {
                style: vaccinated_ratio_style
                }).addTo(map);
              // console.log(polygon)
              polygon.eachLayer(eachFeatureFunction)              
            })
          })
        })
      })
})
