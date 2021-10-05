const { utility } = require("/opt/nodejs/utility");

const constructedApiArray = (diff) => {
  const { date, month, monthChar, year, yearFull } = utility(diff);
  const nseFileName = `cm${date}${monthChar}${yearFull}bhav.csv`;
  const bseFileName = `EQ_ISINCODE_${date}${month}${year}`;
  const apiArray = [
    {
      typeExchg: "NSE",
      fileName: nseFileName,
      url: `https://www1.nseindia.com/content/historical/EQUITIES/${yearFull}/${monthChar}/${nseFileName}.zip`,
      schema: {
        id: "",
        sid: "",
        name: "",
        exchg: "",
        type: "",
        subt: "",
        itype: "",
        price: 0,
        prev: 0,
        mcap: null,
        createdAt: "",
        updatedAt: "",
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
        exchg: "",
        type: "",
        subt: "",
        itype: "",
        price: 0,
        prev: 0,
        mcap: null,
        createdAt: "",
        updatedAt: "",
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
  return apiArray;
};

const metaApiArray = [
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
];

module.exports = { constructedApiArray, metaApiArray };
