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

const getStr = (num) => (num < 10 ? `0${num}` : "" + num);

const awsdate = (dateStr) => {
  if (!dateStr) return null;
  const today = new Date(dateStr);
  const date = today.getDate();
  const month = today.getMonth() + 1;
  const year = today.getFullYear();
  const awsdate = `${year}-${getStr(month)}-${getStr(date)}`;
  return awsdate.includes('NaN') ? null : awsdate;
};

const checkDate = (date) => {
  const todayDate = awsdate(new Date());
  const days = getNumberOfDays(date, todayDate);
  return days <= 3;
};

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
  userinsmap.forEach((item) => {
    if (isinMap[item.id]) return;
    let data = insMap[item.id];
    if (!data) data = insMap[item.name];
    if(!data) return;
    isinMap[item.id] = item.id;
    const qty = item.qty;
    const { yhigh, ylow, yhighd, ylowd, prev, price, name } = data;
    totalPrice += qty * price;
    totalPrev += qty * prev;

    if (yhigh && checkDate(yhighd)) yhighList.push({ name, yhigh });
    if (ylow && checkDate(ylowd)) ylowList.push({ name, ylow });

    const diff = calculateDiffPercent(price, prev);
    Math.sign(diff) > 0
      ? gainers.push({ name, diff: Math.abs(diff)})
      : losers.push({ name, diff: Math.abs(diff) });
  });
  gainers = sortDescending(gainers, "diff").slice(0, 3);
  losers = sortDescending(losers, "diff").slice(0, 3);
  return { gainers, losers, yhighList, ylowList, totalPrev, totalPrice };
};

module.exports = {
  instrumentValuation,
  calculateDiffPercent,
  convertTroyOunceToGram,
  getNumberOfDays,
  sortDescending
};
