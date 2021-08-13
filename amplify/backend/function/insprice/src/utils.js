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
const baseFileName = `EQ_ISINCODE_${date}${month}${year}`;

// For NSE
const monthChar = monthsArray[today.getMonth()];
const yearFull = today.getFullYear();
const NSEBaseFileName = `cm${date}${monthChar}${yearFull}bhav.csv`;

const apiArray = [
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
    },
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
  },
];

module.exports = { tempDir, zipFile, apiArray };
