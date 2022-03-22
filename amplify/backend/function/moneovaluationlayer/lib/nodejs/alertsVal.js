const calculateDiffPercent = (curr, prev) => {
  const diff = (100 * (curr - prev)) / prev;
  return Math.round(diff * 100) / 100;
};

const getNumberOfDays = (start, end) => {
  const date1 = new Date(start);
  const date2 = new Date(end);
  const oneDay = 1000 * 60 * 60 * 24;
  const diffInTime = date2.getTime() - date1.getTime();
  const diffInDays = Math.round(diffInTime / oneDay);
  return diffInDays;
};

const getStr = (num) => (num < 10 ? `0${num}` : '' + num);

const awsdate = (dateStr) => {
  if (!dateStr) return;
  const today = new Date(dateStr);
  const date = today.getDate();
  const month = today.getMonth() + 1;
  const year = today.getFullYear();
  return `${year}-${getStr(month)}-${getStr(date)}`;
};

const checkDate = (date) => {
  const todayDate = awsdate(today);
  const days = getNumberOfDays(date, todayDate);
  return days <= 3;
}

const convertTroyOunceToGram = (amt) => parseFloat((amt / 31.1).toFixed(2));

const sortDescending = (array, key) =>
  array.sort((a, b) => parseFloat(b[key]) - parseFloat(a[key]));

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

    if (yhigh && checkDate(yhighd)) yhighList.push({ name, yhigh });
    if (ylow && checkDate(ylowd)) ylowList.push({ name, ylow });

    const diff = calculateDiffPercent(price, prev);
    Math.sign(diff) > 0
      ? gainers.push({ name, diff })
      : losers.push({ name, diff });
  });
  gainers = sortDescending(gainers, "diff").slice(0, 3);
  losers = sortDescending(losers, "diff").slice(0,3);
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
};
