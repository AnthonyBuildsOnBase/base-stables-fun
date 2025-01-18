import streamlit as st
import plotly.graph_objects as go
import pandas as pd
from currency_data import CURRENCY_DATA, COUNTRY_CODES, EUR_COUNTRIES

# Page configuration
st.set_page_config(
    page_title="Base International Stablecoins",
    page_icon="🌍",
    layout="wide"
)

# Update the CSS section with enhanced table styling
st.markdown("""
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
        color: #FFFFFF;
        margin: 1rem 0 3rem 1rem;
        text-align: left;
    }
    </style>
""", unsafe_allow_html=True)

# Title with updated styling
st.markdown('<h1 class="title">Base International Stablecoins</h1>', unsafe_allow_html=True)

def create_globe():
    # Prepare data for active countries and hover text
    active_countries = []
    hover_text = []
    z_values = []

    for currency in CURRENCY_DATA:
        if currency['country'] == 'Europe':
            for country_code in EUR_COUNTRIES:
                active_countries.append(country_code)
                hover_text.append(
                    f"Region: Europe<br>"
                    f"Currency: EUR<br>"
                    f"Digital: {currency['digital']}<br>"
                    f"Provider: {currency['provider']}"
                )
                z_values.append(1)
        else:
            if currency['country'] in COUNTRY_CODES:
                active_countries.append(COUNTRY_CODES[currency['country']])
                hover_text.append(
                    f"Country: {currency['country']}<br>"
                    f"Currency: {currency['code']}<br>"
                    f"Digital: {currency['digital']}<br>"
                    f"Provider: {currency['provider']}"
                )
                z_values.append(1)

    # Create initial figure
    fig = go.Figure()

    # Add choropleth trace with updated colors and hover text
    fig.add_trace(go.Choropleth(
        locations=active_countries,
        z=z_values,
        text=hover_text,
        hoverinfo='text',
        colorscale=[[0, '#1E1E1E'], [1, '#0052FF']],  
        showscale=False,
    ))

    # Update layout for globe projection
    fig.update_geos(
        projection_type='orthographic',
        showcoastlines=True,
        coastlinecolor='#FFFFFF',
        showland=True,
        landcolor='#1E1E1E',
        showocean=True,
        oceancolor='#000000',
        showframe=False,
        bgcolor='#000000'
    )

    # Update layout
    fig.update_layout(
        paper_bgcolor='#000000',
        plot_bgcolor='#000000',
        margin=dict(l=0, r=0, t=0, b=0),
        height=500,  
        geo=dict(
            projection_rotation=dict(lon=0, lat=30, roll=0)
        )
    )

    return fig

# Display the globe
globe_fig = create_globe()
st.plotly_chart(globe_fig, use_container_width=True, config={
    'displayModeBar': False,
    'scrollZoom': False,
    'showTips': False,
    'frameMargins': 0,
    'displaylogo': False,
})

# Create and display the currency table below the globe
st.markdown("<div class='table-container'>", unsafe_allow_html=True)
currency_df = pd.DataFrame(CURRENCY_DATA)
styled_table = currency_df[['country', 'code', 'digital', 'provider']].rename(columns={
    'country': 'Country',
    'code': 'Currency',
    'digital': 'Digital',
    'provider': 'Provider'
}).to_html(classes='styled-table', index=False, escape=False)
st.markdown(styled_table, unsafe_allow_html=True)
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