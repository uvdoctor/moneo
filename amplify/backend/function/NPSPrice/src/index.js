/* Amplify Params - DO NOT EDIT
	AUTH_DDPWA0063633B_USERPOOLID
	ENV
	REGION
Amplify Params - DO NOT EDIT */
const fs = require("fs");
const fsPromise = require("fs/promises");
const { mkdir } = fsPromise;
const utils = require("./utils");
const { tempDir, zipFile, apiArray, getFile } = utils;
const bhaoUtils = require("./bhavUtils");
const calc = require("./calculate");
const {
  downloadZip,
  unzipDownloads,
  cleanDirectory,
  getDataFromTxtFile,
  pushData,
} = bhaoUtils;
const table = "NPS-4cf7om4zvjc4xhdn4qk2auzbdm-newdev";

const getAndPushData = (diff) => {
  return new Promise(async (resolve, reject) => {
    for (let i = 0; i < apiArray.length; i++) {
      try {
        if (fs.existsSync(tempDir)) {
          await cleanDirectory(tempDir, "Initial cleaning completed");
        }
        const file = getFile(diff);
        const { fileName, url } = apiArray(file)[i];
        await mkdir(tempDir);
        await downloadZip(url, tempDir, zipFile);
        await unzipDownloads(zipFile, tempDir);
        const data = await getDataFromTxtFile(tempDir, fileName, calc, table);

        for (let batch in data) {
          await pushData(data[batch], table, batch);
        }
      } catch (err) {
        reject(err);
      }
    }
    resolve();
  });
};

exports.handler = async (event) => {
  return await getAndPushData(event.diff);
};
