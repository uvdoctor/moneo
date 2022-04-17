const watchlistValuation = (insMap, userwatchMap) => {
  let buy = [];
  let sell = [];
  userwatchMap.forEach((item) => {
    let data = insMap[item.id];
    if (!data) return;
    const { price, name } = data;
    if (item.hight && price >= item.hight) sell.push({ name });
    if (item.lowt &&  price <= item.lowt) buy.push({ name });
  });
  return { buy, sell };
};

module.exports = { watchlistValuation };
