const tempDir = `/tmp/temp`;
const zipFile = `${tempDir}/download.zip`;
const monthsArray = [
  "JAN",
  "FEB",
  "MAR",
  "APR",
  "MAY",
  "JUN",
  "JUL",
  "AUG",
  "SEP",
  "OCT",
  "NOV",
  "DEC",
];
const today = new Date();
const todayDate = today.getDate() - 1;
const date = todayDate < 10 ? `0${todayDate}` : todayDate;

// For BSE
const month =
  today.getMonth() + 1 < 10
    ? `0${today.getMonth() + 1}`
    : `${today.getMonth() + 1}`;
const year =
  today.getYear().toString().charAt(1) + today.getYear().toString().charAt(2);
const yearFull = today.getFullYear();
const baseFileName = `EQ_ISINCODE_${date}${month}${year}`;
const baseFileDebtName = `DEBTBHAVCOPY${date}${month}${yearFull}`;
// For NSE
const monthChar = monthsArray[today.getMonth()];
const nseBaseFileName = `cm${date}${monthChar}${yearFull}bhav.csv`;

const apiArray = [
  {
    typeExchg: "BSE",
    fileName: baseFileName + ".CSV",
    url: `https://www.bseindia.com/download/BhavCopy/Equity/${baseFileName}.zip`,
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
    typeIdentifier: "BSE_EQUITY",
  },
  {
    typeExchg: "NSE",
    fileName: nseBaseFileName,
    url: `https://www1.nseindia.com/content/historical/EQUITIES/${yearFull}/${monthChar}/${nseBaseFileName}.zip`,
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
    typeIdentifier: "NSE_EQUITY",
  },
];

module.exports = { tempDir, zipFile, apiArray };
