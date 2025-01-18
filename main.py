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

# Custom CSS for dark theme following design guide
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
        background: #1E1E1E;
        border-radius: 12px;
        padding: 24px;
        margin-top: 20px;
        transition: all 0.2s ease-in-out;
    }
    .table-container:hover {
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    }
    .styled-table {
        width: 100%;
        border-collapse: separate;
        border-spacing: 0 8px;
        margin-top: 20px;
        font-family: 'Inter', sans-serif;
    }
    .styled-table th {
        background-color: #1E1E1E;
        color: #FFFFFF !important;
        padding: 16px;
        text-align: left;
        font-weight: 600;
        font-size: 14px;
        letter-spacing: 0.05em;
        text-transform: uppercase;
    }
    .styled-table td {
        background-color: #2D2D2D;
        color: #F1F1F1 !important;
        padding: 16px;
        font-size: 14px;
        transition: all 0.2s ease-in-out;
    }
    .styled-table tr:hover td {
        background-color: #333333;
    }
    .styled-table tr td:first-child {
        border-radius: 8px 0 0 8px;
    }
    .styled-table tr td:last-child {
        border-radius: 0 8px 8px 0;
    }
    .title {
        font-family: 'Inter', sans-serif;
        font-weight: 600;
        font-size: 32px;
        color: #FFFFFF;
        margin-bottom: 2rem;
        text-align: center;
    }
    </style>
""", unsafe_allow_html=True)

# Title with updated styling
st.markdown('<h1 class="title">Base International Stablecoins</h1>', unsafe_allow_html=True)

def create_globe():
    # Prepare data for active countries
    active_countries = set()
    for currency in CURRENCY_DATA:
        if currency['country'] == 'Europe':
            active_countries.update(EUR_COUNTRIES)
        else:
            if currency['country'] in COUNTRY_CODES:
                active_countries.add(COUNTRY_CODES[currency['country']])

    # Create initial figure
    fig = go.Figure()

    # Add choropleth trace with updated colors
    fig.add_trace(go.Choropleth(
        locations=list(active_countries),
        z=[1] * len(active_countries),
        colorscale=[[0, '#1E1E1E'], [1, '#0083FF']],
        showscale=False,
        hoverinfo='location'
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
        height=500,  # Increased height for better visibility
        geo=dict(
            projection_rotation=dict(lon=0, lat=30, roll=0)
        )
    )

    return fig

# Create two columns with adjusted ratios for better layout
col1, col2 = st.columns([1.2, 0.8])

# Display the globe in the left column
with col1:
    globe_fig = create_globe()
    st.plotly_chart(globe_fig, use_container_width=True, config={
        'displayModeBar': False,
        'scrollZoom': False,
        'showTips': False,
        'frameMargins': 0,
        'displaylogo': False,
    })

# Create and display the currency table in the right column
with col2:
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

# Add JavaScript for globe rotation with smoother animation
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

            function rotate() {
                if (!isRotating) return;

                lon = (lon + 0.5) % 360;  // Slower rotation speed
                Plotly.relayout(plot, {
                    'geo.projection.rotation.lon': lon
                });

                requestAnimationFrame(rotate);
            }

            // Start rotation
            rotate();

            // Handle hover events with smooth transitions
            plot.on('plotly_hover', () => {
                isRotating = false;
            });

            plot.on('plotly_unhover', () => {
                isRotating = true;
                rotate();
            });
        }

        // Start when Plotly is ready
        waitForPlotly();
    </script>
""", unsafe_allow_html=True)