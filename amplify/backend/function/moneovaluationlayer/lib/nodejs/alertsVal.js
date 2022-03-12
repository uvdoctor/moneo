const calculateDiffPercent = (curr, prev) => (100 * (curr - prev)) / prev;
const checkDateEquality = (date) =>
  new Date().toDateString() === new Date(date).toDateString();

const getInstrumentsValuation = (infoMap) => {
  const valuationMap = {};
  Object.keys(infoMap).map((id) => {
    const info = {};
    const data = infoMap[id];
    const { yhigh, ylow, yhighd, ylowd, prev, price, name } = data;
    if (data["yhigh"]) {
      if (checkDateEquality(yhighd)) info["yhigh"] = yhigh;
      if (checkDateEquality(ylowd)) info["ylow"] = ylow;
    }
    const diff = calculateDiffPercent(price, prev);
    if (Math.abs(diff) > 3) {
      Math.sign(diff) > 0 ? (info["gainers"] = diff) : (info["losers"] = diff);
    }
    if (Object.keys(info).length) {
      valuationMap[id] = { name: name, ...info };
    }
  });
  return valuationMap;
};

module.exports = { getInstrumentsValuation };
