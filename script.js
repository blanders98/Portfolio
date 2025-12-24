// ===== MAP INITIALIZATION =====
const pageUrl = window.location.pathname;
let mapCenter;

// Set map center based on the page
if (pageUrl.includes('professional_experience.html')) {
    mapCenter = [38.0293, -78.4767]; // Charlottesville, Virginia
} else {
    mapCenter = [44.9778, -93.2650]; // Minneapolis, Minnesota
}

// Initialize the map with custom styling
const map = L.map('map', {
    zoomControl: true,
    attributionControl: true
}).setView(mapCenter, 13);

// Add custom tile layer with opacity for better overlay effect
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    opacity: 0.7
}).addTo(map);

// Add a custom marker if on home page
if (pageUrl.includes('index.html') || pageUrl === '/' || pageUrl.endsWith('/')) {
    const customIcon = L.divIcon({
        className: 'custom-marker',
        html: '<div style="background: #7CB342; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3);"></div>',
        iconSize: [20, 20]
    });
    L.marker(mapCenter, { icon: customIcon }).addTo(map);
}

// Projects page - no special map initialization needed
// (Map is initialized with the default mapCenter above)


// ===== JOURNEY MAP (HOME PAGE ONLY) =====
if (pageUrl.includes('index.html') || pageUrl === '/' || pageUrl.endsWith('/')) {
    // Wait for DOM to be ready before initializing journey map
    document.addEventListener('DOMContentLoaded', function() {
        const journeyMapElement = document.getElementById('journeyMap');

        if (journeyMapElement) {
            // Initialize journey map centered on North America to show all locations
            const journeyMap = L.map('journeyMap', {
                zoomControl: true,
                attributionControl: true,
                scrollWheelZoom: true
            }).setView([39.8283, -85.5795], 4); // Center of US to show all locations

            // Add tile layer
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
                opacity: 0.85
            }).addTo(journeyMap);

            // Define colors for education and work
            const colors = {
                education: "#2C5F7C", // Primary blue for education
                work: "#7CB342"       // Accent green for work
            };

            // Journey locations with coordinates and information
            const journeyLocations = [
                {
                    coords: [42.9849, -81.2453],
                    location: "London, Ontario",
                    title: "Undergraduate Education",
                    role: "University of Western Ontario",
                    description: "Bachelor's degree in Geography specializing in Environment and Health.",
                    type: "education",
                    number: 1
                },
                {
                    coords: [38.0293, -78.4767],
                    location: "Charlottesville, VA",
                    title: "Staff Geoscientist II",
                    role: "Environmental Consulting (2021-2024)",
                    description: "Delivered GIS-based analytics through professional-grade maps, spatial analyses, and data visualizations for remediation planning.",
                    type: "work",
                    number: 2
                },
                {
                    coords: [44.9742, -93.2336],
                    displayCoords: [44.5000, -93.8000], // Offset position for default zoom - south/west
                    location: "Minneapolis, MN",
                    title: "Graduate Education",
                    role: "University of Minnesota",
                    description: "Master's degree in Geographic Information Science (Expected: May 2026).",
                    type: "education",
                    number: 3,
                    needsOffset: true
                },
                {
                    coords: [44.9892, -93.1815],
                    displayCoords: [45.4500, -92.6000], // Offset position for default zoom - north/east
                    location: "St. Paul, MN",
                    title: "Graduate Research Assistant",
                    role: "RTGS Lab, GEMS Informatics Center (2024-Present)",
                    description: "Developing comprehensive geospatial models for conservation parcel prioritization using Python and open-source libraries.",
                    type: "work",
                    number: 4,
                    needsOffset: true
                },
                {
                    coords: [33.7490, -84.3880],
                    location: "Atlanta, GA",
                    title: "GIS Data Engineer Intern",
                    role: "Juvare (May 2025-Present)",
                    description: "Developing and executing data processing pipelines. Processing datasets for software products and automating workflows.",
                    type: "work",
                    number: 5
                }
            ];

            // Store markers for zoom-based repositioning
            const markers = [];
            const ZOOM_THRESHOLD = 9; // Zoom level where markers snap to true position (4 zooms from default)

            // Create custom numbered icons for each location
            journeyLocations.forEach((location, index) => {
                const markerColor = colors[location.type];
                const customIcon = L.divIcon({
                    className: 'journey-marker',
                    html: `<div style="
                        background: ${markerColor};
                        width: 36px;
                        height: 36px;
                        border-radius: 50%;
                        border: 3px solid white;
                        box-shadow: 0 3px 10px rgba(0,0,0,0.3);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        color: white;
                        font-weight: bold;
                        font-size: 16px;
                        font-family: 'Inter', sans-serif;
                    ">${location.number}</div>`,
                    iconSize: [36, 36],
                    iconAnchor: [18, 18]
                });

                // Create popup content
                const popupContent = `
                    <div class="journey-popup">
                        <div class="popup-title">${location.title}</div>
                        <div class="popup-role">${location.role}</div>
                        <div class="popup-location">${location.location}</div>
                        <div class="popup-description">${location.description}</div>
                    </div>
                `;

                // Use display coords if available, otherwise use true coords
                const initialCoords = location.displayCoords || location.coords;

                // Add marker with popup
                const marker = L.marker(initialCoords, { icon: customIcon })
                    .bindPopup(popupContent, {
                        maxWidth: 300,
                        className: 'journey-popup-container'
                    })
                    .addTo(journeyMap);

                // Draw leader line if this location needs offset
                let leaderLine = null;
                if (location.needsOffset) {
                    leaderLine = L.polyline([location.displayCoords, location.coords], {
                        color: markerColor,
                        weight: 2,
                        opacity: 0.6,
                        dashArray: '5, 5'
                    }).addTo(journeyMap);
                }

                // Store marker with location data and its associated leader line
                markers.push({ marker, location, leaderLine });
            });

            // Handle zoom events to reposition markers
            journeyMap.on('zoomend', function() {
                const currentZoom = journeyMap.getZoom();

                markers.forEach(({ marker, location, leaderLine }) => {
                    if (location.needsOffset) {
                        if (currentZoom >= ZOOM_THRESHOLD) {
                            // Zoomed in - use true position and hide leader line
                            marker.setLatLng(location.coords);
                            if (leaderLine && journeyMap.hasLayer(leaderLine)) {
                                journeyMap.removeLayer(leaderLine);
                            }
                        } else {
                            // Zoomed out - use display position and show leader line
                            marker.setLatLng(location.displayCoords);
                            if (leaderLine && journeyMap.hasLayer(marker) && !journeyMap.hasLayer(leaderLine)) {
                                journeyMap.addLayer(leaderLine);
                            }
                        }
                    }
                });
            });

            // Fit map bounds to show all markers
            const group = L.featureGroup(journeyLocations.map(loc => L.marker(loc.coords)));
            journeyMap.fitBounds(group.getBounds().pad(0.2));

            // Add legend with layer controls
            const legend = L.control({ position: 'bottomright' });

            legend.onAdd = function(map) {
                const div = L.DomUtil.create('div', 'journey-legend');
                div.innerHTML = `
                    <div style="
                        background: white;
                        padding: 12px 15px;
                        border-radius: 8px;
                        box-shadow: 0 2px 10px rgba(0,0,0,0.2);
                        font-family: 'Inter', sans-serif;
                        font-size: 14px;
                        line-height: 1.8;
                    ">
                        <div style="font-weight: 600; margin-bottom: 8px; color: var(--primary-color);">Legend</div>
                        <div style="display: flex; align-items: center; margin-bottom: 5px; cursor: pointer;" id="education-toggle">
                            <input type="checkbox" id="education-checkbox" checked style="margin-right: 8px; cursor: pointer;">
                            <div style="
                                background: ${colors.education};
                                width: 18px;
                                height: 18px;
                                border-radius: 50%;
                                border: 2px solid white;
                                box-shadow: 0 2px 4px rgba(0,0,0,0.2);
                                margin-right: 8px;
                            "></div>
                            <span>Education</span>
                        </div>
                        <div style="display: flex; align-items: center; cursor: pointer;" id="work-toggle">
                            <input type="checkbox" id="work-checkbox" checked style="margin-right: 8px; cursor: pointer;">
                            <div style="
                                background: ${colors.work};
                                width: 18px;
                                height: 18px;
                                border-radius: 50%;
                                border: 2px solid white;
                                box-shadow: 0 2px 4px rgba(0,0,0,0.2);
                                margin-right: 8px;
                            "></div>
                            <span>Work Experience</span>
                        </div>
                    </div>
                `;

                // Prevent map interactions when clicking on legend
                L.DomEvent.disableClickPropagation(div);

                return div;
            };

            legend.addTo(journeyMap);

            // Add toggle functionality
            setTimeout(() => {
                const educationCheckbox = document.getElementById('education-checkbox');
                const workCheckbox = document.getElementById('work-checkbox');

                educationCheckbox.addEventListener('change', function() {
                    const currentZoom = journeyMap.getZoom();
                    markers.forEach(({ marker, location, leaderLine }) => {
                        if (location.type === 'education') {
                            if (this.checked) {
                                journeyMap.addLayer(marker);
                                // Add leader line if zoomed out and marker has offset
                                if (leaderLine && currentZoom < ZOOM_THRESHOLD) {
                                    journeyMap.addLayer(leaderLine);
                                }
                            } else {
                                journeyMap.removeLayer(marker);
                                // Remove leader line if it exists
                                if (leaderLine && journeyMap.hasLayer(leaderLine)) {
                                    journeyMap.removeLayer(leaderLine);
                                }
                            }
                        }
                    });
                });

                workCheckbox.addEventListener('change', function() {
                    const currentZoom = journeyMap.getZoom();
                    markers.forEach(({ marker, location, leaderLine }) => {
                        if (location.type === 'work') {
                            if (this.checked) {
                                journeyMap.addLayer(marker);
                                // Add leader line if zoomed out and marker has offset
                                if (leaderLine && currentZoom < ZOOM_THRESHOLD) {
                                    journeyMap.addLayer(leaderLine);
                                }
                            } else {
                                journeyMap.removeLayer(marker);
                                // Remove leader line if it exists
                                if (leaderLine && journeyMap.hasLayer(leaderLine)) {
                                    journeyMap.removeLayer(leaderLine);
                                }
                            }
                        }
                    });
                });
            }, 100);
        }
    });
}


// ===== BACK TO TOP BUTTON =====
document.addEventListener('DOMContentLoaded', function() {
    // Create back to top button if it doesn't exist
    if (!document.getElementById('back-to-top')) {
        const backToTopBtn = document.createElement('button');
        backToTopBtn.id = 'back-to-top';
        backToTopBtn.innerHTML = '↑';
        backToTopBtn.setAttribute('aria-label', 'Back to top');
        document.body.appendChild(backToTopBtn);
    }

    const backToTopButton = document.getElementById('back-to-top');

    // Show/hide button based on scroll position
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTopButton.classList.add('show');
        } else {
            backToTopButton.classList.remove('show');
        }
    });

    // Scroll to top when button is clicked
    backToTopButton.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
});


// ===== ACTIVE NAVIGATION HIGHLIGHTING =====
document.addEventListener('DOMContentLoaded', function() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('nav ul li a');

    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href');
        // Remove any query parameters or hash from comparison
        const cleanLinkPage = linkPage.split('?')[0].split('#')[0];
        const cleanCurrentPage = currentPage.split('?')[0].split('#')[0];

        if (cleanLinkPage === cleanCurrentPage ||
            (cleanCurrentPage === '' && cleanLinkPage === 'index.html')) {
            link.classList.add('active');
        }
    });
});


// ===== SMOOTH SCROLL FOR ANCHOR LINKS =====
document.addEventListener('DOMContentLoaded', function() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');

    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId !== '#' && targetId !== '') {
                e.preventDefault();
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
});


// ===== FADE IN ANIMATION ON SCROLL =====
document.addEventListener('DOMContentLoaded', function() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe all articles and sections
    const animatedElements = document.querySelectorAll('article, section');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});


// ===== LOADING INDICATOR =====
window.addEventListener('load', function() {
    document.body.classList.remove('loading');
});
