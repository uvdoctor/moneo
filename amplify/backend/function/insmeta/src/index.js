/* Amplify Params - DO NOT EDIT
	AUTH_DDPWA0063633B_USERPOOLID
	ENV
	REGION
Amplify Params - DO NOT EDIT */

const table = "INExchgMeta-4cf7om4zvjc4xhdn4qk2auzbdm-newdev";
const fs = require("fs");
const fsPromise = require("fs/promises");
const { mkdir } = fsPromise;
const { pushData } = require("/opt/nodejs/insertIntoDB");
const { utility, pushDataForFeed } = require("/opt/nodejs/utility");
const utils = require("./utils");
const { tempDir, zipFile, apiArray } = utils;
const {
  downloadZip,
  unzipDownloads,
  extractDataFromExcel,
  cleanDirectory,
} = require("./bhavUtils");
const isinMap = {};

const getAndPushData = () => {
  return new Promise(async (resolve, reject) => {
    for (let i = 0; i < apiArray.length; i++) {
      try {
        if (fs.existsSync(tempDir)) {
          await cleanDirectory(tempDir, "Initial cleaning completed");
        }
        const { fileName, url, exchg } = apiArray[i];
        await mkdir(tempDir);
        await downloadZip(url, tempDir, zipFile);
        await unzipDownloads(zipFile, tempDir);
        const data = await extractDataFromExcel(
          tempDir,
          fileName,
          table,
          isinMap
        );
        for (let batch in data) {
          await pushData(data[batch], table);
        }
        await pushDataForFeed(table, data, pushData, exchg, url, exchg);
      } catch (err) {
        reject(err);
      }
    }
    resolve(results);
  });
};

exports.handler = async (event) => {
  return await getAndPushData();
};
