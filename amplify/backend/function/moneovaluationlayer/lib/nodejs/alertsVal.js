const calculateDiffPercent = (curr, prev) => {
  const diff = (100 * (curr - prev)) / prev;
  return Math.round(diff * 100) / 100;
};
const checkDateEquality = (date) =>
  new Date().toDateString() === new Date(date).toDateString();

const convertTroyOunceToGram = (amt) => parseFloat((amt / 31.1).toFixed(2));

const instrumentValuation = (insMap, userinsmap) => {
  let gainers = [];
  let losers = [];
  let yhighList = [];
  let ylowList = [];
  let totalPrev = 0;
  let totalPrice = 0;
  const isinMap = {};
  userinsmap.map((item) => {
    if (isinMap[item.id]) return;
    const data = insMap[item.id];
    if (!data) return;
    isinMap[item.id] = item.id;
    const qty = item.qty;
    const { yhigh, ylow, yhighd, ylowd, prev, price, name } = data;
    totalPrice += qty * price;
    totalPrev += qty * prev;

    if (yhigh && checkDateEquality(yhighd)) yhighList.push({ name, yhigh });
    if (ylow && checkDateEquality(ylowd)) ylowList.push({ name,  ylow });

    const diff = calculateDiffPercent(price, prev);
    if (Math.abs(diff) > 3) {
      Math.sign(diff) > 0
        ? gainers.push({ name, diff })
        : losers.push({ name, diff });
    }
  });
  return { gainers, losers, yhighList, ylowList, totalPrev, totalPrice };
};

const holdingValuation = (infoMap, userholdingMap, pmArray) => {
  let totalHoldingsPrev = 0;
  let totalHoldingsPrice = 0;
  userholdingMap.map((item) => {
    let data = infoMap[item.name];
    if (!data) data = infoMap[item.subt === "Gold" ? "GC" : item.subt];
    if (!data) return;
    const qty = item.qty;
    const { prev, price } = data;
    if (pmArray.includes(item.subt === "Gold" ? "GC" : item.subt)) {
      const purity = Number.parseFloat(item.name);
      totalHoldingsPrice +=
        qty * ((purity * price) / (item.subt === "Gold" ? 24 : 100));
      totalHoldingsPrev +=
        qty * ((purity * prev) / (item.subt === "Gold" ? 24 : 100));

    } else {
      totalHoldingsPrice += qty * price;
      totalHoldingsPrev += qty * prev;
    }
  });
  return { totalHoldingsPrev, totalHoldingsPrice };
};

module.exports = {
  instrumentValuation,
  holdingValuation,
  calculateDiffPercent,
  convertTroyOunceToGram,
};
