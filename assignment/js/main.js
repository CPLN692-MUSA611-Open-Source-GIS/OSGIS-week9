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
        url: 'https://raw.githubusercontent.com/zjalexzhou/OSGIS-week9/master/assignment/data/zipcode_population/allPop.csv',
        dataType: 'text',
      }).done(function(data){
          
          var allTextLines = data.split(/\r\n|\n/);
          var headers = allTextLines[0].split(',');
          let zipcode_population = []
          allTextLines.shift()
          _.each(allTextLines, function(e){
              zipcode_population.push({
                  zipcode: e.split(',')[1],
                  population: parseInt(e.split(',')[2])
                })
          })
          console.log(zipcode_population)
        })
        //   for (var i=1; i<allTextLines.length; i++){
        //     zipcode_population.push({
        //         zipcode: allTextLines[i].split(',')[1],
        //         population: parseInt(allTextLines[i].split(',')[2])})
        //   }
})
