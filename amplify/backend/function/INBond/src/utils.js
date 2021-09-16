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
  const todayDate = today.getDate() - `${num}`;
  const date = todayDate < 10 ? `0${todayDate}` : todayDate;

  // For BSE
  const month =
    today.getMonth() + 1 < 10
      ? `0${today.getMonth() + 1}`
      : `${today.getMonth() + 1}`;
  const bseFile = `DEBTBHAVCOPY${date}${month}${yearFull}`;

  // For NSE
  const nseFile = `wdmlist_${date}${month}${yearFull}.csv`;
  const csvFile = `${tempDir}/${nseFile}`;
  const bseDate = `${date}${month}${yearFull}`;
  return { bseFile, nseFile, bseDate, csvFile };
};
const apiArray = (bseFile, nseFile, bseDate) => [
  {
    typeExchg: "NSE",
    fileName: nseFile,
    url: `https://www1.nseindia.com/content/historical/WDM/${yearFull}/${monthChar}/${nseFile}`,
    schema: {
      id: "",
      sid: "",
      name: "",
      exchg: "",
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
      createdAt: "",
      updatedAt: "",
    },
    codes: {
      sid: "SECURITY",
      id: "ISIN NO.",
      name: "ISSUE_DESC",
      price: "Last Traded Price (in Rs.)",
      subt: "SECTYPE",
      frate: "ISSUE_NAME",
      sDate: "ISSUE_DATE",
      mDate: "MAT_DATE",
      rate: "ISSUE_NAME",
      crstr: "",
    },
  },
  {
    typeExchg: "BSE",
    fileName: `fgroup${bseDate}.csv`,
    url: `https://www.bseindia.com/download/Bhavcopy/Debt/${bseFile}.zip`,
    schema: {
      id: "",
      sid: "",
      name: "",
      subt: "",
      price: 0,
      exchg: "",
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
      createdAt: "",
      updatedAt: "",
    },
    codes: {
      sid: "Security_cd",
      id: "ISIN No.",
      name: "sc_name",
      price: "Close Price",
      subt: "",
      rate: "COUP0N (%)",
      frate: "COUP0N (%)",
      fv: "FACE VALUE",
      sDate: "",
      mDate: "",
      crstr: "",
    },
  },
  {
    typeExchg: "BSE",
    fileName: `icdm${bseDate}.csv`,
    url: `https://www.bseindia.com/download/Bhavcopy/Debt/${bseFile}.zip`,
    schema: {
      id: "",
      sid: "",
      name: "",
      subt: "",
      price: 0,
      exchg: "",
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
      frate: "Coupon (%)",
      fv: "FACE VALUE",
      sDate: "",
      crstr: "",
      createdAt: "",
      updatedAt: "",
    },
  },
];

module.exports = { tempDir, zipFile, apiArray, getFile };
