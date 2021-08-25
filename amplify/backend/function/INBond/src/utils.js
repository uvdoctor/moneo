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
const yearFull = today.getFullYear();
const monthChar = monthsArray[today.getMonth()] - 1;

const apiArray = [
  {
    fileName: `MLY${monthChar}${yearFull}.csv`,
    url: `https://www1.nseindia.com/archives/debt/monthly/MLY${monthChar}${yearFull}.zip`,
    schema: {
      id: "",
      sid: "",
      name: "",
      subt: "",
      price: 0,
      sm: 0,
      sy: 0,
      mm: 0,
      my: 0,
      rate: 0,
      fr: YN,
      tf: YN,
      fv: 0,
      cr: "",
      crstr: "",
      ytm: 0,
    },	
    codes: {
      sid: "SECURITY",
      id: "NSE_ISIN",
      name: "ISSUE_DESC",
      price: "LTP_PRICE",
      subt: "SECTYPE",
      frate : "ISSUE_NAME",
      sDate : "ISSUE_DATE",
      mDate : "MAT_DATE",
      rate: "CRATE",
      crstr : "CREDIT_RATING"
    },
    typeIdentifier: "NSE_DEBT",
    listQuery: "ListInBonds",
    updateMutation: "UpdateInBond",
    createMutation: "CreateInBond",
    listOperationName: "listINBonds",
  },
];

module.exports = { tempDir, zipFile, apiArray };
