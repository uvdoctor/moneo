const insertInstrument = require("./insertInstruments");
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
    let results = [];
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
          results.push(Object.assign({}, updateSchema));
        }
      })
      .on("end", async () => {
        await cleanDirectory(
          tempDir,
          `${typeIdentifier} results extracted successfully and directory is cleaned`
        );
        resolve(results);
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

const executeMutation = async (mutation, input) => {
  return await insertInstrument({ input: input }, mutation);
};

const pushData = (data, updateMutation, createMutation) => {
  let instrumentData = { updatedIDs: [], errorIDs: [] };
  return new Promise(async (resolve, reject) => {
    for (let i = 0; i < data.length; i++) {
      try {
        const updatedData = await executeMutation(updateMutation, data[i]);
        if (!updatedData.body.data.updateINExchange) {
          await executeMutation(createMutation, data[i]);
        }
        insertedData.body.errors
          ? instrumentData.errorIDs.push({
              id: data[i].id,
              error: insertedData.body.errors,
            })
          : instrumentData.updatedIDs.push(data[i]);
      } catch (err) {
        console.log(err);
      }
    }
    console.log(instrumentData);
    resolve(instrumentData);
  });
};
module.exports = {
  downloadZip,
  unzipDownloads,
  extractDataFromCSV,
  cleanDirectory,
  pushData,
};
