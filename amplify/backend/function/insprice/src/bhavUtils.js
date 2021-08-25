const insertInstrument = require("./insertInstruments");
const https = require("https");
const fs = require("fs");
const fsPromise = require("fs/promises");
const { rmdir } = fsPromise;
const extract = require("extract-zip");
const csv = require("csv-parser");
const calc = require("./calculate");

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
  schema
) => {
  const end = new Promise((resolve, reject) => {
    let results = [];
    fs.createReadStream(`${tempDir}/${fileName}`)
      .pipe(csv())
      .on("data", (record) => {
        if (record[codes.id].includes("INF")) {
          return;
        }
        const type = record[codes.type];
        const subt = record[codes.subt];
        const name = record[codes.name];
        Object.keys(schema).map((key) => {
          if (key === "type") {
            schema.type = calc[typeIdentifier].calcType(type, subt, name);
          } else if (key === "subt") {
            schema.subt = calc[typeIdentifier].calcSubType(type, subt, name);
          } else if (key === "itype") {
            schema.itype = calc[typeIdentifier].calcInsType(type, subt, name);
          } else if (key === "exchg") {
            schema.exchg = typeExchg;
          } else {
            schema[key] = record[codes[key]];
          }
        });

        Object.keys(schema).map((key) => {
          if (!schema[key]) {
            delete schema[key];
          }
        });
        results.push(Object.assign({}, schema));
        // console.log("Results:", results);
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

const getAlreadyAddedInstruments = async (listQuery, listOperationName) => {
  let alreadyAddedInstruments = [];
  return new Promise(async (resolve, reject) => {
    try {
      const getInstrumentData = async (token) => {
        const query = { limit: 100000 };
        if (token) {
          query.nextToken = token;
        }
        const dataInstruments = await insertInstrument(query, listQuery);
        console.log(dataInstruments.body);
        const { items, nextToken } =
          dataInstruments.body.data[listOperationName];
        alreadyAddedInstruments.push(items);
        if (nextToken) {
          getInstrumentData(nextToken);
        } else {
          resolve(alreadyAddedInstruments);
        }
      };
      getInstrumentData();
    } catch (err) {
      reject(err);
    }
  });
};

const pushData = (data, insdata, updateMutation, createMutation) => {
  return new Promise(async (resolve, reject) => {
    try {
      let instrumentData = {
        updatedIDs: [],
        errorIDs: [],
      };
      console.log(insdata);
      for (let i = 0; i < data.length; i++) {
        const insertedData = insdata.filter((bunch) =>
          bunch.some((item) => item.id === data[i].id)
        ).length
          ? await insertInstrument({ input: data[i] }, updateMutation)
          : await insertInstrument({ input: data[i] }, createMutation);

        console.log(insertedData.body);
        insertedData.body.errors
          ? instrumentData.errorIDs.push({
              id: data[i].id,
              error: insertedData.body.errors,
            })
          : instrumentData.updatedIDs.push(data[i].id);
      }
      console.log(instrumentData);
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
  getAlreadyAddedInstruments,
  pushData,
};
