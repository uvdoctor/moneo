var pdfjsLib = require("pdfjs-dist/legacy/build/pdf.js");
// const {
//   appendGenericFields,
// } = require("../../moneoutilslayer/lib/nodejs/databaseUtils");
// const {
//   divideArrayBySize,
// } = require("../../moneoutilslayer/lib/nodejs/utility");
const { divideArrayBySize, appendGenericFields } = require("/opt/nodejs/utility");
const dataObj = [];

const parseDataFromPDF = async (url, table) => {
  const parse = (num) => {
    let number = parseFloat(num);
    if (isNaN(number)) number = 0;
    return number;
  };
  var loadingTask = pdfjsLib.getDocument(url);
  await loadingTask.promise
    .then(function (doc) {
      const numPages = doc.numPages;
      let lastPromise; // will be used to chain promises
      lastPromise = doc.getMetadata();

      const loadPage = function (pageNum) {
        return doc.getPage(pageNum).then(function (page) {
          return page
            .getTextContent()
            .then(function (content) {
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
                  dataObj.push({ PutRequest: { Item: schema } });
                }
              });
              page.cleanup();
              return dataObj;
            })
            .then(function (data) {
              console.log(Object.keys(data).length);
            });
        });
      };
      for (let i = 1; i <= numPages; i++) {
        lastPromise = lastPromise.then(loadPage.bind(null, i));
      }
      return lastPromise;
    })
    .then(
      function () {
        console.log("# End of Document");
      },
      function (err) {
        console.error("Error: " + err);
      }
    );
};

const getData = async (url, table) => {
  await parseDataFromPDF(url, table);
  const batches = divideArrayBySize(dataObj, 25);
  return batches;
};

module.exports = { getData };
