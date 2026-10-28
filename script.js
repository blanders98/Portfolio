// ===== SHARED HEADER & FOOTER =====
// Rendered here so the nav and contact links live in one place.
const PAGES = [
    ['resume.html', 'Resume'],
    ['graduate_work.html', 'Projects'],
    ['research_work.html', 'Research'],
    ['contact.html', 'Contact'],
];
const EMAIL = 'benlanders417@gmail.com';
const LINKEDIN = 'https://www.linkedin.com/in/ben-l-526415219/';
const GITHUB = 'https://github.com/blanders98';

const currentPage = location.pathname.split('/').pop() || 'index.html';

document.querySelector('.site-header').innerHTML = `
    <a class="wordmark" href="index.html">Ben Landers</a>
    <nav aria-label="Main">${PAGES.map(([href, label]) =>
        `<a href="${href}"${href === currentPage ? ' aria-current="page"' : ''}>${label}</a>`).join('')}
    </nav>`;

document.querySelector('.site-footer').innerHTML = `
    <a href="mailto:${EMAIL}">${EMAIL}</a>
    <a href="${LINKEDIN}" target="_blank" rel="noopener">LinkedIn</a>
    <a href="${GITHUB}" target="_blank" rel="noopener">GitHub</a>`;


// ===== BACKGROUND MAP =====
// Each page sets its own location with data-center / data-zoom on <body>.
const sheet = document.querySelector('.sheet');
const isHome = document.body.classList.contains('home');
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

const map = L.map('map', {
    zoomControl: false,
    dragging: false,
    scrollWheelZoom: false,
    doubleClickZoom: false,
    touchZoom: false,
    boxZoom: false,
    keyboard: false,
});

// Esri's gray canvas plus its matching place-name layer; style.css tints both to match the palette.
const canvas = matchMedia('(prefers-color-scheme: dark)').matches ? 'Dark' : 'Light';
['Base', 'Reference'].forEach(layer => {
    L.tileLayer(`https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_${canvas}_Gray_${layer}/MapServer/tile/{z}/{y}/{x}`, {
        attribution: layer === 'Base' ? 'Tiles &copy; Esri, HERE, Garmin, &copy; OpenStreetMap contributors' : '',
        maxZoom: 16,
    }).addTo(map);
});
map.attributionControl.setPrefix(false);
L.control.scale({ position: 'bottomright' }).addTo(map);

// On the home page's wide layout the sheet covers the left side, so aim at the visible strip to its right.
const sheetOffset = () => (isHome && innerWidth > 960 ? sheet.offsetWidth / 2 : 0);

function focusMap(latlng, zoom, fly) {
    const target = map.unproject(map.project(latlng, zoom).subtract([sheetOffset(), 0]), zoom);
    fly ? map.flyTo(target, zoom, { duration: 2 }) : map.setView(target, zoom);
}

const { center, zoom = 12 } = document.body.dataset;
focusMap(center.split(',').map(Number), Number(zoom), false);

// Coordinate readout for the middle of the visible map area.
const coords = L.control({ position: 'bottomright' });
coords.onAdd = () => L.DomUtil.create('div', 'coords');
coords.addTo(map);

const fmt = (v, pos, neg) => `${Math.abs(v).toFixed(4)}° ${v >= 0 ? pos : neg}`;
function showCoords() {
    const size = map.getSize();
    const c = map.containerPointToLatLng([size.x / 2 + sheetOffset(), size.y / 2]);
    coords.getContainer().textContent = `${fmt(c.lat, 'N', 'S')}, ${fmt(c.lng, 'E', 'W')}`;
}
map.on('move', showCoords);
showCoords();

// Slow eastward drift on the home page. panBy rounds to whole pixels, so accumulate sub-pixel steps.
let drifting = isHome && !reduceMotion;
let carry = 0;
let last = performance.now();
function drift(now) {
    carry += (now - last) * 0.008;
    last = now;
    if (drifting && carry >= 1) {
        map.panBy([Math.floor(carry), 0], { animate: false });
        carry %= 1;
    }
    requestAnimationFrame(drift);
}
requestAnimationFrame(drift);


// ===== PATH (HOME PAGE) =====
// Each stop gets a numbered marker; selecting a stop flies the background map there.
const stops = [...document.querySelectorAll('.path button')];
let resumeDrift;

stops.forEach((button, i) => {
    const latlng = button.dataset.coords.split(',').map(Number);
    L.marker(latlng, {
        icon: L.divIcon({ className: `pin pin-${button.dataset.kind}`, html: i + 1, iconSize: [26, 26] }),
        keyboard: false,
    }).addTo(map);

    button.addEventListener('click', () => {
        stops.forEach(b => b.setAttribute('aria-pressed', b === button));
        drifting = false;
        clearTimeout(resumeDrift);
        resumeDrift = setTimeout(() => { drifting = !reduceMotion; carry = 0; }, 2500);
        if (innerWidth <= 960) scrollTo({ top: 0 });
        focusMap(latlng, 11, !reduceMotion);
    });
});
