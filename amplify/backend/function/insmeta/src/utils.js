const { utility } = require("/opt/nodejs/utility");

const constructedApiArray = (diff) => {
  const { date, month, yearFull } = utility(diff);

  const apiArray = [
    {
      fileName: "ind_nifty100list.csv",
      url: `https://www1.nseindia.com/content/indices/ind_nifty100list.csv`,
      exchg: "NSE",
      codes: {
        id: "ISIN Code",
        mcap: "L",
        ind: "Industry",
      },
    },
    {
      fileName: "ind_niftymidcap150list.csv",
      url: `https://www1.nseindia.com/content/indices/ind_niftymidcap150list.csv`,
      exchg: "NSE",
      codes: {
        id: "ISIN Code",
        mcap: "M",
        ind: "Industry",
      },
    },
    {
      fileName: "ind_niftyautolist.csv",
      url: `https://www1.nseindia.com/content/indices/ind_niftyautolist.csv`,
      exchg: "NSE",
      codes: {
        id: "ISIN Code",
        ind: "Industry",
      },
    },
    {
      fileName: "ind_niftybanklist.csv",
      url: `https://www1.nseindia.com/content/indices/ind_niftybanklist.csv`,
      exchg: "NSE",
      codes: {
        id: "ISIN Code",
        ind: "Industry",
      },
    },
    {
      fileName: "ind_niftyconsumerdurableslist.csv",
      url: `https://www1.nseindia.com/content/indices/ind_niftyconsumerdurableslist.csv`,
      exchg: "NSE",
      codes: {
        id: "ISIN Code",
        ind: "Industry",
      },
    },
    {
      fileName: "ind_niftyfinancelist.csv",
      url: `https://www1.nseindia.com/content/indices/ind_niftyfinancelist.csv`,
      exchg: "NSE",
      codes: {
        id: "ISIN Code",
        ind: "Industry",
      },
    },
    {
      fileName: "ind_niftyfinancialservices25_50list.csv",
      url: `https://www1.nseindia.com/content/indices/ind_niftyfinancialservices25_50list.csv`,
      exchg: "NSE",
      codes: {
        id: "ISIN Code",
        ind: "Industry",
      },
    },
    {
      fileName: "ind_niftyfmcglist.csv",
      url: `https://www1.nseindia.com/content/indices/ind_niftyfmcglist.csv`,
      exchg: "NSE",
      codes: {
        id: "ISIN Code",
        ind: "Industry",
      },
    },
    {
      fileName: "ind_niftyhealthcarelist.csv",
      url: `https://www1.nseindia.com/content/indices/ind_niftyhealthcarelist.csv`,
      exchg: "NSE",
      codes: {
        id: "ISIN Code",
        ind: "Industry",
      },
    },
    {
      fileName: "ind_niftyitlist.csv",
      url: `https://www1.nseindia.com/content/indices/ind_niftyitlist.csv`,
      exchg: "NSE",
      codes: {
        id: "ISIN Code",
        ind: "Industry",
      },
    },
    {
      fileName: "ind_niftymedialist.csv",
      url: `https://www1.nseindia.com/content/indices/ind_niftymedialist.csv`,
      exchg: "NSE",
      codes: {
        id: "ISIN Code",
        ind: "Industry",
      },
    },
    {
      fileName: "ind_niftymetallist.csv",
      url: `https://www1.nseindia.com/content/indices/ind_niftymetallist.csv`,
      exchg: "NSE",
      codes: {
        id: "ISIN Code",
        ind: "Industry",
      },
    },
    {
      fileName: "ind_niftyoilgaslist.csv",
      url: `https://www1.nseindia.com/content/indices/ind_niftyoilgaslist.csv`,
      exchg: "NSE",
      codes: {
        id: "ISIN Code",
        ind: "Industry",
      },
    },
    {
      fileName: "ind_niftypharmalist.csv",
      url: `https://www1.nseindia.com/content/indices/ind_niftypharmalist.csv`,
      exchg: "NSE",
      codes: {
        id: "ISIN Code",
        ind: "Industry",
      },
    },
    {
      fileName: "ind_nifty_privatebanklist.csv",
      url: `https://www1.nseindia.com/content/indices/ind_nifty_privatebanklist.csv`,
      exchg: "NSE",
      codes: {
        id: "ISIN Code",
        ind: "Industry",
      },
    },
    {
      fileName: "ind_niftypsubanklist.csv",
      url: `https://www1.nseindia.com/content/indices/ind_niftypsubanklist.csv`,
      exchg: "NSE",
      codes: {
        id: "ISIN Code",
        ind: "Industry",
      },
    },
    {
      fileName: "ind_niftyrealtylist.csv",
      url: `https://www1.nseindia.com/content/indices/ind_niftyrealtylist.csv`,
      exchg: "NSE",
      codes: {
        id: "ISIN Code",
        ind: "Industry",
      },
    },
  ];
  return apiArray;
};

module.exports = constructedApiArray;
