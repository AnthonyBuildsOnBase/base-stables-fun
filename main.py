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

# Custom CSS for dark theme
st.markdown("""
    <style>
    .main {
        padding: 0rem 1rem;
    }
    .stApp {
        background-color: black;
    }
    [data-testid="stHeader"] {
        background-color: black;
    }
    .css-1dp5vir {
        background-color: black;
    }
    .css-18e3th9 {
        padding-top: 1rem;
    }
    .table-container {
        background: #1f1f1f;
        border-radius: 10px;
        padding: 20px;
        margin-top: 20px;
    }
    .styled-table {
        width: 100%;
        border-collapse: separate;
        border-spacing: 0 8px;
        margin-top: 20px;
    }
    .styled-table th {
        background-color: #2d2d2d;
        color: #0083FF !important;
        padding: 12px;
        text-align: left;
        font-weight: 600;
    }
    .styled-table td {
        background-color: #2d2d2d;
        color: white !important;
        padding: 12px;
    }
    .styled-table tr td:first-child {
        border-radius: 6px 0 0 6px;
    }
    .styled-table tr td:last-child {
        border-radius: 0 6px 6px 0;
    }
    </style>
""", unsafe_allow_html=True)

# Title
st.markdown("<h1 style='text-align: center; color: white;'>Base International Stablecoins</h1>", unsafe_allow_html=True)

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

    # Add choropleth trace
    fig.add_trace(go.Choropleth(
        locations=list(active_countries),
        z=[1] * len(active_countries),
        colorscale=[[0, '#1f1f1f'], [1, '#0083FF']],
        showscale=False,
        hoverinfo='location'
    ))

    # Update layout for globe projection
    fig.update_geos(
        projection_type='orthographic',
        showcoastlines=True,
        coastlinecolor='white',
        showland=True,
        landcolor='#1f1f1f',
        showocean=True,
        oceancolor='black',
        showframe=False,
        bgcolor='black'
    )

    # Update layout
    fig.update_layout(
        paper_bgcolor='black',
        plot_bgcolor='black',
        margin=dict(l=0, r=0, t=0, b=0),
        height=400,
        geo=dict(
            projection_rotation=dict(lon=0, lat=30, roll=0)
        )
    )

    return fig

# Create two columns for layout
col1, col2 = st.columns([1, 1])

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
        'code': 'Currency Code',
        'digital': 'Digital Currency',
        'provider': 'Provider'
    }).to_html(classes='styled-table', index=False, escape=False)
    st.markdown(styled_table, unsafe_allow_html=True)
    st.markdown("</div>", unsafe_allow_html=True)

# Add JavaScript for globe rotation
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

                lon = (lon + 1) % 360;
                Plotly.relayout(plot, {
                    'geo.projection.rotation.lon': lon
                });

                requestAnimationFrame(rotate);
            }

            // Start rotation
            rotate();

            // Handle hover events
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