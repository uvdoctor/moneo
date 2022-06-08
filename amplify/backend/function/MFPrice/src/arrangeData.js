const mfData = require("india-mutual-fund-info");
const { utility } = require("/opt/nodejs/utility");
// const { utility } = require("../../moneoutilslayer/lib/nodejs/utility");

const isWeekend = (date) => date.getDay() % 6 == 0;
const getPrevDate = (prev) => {
  let { date, monthChar, yearFull } = utility(prev);
  return new Date(`${date} ${monthChar} ${yearFull}`);
};

let prev = 1;
let mfInfoArray = [];
const getInfo = async () => {
  const prevDate = getPrevDate(prev);
  try {
    mfInfoArray = await mfData.history(prevDate, new Date());
  } catch (error) {
    console.log(error);
  }
  if (
    mfInfoArray.length < 2000 || mfInfoArray.length < 8000 ||
    isWeekend(prevDate)
  ) {
    prev++;
    await getInfo();
  }
  return prev;
};

const arrangeData = async () => {
  const prev = await getInfo();
  const prevDate = getPrevDate(prev);
  const prevInfoMap = {};
  const currInfoArray = [];
  mfInfoArray.forEach((element) => {
    const date = new Date(element["Date"]);
    const id = element["ISIN Div Payout/ISIN Growth"];
    const price = parseFloat(element["Net Asset Value"]);
    if (!id || id.length < 12 || Number.isNaN(price)) return;
    if (date.toDateString() === prevDate.toDateString()) {
      prevInfoMap[id] = parseFloat(price);
    } else if (
      date.toDateString() !== prevDate.toDateString() &&
      !isWeekend(date)
    ) {
      currInfoArray.push(element);
    }
  });
  console.log("CurrInfoArray", currInfoArray.length);
  console.log("PrevInfoMap", Object.keys(prevInfoMap).length);
  return { prevInfoMap, currInfoArray };
};

module.exports = {  arrangeData, getInfo, getPrevDate };
