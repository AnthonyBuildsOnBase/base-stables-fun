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
    th {
        background-color: #1f1f1f;
        color: white !important;
    }
    td {
        background-color: #2d2d2d;
        color: white !important;
    }
    </style>
""", unsafe_allow_html=True)

# Title
st.markdown("<h1 style='text-align: center; color: white;'>Base International Stablecoins</h1>", unsafe_allow_html=True)

# Create the interactive globe
def create_globe():
    # Prepare data for active countries
    active_countries = set()
    for currency in CURRENCY_DATA:
        if currency['country'] == 'Europe':
            active_countries.update(EUR_COUNTRIES)
        else:
            if currency['country'] in COUNTRY_CODES:
                active_countries.add(COUNTRY_CODES[currency['country']])

    # Create figure
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
        height=600,
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

# Create and display the currency table
currency_df = pd.DataFrame(CURRENCY_DATA)
st.markdown("<h3 style='text-align: center; color: white;'>Currency Details</h3>", unsafe_allow_html=True)
st.table(currency_df[['country', 'code', 'digital', 'provider']].rename(columns={
    'country': 'Country',
    'code': 'Currency Code',
    'digital': 'Digital Currency',
    'provider': 'Provider'
}))