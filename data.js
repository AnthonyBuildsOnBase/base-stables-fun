const CURRENCY_DATA = [
    {
        "code": "MXN",
        "country": "Mexico",
        "digital": "XOC",
        "provider": "Xocolatl",
        "contract": "0xa411c9Aa00E020e4f88Bc19996d29c5B7ADB4ACf",
        "website": "https://www.xocolatl.finance/"
    },
    {
        "code": "ZAR",
        "country": "South Africa",
        "digital": "ZARP",
        "provider": "inv.es",
        "contract": "0xb755506531786C8aC63B756BaB1ac387bACB0C04",
        "website": "https://www.zarpstablecoin.com/"
    },
    {
        "code": "IDR",
        "country": "Indonesia",
        "digital": "IDRX",
        "provider": "IDRX.co",
        "contract": "0x18Bc5bcC660cf2B9cE3cd51a404aFe1a0cBD3C22",
        "website": "https://home.idrx.co/en#about"
    },
    {
        "code": "NGN",
        "country": "Nigeria",
        "digital": "cNGN",
        "provider": "Convexity",
        "contract": "0xC930784d6e14e2FC2A1F49BE1068dc40f24762D3",
        "website": "https://cngn.co/"
    },
    {
        "code": "EUR",
        "country": "Europe",
        "digital": "EURC",
        "provider": "Circle",
        "contract": "0x60a3e35cc302bfa44cb288bc5a4f316fdb1adb42",
        "website": "https://www.circle.com/eurc"
    },
    {
        "code": "USD",
        "country": "US",
        "digital": "USDC",
        "provider": "Circle",
        "contract": "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
        "website": "https://www.circle.com/usdc"
    }
];

const COUNTRY_CODES = {
    "Mexico": "484",
    "South Africa": "710",
    "Indonesia": "360",
    "Nigeria": "566",
    "US": "840"
};

// Only European Union member states
const EUR_COUNTRIES = [
    "040", // Austria
    "056", // Belgium
    "196", // Cyprus
    "233", // Estonia
    "246", // Finland
    "250", // France
    "276", // Germany
    "300", // Greece
    "372", // Ireland
    "380", // Italy
    "428", // Latvia
    "440", // Lithuania
    "442", // Luxembourg
    "470", // Malta
    "528", // Netherlands
    "620", // Portugal
    "703", // Slovakia
    "705", // Slovenia
    "724"  // Spain
];