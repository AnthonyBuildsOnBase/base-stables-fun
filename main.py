import streamlit as st
import folium
import pandas as pd
from streamlit_folium import folium_static
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
    .folium-map {
        background-color: #1f1f1f;
        border-radius: 10px;
        padding: 10px;
    }
    </style>
""", unsafe_allow_html=True)

# Title
st.markdown("<h1 style='text-align: center; color: white;'>Base International Stablecoins</h1>", unsafe_allow_html=True)

# Create the interactive globe
def create_map():
    # Create a map centered at (0, 0) with a global view
    m = folium.Map(
        location=[20, 0],
        zoom_start=2,
        tiles='CartoDB dark_matter'
    )

    # Add markers for each country
    for currency in CURRENCY_DATA:
        if currency['country'] == 'Europe':
            # Add markers for all European countries
            for country_code in EUR_COUNTRIES:
                #  Note:  This lacks actual lat/long coordinates.  Needs improvement.
                folium.CircleMarker(
                    location=[0, 0], 
                    radius=8,
                    color='#0083FF',
                    fill=True,
                    popup=f"Currency: EUR<br>Digital: {currency['digital']}<br>Provider: {currency['provider']}"
                ).add_to(m)
        else:
            if currency['country'] in COUNTRY_CODES:
                # Note: This lacks actual lat/long coordinates. Needs improvement.
                folium.CircleMarker(
                    location=[0, 0], 
                    radius=8,
                    color='#0083FF',
                    fill=True,
                    popup=f"Currency: {currency['code']}<br>Digital: {currency['digital']}<br>Provider: {currency['provider']}"
                ).add_to(m)

    return m

# Create two columns for layout
col1, col2 = st.columns([1, 1])

# Display the map in the left column
with col1:
    st.markdown('<div class="folium-map">', unsafe_allow_html=True)
    folium_static(create_map(), width=400)
    st.markdown('</div>', unsafe_allow_html=True)

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