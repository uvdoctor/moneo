/* Amplify Params - DO NOT EDIT
	AUTH_DDPWA0063633B_USERPOOLID
	ENV
	REGION
Amplify Params - DO NOT EDIT */ const fs = require("fs");
const fsPromise = require("fs/promises");
const { mkdir } = fsPromise;
const utils = require("./utils");
const { tempDir, zipFile, apiArray, getFile } = utils;
const bhaoUtils = require("./bhavUtils");
const { calc, calcSchema } = require("./calculate");
const {
  downloadZip,
  unzipDownloads,
  extractDataFromCSV,
  cleanDirectory,
  pushData,
} = bhaoUtils;
const table = "INExchg-4cf7om4zvjc4xhdn4qk2auzbdm-newdev";
const instrumentList = [];

const getAndPushData = (diff) => {
  return new Promise(async (resolve, reject) => {
    for (let i = 0; i < apiArray.length; i++) {
      try {
        if (fs.existsSync(tempDir)) {
          await cleanDirectory(tempDir, "Initial cleaning completed");
        }
        const { bseFile, nseFile } = getFile(diff);
        const { typeExchg, fileName, url, codes, schema } = apiArray(
          bseFile,
          nseFile
        )[i];
        await mkdir(tempDir);
        await downloadZip(url, tempDir, zipFile);
        await unzipDownloads(zipFile, tempDir);
        const data = await extractDataFromCSV(
          tempDir,
          fileName,
          typeExchg,
          codes,
          schema,
          calcSchema,
          instrumentList,
          table
        );
        for (let batch in data) {
          await pushData(data[batch], table, instrumentList, batch);
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
