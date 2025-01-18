// Function to create and update the globe
function createGlobe() {
    // Prepare data for active countries and hover text
    const activeCountries = [];
    const hoverText = [];
    const zValues = [];

    CURRENCY_DATA.forEach(currency => {
        if (currency.country === 'Europe') {
            EUR_COUNTRIES.forEach(countryCode => {
                activeCountries.push(countryCode);
                hoverText.push(
                    `Region: Europe<br>` +
                    `Currency: EUR<br>` +
                    `Digital: ${currency.digital}<br>` +
                    `Provider: ${currency.provider}`
                );
                zValues.push(1);
            });
        } else {
            if (COUNTRY_CODES[currency.country]) {
                activeCountries.push(COUNTRY_CODES[currency.country]);
                hoverText.push(
                    `Country: ${currency.country}<br>` +
                    `Currency: ${currency.code}<br>` +
                    `Digital: ${currency.digital}<br>` +
                    `Provider: ${currency.provider}`
                );
                zValues.push(1);
            }
        }
    });

    const data = [{
        type: 'choropleth',
        locations: activeCountries,
        z: zValues,
        text: hoverText,
        hoverinfo: 'text',
        colorscale: [[0, '#1E1E1E'], [1, '#0052FF']],
        showscale: false
    }];

    const layout = {
        geo: {
            projection: {
                type: 'orthographic',
                rotation: {
                    lon: 0,
                    lat: 30,
                    roll: 0
                }
            },
            showcoastlines: true,
            coastlinecolor: '#FFFFFF',
            showland: true,
            landcolor: '#1E1E1E',
            showocean: true,
            oceancolor: '#000000',
            showframe: false,
            bgcolor: '#000000'
        },
        paper_bgcolor: '#000000',
        plot_bgcolor: '#000000',
        margin: { l: 0, r: 0, t: 0, b: 0 },
        height: 500
    };

    const config = {
        displayModeBar: false,
        scrollZoom: false,
        showTips: false,
        frameMargins: 0,
        displaylogo: false
    };

    Plotly.newPlot('globe', data, layout, config);
}

// Function to populate the currency table
function populateTable() {
    const tableBody = document.getElementById('currency-table-body');
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

// Initialize globe rotation
function initializeGlobeRotation() {
    let lon = 0;
    let isRotating = true;
    let lastTime = 0;
    const rotationSpeed = 0.2;

    function easeInOutCubic(t) {
        return t < 0.5
            ? 4 * t * t * t
            : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }

    function animate(currentTime) {
        if (!lastTime) lastTime = currentTime;
        const deltaTime = (currentTime - lastTime) / 1000;
        lastTime = currentTime;

        if (!isRotating) return;

        const easedIncrement = easeInOutCubic(deltaTime) * rotationSpeed * 60;
        lon = (lon + easedIncrement) % 360;

        Plotly.relayout('globe', {
            'geo.projection.rotation.lon': lon
        });

        requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);

    const globeElement = document.getElementById('globe');
    let transitionTimeout;

    globeElement.addEventListener('mouseover', () => {
        clearTimeout(transitionTimeout);
        const slowDown = () => {
            rotationSpeed *= 0.95;
            if (rotationSpeed > 0.01) {
                requestAnimationFrame(slowDown);
            } else {
                isRotating = false;
            }
        };
        slowDown();
    });

    globeElement.addEventListener('mouseout', () => {
        clearTimeout(transitionTimeout);
        isRotating = true;
        const speedUp = () => {
            rotationSpeed = Math.min(rotationSpeed * 1.05, 0.2);
            if (rotationSpeed < 0.2) {
                requestAnimationFrame(speedUp);
            }
        };
        transitionTimeout = setTimeout(() => {
            speedUp();
            requestAnimationFrame(animate);
        }, 100);
    });
}

// Initialize everything when the page loads
document.addEventListener('DOMContentLoaded', () => {
    createGlobe();
    populateTable();
    initializeGlobeRotation();
});
