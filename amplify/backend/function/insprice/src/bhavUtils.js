const fs = require("fs");
const csv = require("csv-parser");
const { cleanDirectory } = require("/opt/nodejs/bhavUtils");
const { tempDir } = require("/opt/nodejs/utility");
const { calcSchema } = require("./calculate");

const extractDataFromCSV = async (
  fileName,
  exchg,
  codes,
  schema,
  exchgTable,
  isinMap,
  nameMap,
  weekHLMap,
  bondTable
) => {
  const end = new Promise((resolve, reject) => {
    let [exchgBatches, exchgBatchRecords, exchgCount] = [[], [], 0];
    let [bondBatches, bondBatchRecords, bondCount] = [[], [], 0];
    const stream = fs
      .createReadStream(`${tempDir}/${fileName}`)
      .pipe(csv())
      .on("data", async (record) => {
        if (isinMap[record[codes.id]]) return;
        let [updateSchema, isBond] = [{}, false];
        try {
          stream.pause();
          const data = await calcSchema(
            record,
            codes,
            schema,
            exchg,
            isinMap,
            exchgTable,
            bondTable
          );
          updateSchema = data.updateSchema;
          isBond = data.isBond;
        } finally {
          stream.resume();
        }
        if (Object.keys(updateSchema).length === 0) return;
        const dataToPush = JSON.parse(JSON.stringify(updateSchema));
        if (isBond) {
          bondBatches.push({ PutRequest: { Item: dataToPush } });
          bondCount++;
          if (bondCount === 25) {
            bondBatchRecords.push(bondBatches);
            bondBatches = [];
            bondCount = 0;
          }
        } else {
          const id = dataToPush.id;
          const sid = dataToPush.sid;
          if (nameMap[id]) {
            dataToPush.name = nameMap[id].name;
            dataToPush.fv = nameMap[id].fv;
            if (nameMap[id].under) dataToPush.under = nameMap[id].under;
          }
          if (weekHLMap[sid]) {
            dataToPush.yhigh = weekHLMap[sid].yhigh;
            dataToPush.ylow = weekHLMap[sid].ylow;
          }
          exchgBatches.push({ PutRequest: { Item: dataToPush } });
          exchgCount++;
          if (exchgCount === 25) {
            exchgBatchRecords.push(exchgBatches);
            exchgBatches = [];
            exchgCount = 0;
          }
        }
      })
      .on("end", async () => {
        if (exchgCount < 25 && exchgCount > 0) {
          exchgBatchRecords.push(exchgBatches);
        }
        if (bondCount < 25 && bondCount > 0) {
          bondBatchRecords.push(bondBatches);
        }
        await cleanDirectory(
          tempDir,
          `${fileName} of ${exchg} results extracted successfully and directory is cleaned`
        );
        const data = {
          exchgData: exchgBatchRecords,
          bondData: bondBatchRecords,
        };
        resolve(data);
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

const extractPartOfData = async (fileName, codes, nameMap, weekHLMap) => {
  const end = new Promise((resolve, reject) => {
    let count = 0;
    const csvFormat = fileName.includes("CM_52_wk_High_low")
      ? csv({ headers: true })
      : csv();
    fs.createReadStream(`${tempDir}/${fileName}`)
      .pipe(csvFormat)
      .on("data", (record) => {
        const parse = (data) => (parseFloat(data) ? parseFloat(data) : null);
        if (fileName.includes("CM_52_wk_High_low")) {
          weekHLMap[record[codes.sid]] = {
            yhigh: parse(record[codes.yhigh]),
            ylow: parse(record[codes.ylow]),
          };
        } else if (fileName === "eq_etfseclist.csv") {
          nameMap[record[codes.id]] = {
            fv: parse(record[codes.fv]),
            name: record[codes.name],
            under: record[codes.under],
          };
        } else {
          nameMap[record[codes.id]] = {
            fv: parse(record[codes.fv]),
            name: record[codes.name],
          };
        }
        count++;
      })
      .on("end", async () => {
        await cleanDirectory(
          tempDir,
          `${fileName} results extracted successfully and directory is cleaned`
        );
        resolve(count);
      })
      .on("error", (err) => {
        cleanDirectory(
          tempDir,
          `Unable to read ${fileName} csv file, ${err.message}`
        );
        throw new Error(err.message);
      });
  });
  return await end;
};

const getMarketCapType = (marketcap) => {
  const mcap = marketcap / 10000000;
  if (mcap > 5000 && mcap < 20000) return "M";
  if (mcap > 20000) return "L";
  return "S";
};

const mergeEodAndExchgData = (exchgData, eodData, splitData, dividendData) => {
  if (!(eodData || splitData || dividendData)) return exchgData;
  exchgData.map((element) => {
    element.map((item) => {
      const getData = (data) =>
        data.find(
          (re) =>
            re.code.includes(item.PutRequest.Item.sid) ||
            item.PutRequest.Item.sid === re.code
        );
      const eod = eodData && getData(eodData);
      const split = splitData && getData(splitData);
      const dividend = dividendData && getData(dividendData);
      if (split) {
        item.PutRequest.Item.splitd = split.date;
        let value = split.split.replace(/\//g, "");
        value = value.replace(/\\/g, ":");
        item.PutRequest.Item.split = value;
      }
      if (dividend) {
        item.PutRequest.Item.divdd = dividend.date;
        item.PutRequest.Item.divrd = dividend.recordDate;
        item.PutRequest.Item.divpd = dividend.paymentDate;
        item.PutRequest.Item.div = split.dividend;
      }
      if (eod) {
        const {
          code,
          name,
          MarketCapitalization,
          adjusted_close,
          hi_250d,
          lo_250d,
          close,
          Beta,
        } = eod;
        item.PutRequest.Item.sid = code;
        item.PutRequest.Item.name = name;
        item.PutRequest.Item.price = adjusted_close;
        item.PutRequest.Item.prev = close;
        item.PutRequest.Item.yhigh = item.PutRequest.Item.yhigh ? item.PutRequest.Item.yhigh : hi_250d;
        item.PutRequest.Item.ylow =  item.PutRequest.Item.ylow ? item.PutRequest.Item.ylow : lo_250d;
        item.PutRequest.Item.beta = Beta;
        item.PutRequest.Item.mcap = MarketCapitalization;
        item.PutRequest.Item.mcapt = getMarketCapType(MarketCapitalization);
      }
    });
  });
  return exchgData;
};

const addMetaData = async (exchgData, data) => {
  exchgData.map((element) => {
    element.map((item) => {
      const metaData = data.Items.find(
        (re) => re.id === item.PutRequest.Item.id
      );
      if (!metaData) return;
      item.PutRequest.Item.meta = metaData;
    });
  });

  return exchgData;
};

module.exports = {
  extractDataFromCSV,
  extractPartOfData,
  addMetaData,
  mergeEodAndExchgData,
};
