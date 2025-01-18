html
    <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');

    .main {
        background-color: #000000;
        font-family: 'Inter', sans-serif;
        padding: 0;
    }
    .stApp {
        background-color: #000000;
    }
    [data-testid="stHeader"] {
        background-color: #000000;
    }
    .css-1dp5vir {
        background-color: #000000;
    }
    .css-18e3th9 {
        padding: 2rem 1rem;
    }
    .table-container {
        background-color: #000000;
        padding: 20px;
        margin-top: 20px;
    }
    .styled-table {
        width: 100%;
        border-collapse: separate;
        border-spacing: 0;
        margin: 0;
        font-family: 'Inter', sans-serif;
        color: #FFFFFF;
    }
    .styled-table th {
        background-color: transparent;
        color: #666666 !important;
        padding: 12px 16px;
        text-align: left;
        font-weight: 500;
        font-size: 12px;
        letter-spacing: 0.05em;
        text-transform: uppercase;
        border-bottom: 1px solid #333333;
    }
    .styled-table td {
        padding: 16px;
        font-size: 14px;
        font-weight: 400;
        border-bottom: 1px solid #1E1E1E;
        transition: background-color 0.2s ease;
    }
    .styled-table tr:hover td {
        background-color: #111111;
    }
    .styled-table tr td:first-child {
        font-weight: 500;
    }
    .title {
        font-family: 'Inter', sans-serif;
        font-weight: 600;
        font-size: 42px;
        color: #FFFFFF !important;
        margin: 2rem 0 4rem 2rem;
        text-align: left;
        padding-top: 1rem;
    }
    .globe-container {
        margin-top: 2rem;
        padding-top: 1rem;
    }
    </style>
""", unsafe_allow_html=True)

# Title with updated styling
st.markdown('<h1 class="title" style="color: #FFFFFF !important;">Base International Stablecoins</h1>', unsafe_allow_html=True)

# Add container div around globe
st.markdown('<div class="globe-container">', unsafe_allow_html=True)


# Placeholder for globe visualization -  Python code removed
st.markdown("<p>Globe visualization would go here.</p>", unsafe_allow_html=True)


st.markdown('</div>', unsafe_allow_html=True)

# Create and display the currency table below the globe
st.markdown("<div class='table-container'>", unsafe_allow_html=True)
# Placeholder for currency table - Python code removed
st.markdown("<p>Currency table would go here.</p>", unsafe_allow_html=True)
st.markdown("</div>", unsafe_allow_html=True)

# Add JavaScript for globe rotation with smooth easing effects
st.markdown("""
    <script>
        function waitForPlotly() {
            if (typeof Plotly === 'undefined') {
                setTimeout(waitForPlotly, 100);
                return;
            }

            const plot = document.querySelector('.js-plotly-plot');
            if (!plot) {
                setTimeout(waitForPlotly, 100);
                return;
            }

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

                Plotly.relayout(plot, {
                    'geo.projection.rotation.lon': lon
                });

                requestAnimationFrame(animate);
            }

            requestAnimationFrame(animate);

            let transitionTimeout;

            plot.on('plotly_hover', () => {
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

            plot.on('plotly_unhover', () => {
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

        waitForPlotly();
    </script>
""", unsafe_allow_html=True)