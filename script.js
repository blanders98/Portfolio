// Initialize the map and set the view to Minneapolis
var map = L.map('map').setView([44.9778, -93.2650], 13);

// Add OpenStreetMap tiles to the map
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 18,
}).addTo(map);

// Add a semi-transparent overlay for more shading
var overlay = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    opacity: 0.1, // Make the shading more significant
    maxZoom: 18,
}).addTo(map);
