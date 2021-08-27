const tempDir = `/tmp/temp`;
const zipFile = `${tempDir}/download.zip`;
const today = new Date();
const month =
  today.getMonth() + 1 < 10
    ? `0${today.getMonth()}`
    : `${today.getMonth()}`;

const yearFull = today.getFullYear();

const apiArray = [
  {
    typeExchg:"NSE",
    fileName: `MLY${month}${yearFull}.csv`,
    url: `https://www1.nseindia.com/archives/debt/monthly/MLY${month}${yearFull}.zip`,
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
      fr: "",
      tf: "",
      fv: 0,
      cr: null,
      crstr: null,
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
      crstr : "CREDIT_RATING",
    },
    typeIdentifier: "NSE_DEBT",
    listQuery: "ListInBonds",
    updateMutation: "UpdateInBond",
    createMutation: "CreateInBond",
    listOperationName: "listINBonds",
  },
];

module.exports = { tempDir, zipFile, apiArray };
