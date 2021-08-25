const insertInstrument = require("./operation");
const https = require("https");
const fs = require("fs");
const fsPromise = require("fs/promises");
const { rmdir } = fsPromise;
const extract = require("extract-zip");
const csv = require("csv-parser");
const {calc,calcYTM} = require("./calculate");

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
  codes,
  typeIdentifier,
  schema
) => {
  const end = new Promise((resolve, reject) => {
    let results = [];
    fs.createReadStream(`${tempDir}/${fileName}`)
      .pipe(csv())
      .on("data", (record) => {
        if (record[codes.subt]==="MC"){
          return
        }
        Object.keys(schema).map((key) => {
          switch (key) {
            case "price":
              if(!record[codes.price]){
                return schema.price = 100
              }
              return schema.price = record[codes.price]
            case "subt":
              return (schema.subt = calc.calcSubType(record[codes.subt]));
            case "sm":
              return schema.sm = calc.calcSM(record[codes.sDate]);
            case "sy":
              return schema.sy = calc.calcSY(record[codes.sDate]);
            case "mm":
              return schema.mm = calc.calcMM(record[codes.mDate]);
            case "my":
              return schema.my = calc.calcMY(record[codes.mDate]);
            case "fr":
              return (schema.fr = calc.calcFR(record[codes.frate]));
            case "tf":
              return (schema.tf = calc.calcTF(record[codes.subt]));
            case "cr":
              return (schema.cr = calc.calcCR(record[codes.crstr]));
            case "crstr":
              if(record[codes.crstr]===""){
                return schema.crstr = undefined
              }
              return schema.crstr = record[codes.crstr]
            case "fv":
              return schema.fv = 100;
            case "ytm":
              return (schema.ytm = calcYTM(record,codes,
                record[codes.rate],
                100,
                record[codes.price]
              ));
            default:
              schema[key] = record[codes[key]];
          }
        });

        Object.keys(schema).map((key) => {
          if (schema[key]===undefined) {
            delete schema[key];
          }
        });
        console.log(schema);
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
