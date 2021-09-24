const tempDir = `/tmp/temp`;
const zipFile = `${tempDir}/download.zip`;

const getFileName = (date, month, monthChar, year, yearFull, typeExchg) => {
  if (typeExchg === "NSE") return `cm${date}${monthChar}${yearFull}bhav.csv`;
  if (typeExchg === "BSE") return `EQ_ISINCODE_${date}${month}${year}.CSV`;
};

const getUrl = (url, monthChar, yearFull, fileName) => {
  if (url.includes("nse"))
    return (url = url.replace(
      "${yearFull}/${monthChar}/${fileName}",
      `${yearFull}/${monthChar}/${fileName}`
    ));
  if (url.includes("bse")) {
    fileName = fileName.replace(".CSV", "");
    url = url.replace("${fileName}", fileName);
    return url;
  }
};

const apiArray = [
  {
    typeExchg: "BSE",
    url: "https://www.bseindia.com/download/BhavCopy/Equity/${fileName}.zip",
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
    url: "https://www1.nseindia.com/content/historical/EQUITIES/${yearFull}/${monthChar}/${fileName}.zip",
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

module.exports = { tempDir, zipFile, apiArray, getFileName, getUrl };
