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

const extractDataFromCSV = async (tempDir, fileName) => {
  const end = new Promise((resolve, reject) => {
    let results = [];
    fs.createReadStream(`${tempDir}/${fileName}`)
      .pipe(csv())
      .on("data", ({ SYMBOL, ISIN, SERIES, LAST, PREVCLOSE }) => {
        results.push({
          id: ISIN,
          sid: SERIES,
          name: SYMBOL,
          exchg: "NSE",
          country: "IN",
          curr: "INR",
          type: "E",
          subt: "S",
          price: LAST,
          prev: PREVCLOSE,
          sm: 0,
          sy: 0,
          mm: 0,
          my: 0,
          rate: 0,
        });
      })
      .on("end", async () => {
        await cleanDirectory(
          tempDir,
          "Results extracted successfully and directory is cleaned"
        );
        resolve(results);
      })
      .on("error", (err) => {
        cleanDirectory(tempDir, `Unable to read csv file, ${err.message}`);
        throw new Error(err.message);
      });
  });
  return await end;
};

const pushData = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      let instrumentData = {
        updatedIDs: [],
        errorIDs: [],
      };
      const alreadyAddedInstruments = await insertInstrument(
        {},
        "ListInstruments"
      );
      for (let i = 0; i < data.length; i++) {
        const insertedData =
          alreadyAddedInstruments.body.data.listInstruments.items.some(
            (item) => item.id === data[i].id
          )
            ? await insertInstrument(data[i], "UpdateInstrument")
            : await insertInstrument(data[i], "CreateInstrument");
        insertedData.body.errors
          ? instrumentData.errorIDs.push(data[i].id)
          : instrumentData.updatedIDs.push(data[i].id);
      }
      console.log(instrumentData)
      resolve(instrumentData);
    } catch (err) {
      reject(err);
    }
  });
};

module.exports = {
  downloadZip,
  unzipDownloads,
  extractDataFromCSV,
  cleanDirectory,
  pushData,
};
