const fs = require("fs");
const fsPromise = require("fs/promises");
const { mkdir } = fsPromise;
const { getAllData, pushData } = require("/opt/nodejs/insertIntoDB");
const { utility } = require("/opt/nodejs/utility");
const utils = require("./utils");
const { tempDir, zipFile, apiArray, getFileName, getUrl } = utils;
const bhaoUtils = require("./bhavUtils");
const { calcSchema } = require("./calculate");

const {
  downloadZip,
  unzipDownloads,
  extractDataFromCSV,
  cleanDirectory,
  addMetaData,
} = bhaoUtils;
const table = "INExchg-4cf7om4zvjc4xhdn4qk2auzbdm-newdev";
let exchgData = [];
const isinMap = {};
const numToDeductFromDate = (num) => num;

const getAndPushData = (diff) => {
  return new Promise(async (resolve, reject) => {
    for (let i = 0; i < apiArray.length; i++) {
      try {
        if (fs.existsSync(tempDir)) {
          await cleanDirectory(tempDir, "Initial cleaning completed");
        }
        const num = numToDeductFromDate(diff);
        const { date, month, monthChar, year, yearFull } = utility(num);
        const { typeExchg, url, schema, codes } = apiArray[i];
        const fileName = getFileName(
          date,
          month,
          monthChar,
          year,
          yearFull,
          typeExchg
        );
        console.log(fileName);
        const urlName = getUrl(url, monthChar, yearFull, fileName);
        console.log(urlName);
        await mkdir(tempDir);
        await downloadZip(urlName, tempDir, zipFile);
        await unzipDownloads(zipFile, tempDir);
        const data = await extractDataFromCSV(
          tempDir,
          fileName,
          typeExchg,
          codes,
          schema,
          calcSchema,
          table,
          isinMap
        );
        exchgData = exchgData.concat(data);
      } catch (err) {
        reject(err);
      }
    }
    resolve(exchgData);
  });
};

exports.handler = async (event) => {
  const exchgData = await getAndPushData(event.diff);
  const data = await addMetaData(exchgData, getAllData);
  for (let batch in data) {
    await pushData(data[batch], table);
  }
};
