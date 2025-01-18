// Function to create and update the globe
function createGlobe() {
    try {
        console.log('Initializing globe...');
        const globeElement = document.getElementById('globe');

        if (!globeElement) {
            console.error('Globe container element not found');
            return;
        }

        if (typeof Globe === 'undefined') {
            console.error('Globe.gl library not loaded');
            return;
        }

        // Initialize globe with basic configuration
        const globe = Globe()
            .globeImageUrl('//unpkg.com/three-globe/example/img/earth-night.jpg')
            .backgroundColor('#000000')
            .width(globeElement.clientWidth)
            .height(500)
            .showGraticules(true)
            .atmosphereColor('#1a237e')
            .atmosphereAltitude(0.25);

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

        // Configure globe with country data
        globe
            .hexPolygonsData(countryData)
            .hexPolygonResolution(3)
            .hexPolygonMargin(0.3)
            .hexPolygonAltitude(0.001)
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

        // Set initial camera position
        globe.pointOfView({ lat: 39.6, lng: -98.5, altitude: 2.5 });

        // Auto-rotation
        let currentLng = -98.5;
        let frame;

        function animate() {
            currentLng = (currentLng + 0.3) % 360;
            globe.pointOfView({
                lat: 39.6,
                lng: currentLng,
                altitude: 2.5
            });
            frame = requestAnimationFrame(animate);
        }

        // Start animation
        animate();

        // Clean up on window unload
        window.addEventListener('unload', () => {
            if (frame) {
                cancelAnimationFrame(frame);
            }
        });

        // Handle window resize
        window.addEventListener('resize', () => {
            globe.width(globeElement.clientWidth);
        });

    } catch (error) {
        console.error('Error creating globe:', error);
    }
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
    console.log('DOM Content Loaded');
    createGlobe();
    populateTable();
});