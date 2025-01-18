// Globe visualization
document.addEventListener('DOMContentLoaded', function() {
    // Set up SVG
    const width = document.querySelector('.globe-container').clientWidth;
    const height = 500;
    const sensitivity = 75;

    const svg = d3.select('#globe')
        .attr('width', width)
        .attr('height', height);

    // Set up the globe projection
    const projection = d3.geoOrthographic()
        .scale(height / 2.1)
        .translate([width / 2, height / 2]);

    const initialScale = projection.scale();
    const path = d3.geoPath().projection(projection);

    // Add background circle
    svg.append('circle')
        .attr('fill', '#111')
        .attr('stroke', '#000')
        .attr('stroke-width', '0.2')
        .attr('cx', width / 2)
        .attr('cy', height / 2)
        .attr('r', initialScale);

    // Function to determine if a country should be highlighted
    function shouldHighlightCountry(countryId) {
        // Check if it's a Euro country
        const isEuroCountry = EUR_COUNTRIES.includes(countryId);
        if (isEuroCountry) {
            console.log('Euro country found:', countryId);
            return true;
        }

        // Check against COUNTRY_CODES
        for (const [country, code] of Object.entries(COUNTRY_CODES)) {
            if (code === countryId) {
                console.log('Stablecoin country found:', country, code);
                return true;
            }
        }

        return false;
    }

    // Load world map data and create the globe
    d3.json('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json')
        .then(function(world) {
            console.log('Loaded world data, processing countries...');

            // Draw countries
            const countries = svg.append('g');
            countries.selectAll('path')
                .data(topojson.feature(world, world.objects.countries).features)
                .enter().append('path')
                .attr('d', path)
                .attr('fill', d => {
                    const highlight = shouldHighlightCountry(d.id);
                    console.log('Country:', d.id, 'Highlighted:', highlight);
                    return highlight ? '#2979ff' : '#1a1a1a';
                })
                .attr('stroke', '#333')
                .attr('stroke-width', '0.3')
                .attr('opacity', d => shouldHighlightCountry(d.id) ? 1 : 0.7);

            // Rotation behavior
            let m0, o0;

            svg.call(d3.drag()
                .on('start', function(event) {
                    const r = projection.rotate();
                    m0 = [event.x, event.y];
                    o0 = [-r[0], -r[1]];
                })
                .on('drag', function(event) {
                    if (m0) {
                        const m1 = [event.x, event.y];
                        const o1 = [o0[0] + (m1[0] - m0[0]) / sensitivity, 
                                  o0[1] + (m1[1] - m0[1]) / sensitivity];
                        projection.rotate([-o1[0], -o1[1]]);
                        svg.selectAll('path').attr('d', path);
                    }
                }));

            // Auto-rotation
            function rotate() {
                const rotation = projection.rotate();
                projection.rotate([rotation[0] + 0.1, rotation[1]]);
                svg.selectAll('path').attr('d', path);
                requestAnimationFrame(rotate);
            }

            // Start auto-rotation
            rotate();
        })
        .catch(function(error) {
            console.error('Error loading world map data:', error);
        });

    // Handle window resize
    window.addEventListener('resize', function() {
        const newWidth = document.querySelector('.globe-container').clientWidth;
        svg.attr('width', newWidth);
        projection.translate([newWidth / 2, height / 2]);
        svg.selectAll('path').attr('d', path);
    });
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