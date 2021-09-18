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
const monthChar = monthsArray[today.getMonth()];
const yearFull = today.getFullYear();

const getFile = (num) => {
  if (!num) num = 0;
  const todayDate = today.getDate() - parseInt(num);
  const date = todayDate < 10 ? `0${todayDate}` : todayDate;
  // For BSE
  const month =
    today.getMonth() + 1 < 10
      ? `0${today.getMonth() + 1}`
      : `${today.getMonth() + 1}`;
  const year =
    today.getYear().toString().charAt(1) + today.getYear().toString().charAt(2);

  const bseFile = `EQ_ISINCODE_${date}${month}${year}`;
  // For NSE
  const nseFile = `cm${date}${monthChar}${yearFull}bhav.csv`;
  return { bseFile, nseFile };
};

const apiArray = (bseFile, nseFile) => [
  {
    typeExchg: "BSE",
    fileName: bseFile + ".CSV",
    url: `https://www.bseindia.com/download/BhavCopy/Equity/${bseFile}.zip`,
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
  {
    typeExchg: "NSE",
    fileName: nseFile,
    url: `https://www1.nseindia.com/content/historical/EQUITIES/${yearFull}/${monthChar}/${nseFile}.zip`,
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
];

module.exports = { tempDir, zipFile, apiArray, getFile };
