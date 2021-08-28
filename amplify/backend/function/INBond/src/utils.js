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
    typeExchg: "NSE",
    fileName: `wdmlist_${date}${month}${yearFull}.csv`,
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
      price: "Last Traded Price (in Rs.)",
      subt: "SECTYPE",
      frate: "ISSUE_NAME",
      sDate: "ISSUE_DATE",
      mDate: "MAT_DATE",
      rate: "ISSUE_NAME",
      crstr: "",
    },
    typeIdentifier: "NSE_DEBT",
  },
  {
    typeExchg: "BSE",
    fileName: `fgroup${date}${month}${yearFull}.csv`,
    url: `https://www.bseindia.com/download/Bhavcopy/Debt/${baseFileDebtName}.zip`,
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
      sid: "Security_cd",
      id: "ISIN No.",
      name: "sc_name",
      price: "Close Price",
      subt: "",
      rate: "COUP0N (%)",
      fv: "FACE VALUE",
    },
    typeIdentifier: "BSE_DEBT",
  },
  {
    typeExchg: "BSE",
    fileName: `icdm${date}${month}${yearFull}.csv`,
    url: `https://www.bseindia.com/download/Bhavcopy/Debt/${baseFileDebtName}.zip`,
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
      sid: "Security Code",
      id: "ISIN No.",
      name: "Issuer Name",
      price: "LTP",
      subt: "",
      rate: "Coupon (%)",
      mDate: "Maturity Date",
      fv: "FACE VALUE",
    },
    typeIdentifier: "BSE_DEBT",
  },
  // {
  //   typeExchg: "NSE",
  //   fileName: `MLY${month}${yearFull}.csv`,
  //   url: `https://www1.nseindia.com/archives/debt/monthly/MLY${month}${yearFull}.zip`,
  //   schema: {
  //     id: "",
  //     sid: "",
  //     name: "",
  //     subt: "",
  //     price: 0,
  //     sm: 0,
  //     sy: 0,
  //     mm: 0,
  //     my: 0,
  //     rate: 0,
  //     fr: "",
  //     tf: "",
  //     fv: 0,
  //     cr: null,
  //     crstr: null,
  //     ytm: 0,
  //   },
  //   codes: {
  //     sid: "SECURITY",
  //     id: "NSE_ISIN",
  //     name: "ISSUE_DESC",
  //     price: "LTP_PRICE",
  //     subt: "SECTYPE",
  //     frate: "ISSUE_NAME",
  //     sDate: "ISSUE_DATE",
  //     mDate: "MAT_DATE",
  //     rate: "CRATE",
  //     crstr: "CREDIT_RATING",
  //   },
  //   typeIdentifier: "NSE_DEBT",
  //   listQuery: "ListInBonds",
  //   updateMutation: "UpdateInBond",
  //   createMutation: "CreateInBond",
  //   listOperationName: "listINBonds",
  // },
];

module.exports = { tempDir, zipFile, apiArray };
