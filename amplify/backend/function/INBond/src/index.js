const fs = require("fs");
const fsPromise = require("fs/promises");
const { mkdir } = fsPromise;
const utils = require("./utils");
const { tempDir, zipFile, apiArray } = utils;
const bhaoUtils = require("./bhavUtils");
const updateSchema = require("./calculate");
const {
  downloadZip,
  unzipDownloads,
  extractDataFromCSV,
  cleanDirectory,
  pushData,
} = bhaoUtils;

const getAndPushData = () => {
  return new Promise(async (resolve, reject) => {
    for (let i = 0; i < apiArray.length; i++) {
      try {
        if (fs.existsSync(tempDir)) {
          await cleanDirectory(tempDir, "Initial cleaning completed");
        }
        const {
          typeExchg,
          fileName,
          url,
          codes,
          schema,
          typeIdentifier,
          updateMutation,
          createMutation,
        } = apiArray[i];
        await mkdir(tempDir);
        await downloadZip(url, tempDir, zipFile);
        await unzipDownloads(zipFile, tempDir);
        const data = await extractDataFromCSV(
          tempDir,
          fileName,
          codes,
          typeIdentifier,
          schema,
          typeExchg,
          updateSchema
        );
        await pushData(data, updateMutation, createMutation);
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
