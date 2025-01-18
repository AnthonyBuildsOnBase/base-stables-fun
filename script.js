// Globe visualization
document.addEventListener('DOMContentLoaded', function() {
    // Set up SVG
    const width = document.querySelector('.globe-container').clientWidth;
    const height = 500;
    const sensitivity = 75;

    const svg = d3.select('#globe')
        .attr('width', width)
        .attr('height', height);

    // Create tooltip
    const tooltip = d3.select('body').append('div')
        .attr('class', 'tooltip');

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

    let isHovered = false;

    // Function to determine if a country should be highlighted
    function shouldHighlightCountry(countryId) {
        // Check if it's a Euro country
        const isEuroCountry = EUR_COUNTRIES.includes(countryId);
        if (isEuroCountry) {
            return true;
        }

        // Check against COUNTRY_CODES
        for (const [country, code] of Object.entries(COUNTRY_CODES)) {
            if (code === countryId) {
                return true;
            }
        }

        return false;
    }

    // Function to get stablecoin info for a country
    function getStablecoinInfo(countryId) {
        let info = [];

        // Check if it's a Euro country
        if (EUR_COUNTRIES.includes(countryId)) {
            const eurData = CURRENCY_DATA.find(c => c.country === 'Europe');
            if (eurData) {
                info.push({
                    country: 'Europe',
                    code: eurData.code,
                    digital: eurData.digital,
                    provider: eurData.provider
                });
            }
            return info;
        }

        // Check other countries
        for (const [country, code] of Object.entries(COUNTRY_CODES)) {
            if (code === countryId) {
                const currencyData = CURRENCY_DATA.find(c => c.country === country);
                if (currencyData) {
                    info.push(currencyData);
                }
            }
        }

        return info;
    }

    // Load world map data and create the globe
    d3.json('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json')
        .then(function(world) {
            // Draw countries
            const countries = svg.append('g');
            countries.selectAll('path')
                .data(topojson.feature(world, world.objects.countries).features)
                .enter().append('path')
                .attr('d', path)
                .attr('fill', d => {
                    const highlight = shouldHighlightCountry(d.id);
                    return highlight ? '#0052FF' : '#1a1a1a';
                })
                .attr('stroke', '#333')
                .attr('stroke-width', '0.3')
                .attr('opacity', d => shouldHighlightCountry(d.id) ? 1 : 0.7)
                .on('mouseover', function(event, d) {
                    const stablecoinInfo = getStablecoinInfo(d.id);
                    if (stablecoinInfo.length > 0) {
                        const tooltipContent = stablecoinInfo.map(info => `
                            <h4>${info.country}</h4>
                            <p>Currency: ${info.code}</p>
                            <p>Name: ${info.digital}</p>
                            <p>Issuer: ${info.provider}</p>
                        `).join('');

                        tooltip.style('display', 'block')
                            .html(tooltipContent);
                    }
                })
                .on('mousemove', function(event) {
                    tooltip.style('left', (event.pageX + 10) + 'px')
                           .style('top', (event.pageY + 10) + 'px');
                })
                .on('mouseout', function() {
                    tooltip.style('display', 'none');
                });

            // Add hover detection for the entire globe
            svg.on('mouseenter', () => { isHovered = true; })
               .on('mouseleave', () => { isHovered = false; });

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
                if (!isHovered) {
                    const rotation = projection.rotate();
                    projection.rotate([rotation[0] + 0.1, rotation[1]]);
                    svg.selectAll('path').attr('d', path);
                }
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