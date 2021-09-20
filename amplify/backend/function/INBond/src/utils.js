const tempDir = `/tmp/temp`;
const zipFile = `${tempDir}/download.zip`;

const getFileName = (file, dateFormat, typeExchg) => {
  if (typeExchg === "NSE") return (file = file + dateFormat);
  if (typeExchg === "BSE") {
    file = file.replace("${dateFormat}", dateFormat);
    return file;
  }
};

const getUrl = (url, monthChar, yearFull, fileName, dateFormat) => {
  if (url.includes("nse"))
    return (url = url.replace(
      "${yearFull}/${monthChar}/${fileName}",
      `${yearFull}/${monthChar}/${fileName}`
    ));
  if (url.includes("bse"))
    return (url = url.replace("${dateFormat}", dateFormat));
};

const apiArray = [
  {
    typeExchg: "NSE",
    file: "wdmlist_",
    url: "https://www1.nseindia.com/content/historical/WDM/${yearFull}/${monthChar}/${fileName}.csv",
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
    file: "fgroup${dateFormat}.csv",
    url: "https://www.bseindia.com/download/Bhavcopy/Debt/DEBTBHAVCOPY${dateFormat}.zip",
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
    file: "icdm${dateFormat}.csv",
    url: "https://www.bseindia.com/download/Bhavcopy/Debt/DEBTBHAVCOPY${dateFormat}.zip",
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

module.exports = { tempDir, zipFile, apiArray, getFileName, getUrl };
