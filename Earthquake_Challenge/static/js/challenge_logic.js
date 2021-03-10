// Add console.log to see if our code is working.
console.log("working");

// Create the tile layer that will be the background of our map.
let streets = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/{z}/{x}/{y}?access_token={accessToken}', {
	attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
	maxZoom: 18,
	accessToken: API_KEY
});

// Create the second tile layer that will be the second background of our map.
let satelliteStreets = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v11/tiles/{z}/{x}/{y}?access_token={accessToken}', {
	attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
	maxZoom: 18,
	accessToken: API_KEY
});

// Create the third tile layer that will be the third background of our map.
let dark = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/dark-v10/tiles/{z}/{x}/{y}?access_token={accessToken}', {
	attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
	maxZoom: 18,
	accessToken: API_KEY
});

// Create the map object with center, zoom level, and default layer.
let map = L.map('mapid', {
	center: [40.7, -94.5],
	zoom: 3,
	layers: [streets]
});

// Create a base layer that holds all maps.
let baseMaps = {
  "Streets": streets,
  "Satellite": satelliteStreets,
  "Dark": dark
};

// 1. Add all layerGroups.
let allEarthquakes = new L.LayerGroup();
let allTechtonicPlates = new L.LayerGroup();
let majorEarthquakes = new L.LayerGroup();

// 2. Add a reference to the tectonic plates and major earthquakes group to the overlays object.
let overlays = {
  "Earthquakes": allEarthquakes,
  "Techtonic Plates": allTechtonicPlates,
  "Major Earthquakes": majorEarthquakes
};

// Then, add a control to the map that will allow the user to change which
// layers are visible.
L.control.layers(baseMaps, overlays).addTo(map);

// Use d3.json to call all our all_week geoJSON data.
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(function(data) {

  // This function returns the style data for each of the earthquakes plotted on
  // the map. Pass the magnitude of the earthquake into two separate functions
  // to calculate the color and radius.
  function styleInfo(feature) {
    return {
      opacity: 1,
      fillOpacity: 1,
      fillColor: getColor(feature.properties.mag),
      color: "#000000",
      radius: getRadius(feature.properties.mag),
      stroke: true,
      weight: 0.5
    };
  }

  // Determine the color of the marker based on the magnitude of the earthquake.
  function getColor(magnitude) {
    if (magnitude > 5) {
      return "#ea2c2c";
    }
    if (magnitude > 4) {
      return "#ea822c";
    }
    if (magnitude > 3) {
      return "#ee9c00";
    }
    if (magnitude > 2) {
      return "#eecc00";
    }
    if (magnitude > 1) {
      return "#d4ee00";
    }
    return "#98ee00";
  }

  // Determine the radius of the earthquake marker based on its magnitude.
  // Earthquakes with a magnitude of 0 were being plotted with the wrong radius.
  function getRadius(magnitude) {
    if (magnitude === 0) {
      return 1;
    }
    return magnitude * 4;
  }

  // Create GeoJSON layer with the retrieved data.
  L.geoJson(data, {

    	// We turn each feature into a circleMarker on the map.
    	pointToLayer: function(feature, latlng) {

      		console.log(data);
      		return L.circleMarker(latlng);
        },

      // Set the style for each circleMarker using the styleInfo function.
      style: styleInfo,

     // Create a popup for each circleMarker to display the magnitude and location of the earthquake
     //  after the marker has been created and styled.
     onEachFeature: function(feature, layer) {
      layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place);
    }
  }).addTo(allEarthquakes);

  // Then, add the earthquake layer to our map.
  allEarthquakes.addTo(map);

  // Retrieve the major earthquake GeoJSON data >4.5 mag for the week.
  d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_week.geojson").then(function(data3) {

    // 4. Use the same style as the earthquake data.
    function styleInfo3(feature) {
      return {
        opacity: 1,
        fillOpacity: 1,
        fillColor: getColorB(feature.properties.mag),
        color: "#000000",
        radius: getRadiusB(feature.properties.mag),
        stroke: true,
        weight: 0.5
      };
    }
  
    // 5. Change the color function to use three colors for the major earthquakes based on the magnitude of the earthquake.
    function getColorB(magnitude) {

      // Mag greater than 5
      if (magnitude > 5) {
        return "#ea2c2c";
      }

      // Mag greater than 4 blue
      if (magnitude > 4) {
        return "#ea822c";
      }

      // Mag less than 4 (all others) white
      return "#ee9c00";
    }
 
    // 6. Use the function that determines the radius of the earthquake marker based on its magnitude.
    function getRadiusB(magnitude) {
      if (magnitude === 0) {
       return 1;
      }
      return magnitude * 4;
    }

    // 7. Create a GeoJSON layer with the retrieved data that adds a circle to the map, 
    // sets the style of the circle, and displays the magnitude and location of the earthquake
    //  after the marker has been created and styled.
    L.geoJson(data3, {
      pointToLayer: function(feature, latlng) {
        return L.circleMarker(latlng)
      },
      style: styleInfo3,
      onEachFeature: function(feature, layer) {
        layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place);
      }
    }).addTo(majorEarthquakes);

    // 8. Add the major earthquakes layer to the map.
    majorEarthquakes.addTo(map);

    // 9. Close the braces and parentheses for the major earthquake data.
  });

  // Create a legend control object.
  let legend = L.control({
    position: "bottomright"
  });

  // Then, add all the details for the legend.
  legend.onAdd = function() {
    let div = L.DomUtil.create("div", "info legend");

    const magnitudes = [0, 1, 2, 3, 4, 5];
    const colors = [
      "#98ee00",
      "#d4ee00",
      "#eecc00",
      "#ee9c00",
      "#ea822c",
      "#ea2c2c"
    ];

    // Loop through intervals to generate a label with a colored square for each interval.
    for (var i = 0; i < magnitudes.length; i++) {

      // Comment out adding colors to the log as this is not necessary.
      // console.log(colors[i]);

      div.innerHTML +=
        "<i style='background: " + colors[i] + "'></i> " +
        magnitudes[i] + (magnitudes[i + 1] ? "&ndash;" + magnitudes[i + 1] + "<br>" : "+");
      }
      return div;
  };

  // Finally, add legend to the map.
  legend.addTo(map);

  // Retrieve the earthquake GeoJSON data from fraxen github page.
  // Add source as binary popup so users know where data comes from.
  // Use d3.json to make a call to get Tectonic Plate geoJSON data.
  d3.json("https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json").then(function(data2) {
    
    // Comment out data log as this is not necessary.
    // console.log(data2);

    // Style function #2
    function styleInfo2(features) {
      return {
        color: "Orange",
        stroke: true,
        weight: 5
      };
    }

    L.geoJson(data2, {
      style: styleInfo2,
      onEachFeature: function(features, layer) {
        layer.bindPopup("Name: " + features.properties.Name + "<br>Source: " + features.properties.Source);
      }
    }).addTo(allTechtonicPlates);
  
    allTechtonicPlates.addTo(map);

  });

});





  
 
  
