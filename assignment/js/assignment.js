/* =====================
  Global Variables
===================== */
var vaccination = [];
var zipCode;
var selectedZip;
var zipPop = {"19102": { "partially_vaccinated": 822, "fully_vaccinated": 1773, "etl_timestamp": "2021-04-08 17:20:02", "population": 4396 }, "19103": { "partially_vaccinated": 3629, "fully_vaccinated": 8284, "etl_timestamp": "2021-04-08 17:20:02", "population": 19714 }, "19104": { "partially_vaccinated": 6767, "fully_vaccinated": 7422, "etl_timestamp": "2021-04-08 17:20:02", "population": 50125 }, "19106": { "partially_vaccinated": 1490, "fully_vaccinated": 3812, "etl_timestamp": "2021-04-08 17:20:02", "population": 8359 }, "19107": { "partially_vaccinated": 2410, "fully_vaccinated": 4497, "etl_timestamp": "2021-04-08 17:20:02", "population": 12340 }, "19111": { "partially_vaccinated": 6437, "fully_vaccinated": 8666, "etl_timestamp": "2021-04-08 17:20:02", "population": 58874 }, "19114": { "partially_vaccinated": 3876, "fully_vaccinated": 5267, "etl_timestamp": "2021-04-08 17:20:02", "population": 31083 }, "19115": { "partially_vaccinated": 3944, "fully_vaccinated": 6958, "etl_timestamp": "2021-04-08 17:20:02", "population": 31853 }, "19116": { "partially_vaccinated": 3372, "fully_vaccinated": 5176, "etl_timestamp": "2021-04-08 17:20:02", "population": 32560 }, "19118": { "partially_vaccinated": 1147, "fully_vaccinated": 2291, "etl_timestamp": "2021-04-08 17:20:02", "population": 9608 }, "19119": { "partially_vaccinated": 3265, "fully_vaccinated": 5681, "etl_timestamp": "2021-04-08 17:20:02", "population": 28837 }, "19120": { "partially_vaccinated": 5599, "fully_vaccinated": 6728, "etl_timestamp": "2021-04-08 17:20:02", "population": 68831 }, "19121": { "partially_vaccinated": 3405, "fully_vaccinated": 5022, "etl_timestamp": "2021-04-08 17:20:02", "population": 34935 }, "19122": { "partially_vaccinated": 2962, "fully_vaccinated": 3173, "etl_timestamp": "2021-04-08 17:20:02", "population": 19589 }, "19123": { "partially_vaccinated": 2332, "fully_vaccinated": 3946, "etl_timestamp": "2021-04-08 17:20:02", "population": 9818 }, "19124": { "partially_vaccinated": 4923, "fully_vaccinated": 6211, "etl_timestamp": "2021-04-08 17:20:02", "population": 63131 }, "19125": { "partially_vaccinated": 3549, "fully_vaccinated": 5461, "etl_timestamp": "2021-04-08 17:20:02", "population": 23646 }, "19126": { "partially_vaccinated": 1535, "fully_vaccinated": 2382, "etl_timestamp": "2021-04-08 17:20:02", "population": 16484 }, "19127": { "partially_vaccinated": 732, "fully_vaccinated": 998, "etl_timestamp": "2021-04-08 17:20:02", "population": 5465 }, "19128": { "partially_vaccinated": 4319, "fully_vaccinated": 6594, "etl_timestamp": "2021-04-08 17:20:02", "population": 36420 }, "19129": { "partially_vaccinated": 1453, "fully_vaccinated": 2275, "etl_timestamp": "2021-04-08 17:20:02", "population": 10748 }, "19130": { "partially_vaccinated": 4015, "fully_vaccinated": 7081, "etl_timestamp": "2021-04-08 17:20:02", "population": 22874 }, "19131": { "partially_vaccinated": 4420, "fully_vaccinated": 5702, "etl_timestamp": "2021-04-08 17:20:02", "population": 47044 }, "19132": { "partially_vaccinated": 2923, "fully_vaccinated": 3546, "etl_timestamp": "2021-04-08 17:20:02", "population": 41709 }, "19133": { "partially_vaccinated": 2175, "fully_vaccinated": 2256, "etl_timestamp": "2021-04-08 17:20:02", "population": 27971 }, "19134": { "partially_vaccinated": 4929, "fully_vaccinated": 5890, "etl_timestamp": "2021-04-08 17:20:02", "population": 57922 }, "19135": { "partially_vaccinated": 2570, "fully_vaccinated": 3776, "etl_timestamp": "2021-04-08 17:20:02", "population": 30881 }, "19136": { "partially_vaccinated": 3824, "fully_vaccinated": 4370, "etl_timestamp": "2021-04-08 17:20:02", "population": 40080 }, "19137": { "partially_vaccinated": 646, "fully_vaccinated": 1294, "etl_timestamp": "2021-04-08 17:20:02", "population": 8069 }, "19138": { "partially_vaccinated": 2635, "fully_vaccinated": 4278, "etl_timestamp": "2021-04-08 17:20:02", "population": 34477 }, "19139": { "partially_vaccinated": 3958, "fully_vaccinated": 5178, "etl_timestamp": "2021-04-08 17:20:02", "population": 43866 }, "19140": { "partially_vaccinated": 4526, "fully_vaccinated": 4919, "etl_timestamp": "2021-04-08 17:20:02", "population": 57125 }, "19141": { "partially_vaccinated": 2559, "fully_vaccinated": 3509, "etl_timestamp": "2021-04-08 17:20:02", "population": 34984 }, "19142": { "partially_vaccinated": 2097, "fully_vaccinated": 2395, "etl_timestamp": "2021-04-08 17:20:02", "population": 29063 }, "19143": { "partially_vaccinated": 6589, "fully_vaccinated": 9315, "etl_timestamp": "2021-04-08 17:20:02", "population": 71169 }, "19144": { "partially_vaccinated": 4439, "fully_vaccinated": 5882, "etl_timestamp": "2021-04-08 17:20:02", "population": 46794 }, "19145": { "partially_vaccinated": 6354, "fully_vaccinated": 8347, "etl_timestamp": "2021-04-08 17:20:02", "population": 45647 }, "19146": { "partially_vaccinated": 5044, "fully_vaccinated": 9838, "etl_timestamp": "2021-04-08 17:20:02", "population": 35738 }, "19147": { "partially_vaccinated": 5715, "fully_vaccinated": 10217, "etl_timestamp": "2021-04-08 17:20:02", "population": 32680 }, "19148": { "partially_vaccinated": 7256, "fully_vaccinated": 9810, "etl_timestamp": "2021-04-08 17:20:02", "population": 48573 }, "19149": { "partially_vaccinated": 6094, "fully_vaccinated": 6043, "etl_timestamp": "2021-04-08 17:20:02", "population": 48483 }, "19150": { "partially_vaccinated": 2514, "fully_vaccinated": 4104, "etl_timestamp": "2021-04-08 17:20:02", "population": 25274 }, "19151": { "partially_vaccinated": 2597, "fully_vaccinated": 3895, "etl_timestamp": "2021-04-08 17:20:02", "population": 31255 }, "19152": { "partially_vaccinated": 4494, "fully_vaccinated": 5270, "etl_timestamp": "2021-04-08 17:20:02", "population": 31379 }, "19153": { "partially_vaccinated": 1265, "fully_vaccinated": 1690, "etl_timestamp": "2021-04-08 17:20:02", "population": 12324 }, "19154": { "partially_vaccinated": 3895, "fully_vaccinated": 5404, "etl_timestamp": "2021-04-08 17:20:02", "population": 35606 } }
//bar chart
var ctx = document.getElementById('myChart1');
var myChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: ['Partially Vaccinated','Fully Vaccinated'],
        datasets: [{
            label: 'Population Vaccinated',
            data: [0,0],
            borderWidth: 1
        }]
    },
    options: {
      responsive: false,
      maintainAspectRatio: false,
      scales: {
          y: {
              beginAtZero: true
          }
      }
    }
});
//doughnut chart
var ctx1 = document.getElementById('myChart2');
var myChartDoughnut = new Chart(ctx1, {
  type: 'doughnut',
  data: {
      labels: ['Partially Vaccinated','Fully Vaccinated','Total Population'],
      datasets: [{
          label: 'Population Vaccinated',
          data: [10,0,0],
      }]
  },
  options: {
    responsive: false,
    maintainAspectRatio: false,
  }
});




/* =====================
  Map Setup
===================== */
// Notice that we've been using an options object since week 1 without realizing it
var mapOpts = {
  center: [0, 0],
  zoom: 2
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



$.ajax('https://raw.githubusercontent.com/CPLN692-MUSA611-Open-Source-GIS/datasets/master/geojson/Zipcodes_Poly.geojson').done(function(data){
  zipCode = JSON.parse(data);
  var mapBoundary = L.geoJson(turf.envelope(zipCode)).getBounds();
  map.fitBounds(mapBoundary);

  var geoJsonLayer = L.geoJson(zipCode,{
    style: function(features){
      if(vaccination[features.properties.CODE]=== undefined){
        console.log("19112")
        return{fillOpacity:0}
      }
      if(vaccination[features.properties.CODE] != undefined){
        console.log(features.properties.CODE);
        console.log((vaccination[features.properties.CODE].fully_vaccinated + vaccination[features.properties.CODE].partially_vaccinated)/zipPop[features.properties.CODE].population);
        return{fillOpacity:(vaccination[features.properties.CODE].fully_vaccinated + vaccination[features.properties.CODE].partially_vaccinated)/zipPop[features.properties.CODE].population}
      }
    }
  }).addTo(map);

  //(vaccination[zipCode.features[1].properties.CODE].fully_vaccinated + vaccination[zipCode.features[1].properties.CODE].partially_vaccinated)/zipPop[zipCode.features[1].properties.CODE].population
  //(vaccination[features.properties.CODE].fully_vaccinated + vaccination[features.properties.CODE].partially_vaccinated)/zipPop[features.properties.CODE].population


  geoJsonLayer.eachLayer(function (layer) {
      layer._path.id = layer.feature.properties.CODE;
  });

  //when polygon clicked
  $('.leaflet-clickable').click(function(e){
    selectedZip = $(e.currentTarget.id).selector
    console.log(selectedZip);
    console.log(vaccination[selectedZip]);
    //remove plot
    myChart.destroy();
    console.log(typeof(myChart))
    myChartDoughnut.destroy();
    //make bar plot 
    ctx = document.getElementById('myChart1');
    myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Partially Vaccinated','Fully Vaccinated'],
            datasets: [{
                label: 'Population Vaccinated',
                data: [vaccination[selectedZip].partially_vaccinated,vaccination[selectedZip].fully_vaccinated],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
          responsive: false,
          maintainAspectRatio: false,
          scales: {
              y: {
                  beginAtZero: true
              }
          }
        }
    });
    ctx1 = document.getElementById('myChart2');
    myChartDoughnut = new Chart(ctx1, {
      type: 'doughnut',
      data: {
          labels: ['Partially Vaccinated','Fully Vaccinated','Not Vaccinated'],
          datasets: [{
              label: 'Population Vaccinated',
              data: [vaccination[selectedZip].partially_vaccinated,vaccination[selectedZip].fully_vaccinated,zipPop[selectedZip].population - vaccination[selectedZip].partially_vaccinated - vaccination[selectedZip].fully_vaccinated],
              backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(250, 187, 45, 0.2)'
              ]
          }]
      },
      options: {
        responsive: false,
        maintainAspectRatio: false,
      }
    });
  })
})
//read in vaccination data
$.ajax('https://raw.githubusercontent.com/CPLN692-MUSA611-Open-Source-GIS/OSGIS-week9/master/assignment/vaccination_by_zip.json').done(function(data){
  vaccination = JSON.parse(data);
})

