// Globe visualization
document.addEventListener('DOMContentLoaded', function() {
    // Set up SVG
    const width = document.querySelector('.globe-container').clientWidth;
    const height = document.querySelector('.globe-container').clientHeight;
    const isMobile = window.innerWidth <= 768;
    const sensitivity = isMobile ? 150 : 75;
    const rotationSpeed = 0.2;
    const mobileRotationMultiplier = isMobile ? 2 : 1;

    const svg = d3.select('#globe')
        .attr('width', width)
        .attr('height', height);

    // Create tooltip
    const tooltip = d3.select('body').append('div')
        .attr('class', 'tooltip');

    // Set up the globe projection
    const projection = d3.geoOrthographic()
        .scale(height / 2.3)
        .translate([width / 2, height / 2]);

    const initialScale = projection.scale();
    const path = d3.geoPath().projection(projection);

    let isHovered = false;
    let hoverTimeout;

    // Function to reset hover state
    const resetHoverState = () => {
        clearTimeout(hoverTimeout);
        hoverTimeout = setTimeout(() => {
            isHovered = false;
            tooltip.style('display', 'none');
        }, 2000);
    };

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
        if (!countryId) return false;

        // Check if it's a Euro country
        const isEuroCountry = EUR_COUNTRIES.includes(countryId);
        if (isEuroCountry) {
            return true;
        }

        // Check against COUNTRY_CODES
        return Object.values(COUNTRY_CODES).includes(countryId);
    }

    // Function to get stablecoin info for a country
    function getStablecoinInfo(countryId) {
        if (!countryId) return [];

        let info = [];

        // Check if it's a Euro country
        if (EUR_COUNTRIES.includes(countryId)) {
            const eurData = CURRENCY_DATA.find(c => c.country === 'Europe');
            if (eurData) {
                info.push({
                    country: 'European Union',
                    code: eurData.code,
                    digital: eurData.digital,
                    provider: eurData.provider,
                    contract: eurData.contract,
                    website: eurData.website
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

    // Load world map data with better error handling
    fetch('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(function(world) {
            if (!world || !world.objects || !world.objects.countries) {
                throw new Error('Invalid world map data format');
            }

            // Draw countries
            const countries = svg.append('g');
            countries.selectAll('path')
                .data(topojson.feature(world, world.objects.countries).features)
                .enter().append('path')
                .attr('d', path)
                .attr('fill', d => shouldHighlightCountry(d.id) ? '#0052FF' : '#1a1a1a')
                .attr('stroke', '#333')
                .attr('stroke-width', '0.3')
                .attr('opacity', d => shouldHighlightCountry(d.id) ? 1 : 0.7)
                .on('mouseenter touchstart', function() {
                    isHovered = true;
                    clearTimeout(hoverTimeout);
                })
                .on('mouseleave touchend', resetHoverState)
                .on('mouseover touchstart', function(event, d) {
                    const stablecoinInfo = getStablecoinInfo(d.id);
                    if (stablecoinInfo.length > 0) {
                        const tooltipContent = stablecoinInfo.map(info => `
                            <h4>${info.country}</h4>
                            <p>Currency: ${info.code}</p>
                            <p>Name: <a href="https://basescan.org/token/${info.contract}" target="_blank" style="color: #0052FF">${info.digital}</a></p>
                            <p>Issuer: <a href="${info.website}" target="_blank" style="color: #0052FF">${info.provider}</a></p>
                        `).join('');

                        tooltip.style('display', 'block')
                               .html(tooltipContent);

                        if (isMobile) {
                            resetHoverState();
                        }
                    }
                })
                .on('mousemove touchmove', function(event) {
                    const coords = (event.touches && event.touches[0]) || event;
                    tooltip.style('left', (coords.pageX + 10) + 'px')
                           .style('top', (coords.pageY + 10) + 'px');
                })
                .on('mouseout touchend', resetHoverState);

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
                    projection.rotate([rotation[0] + (rotationSpeed * mobileRotationMultiplier), rotation[1]]);
                    svg.selectAll('path').attr('d', path);
                }
                requestAnimationFrame(rotate);
            }

            // Start auto-rotation
            rotate();
        })
        .catch(function(error) {
            console.error('Error loading world map data:', error.message);
            // Add a visible error message to the page
            svg.append('text')
                .attr('x', width / 2)
                .attr('y', height / 2)
                .attr('text-anchor', 'middle')
                .attr('fill', '#666')
                .text('Error loading map data. Please refresh the page.');
        });

    // Handle window resize
    window.addEventListener('resize', function() {
        const container = document.querySelector('.globe-container');
        const newWidth = container.clientWidth;
        const newHeight = container.clientHeight;

        svg.attr('width', newWidth)
           .attr('height', newHeight);

        const newScale = newHeight / 2.3;

        projection
            .scale(newScale)
            .translate([newWidth / 2, newHeight / 2]);

        svg.select('circle')
           .attr('cx', newWidth / 2)
           .attr('cy', newHeight / 2)
           .attr('r', newScale);

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
            <td><a href="https://basescan.org/token/${currency.contract}" target="_blank" style="color: #0052FF">${currency.digital}</a></td>
            <td><a href="${currency.website}" target="_blank" style="color: #0052FF">${currency.provider}</a></td>
        `;
        tableBody.appendChild(row);
    });
}

// Initialize the table when DOM is ready
document.addEventListener('DOMContentLoaded', populateTable);