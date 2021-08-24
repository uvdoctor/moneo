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
 const calcType = {
    BSE_EQUITY: (type, subt, name) => {
      switch (true) {
        case type === "Q" && (subt === "F" || subt === "B"):
        case type === "B" || type === "D":
          return "F"
        case type === "Q" || type === "P":
          return "E"
        default:
          return "E"
      }
    },
    NSE_EQUITY: (type, subt, name) => {
      const equity = ["EQ", "BE", "BZ", "E1", "SM", "ST", "X1", "P1", "P2"];
      const fixed = ["GB", "GS", "W", "N", "Y", "Z"];
      switch (true) {
        case type === "MF":
          return "MF"
        case name.includes('ETF'):
          switch (true) {
            case name.includes('GOLD'):
            case name.includes('GILT'):
            case name.includes('BBETF'):
            case name.includes('LIQUID'):
              return "F"
            default:
              return "E"
          }
        case equity.some((item) => item === type):
          return "E"
        case fixed.some((item) => item === type || type.startsWith(item)):
          return "F"
        case type === "IV" || type === "RR":
          return "A"
        default:
          return "E"
      }
    },
  }
  const calcSubType = {
    BSE_EQUITY: (type, subt, name) => {
      switch (true) {
        case name.includes("LIQUID"):
          return "L"
        case type === "Q" && subt === "F":
          return "GB"
        case type === "B" && subt === "G":
          return "GoldB"
        case type === "Q" && subt === "B":
          return "I"
        case (type === "B" || type === "D") && subt === "F":
          return "CB"
        case type === "Q" || type === "P":
          return "S"
        default:
          return "S"
      }
    },
    NSE_EQUITY: (type, subt, name) => {
      switch (true) {
        case name.includes("ETF"):
          switch (true) {
            case name.includes("GOLD"):
              return "Gold"
            case name.includes("GILT"):
              return "GB"
            case name.includes("BBETF"):
              return "GBO"
            case name.includes("LIQUID"):
              return "L"
            default:
              return "I"
          }
        case type === "GC" || type === "GS":
          return "GB"
        case type === "GB":
          return "GoldB"
        case type === "RR" || type === "IV":
          return "R"
        case type.includes("N"):
        case type.includes("Y"):
        case type.includes("Z"):
          return "CB"
        default:
          return "S"
      }
    }
  }
  const calcInsType = {
    BSE_EQUITY: (type, subt, name) => {
      if (type === "Q" && subt === "E") {
        return "ETF";
      }
    },
    NSE_EQUITY: (type, subt, name) => {
      switch (true) {
        case name.includes("ETF"):
          return "ETF"
        case type === "IV":
          return "InvIT"
        case type === "RR":
          return "REIT"
      }
    }
  }

  const end = new Promise((resolve, reject) => {
    let results = []
    fs.createReadStream(`${tempDir}/${fileName}`)
      .pipe(csv())
      .on("data", (record) => {
        Object.keys(schema).map((key) => {
          if (key === "type") {
            schema.type = calcType[typeIdentifier](
              record[codes.type],
              record[codes.subt],
              record[codes.name]
            );
          } else if (key === "subt") {
            schema.subt = calcSubType[typeIdentifier](
              record[codes.type],
              record[codes.subt],
              record[codes.name]
            );
          }
          else if (key === "itype") {
            schema.itype = calcInsType[typeIdentifier](
              record[codes.type],
              record[codes.subt],
              record[codes.name]
            );
          }
          else if (key === "exchg") {
            schema.exchg = type;
          }
          else {
            schema[key] = record[codes[key]];
          }

        });
  
        Object.keys(schema).map((key) => {
          if (schema.type === "MF") {
            delete schema
          }
          else if (!schema[key]) {
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
  listQuery,
  listOperationName
) => {
  let alreadyAddedInstruments = [];
  return new Promise(async (resolve, reject) => {
    try {
      const getInstrumentData = async (token) => {
        const query = {
          limit: 100000,
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
