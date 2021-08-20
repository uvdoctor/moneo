const tempDir = `${__dirname}/temp` //`/tmp/temp`;
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
const baseFileDebtName = `DEBTBHAVCOPY${date}${month}${yearFull}`
// For NSE
const monthChar = monthsArray[today.getMonth()];
const NSEBaseFileName = `cm${date}${monthChar}${yearFull}bhav.csv`;

const apiArray = [
  {
    type: "BSE",
    fileName: `fgroup${date}${month}${yearFull}.csv`,
    url: `https://www.bseindia.com/download/Bhavcopy/Debt/${baseFileDebtName}.zip`,
    codes: {
      sid: "Security_cd",
      id: "ISIN No.",
      name: "sc_name",
      price: "Close Price",
      prev: "Open Price",
    },
    typeIdentifier: 'BSE_DEBT_FGROUP'
  },
  {
    type: "BSE",
    fileName: `icdm${date}${month}${yearFull}.csv`,
    url: `https://www.bseindia.com/download/Bhavcopy/Debt/${baseFileDebtName}.zip`,
    codes: {
      sid: "Security_cd",
      id: "ISIN No.",
      name: "Issuer Name",
      price: "Weighted Average Price",
      prev: "Weighted Average Yield",
    },
    typeIdentifier: 'BSE_DEBT_ICDM'
  },
  {
    type: "BSE",
    fileName: `wdm${date}${month}${yearFull}.csv`,
    url: `https://www.bseindia.com/download/Bhavcopy/Debt/${baseFileDebtName}.zip`,
    codes: {
      sid: "Scrip Code",
      id: "Security Code",
      name: "Security Description",
      price: "Close Price",
      prev: "Open Price",
    },
    typeIdentifier: 'BSE_DEBT_WDM'
  },
  {
    type: "NSE",
    fileName: NSEBaseFileName,
    url: `https://www1.nseindia.com/content/historical/EQUITIES/${yearFull}/${monthChar}/${NSEBaseFileName}.zip`,
    codes: {
      sid: "SYMBOL",
      id: "ISIN",
      name: "SERIES",
      price: "LAST",
      prev: "PREVCLOSE",
    },
    typeIdentifier: 'NSE_EQUITY'
  },
  {
    type: "BSE",
    fileName: baseFileName + ".CSV",
    url: `https://www.bseindia.com/download/BhavCopy/Equity/${baseFileName}.zip`,
    codes: {
      sid: "SC_CODE",
      id: "ISIN_CODE",
      name: "SC_NAME",
      price: "LAST",
      prev: "PREVCLOSE",
      type: "SC_TYPE",
      subt: "SC_GRP",
    },
    typeIdentifier: 'BSE_EQUITY'
  },
];

module.exports = { tempDir, zipFile, apiArray };
