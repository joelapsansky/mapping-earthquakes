// Add console.log to check to see if code is working.
console.log("working");

// We create tile layer that will be the background

// Grabbing our GeoJSON data
// L.geoJson(sanFranAirport, {
//     // We turn each feature into a marker on the map
//     onEachFeature: function(feature, layer) {
//       console.log(layer);
//       layer.bindPopup("Ariport Code: " + feature.properties.faa + 
//         "<br>---------------------------------------------------<br>" + 
//         "Airport Name: " + feature.properties.name);
//     }
//   }).addTo(map);


// Comment out previous work
// let cityData = cities;

// // Loop through the cities array and create one marker for each city.
// cityData.forEach(function(city) {
//     console.log(city)
//     L.circleMarker(city.location, {
//         radius: city.population/100000,
//         color: "yellow",
//         fillColor: "orange"
//     })
//     .bindPopup("<h2>" + city.city + ", " + city.state + "</h2> <hr> <h3>Population " + city.population.toLocaleString() + "</h3>")
//     .addTo(map);
// });

// We create the tile layer that will be the background of our map
let streets = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/{z}/{x}/{y}?access_token={accessToken}', {
  attribution: 'Map data © <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
  maxZoom: 18,
  accessToken: API_KEY
});

let satelliteStreets = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v11/tiles/{z}/{x}/{y}?access_token={accessToken}', {
  attribution: 'Map data © <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
  maxZoom: 18,
  accessToken: API_KEY
});

let baseMaps = {
  "Streets": streets,
  "Satellite Streets": satelliteStreets
};

// Create the map object with a center and zoom level
let map = L.map('mapid', {
  center: [43.7, -79.3],
  zoom: 11,
  weight: 30,
  layers: [satelliteStreets]
});

// Pass our map layers into our layer control and add the layer control to the map
L.control.layers(baseMaps).addTo(map);

// Accessing the Toronto neighborhoods GeoJSON URL.
let torontoHoods = "https://raw.githubusercontent.com/joelapsansky/mapping-earthquakes/main/torontoNeighborhoods.json";

// Grabbing our GeoJSON data.
d3.json(torontoHoods).then(function(data) {
  console.log(data);
  //Creating a GeoJSON layer with the retrieved data.
  L.geoJSON(data, {
    color: "purple",
    fillColor: "white",
    fillOpacity: 0.75
  }).addTo(map);
});