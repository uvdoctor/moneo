const { utility } = require("/opt/nodejs/utility");

const constructedApiArray = (diff) => {
  const { date, month, monthChar, year, yearFull } = utility(diff);
  const nseFileName = `cm${date}${monthChar}${yearFull}bhav.csv`;
  const bseFileName = `EQ_ISINCODE_${date}${month}${year}`;
  const weekHLFileName = `CM_52_wk_High_low_${date}${month}${yearFull}.csv`;
  const apiArray = [
    {
      exchg: "NSE",
      fileName: nseFileName,
      url: `https://www1.nseindia.com/content/historical/EQUITIES/${yearFull}/${monthChar}/${nseFileName}.zip`,
      schema: {
        id: "",
        sid: "",
        name: "",
        type: "",
        subt: "",
        itype: "",
        price: 0,
        prev: 0,
        risk: "M"
      },
      codes: {
        sid: "SYMBOL",
        id: "ISIN",
        name: "SYMBOL",
        price: "LAST",
        prev: "PREVCLOSE",
        type: "SERIES",
        subt: "",
      },
    },
    {
      exchg: "BSE",
      fileName: bseFileName + ".CSV",
      url: `https://www.bseindia.com/download/BhavCopy/Equity/${bseFileName}.zip`,
      schema: {
        id: "",
        sid: "",
        name: "",
        type: "",
        subt: "",
        itype: "",
        price: 0,
        prev: 0,
        risk: "M"
      },
      codes: {
        sid: "SC_CODE",
        id: "ISIN_CODE",
        name: "SC_NAME",
        price: "LAST",
        prev: "PREVCLOSE",
        type: "SC_TYPE",
        subt: "SC_GROUP",
      },
    },
  ];

  const partOfDataApiArray = [
    {
      exchg: "NSE",
      id: "NSE_PARTOF",
      fileName: "EQUITY_L.csv",
      url: "https://www1.nseindia.com/content/equities/EQUITY_L.csv",
      codes: {
        id: " ISIN NUMBER",
        name: "NAME OF COMPANY",
        fv: " FACE VALUE",
      },
    },
    {
      exchg: "NSE",
      id: "NSE_PARTOF",
      fileName: "REITS_L.csv",
      url: "https://www1.nseindia.com/content/equities/REITS_L.csv",
      codes: {
        id: " ISIN NUMBER",
        name: "NAME OF COMPANY",
        fv: " FACE VALUE",
      },
    },
    {
      exchg: "NSE",
      id: "NSE_PARTOF",
      fileName: "eq_etfseclist.csv",
      url: "https://www1.nseindia.com/content/equities/eq_etfseclist.csv",
      codes: {
        id: "ISIN Number",
        name: "Security Name",
        fv: " Face Value",
        under: "Underlying",
      },
    },
    {
      exchg: "NSE",
      id: "NSE_PARTOF",
      fileName: weekHLFileName,
      url: `https://archives.nseindia.com/content/${weekHLFileName}`,
      codes: {
        sid: "_0",
        yhigh: "_2",
        ylow: "_4",
      },
    },
    {
      fileName: "ind_nifty100list.csv",
			id: "NSE_PARTOF",
      url: `https://www1.nseindia.com/content/indices/ind_nifty100list.csv`,
      exchg: "NSE",
      codes: {
        id: "ISIN Code",
        mcap: "L",
      },
    },
    {
      fileName: "ind_niftymidcap150list.csv",
			id: "NSE_PARTOF",
      url: `https://www1.nseindia.com/content/indices/ind_niftymidcap150list.csv`,
      exchg: "NSE",
      codes: {
        id: "ISIN Code",
        mcap: "M",
      },
    },
  ];

  return { apiArray, partOfDataApiArray };
};

module.exports = constructedApiArray;
