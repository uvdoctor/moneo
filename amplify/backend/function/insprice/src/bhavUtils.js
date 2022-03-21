const fs = require("fs");
const csv = require("csv-parser");
const { cleanDirectory } = require("/opt/nodejs/downloadUtils");
const { tempDir, awsdate } = require("/opt/nodejs/utility");
const { calcSchema, calculateRisk } = require("./calculate");

const extractDataFromCSV = async (
  fileName,
  exchg,
  codes,
  schema,
  exchgTable,
  isinMap,
  nameMap,
  weekHLMap,
  mcaptMap,
  bondTable
) => {
  const end = new Promise((resolve, reject) => {
    let [exchgBatches, exchgBatchRecords, exchgCount] = [[], [], 0];
    let [bondBatches, bondBatchRecords, bondCount] = [[], [], 0];
    fs.createReadStream(`${tempDir}/${fileName}`)
      .pipe(csv())
      .on("data", (record) => {
        if (isinMap[record[codes.id]]) return;
        const { updateSchema, isBond } = calcSchema(
          record,
          codes,
          schema,
          exchg,
          isinMap,
          exchgTable,
          bondTable
        );
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
            dataToPush.name = nameMap[id].name
              ? nameMap[id].name
              : dataToPush.name;
            dataToPush.fv = nameMap[id].fv;
            if (nameMap[id].under) dataToPush.under = nameMap[id].under;
          }
          if (mcaptMap[id]) {
            dataToPush.mcapt = mcaptMap[id].mcapt;
          }
          if (weekHLMap[sid]) {
            dataToPush.yhigh = weekHLMap[sid].yhigh;
            dataToPush.ylow = weekHLMap[sid].ylow;
            dataToPush.yhighd = awsdate(weekHLMap[sid].yhighd);
            dataToPush.ylowd = awsdate(weekHLMap[sid].ylowd);
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
          `Unable to read ${fileName} csv file, ${err.message}`
        );
        throw new Error(err.message);
      });
  });
  return await end;
};

const extractPartOfData = async (
  fileName,
  codes,
  nameMap,
  weekHLMap,
  mcaptMap
) => {
  const end = new Promise((resolve, reject) => {
    let count = 0;
    const csvFormat = fileName.includes("CM_52_wk_High_low")
      ? csv({ headers: true })
      : csv();
    fs.createReadStream(`${tempDir}/${fileName}`)
      .pipe(csvFormat)
      .on("data", (record) => {
        if (!Object.keys(record).length) return;
        const parse = (data) => (parseFloat(data) ? parseFloat(data) : null);
        if (
          fileName === "ind_nifty100list.csv" ||
          fileName === "ind_niftymidcap150list.csv"
        ) {
          mcaptMap[record[codes.id]] = {
            mcapt: codes.mcap,
          };
        }
        if (fileName.includes("CM_52_wk_High_low")) {
          if (record[codes.sid].length > 20) return;
          weekHLMap[record[codes.sid]] = {
            yhigh: parse(record[codes.yhigh]),
            ylow: parse(record[codes.ylow]),
            yhighd: record[codes.yhighd] ? record[codes.yhighd] : "",
            ylowd: record[codes.ylowd] ? record[codes.yhighd] : "",
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

const mergeEodAndExchgData = (exchgData, eodData, splitData, dividendData) => {
  if (!(eodData || splitData || dividendData)) return exchgData;
  exchgData.map((element) => {
    element.map((item) => {
      const Item = item.PutRequest.Item;
      const getData = (data) => {
        let result = data.find((re) => Item.sid === re.code);
        if (!result) result = data.find((re) => re.code.startsWith(Item.sid));
        if (!result) result = data.find((re) => Item.name === re.code);
        return result;
      };
      const eod = eodData && getData(eodData);
      const split = splitData && getData(splitData);
      const dividend = dividendData && getData(dividendData);
      if (split) {
        Item.splitd = split.date;
        let value = split.split.replace(/\//g, "");
        value = value.replace(/\\/g, ":");
        Item.split = value;
      }
      if (dividend) {
        Item.divdd = dividend.date;
        Item.divrd = dividend.recordDate;
        Item.divpd = dividend.paymentDate;
        Item.div = dividend.dividend;
      }
      if (eod) {
        const {
          code,
          name,
          MarketCapitalization,
          adjusted_close,
          hi_250d,
          lo_250d,
          Beta,
        } = eod;
        Item.sid = code;
        Item.name = name;
        Item.price = adjusted_close;
        Item.yhigh = Item.yhigh ? Item.yhigh : hi_250d;
        Item.ylow = Item.ylow ? Item.ylow : lo_250d;
        Item.beta = Beta;
        Item.mcap = MarketCapitalization;
      }
      Item.risk = calculateRisk(
        Item.beta ? Item.beta : "",
        Item.mcapt,
        Item.subt,
        Item.itype
      );
    });
  });
  return exchgData;
};

module.exports = {
  extractDataFromCSV,
  extractPartOfData,
  mergeEodAndExchgData,
};
