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

  //data
var phillyPoly = "https://raw.githubusercontent.com/CPLN692-MUSA611-Open-Source-GIS/datasets/master/geojson/Zipcodes_Poly.geojson"
var vaccination = "https://raw.githubusercontent.com/jiaxuanlyu/OSGIS-week9/master/assignment/vaccination_by_zip.json"
var zipPop = "https://raw.githubusercontent.com/jiaxuanlyu/OSGIS-week9/master/assignment/population_by_zip.json"
var featureGroup;

var vaccinationData;
var zipPopData;

//get a list of zipcode
var zipList = []

var ctx = document.getElementById("myChart");
var ctx2 = document.getElementById("myChart2");
var myChart;
var myChart2;



//remove charts
var removeChart = function() {
  if(_.isUndefined(myChart)){}
  else{
    myChart.destroy();
  }
}

var removeChart2 = function() {
  if(_.isUndefined(myChart2)){}
  else{
    myChart2.destroy();
  }
}



//click event
var eachFeatureFunction = function(layer) {
    layer.on('click', function (event) {
      /* =====================
      The following code will run every time a layer on the map is clicked.
      Check out layer.feature to see some useful data about the layer that
      you can use in your application.
      ===================== */
      map.fitBounds(event.target.getBounds());

      //remove charts
      removeChart()
      removeChart2()


      //console.log(event.target.feature.properties.CODE)
      var zipcode = event.target.feature.properties.CODE
      var population = zipPopData[zipcode].population
      var vaccinationInfo = vaccinationData[zipcode]


      console.log(`There are ${vaccinationInfo.partially_vaccinated} people being partially vaccinated, 
      and there are ${vaccinationInfo.fully_vaccinated} people being fully vaccinated.
      There are a total of ${population} people.`)

      var showData = [vaccinationInfo.partially_vaccinated, vaccinationInfo.fully_vaccinated]
      var infoData = [vaccinationInfo.partially_vaccinated, vaccinationInfo.fully_vaccinated, population - (vaccinationInfo.partially_vaccinated + vaccinationInfo.fully_vaccinated)]

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

      const zipInfoPlot = {
        labels: ['partially vaccinated', 'fully vaccinated', 'not vaccinated'],
        datasets: [{
          label: `Vaccination Information in the zipcode ${zipcode}`,
          data: infoData,
          backgroundColor: [
            'rgb(255, 99, 132)',
            'rgb(54, 162, 235)',
            'rgb(255, 205, 86)'
          ],
          hoverOffset: 4
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

      myChart2 = new Chart(ctx2, {
        type: 'pie',
        data: zipInfoPlot,
      })
  

    });
  };


//get color
var getColor =  function(feature) {
  if (feature.properties.pct_vaccinated == 0) return "#f7fcf0" ;
  if (feature.properties.pct_vaccinated < 0.2) return "#ccebc5" ;
  if (feature.properties.pct_vaccinated < 0.25) return "#a8ddb5" ;
  if (feature.properties.pct_vaccinated < 0.3) return "#7bccc4";
  if (feature.properties.pct_vaccinated < 0.4) return "#4eb3d3";
  if (feature.properties.pct_vaccinated < 0.5) return "#2b8cbe";
}


//Style of Polygon
var MyStyle = function(feature) {
  return {
    fillColor: getColor(feature),
    color: "#08589e",
    weight: 1,
    opacity: 1,
    fillOpacity: 0.8
  } 
}



$(document).ready(function() {

    //read vaccination data
    $.ajax(vaccination).done(function(data) {
        vaccinationData = JSON.parse(data)
    })

    $.ajax(zipPop).done(function(data) {
      zipPopData =JSON.parse(data)
    })

    //read polygons
    $.ajax(phillyPoly).done(function(data) {
        var parsedData = JSON.parse(data);
        

        //Find out the missing values in population dataset
        var zipList1 = []

        _.map(parsedData.features, (a) => {
          zipList1.push(a.properties.CODE)
        })

        var zipList2 = Object.keys(zipPopData)

        console.log(_.difference(zipList1, zipList2))


        _.map(parsedData.features, (e) => {
          zipSelected = e.properties.CODE
          if(zipSelected == 19109 || zipSelected == 19112) {
            e.properties.population = 0
            e.properties.fully_vaccinated = 0
            e.properties.partially_vaccinated = 0
            e.properties.pct_vaccinated = 0
          } else {
            e.properties.population = zipPopData[zipSelected].population
            e.properties.fully_vaccinated = vaccinationData[zipSelected].fully_vaccinated
            e.properties.partially_vaccinated = vaccinationData[zipSelected].partially_vaccinated
            e.properties.pct_vaccinated = (e.properties.partially_vaccinated + e.properties.fully_vaccinated) / e.properties.population
          }
          //  console.log(e.properties.pct_vaccinated)
        })

        featureGroup = L.geoJson(parsedData, {
          style: MyStyle,
        }).bindPopup(function (layer) {
            return `ZIP CODE: ${layer.feature.properties.CODE}`;
        }).addTo(map);
       


        // quite similar to _.each
        featureGroup.eachLayer(eachFeatureFunction);


    });
})