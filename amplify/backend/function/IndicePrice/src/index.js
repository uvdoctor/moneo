/* Amplify Params - DO NOT EDIT
	AUTH_MONEO3E6273BC_USERPOOLID
	ENV
	REGION
Amplify Params - DO NOT EDIT */const fs = require("fs");
const fsPromise = require("fs/promises");
const { pushData, pushDataForFeed } = require("/opt/nodejs/insertIntoDB");
const { cleanDirectory, downloadZip } = require("/opt/nodejs/bhavUtils");
const { tempDir } = require("/opt/nodejs/utility");
const constructedApiArray = require("./utils");
const getData = require("./getData");
const extractDataFromCSV = require("./bhavUtils");
const { mkdir } = fsPromise;
const table = "Indices-fdun77s5lzbinkbgvnuidw6ihq-usdev";
let dataFromNse;

const getAndPushData = async (diff) => {
  const apiArray = constructedApiArray(diff);
  for (let i = 0; i < apiArray.length; i++) {
    try {
      const { fileName, url, exchg, cat, type, subt, schema, codes } =
        apiArray[i];
      if (i === 0) {
        if (fs.existsSync(tempDir)) {
          await cleanDirectory(tempDir, "Initial cleaning completed");
        }
        await mkdir(tempDir);
        const csvFile = `${tempDir}/${fileName}`;
        await downloadZip(url, tempDir, csvFile);
        dataFromNse = await extractDataFromCSV(fileName);
      }
      const data = await getData(
        dataFromNse,
        table,
        url,
        cat,
        type,
        subt,
        schema,
        codes,
        exchg
      );
      for (let batch in data) {
        const results = await pushData(data[batch], table);
        console.log(results);
      }
      await pushDataForFeed(table, data, cat, url, exchg);
    } catch (err) {
      console.log(err);
    }
  }
};

exports.handler = async (event) => {
  return await getAndPushData(event.diff);
};
