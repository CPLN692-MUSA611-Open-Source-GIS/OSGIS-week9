/* =====================
Leaflet Configuration
===================== */

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


// var zip_dataset = "https://raw.githubusercontent.com/CPLN692-MUSA611-Open-Source-GIS/datasets/master/geojson/Zipcodes_Poly.geojson"
// var vaccine = "https://raw.githubusercontent.com/kylepmccarthy/OSGIS-week9/master/covid_vaccines_by_zip.geojson"
// var population = "https://raw.githubusercontent.com/zjalexzhou/OSGIS-week9/master/assignment/data/population_by_zip.json"
var zip_dataset =
  "https://raw.githubusercontent.com/CPLN692-MUSA611-Open-Source-GIS/datasets/master/geojson/Zipcodes_Poly.geojson";
var vax_dataset =
  "https://raw.githubusercontent.com/CPLN692-MUSA611-Open-Source-GIS/OSGIS-week9/master/assignment/vaccination_by_zip.json";
var zip_pop_dataset =
  "https://gist.githubusercontent.com/tybradf/1211e46083b9109d0433c40e10b4908e/raw/9ca5cdd8b0ded8c8f487fa0de7c71a1f1efafa20/pa_population_by_zip.json";
var featureGroup;
var initialBounds = map.getBounds();
var vaxData;
var ctx;
var myChart;
var barChart
//var zip = [];

var myStyle = function (feature) {};

var showResults = function () {
  /* =====================
  This function uses some jQuery methods that may be new. $(element).hide()
  will add the CSS "display: none" to the element, effectively removing it
  from the page. $(element).show() removes "display: none" from an element,
  returning it to the page. You don't need to change this part.
  ===================== */
  // => <div id="intro" css="display: none">
  $("#intro").hide();
  // => <div id="results">
  $("#results").show();
};

var eachFeatureFunction = function (layer) {
  layer.on("click", function (event) {
    /* =====================
    The following code will run every time a layer on the map is clicked.
    Check out layer.feature to see some useful data about the layer that
    you can use in your application.
    ===================== */
    //console.log(layer.feature);
    //showResults();
    //theZIP = layer.feature.properties.CODE;
  });
};

var myFilter = function (feature) {
  return true;
};

$(document).ready(function () {
  var theZIP = "";
  var vaxData;
  $.ajax(zip_dataset).done(function (data) {
    var parsedZIPs = JSON.parse(data);

    $.ajax(zip_pop_dataset).done(function (data) {
      philaZIPPop = _.filter(JSON.parse(data), function (item) {
        return item["city"] == "Philadelphia";
      });

      $.ajax(vax_dataset).done(function (data) {
        vaxData = JSON.parse(data);
    
        philaZIPPop = _.map(philaZIPPop, function (item) {
          return _.extend(item, vaxData[item.zip]);
        });

        featureGroup = L.geoJson(parsedZIPs, {
          style: myStyle,
          filter: myFilter,
        }).addTo(map);

        featureGroup.eachLayer(function (layer) {
          layer.on("click", function (event) {
            theZIP = layer.feature.properties.CODE;
            vaxDataZIP = vaxData[theZIP];
            popDataZIP = _.filter(philaZIPPop, function (item) {
              return item["zip"] == theZIP;
            })[0];

            fullyVaxdZipPerc =
              Math.round(
                (vaxDataZIP.fully_vaccinated / popDataZIP.pop) * 10000
              ) / 100;
            partVaxdZipPerc =
              Math.round(
                (vaxDataZIP.partially_vaccinated / popDataZIP.pop) * 10000
              ) / 100;
            unVaxdZipPerc = 100 - (fullyVaxdZipPerc + partVaxdZipPerc);

            ctx = $("#barChart");
            barChart = new Chart(ctx, {
              type: "bar",
              data: {
                labels: ["Partially Vaccinated", "Fully Vaccinated"],
                datasets: [
                  {
                    label: `People Vaccinated, ZIP Code ${theZIP}`,
                    data: [
                      vaxDataZIP.partially_vaccinated,
                      vaxDataZIP.fully_vaccinated,
                    ],
                    backgroundColor: [
                      "rgba(86, 121, 227, 0.9)",
                      "rgba(25, 42, 94, 0.9)",
                    ],
                    borderColor: [
                      "rgba(25, 42, 94, 1)",
                      "rgba(54, 162, 235, 1)",
                    ],
                    borderWidth: 1,
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
            ctxPie = $("#pieChart");
            pieChart = new Chart(ctxPie, {
              type: "doughnut",
              data: {
                labels: [
                  "Partially Vaccinated",
                  "Fully Vaccinated",
                  "Unvaccinated",
                ],
                datasets: [
                  {
                    label: "Vaxd people",
                    data: [partVaxdZipPerc, fullyVaxdZipPerc, unVaxdZipPerc],
                    backgroundColor: [
                      "rgb(86, 121, 227)",
                      "rgb(25, 42, 94)",
                      "rgb(255, 205, 86)",
                    ],
                    hoverOffset: 4,
                  },
                ],
              },
            });
          });
        });
      });
    });
  });
});

// $(document).ready(function() {
//   $.ajax(dataset).done(function(data) {
//     var parsedData = JSON.parse(data);
//     featureGroup = L.geoJson(parsedData, {
//     }).addTo(map)
//   });
// });




