const apiArray = [
  // {
  //   url: "https://www.nseindia.com/api/sovereign-gold-bonds",
  //   mcap: null,
  //   indices: "SGB",
  // },
  // {
  //   url: "https://www.nseindia.com/api/etf",
  //   mcap: null,
  //   indices:"ETF",
  // },
  // {
  //   url: `https://www.nseindia.com/api/equity-stockIndices?index=NIFTY%20MIDCAP%20150`,
  //   mcap: "M",
  //   indices: "NIFTY MIDCAP 150",
  // },
  // {
  //   url: `https://www.nseindia.com/api/equity-stockIndices?index=NIFTY%20LARGEMIDCAP%20250`,
  //   mcap: "L",
  //   indices: "NIFTY LARGEMIDCAP 250",
  // },
  {
    url: `https://www.nseindia.com/api/equity-stockIndices?index=NIFTY500%20MULTICAP%2050:25:25`,
    mcap: "S",
    indices: "NIFTY MULTICAP 50:25:25",
  },
];

module.exports = apiArray;
