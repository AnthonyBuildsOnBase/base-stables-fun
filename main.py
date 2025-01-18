import streamlit as st
import plotly.express as px
import pandas as pd
from currency_data import CURRENCY_DATA, COUNTRY_CODES, EUR_COUNTRIES

# Page configuration
st.set_page_config(
    page_title="Live Digital Currencies World Map",
    page_icon="🌍",
    layout="wide"
)

# Custom CSS
st.markdown("""
    <style>
    .main {
        padding: 0rem 1rem;
    }
    .stApp {
        background-color: #f0f2f6;
    }
    .currency-card {
        padding: 1rem;
        background-color: white;
        border-radius: 5px;
        margin-bottom: 1rem;
    }
    </style>
""", unsafe_allow_html=True)

# Title
st.title("🌍 Live Digital Currencies World Map")
st.markdown("Interactive visualization of regions with active digital currencies")

# Create a DataFrame for the map
def prepare_map_data():
    # Get all country codes that have digital currencies
    active_countries = set()
    for currency in CURRENCY_DATA:
        if currency['country'] == 'Europe':
            active_countries.update(EUR_COUNTRIES)
        else:
            if currency['country'] in COUNTRY_CODES:
                active_countries.add(COUNTRY_CODES[currency['country']])
    
    # Create world data
    world_data = []
    for country in active_countries:
        world_data.append({
            'iso_alpha': country,
            'has_digital_currency': 1
        })
    
    return pd.DataFrame(world_data)

# Create the map
def create_map():
    df = prepare_map_data()
    
    fig = px.choropleth(
        df,
        locations='iso_alpha',
        color='has_digital_currency',
        scope='world',
        color_continuous_scale=['white', '#0083FF'],
        labels={'has_digital_currency': 'Digital Currency Status'},
    )
    
    fig.update_layout(
        showlegend=False,
        geo=dict(
            showframe=False,
            showcoastlines=True,
            projection_type='equirectangular'
        ),
        margin=dict(l=0, r=0, t=0, b=0),
        coloraxis_showscale=False,
    )
    
    return fig

# Sidebar with currency information
st.sidebar.title("Digital Currencies")
st.sidebar.markdown("### Active Currencies")

for currency in CURRENCY_DATA:
    with st.sidebar.container():
        st.markdown(
            f"""
            <div class="currency-card">
            <h4>{currency['country']} ({currency['code']})</h4>
            <p>Digital Currency: {currency['digital']}<br>
            Provider: {currency['provider']}</p>
            </div>
            """,
            unsafe_allow_html=True
        )

# Main content
col1, col2 = st.columns([3, 1])

with col1:
    st.plotly_chart(create_map(), use_container_width=True)

with col2:
    st.markdown("### Legend")
    st.markdown("""
        🔵 Regions with active digital currencies
        
        ⚪ Regions without digital currencies
        
        ### Details
        - Hover over regions to see country names
        - Check the sidebar for detailed currency information
        - Data is current as of the latest update
    """)

# Footer
st.markdown("---")
st.markdown("Data provided by various digital currency providers. Map updates regularly.")
