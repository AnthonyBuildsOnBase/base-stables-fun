import streamlit as st
import plotly.express as px
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

# Create a DataFrame for the map
def prepare_map_data():
    active_countries = set()
    for currency in CURRENCY_DATA:
        if currency['country'] == 'Europe':
            active_countries.update(EUR_COUNTRIES)
        else:
            if currency['country'] in COUNTRY_CODES:
                active_countries.add(COUNTRY_CODES[currency['country']])

    world_data = []
    for country in active_countries:
        world_data.append({
            'iso_alpha': country,
            'has_digital_currency': 1
        })

    return pd.DataFrame(world_data)

# Create the interactive globe
def create_globe():
    df = prepare_map_data()

    fig = px.choropleth(
        df,
        locations='iso_alpha',
        color='has_digital_currency',
        projection='orthographic',
        color_continuous_scale=['#1f1f1f', '#0083FF'],
        labels={'has_digital_currency': 'Digital Currency Status'},
    )

    fig.update_layout(
        paper_bgcolor='black',
        plot_bgcolor='black',
        geo=dict(
            showframe=False,
            showcoastlines=True,
            coastlinecolor='white',
            projection_rotation=dict(lon=0, lat=30, roll=0),
            bgcolor='black'
        ),
        margin=dict(l=0, r=0, t=0, b=0),
        coloraxis_showscale=False,
        height=600,
    )

    # Add rotation animation
    fig.update_layout(
        updatemenus=[{
            'type': 'buttons',
            'showactive': False,
            'buttons': [{
                'method': 'animate',
                'args': [None, {
                    'frame': {'duration': 50, 'redraw': True},
                    'fromcurrent': True,
                    'transition': {'duration': 0}
                }],
                'label': '🌍 Rotate Globe'
            }]
        }]
    )

    return fig

# Display the globe
st.plotly_chart(create_globe(), use_container_width=True)

# Create and display the currency table
currency_df = pd.DataFrame(CURRENCY_DATA)
st.markdown("<h3 style='text-align: center; color: white;'>Currency Details</h3>", unsafe_allow_html=True)
st.table(currency_df[['country', 'code', 'digital', 'provider']].rename(columns={
    'country': 'Country',
    'code': 'Currency Code',
    'digital': 'Digital Currency',
    'provider': 'Provider'
}))