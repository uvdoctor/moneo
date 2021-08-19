const mfData = require("india-mutual-fund-info");
const dataInfo = require("./data");
const { getType, mfType, pushData } = dataInfo;
const getData = () => {
  return new Promise(async (resolve, reject) => {
    const mfInfoArray = await mfData.today();
    const mfList = [];
    await Promise.all(
      mfInfoArray.map(async (element) => {
        mfList.push({
          id: element["ISIN Div Payout/ ISIN Growth"],
          sid: element["Scheme Code"],
          tid: element["ISIN Div Reinvestment"],
          name: element["Scheme Name"],
          country: "IN",
          curr: "INR",
          type: getType(element),
          subt: "M",
          price: element["Net Asset Value"],
          mftype: mfType(element),
        });
      })
    );
    resolve(mfList);
  });
};

exports.handler = async (event) => {
  const data = await getData();
  return await pushData(data);
};
