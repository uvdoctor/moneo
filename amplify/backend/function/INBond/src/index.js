const fs = require("fs");
const fsPromise = require("fs/promises");
const {
  pushData,
  pushDataForFeed,
  getTableNameFromInitialWord,
} = require("/opt/nodejs/databaseUtils");
const { tempDir, zipFile } = require("/opt/nodejs/utility");
const {
  cleanDirectory,
  downloadZip,
  unzipDownloads,
} = require("/opt/nodejs/downloadUtils");
const { getPrev, updatePrevByGetItem } = require("/opt/nodejs/prevUtils");
const constructedApiArray = require("./utils");
const extractDataFromCSV = require("./bhavUtils");
const { mkdir } = fsPromise;
const table = "INBondPrice";
const isinMap = {};
const prevBatch = {};

const downloadFile = async (apiArray, prevMap, isPrevFile, prevBatch) => {
  const { typeExchg, fileName, url, schema, codes } = apiArray;
  const csvFile = `${tempDir}/${fileName}`;
  await mkdir(tempDir);
  if (url.includes("zip")) {
    await downloadZip(url, tempDir, zipFile);
    await unzipDownloads(zipFile, tempDir);
  } else {
    await downloadZip(url, tempDir, csvFile);
  }
  const data = await extractDataFromCSV(
    fileName,
    typeExchg,
    codes,
    schema,
    isinMap,
    table,
    prevMap,
    isPrevFile,
    prevBatch
  );
  return data;
};

const getAndPushData = (diff) => {
  return new Promise(async (resolve, reject) => {
    const tableName = await getTableNameFromInitialWord(table);
    console.log("Table name fetched: ", tableName);
    const apiArray = constructedApiArray(diff);
    for (let i = 0; i < apiArray.length; i++) {
      try {
        if (fs.existsSync(tempDir)) {
          await cleanDirectory(tempDir, "Initial cleaning completed");
        }
        const prevMap = await getPrev(
          diff,
          downloadFile,
          constructedApiArray,
          table,
          i
        );
        console.log("Prev map",Object.keys(prevMap).length);
        const { url, typeExchg } = apiArray[i];
        const data = await downloadFile(apiArray[i], prevMap, false, prevBatch);
        for (let batch in data) {
          await pushData(data[batch], tableName);
        }
        await pushDataForFeed(table, data, `${typeExchg}${i}`, url, typeExchg);
      } catch (err) {
        reject(err);
      }
    }
    console.log("Prev Batch", Object.keys(prevBatch).length);
    if(!diff) {
      await updatePrevByGetItem(prevBatch, tableName);
    }
    resolve();
  });
};

exports.handler = async (event) => {
  return await getAndPushData(event.diff);
};
