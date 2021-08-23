const fs = require("fs");
const fsPromise = require("fs/promises");
const { mkdir } = fsPromise;
const utils = require("./utils");
const { tempDir, zipFile, apiArray } = utils;
const bhaoUtils = require("./bhavUtils");
const {
  downloadZip,
  unzipDownloads,
  extractDataFromCSV,
  cleanDirectory,
  getAlreadyAddedInstruments,
  pushData,
} = bhaoUtils;

const getAndPushData = () => {
  return new Promise(async (resolve, reject) => {
    for (let i = 0; i < apiArray.length; i++) {
      try {
        if (fs.existsSync(tempDir)) {
          await cleanDirectory(tempDir, "Initial cleaning completed");
        }
        const { type, fileName, url, codes, typeIdentifier,listQuery,updateMutation,createMutation,listOperationName } = apiArray[i];
        await mkdir(tempDir);
        await downloadZip(url, tempDir, zipFile);
        await unzipDownloads(zipFile, tempDir);
        const data = await extractDataFromCSV(
          tempDir,
          fileName,
          type,
          codes,
          typeIdentifier,
        );
        const insdata = await getAlreadyAddedInstruments(typeIdentifier,listQuery,listOperationName);
        await pushData(data, insdata,updateMutation,createMutation);
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
