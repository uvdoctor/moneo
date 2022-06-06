// const { getEODdataByDate } = require("../../moneopricelayer/lib/nodejs/eod");
const { arrangeAndPushData, getInfo } = require('./getAndPushData')
const { getEODdataByDate } = require("/opt/nodejs/eod");

const getFundData = async (yearsList, tableName) => {
  const fundIds = {};
  const p1y = [];
  const p3y = [];
  const p5y = [];
  for (let year of yearsList) {
    const isinMap = {};
    const mfInfoArray = await getInfo(year);
    mfInfoArray.forEach((element) => {
      const id = element["ISIN Div Payout/ISIN Growth"];
      const price = parseFloat(element["Net Asset Value"]);
      if (!id || id.length < 12 || Number.isNaN(price) || !price) return;
      if (isinMap[id]) return;
      isinMap[id] = id;
      if (!fundIds[id]) fundIds[id] = id;
      if (year === 365) p1y.push({ id, price });
      if (year === 365 * 3) p3y.push({ id, price });
      if (year === 365 * 5) p5y.push({ id, price });
    });
  }
  return arrangeAndPushData(fundIds, p1y, p3y, p5y, tableName, "Fund");
};

const getExchgData = async (yearsList, tableName) => {
  const p1y = [];
  const p3y = [];
  const p5y = [];
  const exchgIds = {};
  const exchgs = ["NSE", "BSE"];
  for (let year of yearsList) {
    const isinMap = {};
    for (let exchg of exchgs) {
      const data = await getEODdataByDate(exchg, year);
      data.map((item) => {
        if (isinMap[item.code]) return;
        if (!exchgIds[item.code]) exchgIds[item.code] = item.code;
        isinMap[item.code] = item.code;
        const id = item.code;
        const price = item.adjusted_close;
        if (!price || isNaN(price)) return;
        if (year === 365) p1y.push({ id, price });
        if (year === 365 * 3) p3y.push({ id, price });
        if (year === 365 * 5) p5y.push({ id, price });
      });
    }
  }
  return arrangeAndPushData(exchgIds, p1y, p3y, p5y, tableName, "Exchg");
};

module.exports = { getFundData, getExchgData }