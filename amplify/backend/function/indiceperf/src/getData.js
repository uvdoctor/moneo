const pdfjsLib = require("pdfjs-dist/legacy/build/pdf.js");
// const {
//   getTableNameFromInitialWord,
//   pushDataForFeed,
//   pushData,
// } = require("../../moneoutilslayer/lib/nodejs/databaseUtils");
// const {
//   divideArrayBySize,
//   utility,
//   appendGenericFields,
// } = require("../../moneoutilslayer/lib/nodejs/utility");
const { divideArrayBySize, appendGenericFields, utility } = require("/opt/nodejs/utility");
const {
  getTableNameFromInitialWord,
  pushDataForFeed,
  pushData,
} = require("/opt/nodejs/databaseUtils");
const table = "IndiceHistPerf";

const parse = (num) => (isNaN(num) ? 0 : parseFloat(num));

const parseDataFromPDF = async (url, table) => {
  return new Promise(async (resolve, reject) => {
    const dataArray = [];
    try {
      var loadingTask = pdfjsLib.getDocument(url);
      const doc = await loadingTask.promise;
      const numPages = doc.numPages;

      const loadPage = async (pageNum) => {
        const page = await doc.getPage(pageNum);
        const content = await page.getTextContent();
        const strings = content.items.map(function (item) {
          const value = item.str;
          if (!value.length) return " ";
          return value;
        });
        const data = strings.filter((item) => item !== " ");
        data.filter((item) => {
          if (item.startsWith("NIFTY")) {
            const [
              name,
              p1m,
              p3m,
              p1y,
              p3y,
              p5y,
              vol,
              beta,
              corr,
              rsq,
              pe,
              pb,
              div,
            ] = data.slice(data.indexOf(item), data.indexOf(item) + 13);
            const schema = {
              name: name.trim(),
              p1m: parse(p1m),
              p3m: parse(p3m),
              p1y: parse(p1y),
              p3y: parse(p3y),
              p5y: parse(p5y),
              vol: parse(vol),
              beta: parse(beta),
              corr: parse(corr),
              rsq: parse(rsq),
              pe: parse(pe),
              pb: parse(pb),
              div: parse(div),
            };
            appendGenericFields(schema, table);
            dataArray.push({ PutRequest: { Item: schema } });
          }
        });
        page.cleanup();
      };

      for (let i = 1; i <= numPages; i++) {
        await loadPage(i);
      }
      resolve(dataArray);
    } catch (err) {
      console.log(err);
      reject(err);
    }
  });
};

const getAndPushData = async () => {
  return new Promise(async (resolve, reject) => {
    const tableName = await getTableNameFromInitialWord(table);
    console.log("Table name fetched: ", tableName);
    const { monthChar, yearFull } = utility(30);
    const url = `https://www1.nseindia.com/content/indices/Index_Dashboard_${monthChar}${yearFull}.pdf`;
    console.log(url);
    try {
      let batches = [];
      const data = await parseDataFromPDF(url, table);
      if (Array.isArray(batches)) batches = divideArrayBySize(data, 25);
      for (let batch in batches) {
        const result = await pushData(batches[batch], tableName);
        console.log(result);
      }
      await pushDataForFeed(table, batches, "NSE", url, "NSE");
    } catch (err) {
      reject(err);
    }
    resolve();
  });
};

module.exports = { getAndPushData, parseDataFromPDF };
