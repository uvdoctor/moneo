const fs = require("fs");
const fsPromise = require("fs/promises");
const {
  cleanDirectory,
  downloadZip,
  unzipDownloads,
} = require("/opt/nodejs/bhavUtils");
const {
  getDataFromTable,
  pushData,
  pushDataForFeed,
} = require("/opt/nodejs/insertIntoDB");
const { tempDir, zipFile } = require("/opt/nodejs/utility");
const constructedApiArray = require("./utils");
const {
  extractPartOfData,
  extractDataFromCSV,
  addMetaData,
} = require("./bhavUtils");
const { mkdir } = fsPromise;
const table = "INExchg-4cf7om4zvjc4xhdn4qk2auzbdm-newdev";
const isinMap = {};

const getAndPushData = (diff) => {
  return new Promise(async (resolve, reject) => {
    const { apiArray, nameApiArray } = constructedApiArray(diff);
    const nameArray = [];
    const weekHLArray = [];
    try {
      if (fs.existsSync(tempDir)) {
        await cleanDirectory(tempDir, "Initial cleaning completed");
      }
      for (let ind = 0; ind < nameApiArray.length; ind++) {
        const { fileName, url, codes } = nameApiArray[ind];
        const csvFile = `${tempDir}/${fileName}`;
        await mkdir(tempDir);
        await downloadZip(url, tempDir, csvFile);
        await extractPartOfData(fileName, codes, nameArray, weekHLArray);
      }
      for (let i = 0; i < apiArray.length; i++) {
        const { typeExchg, fileName, url, schema, codes } = apiArray[i];
        console.log(url);
        await mkdir(tempDir);
        await downloadZip(url, tempDir, zipFile);
        await unzipDownloads(zipFile, tempDir);
        const exchgData = await extractDataFromCSV(
          fileName,
          typeExchg,
          codes,
          schema,
          table,
          isinMap,
          nameArray,
          weekHLArray
        );
        const data = await addMetaData(exchgData, getDataFromTable);
        for (let batch in data) {
          await pushData(data[batch], table);
        }
        await pushDataForFeed(table, data, typeExchg, url, typeExchg);
      }
    } catch (err) {
      reject(err);
    }
    resolve();
  });
};

exports.handler = async (event) => {
  return await getAndPushData(event.diff);
};
