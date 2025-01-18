// Import Globe.gl
import Globe from 'globe.gl';

// Function to create and update the globe
function createGlobe() {
    const globeElement = document.getElementById('globe');

    // Initialize globe
    const globe = Globe()
        .globeImageUrl('//unpkg.com/three-globe/example/img/earth-dark.jpg')
        .backgroundColor('#000000')
        .width(globeElement.clientWidth)
        .height(500);

    // Add it to the DOM
    globe(globeElement);

    // Prepare data for countries
    const countryData = [];

    CURRENCY_DATA.forEach(currency => {
        if (currency.country === 'Europe') {
            EUR_COUNTRIES.forEach(countryCode => {
                countryData.push({
                    code: countryCode,
                    color: '#0052FF',
                    info: {
                        region: 'Europe',
                        currency: 'EUR',
                        digital: currency.digital,
                        provider: currency.provider
                    }
                });
            });
        } else {
            if (COUNTRY_CODES[currency.country]) {
                countryData.push({
                    code: COUNTRY_CODES[currency.country],
                    color: '#0052FF',
                    info: {
                        country: currency.country,
                        currency: currency.code,
                        digital: currency.digital,
                        provider: currency.provider
                    }
                });
            }
        }
    });

    // Configure globe
    globe
        .hexPolygonsData(countryData)
        .hexPolygonResolution(3)
        .hexPolygonMargin(0.3)
        .hexPolygonColor(d => d.color)
        .hexPolygonLabel(d => {
            const info = d.info;
            return `
                ${info.country ? `Country: ${info.country}` : `Region: ${info.region}`}<br>
                Currency: ${info.currency}<br>
                Digital: ${info.digital}<br>
                Provider: ${info.provider}
            `;
        });

    // Auto-rotation
    let isRotating = true;
    const rotationSpeed = 0.3;

    (function animate() {
        if (isRotating) {
            globe.rotation({
                lat: globe.rotation().lat,
                lng: (globe.rotation().lng + rotationSpeed) % 360
            });
        }
        requestAnimationFrame(animate);
    })();

    // Control rotation on interaction
    globeElement.addEventListener('mousedown', () => {
        isRotating = false;
    });

    globeElement.addEventListener('mouseup', () => {
        setTimeout(() => {
            isRotating = true;
        }, 1500);
    });

    // Handle window resize
    window.addEventListener('resize', () => {
        globe.width(globeElement.clientWidth);
    });
}

// Function to populate the currency table
function populateTable() {
    const tableBody = document.getElementById('currency-table-body');
    tableBody.innerHTML = ''; // Clear existing content

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

// Initialize everything when the page loads
document.addEventListener('DOMContentLoaded', () => {
    createGlobe();
    populateTable();
});