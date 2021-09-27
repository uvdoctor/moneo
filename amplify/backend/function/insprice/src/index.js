const fs = require("fs");
const fsPromise = require("fs/promises");
const { mkdir } = fsPromise;
const { getAllData, pushData } = require("/opt/nodejs/insertIntoDB");
const { utility, pushDataForFeed } = require("/opt/nodejs/utility");
const {cleanDirectory, downloadZip, unzipDownloads} = require('opt/nodejs/bhavUtils')
const { tempDir, zipFile, apiArray, getFileName, getUrl } = require("./utils");
const { calcSchema } = require("./calculate");
const { extractDataFromCSV, addMetaData } = require("./bhavUtils");
const table = "INExchg-4cf7om4zvjc4xhdn4qk2auzbdm-newdev";
const isinMap = {};

const getAndPushData = (diff) => {
  return new Promise(async (resolve, reject) => {
    for (let i = 0; i < apiArray.length; i++) {
      try {
        if (fs.existsSync(tempDir)) {
          await cleanDirectory(tempDir, "Initial cleaning completed");
        }
        const { date, month, monthChar, year, yearFull } = utility(diff);
        const { typeExchg, url, schema, codes } = apiArray[i];
        const fileName = getFileName(
          date,
          month,
          monthChar,
          year,
          yearFull,
          typeExchg
        );
        const urlName = getUrl(url, monthChar, yearFull, fileName);
        await mkdir(tempDir);
        await downloadZip(urlName, tempDir, zipFile);
        await unzipDownloads(zipFile, tempDir);
        const exchgData = await extractDataFromCSV(
          cleanDirectory,
          tempDir,
          fileName,
          typeExchg,
          codes,
          schema,
          calcSchema,
          table,
          isinMap
        );
        const data = await addMetaData(exchgData, getAllData);
        for (let batch in data) {
          await pushData(data[batch], table);
        }
        await pushDataForFeed(table, data, pushData, typeExchg, url, typeExchg);
      } catch (err) {
        reject(err);
      }
    }
    resolve();
  });
};

exports.handler = async (event) => {
  return await getAndPushData();
};
