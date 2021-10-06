const { utility } = require("/opt/nodejs/utility");

const constructedApiArray = (diff) => {
  const { date, month, monthChar, year, yearFull } = utility(diff);
  const nseFileName = `cm${date}${monthChar}${yearFull}bhav.csv`;
  const bseFileName = `EQ_ISINCODE_${date}${month}${year}`;
  const weekHLFileName = `CM_52_wk_High_low_${date}${month}${yearFull}.csv`;
  const apiArray = [
    {
      typeExchg: "NSE",
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
      typeExchg: "BSE",
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

  const nameApiArray = [
    {
      typeExchg: "NSE",
      fileName: "EQUITY_L.csv",
      url: "https://www1.nseindia.com/content/equities/EQUITY_L.csv",
      codes: {
        id: " ISIN NUMBER",
        name: "NAME OF COMPANY",
        fv: " FACE VALUE",
      },
    },
    {
      typeExchg: "NSE",
      fileName: "REITS_L.csv",
      url: "https://www1.nseindia.com/content/equities/REITS_L.csv",
      codes: {
        id: " ISIN NUMBER",
        name: "NAME OF COMPANY",
        fv: " FACE VALUE",
      },
    },
    {
      typeExchg: "NSE",
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
      typeExchg: "NSE",
      fileName: weekHLFileName,
      url: `https://archives.nseindia.com/content/${weekHLFileName}`,
      codes: {
        sid: "_0",
        yhigh: "_2",
        ylow: "_4",
      },
    },
  ];

  return { apiArray, nameApiArray };
};

module.exports = constructedApiArray;
