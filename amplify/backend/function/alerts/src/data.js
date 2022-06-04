const {
  getTableNameFromInitialWord,
  filterTableByList,
} = require("/opt/nodejs/databaseUtils");
const { toCurrency } = require("/opt/nodejs/utility");
const {
  getCommodityPrice,
  getCryptoPrice,
  getFXRate,
} = require("/opt/nodejs/eod");
const {
  convertTroyOunceToGram,
  calculateDiffPercent,
} = require("/opt/nodejs/alertsVal");
const { getInstrumentsData } = require("./processData");
// const {
//   getTableNameFromInitialWord,
//   filterTableByList,
// } = require("../../moneoutilslayer/lib/nodejs/databaseUtils");
// const { toCurrency } = require("../../moneoutilslayer/lib/nodejs/utility");
// const {
//   getCommodityPrice,
//   getCryptoPrice,
//   getFXRate,
// } = require("../../moneopricelayer/lib/nodejs/eod");
// const {
//   convertTroyOunceToGram,
//   calculateDiffPercent,
// } = require("../../moneovaluationlayer/lib/nodejs/alertsVal");

const processInstruments = async (
  infoMap,
  usersMap,
  usersinsMap,
  usersWatchMap
) => {
  let mfIds = new Set();
  let otherIds = new Set();
  const userinsTableName = await getTableNameFromInitialWord("UserIns");
  const userinsdata = await filterTableByList(
    userinsTableName,
    Object.keys(usersMap),
    "uname",
    "uname, ins, watch"
  );
  for (let item of userinsdata) {
    let instruments = [];
    if (item.ins) {
      usersinsMap[item.uname] = item.ins;
      instruments = [...item.ins];
    }
    if (item.watch) {
      usersWatchMap[item.uname] = item.watch;
      instruments = [...instruments, ...item.watch];
    }
    for (let item of instruments) {
      if (item.id.startsWith("INF")) mfIds.add(item.id);
      else otherIds.add(item.id);
    }
  }
  if (mfIds.size) {
    await getInstrumentsData(mfIds, "INMFPrice", infoMap);
  }
  mfIds.forEach((id) => otherIds.add(id));
  if (otherIds.size) {
    await getInstrumentsData(otherIds, "INExchgPrice", infoMap);
  }
  if (otherIds.size) {
    await getInstrumentsData(otherIds, "INBondPrice", infoMap);
  }
  return { usersinsMap, usersWatchMap };
};

const processHoldings = async (infoMap, usersMap, usersinsMap) => {
  const userholdingsTableName = await getTableNameFromInitialWord(
    "UserHoldings"
  );
  const userholdingsdata = await filterTableByList(
    userholdingsTableName,
    Object.keys(usersMap),
    "uname",
    "uname, crypto, nps"
  );
  let npsIds = new Set();
  let cryptoIds = new Set();
  for (let item of userholdingsdata) {
    usersinsMap[item.uname] = [
      ...usersinsMap[item.uname],
      ...item.nps,
      ...item.crypto,
    ];
    for (let holding of item.nps) {
      npsIds.add(holding.name);
    }
    for (let holding of item.crypto) {
      cryptoIds.add(holding.name);
    }
  }

  if (npsIds.size) {
    await getInstrumentsData(npsIds, "NPSPrice", infoMap);
  }

  // Crytpo
  const cryptoArray = [...cryptoIds];
  if (cryptoIds.size) {
    const fxRate = await getFXRate("INR");
    const convertUSDToINR = (amt) => fxRate * amt;
    for (let ids of cryptoArray) {
      let prev = 0;
      let price = 0;
      try {
        prev = await getCryptoPrice(ids, true);
        price = await getCryptoPrice(ids);
      } catch (err) {
        console.log(err);
      }
      if (typeof prev !== "number" && typeof price !== "number") continue;
      infoMap[ids] = {
        name: ids,
        prev: convertUSDToINR(prev),
        price: convertUSDToINR(price),
      };
    }
  }
};

const getCommodityList = async () => {
  const commodityList = [];
  const fxRate = await getFXRate("INR");
  const convertUSDToINR = (amt) => fxRate * amt;
  const metals = ["GC", "SI"];
  for (let ids of metals) {
    const data = await getCommodityPrice(ids, true);
    const prev = convertUSDToINR(convertTroyOunceToGram(data[0])) * 10;
    const price = convertUSDToINR(convertTroyOunceToGram(data[1])) * 10;
    const diff = calculateDiffPercent(price, prev);
    commodityList.push({
      name: `10 grams of ${ids === "SI" ? "99.99% Silver" : "24k Gold"}:`,
      price: toCurrency(price, "INR", true),
      chg: Math.abs(diff),
      up: Math.sign(diff) > 0 ? true : false,
    });
  }
  return commodityList;
};

module.exports = {
  processInstruments,
  processHoldings,
  getCommodityList,
};
