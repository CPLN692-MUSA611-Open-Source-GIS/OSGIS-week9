/* =====================
Leaflet Configuration
===================== */

var map = L.map('map', {
  center: [39.99, -75.0138],
  zoom: 11
});
var Stamen_TonerLite = L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}.png', {
  attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  subdomains: 'abcd',
  minZoom: 0,
  maxZoom: 20,
  ext: 'png'
}).addTo(map);


var dataset = "https://raw.githubusercontent.com/CPLN692-MUSA611-Open-Source-GIS/datasets/master/geojson/Zipcodes_Poly.geojson"
var featureGroup;
var vaccine = "https://raw.githubusercontent.com/gxzhao1/OSGIS-week9/master/assignment/vaccination_by_zip.json"
var vaccineData;
var pop =
  "https://raw.githubusercontent.com/gxzhao1/OSGIS-week9/master/assignment/pop_by_zip.json";
var popData;
var newData;

/* =====================
var showResults = function() {
  
  This function uses some jQuery methods that may be new. $(element).hide()
  will add the CSS "display: none" to the element, effectively removing it
  from the page. $(element).show() removes "display: none" from an element,
  returning it to the page. You don't need to change this part.
  
  // => <div id="intro" css="display: none">
  $('#intro').hide();
  // => <div id="results">
  $('#results').show();
};
===================== */

var eachFeatureFunction = function(layer) {
  layer.on('click', function (event) {
    console.log(layer.feature.properties.CODE)
    var zip = layer.feature.properties.CODE;
    var fullvacstat = vaccineData[zip].fully_vaccinated;
    var partvacstat = vaccineData[zip].partially_vaccinated;

    // bar chart
    ctxBar = $("#barChart");
    barChart = new Chart(ctxBar, {
      type: "bar",
      data: {
        labels: ["Partially Vaccinated", "Fully Vaccinated"],
        datasets: [
          {data: [
              partvacstat,
              fullvacstat,
            ],
            backgroundColor: [
              "rgba(250, 225, 221, 1)",
              "rgba(250, 225, 221, 1)",
            ],
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    }); 
    // pie chart prep -> lookup pop by zip
    zipPop = _.filter(popData, function (i) {
      return i["ZIP"] == zip;
    })[0].POP;

    // pie chart prep -> calculate %
    fullyvacperc = Math.round((fullvacstat / zipPop) * 100);
    partvacperc =  Math.round((partvacstat / zipPop) * 100);
    unvacperc = 100 - fullyvacperc - partvacperc;

    // pie chart
    ctxPie = $("#pieChart");
    pieChart = new Chart(ctxPie, {
      type: "doughnut",
      data: {
        labels: [
          "Unvaccinated %",
          "Partially Vaccinated %",
          "Fully Vaccinated %",
        ],
        datasets: [
          {
            label: "Vaccination Progress",
            data: [unvacperc, partvacperc, fullyvacperc],
            backgroundColor: [
              "rgba(216, 226, 220, 1)",
              "rgba(250, 225, 221, 0.5)",
              "rgba(250, 225, 221, 1)",
            ],

          },
        ],
      },
    });
/*     switch (layer.feature.properties.COLLDAY) {
      case 'MON':   
        day = "Monday";
        break;
      case 'TUE':   
        day = "Tuesday";
        break;
      case 'WED':   
        day = "Wednesday";
        break;
      case 'THU':   
        day = "Thursday";
        break;
      case 'FRI':   day = "Friday";
        break;
    } */
    // $('.day-of-week').text(day)

    layer.feature.properties["fullyperc"] = fullyvacperc;
    //showResults();
    map.fitBounds( event.target.getBounds())
  });
};

var myStyle = function(feature) {
  var found = newData.find(x => x.ZIP == Number(feature.properties.CODE));
  console.log(found)
  if (found != undefined) {
    val = found.zfullyperc;
  } else {
    val = 0
  }
  console.log(val)

  function getColor(d, min = 0, mean = 20, max = 100, startColor = '#D8E2DC', medColor = '#FAE1DD', endColor="#f28482") {
    const scale = chroma.scale([startColor, medColor, endColor]).domain([min, mean, max]);
  return scale(d).hex();
  }

  console.log(String(getColor(Number(val))))

  return {fillOpacity: 0.9,
          color: String(getColor(Number(val))),
          fillColor: String(getColor(Number(val)))}
};

// var legend = L.control({ position: "bottomright" });

/* =====================
legend.onAdd = function(map) {
  var div = L.DomUtil.create("div", "legend");
  div.innerHTML += "<h4>Legend</h4>";
  div.innerHTML += '<i style="background: #699DCC"></i><span>Monday</span><br>';
  div.innerHTML += '<i style="background: #8382DE"></i><span>Tuesday</span><br>';
  div.innerHTML += '<i style="background: #DC878F"></i><span>Wednesday</span><br>';
  div.innerHTML += '<i style="background: #FFB898"></i><span>Thursday</span><br>';
  div.innerHTML += '<i style="background: #E7E3F1"></i><span>Friday</span><br>';
  
  return div;
};

var myFilter = function(feature) {
  if (feature.properties.COLLDAY.length == 3 ) {
    return true;
  } else {
    return false
  }
  return true
};
===================== */

$(document).ready(function() {
  $.ajax(dataset).done(function(json) {
    var parsedData = JSON.parse(json);
    var data = parsedData.features;

    $.ajax(vaccine).done(function(json){
      var parsedData = JSON.parse(json);
      vaccineData = parsedData;
      console.log(vaccineData)
      $.ajax(pop).done(function(json){
        var parsedData = JSON.parse(json);
        popData = parsedData;
        console.log("pop", popData)

        // create new dataset
        newData = [];
        popData.map(a => {
          var z = a.ZIP;
          var zpop = a.POP;
          if (_.contains(Object.keys(vaccineData), String(z))) {
            var zfullvac = vaccineData[z].fully_vaccinated;
            var zpartvac = vaccineData[z].partially_vaccinated;
            var zfullyvacperc = Math.round((zfullvac / zpop) * 100);
            var zpartvacperc =  Math.round((zpartvac / zpop) * 100);
            var zunvacperc = 100 - zfullyvacperc - zpartvacperc;
            a["zfullyperc"] = zfullyvacperc;
            newData.push(a)
          } else {
            newData = newData;
          }
        })

        featureGroup = L.geoJson(data, {
          style: myStyle,
          //filter: myFilter
        }).addTo(map);
        //legend.addTo(map);
        // quite similar to _.each
        featureGroup.eachLayer(eachFeatureFunction);

      })
    })
  });
});
