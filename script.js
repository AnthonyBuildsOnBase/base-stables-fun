// Initialize the globe when both scripts are loaded
let threeLoaded = false;
let globeLoaded = false;

function initializeGlobe() {
    if (!threeLoaded || !globeLoaded) {
        console.log('Waiting for dependencies...', { threeLoaded, globeLoaded });
        return;
    }

    console.log('Initializing globe...');
    try {
        const globeElement = document.getElementById('globe');
        if (!globeElement) {
            throw new Error('Globe container not found');
        }

        // Basic globe configuration
        const globe = Globe()
            .backgroundColor('#000000')
            .globeImageUrl('//cdn.jsdelivr.net/npm/three-globe/example/img/earth-dark.jpg')
            .width(globeElement.clientWidth)
            .height(500);

        // Mount the globe
        globe(globeElement);

        // Set initial view
        globe.pointOfView({ lat: 0, lng: 0, altitude: 2.5 });

        console.log('Globe initialized successfully');

        // Add window resize handler
        window.addEventListener('resize', () => {
            globe.width(globeElement.clientWidth);
        });

    } catch (error) {
        console.error('Error initializing globe:', error);
    }
}

// Check script loading
document.querySelector('script[src*="three"]').addEventListener('load', () => {
    console.log('Three.js loaded via event listener');
    threeLoaded = true;
    initializeGlobe();
});

document.querySelector('script[src*="globe.gl"]').addEventListener('load', () => {
    console.log('Globe.gl loaded via event listener');
    globeLoaded = true;
    initializeGlobe();
});

// Populate the table with currency data
function populateTable() {
    const tableBody = document.getElementById('currency-table-body');
    if (!tableBody) {
        console.error('Table body element not found');
        return;
    }

    tableBody.innerHTML = '';

    CURRENCY_DATA.forEach(currency => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${currency.country}</td>
            <td>${currency.code}</td>
            <td>${currency.digital}</td>
            <td>${currency.provider}</td>
        `;
        tableBody.appendChild(row);
    });
}

// Initialize the table when DOM is ready
document.addEventListener('DOMContentLoaded', populateTable);