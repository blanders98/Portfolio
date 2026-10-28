# Ben Landers Portfolio

This repository hosts my personal portfolio showcasing projects and work in GIS involving geospatial data analysis, data science, and development.

**Live site:** https://blanders98.github.io/Portfolio/

## Tech Stack
- HTML
- CSS
- JavaScript with [Leaflet](https://leafletjs.com/) and OpenStreetMap tiles

## Structure
- `index.html`, `resume.html`, `graduate_work.html` (Projects), `research_work.html`, `contact.html`: page content
- `style.css`: all styles, including light and dark themes
- `script.js`: shared header/footer (nav and contact links are defined once here), the background map, and the Path map on the home page
- Each page sets its background map location with `data-center` and `data-zoom` on `<body>`
