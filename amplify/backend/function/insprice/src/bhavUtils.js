const docClient = require("./insertIntoDB");
const https = require("https");
const fs = require("fs");
const fsPromise = require("fs/promises");
const { rmdir } = fsPromise;
const extract = require("extract-zip");
const csv = require("csv-parser");

const cleanDirectory = async (tempDir, msg) => {
  await rmdir(tempDir, { recursive: true });
  console.log(msg);
};

const downloadZip = (NSE_URL, tempDir, zipFile) => {
  return new Promise((resolve, reject) => {
    const req = https.get(NSE_URL, async (res) => {
      const { statusCode } = res;
      if (statusCode < 200 || statusCode >= 300) {
        await cleanDirectory(
          tempDir,
          `Unable to download zip file, ${statusCode}`
        );
        return reject(new Error("statusCode=" + statusCode));
      }
      res.pipe(fs.createWriteStream(zipFile));
      res.on("end", function () {
        resolve();
      });
    });
    req.on("error", async (e) => {
      await cleanDirectory(
        tempDir,
        `Unable to download zip file, ${e.message}`
      );
      reject(e.message);
    });
    req.end();
  });
};

const unzipDownloads = async (zipFile, tempDir) => {
  try {
    await extract(zipFile, {
      dir: tempDir,
    });
  } catch (err) {
    await cleanDirectory(tempDir, `Unable to extract zip file, ${err.message}`);
    throw new Error(err.message);
  }
};

const extractDataFromCSV = async (
  tempDir,
  fileName,
  typeExchg,
  codes,
  typeIdentifier,
  schema,
  calcSchema,
  instrumentList
) => {
  const end = new Promise((resolve, reject) => {
    let batches = [];
    let batchRecords = [];
    let count = 0;
    fs.createReadStream(`${tempDir}/${fileName}`)
      .pipe(csv())
      .on("data", (record) => {
        const idCheck = instrumentList.some(
          (item) => item === record[codes.id]
        );
        if (!idCheck) {
          const updateSchema = calcSchema(
            record,
            codes,
            schema,
            typeIdentifier,
            typeExchg
          );
          const dataToPush = JSON.parse(JSON.stringify(updateSchema));
          batches.push({ PutRequest: { Item: dataToPush } });
          count++;
          if (count === 25) {
            batchRecords.push(batches);
            batches = [];
            count = 0;
          }
        }
      })
      .on("end", async () => {
        await cleanDirectory(
          tempDir,
          `${typeIdentifier} results extracted successfully and directory is cleaned`
        );
        resolve(batchRecords);
      })
      .on("error", (err) => {
        cleanDirectory(
          tempDir,
          `Unable to read ${type} csv file, ${err.message}`
        );
        throw new Error(err.message);
      });
  });
  return await end;
};

const pushData = async (data, table, instrumentList) => {
  return new Promise((resolve, reject) => {
    data.filter(async (bunch) => {
      var params = {
        RequestItems: {
          [table]: bunch,
        },
      };
      try {
        const updateRecord = await docClient.batchWrite(params).promise();
        bunch.map((item) => instrumentList.push(item.PutRequest.Item.id));
        resolve(updateRecord);
      } catch (error) {
        reject(`Error in dynamoDB: ${JSON.stringify(error)}`);
      }
    });
  });
};

module.exports = {
  downloadZip,
  unzipDownloads,
  extractDataFromCSV,
  cleanDirectory,
  pushData,
};
