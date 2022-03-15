const calculateDiffPercent = (curr, prev) => {
  const diff = (100 * (curr - prev)) / prev;
  return Math.round(diff * 100) / 100;
};
const checkDateEquality = (date) =>
  new Date().toDateString() === new Date(date).toDateString();

const convertTroyOunceToGram = (amt) => parseFloat((amt / 31.1).toFixed(2));

const sortDescending = (array, key) =>
  array.sort((a, b) => parseFloat(b[key]) - parseFloat(a[key]));

const toCurrency = (num, currency, decimal = false) => {
  const formatter = new Intl.NumberFormat(navigator.language, {
    style: "currency",
    currency: currency,
    minimumFractionDigits: decimal ? 2 : 0,
    maximumFractionDigits: decimal ? 2 : 0,
  });
  return num ? formatter.format(num) : formatter.format(0);
};

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
    if (ylow && checkDateEquality(ylowd)) ylowList.push({ name, ylow });

    const diff = calculateDiffPercent(price, prev);
    if (Math.abs(diff) > 3) {
      Math.sign(diff) > 0
        ? gainers.push({ name, diff })
        : losers.push({ name, diff });
    }
  });
  gainers = sortDescending(gainers, "diff").slice(0, 3);
  losers = sortDescending(losers, "diff").slice(-3);
  return { gainers, losers, yhighList, ylowList, totalPrev, totalPrice };
};

const holdingValuation = (infoMap, userholdingMap, pmArray) => {
  const isGold = (subt) => subt === "Gold";
  let totalHoldingsPrev = 0;
  let totalHoldingsPrice = 0;
  userholdingMap.map((item) => {
    const { subt, name, qty } = item;
    let data = infoMap[item.name];
    if (!data) data = infoMap[isGold(subt) ? "GC" : subt];
    if (!data) return;
    const { prev, price } = data;
    if (pmArray.includes(isGold(subt) ? "GC" : subt)) {
      const purity = Number.parseFloat(name);
      const calcPrice = (price) =>
        qty * ((purity * price) / (isGold(subt) ? 24 : 100));
      totalHoldingsPrice += calcPrice(price);
      totalHoldingsPrev += calcPrice(prev);
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
  toCurrency
};
