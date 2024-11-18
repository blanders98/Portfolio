// Check which page is loaded
const pageUrl = window.location.pathname;

let mapCenter;

// Set map center based on the page
if (pageUrl.includes('professional_experience.html')) {
    mapCenter = [38.0293, -78.4767]; // Coordinates for Charlottesville, Virginia
} else {
    mapCenter = [44.9778, -93.2650]; // Coordinates for Minneapolis, Minnesota
}

// Initialize the map
const map = L.map('map').setView(mapCenter, 13);

// Add OpenStreetMap tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Function to initialize the ArcGIS web map
function initializeWebMap() {
    require(["esri/Map", "esri/views/MapView", "esri/WebMap"], function(Map, MapView, WebMap) {
        var webmap = new WebMap({
            portalItem: { // autocasts as new PortalItem()
                id: "02f0b4b239f9432a8bdf6d79a041808f"
            }
        });
        var view = new MapView({
            container: "webmap", // Reference to the scene div created in step 3
            map: webmap // Reference to the map object created before the scene
        });
    });
}

// Call the function if the current page is graduate_work.html
if (pageUrl.includes('graduate_work.html')) {
    initializeWebMap();
}
