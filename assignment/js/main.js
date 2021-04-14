/* =====================
  Global Variables
===================== */
var vaccination;
var zipcode;

vaccinationPath = 'https://raw.githubusercontent.com/zjalexzhou/OSGIS-week9/master/assignment/data/vaccination_by_zip.json'
zipcodePath = 'https://raw.githubusercontent.com/CPLN692-MUSA611-Open-Source-GIS/datasets/master/geojson/Zipcodes_Poly.geojson'

var eachFeatureFunction = function(layer) {
    layer.on('click', function (event) {
        // Zoom to a particular feature when clicked
        map.fitBounds(event.target.getBounds())
        let zip = event.target.feature.properties.CODE
        zipVaccinationInfo = vaccination[zip]
        console.log('Vaccination Info. For zipcode '+ zip + ': ')
        console.log(zipVaccinationInfo)
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
    $.ajax({
        url: 'data/zipcode/population/allPop.csv',
        dataType: 'text',
      }).done(function(data){
          console.log(data)
      });
})
