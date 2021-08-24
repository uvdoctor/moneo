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
  type,
  codes,
  typeIdentifier,
  schema
) => {
  const calcType = (type, subt, name) => {
    if (typeIdentifier === "BSE_EQUITY") {
      if (type === "Q" && subt === "F") {
        return "F";
      } else if (type === "Q" && subt === "B") {
        return "F";
      } else if (type === "Q" || type === "P") {
        return "E";
      } else if (type === "B" || type === "D") {
        return "F";
      } else {
        return "E";
      }
    } else if (typeIdentifier === "NSE_EQUITY") {
      const equity = ["EQ", "BE", "BZ", "E1", "SM", "ST", "X1", "P1", "P2"];
      const fixed = ["GB", "GS", "W", "N", "Y", "Z"];
      if (type === "MF") {
        return "MF"
      } else if (name.includes("ETF")) {
        if (
          name.includes("GOLD") ||
          name.includes("GILT") ||
          name.includes("BBETF") ||
          name.includes("LIQUID")
        ) {
          return "F";
        }else{
          return "E"
        }
      } else if (equity.some((item) => item === type)) {
        return "E";
      } else if (fixed.some((item) => item === type || type.startsWith(item))) {
        return "F";
      } else if (type === "IV") {
        return "A";
      } else if (type === "RR") {
        return "A";
      }
    }
  };

  const calcSubType = (type, subt, name) => {
    if (typeIdentifier === "BSE_EQUITY") {
      if (name.includes("LIQUID")) {
        return "L";
      } else if (type === "Q" && subt === "F") {
        return "GB";
      } else if (type === "B" && subt === "G") {
        return "GoldB";
      } else if (type === "Q" && subt === "B") {
        return "I";
      } else if ((type === "B" || type === "D") && subt === "F") {
        return "CB";
      } else if (type === "Q" || type === "P") {
        return "S";
      } else {
        return "S";
      }
    } else if (typeIdentifier === "NSE_EQUITY") {
      if (name.includes("ETF")) {
        if (name.includes("GOLD")) {
          return "Gold";
        } else if (name.includes("GILT")) {
          return "GB";
        } else if (name.includes("BBETF")) {
          return "GBO";
        } else if (name.includes("LIQUID")) {
          return "L";
        } else {
          return "I";
        }
      } else if (type === "GC" || type === "GS") {
        return "GB";
      } else if (type === "GB") {
        return "GoldB";
      } else if (type === "RR" || type === "IV") {
        return "R";
      } else if (
        type.includes("N") ||
        type.includes("Y") ||
        type.includes("Z")
      ) {
        return "CB";
      } else {
        return "S";
      }
    }
  };

  const calcInsType = (type, subt, name) => {
    if (typeIdentifier === "BSE_EQUITY") {
      if (type === "Q" && subt === "E") {
        return "ETF";
      }
    } else if (typeIdentifier === "NSE_EQUITY") {
      if (name.includes("ETF")) {
        return "ETF";
      } else if (type === "IV") {
        return "InvIT";
      } else if (type === "RR") {
        return "REIT";
      }
    }
  };

  const end = new Promise((resolve, reject) => {
    let results = []
    fs.createReadStream(`${tempDir}/${fileName}`)
      .pipe(csv())
      .on("data", (record) => {
        Object.keys(schema).map((key) => {
          if(key === "type"){
            schema.type = calcType(
              record[codes.type],
              record[codes.subt],
              record[codes.name]
            );
          }else if(key === "subt"){
            schema.subt = calcSubType(
              record[codes.type],
              record[codes.subt],
              record[codes.name]
            );}
          else if(key === "itype"){
            schema.itype = calcInsType(
              record[codes.type],
              record[codes.subt],
              record[codes.name]
            );}
          else if(key === "exchg"){
            schema.exchg = type; }
          else{
            schema[key] = record[codes[key]];
          }
          
        });
        // console.log("Schema: ", schema);
        Object.keys(schema).map((key) => {
          if (schema.type === "MF"){
            delete schema
          }
          else if (schema[key]=== undefined) {
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

const getAlreadyAddedInstruments = async (
  typeIdentifier,
  listQuery,
  listOperationName
) => {
  let alreadyAddedInstruments = [];
  return new Promise(async (resolve, reject) => {
    try {
      const getInstrumentData = async (token) => {
        const query = {
          limit: 100000,
          // filter: { sid: { eq: typeIdentifier } },
        };
        if (token) {
          query.nextToken = token;
        }
        const dataInstruments = await insertInstrument(query, listQuery);
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
