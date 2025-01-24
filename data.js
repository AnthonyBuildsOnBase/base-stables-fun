const CURRENCY_DATA = [
    {
        code: "MXN",
        country: "Mexico",
        digital: "MXNe",
        provider: "Etherfuse",
        contract: "0x269caE7Dc59803e5C596c95756faEeBb6030E0aF",
        website: "https://brale.xyz/stablecoins/MXNe",
    },
    {
        code: "MXN",
        country: "Mexico",
        digital: "XOC",
        provider: "Xocolatl",
        contract: "0xa411c9Aa00E020e4f88Bc19996d29c5B7ADB4ACf",
        website: "https://www.xocolatl.finance/",
    },
    {
        code: "ZAR",
        country: "South Africa",
        digital: "ZARP",
        provider: "inv.es",
        contract: "0xb755506531786C8aC63B756BaB1ac387bACB0C04",
        website: "https://www.zarpstablecoin.com/",
    },
    {
        code: "IDR",
        country: "Indonesia",
        digital: "IDRX",
        provider: "IDRX.co",
        contract: "0x18Bc5bcC660cf2B9cE3cd51a404aFe1a0cBD3C22",
        website: "https://home.idrx.co/en#about",
    },
    {
        code: "NGN",
        country: "Nigeria",
        digital: "cNGN",
        provider: "Convexity",
        contract: "0xC930784d6e14e2FC2A1F49BE1068dc40f24762D3",
        website: "https://cngn.co/",
    },
    {
        code: "NGN",
        country: "Nigeria",
        digital: "NGNC",
        provider: "Link",
        contract: "0xA971B44246a55b3676ab2E66a4732Fa4cce2EA13",
        website: "https://www.linkio.world/ngnc",
    },
    {
        code: "EUR",
        country: "Europe",
        digital: "EURC",
        provider: "Circle",
        contract: "0x60a3e35cc302bfa44cb288bc5a4f316fdb1adb42",
        website: "https://www.circle.com/eurc",
    },
    {
        code: "BRL",
        country: "Brazil",
        digital: "NBRL",
        provider: "Numun.fi",
        contract: "0x9E087E2Ad52D2494Ff930553C20Ed64F23a2fd20",
        website: "https://numun.fi/",
    },
    {
        code: "CLP",
        country: "Chile",
        digital: "CLPD",
        provider: "a0x",
        contract: "0x24460D2b3d96ee5Ce87EE401b1cf2FD01545d9b1",
        website: "https://clpd.a0x.co/",
    },
    {
        code: "ARS",
        country: "Argentina",
        digital: "NARS",
        provider: "Numun.fi",
        contract: "0x5e40f26E89213660514c51Fb61b2d357DBf63C85",
        website: "https://numun.fi/",
    },
    {
        code: "UGX",
        country: "Uganda",
        digital: "Nuzo",
        provider: "Nuzo",
        contract: "0x92fb0552b5bcdc384de363b0aff114bbf8e5ec1a",
        website: "https://www.nuzo.co/home/",
    },
    {
        code: "USD",
        country: "US",
        digital: "USDC",
        provider: "Circle",
        contract: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
        website: "https://www.circle.com/usdc",
    },
];

const COUNTRY_CODES = {
    Mexico: "484",
    "South Africa": "710",
    Indonesia: "360",
    Nigeria: "566",
    US: "840",
    Brazil: "076",
    Chile: "152",
    Argentina: "032",
    Uganda: "800"
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
    "724", // Spain
];