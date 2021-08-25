const mfData = require("india-mutual-fund-info");
const dataInfo = require("./data");
const {
  getDirISIN,
  directISIN,
  getAssetSubType,
  getAssetType,
  mfType,
  pushData,
  mCap,
} = dataInfo;

const getData = () => {
  return new Promise(async (resolve, reject) => {
    const mfInfoArray = await mfData.today();
    const regdirData = directISIN(mfInfoArray);
    const { regularData, directData } = regdirData;
    const mfList = [];
    mfInfoArray.map((element) => {
      const tidToCompare = element["ISIN Div Reinvestment"];
      const idToCompare = element["ISIN Div Payout/ ISIN Growth"];
      const id = idToCompare === "-" ? tidToCompare : idToCompare;
      const tid = idToCompare === "-" ? idToCompare : tidToCompare;

      if (id === "-" && tid === "-") {
        return;
      }
      const dataToAdd = {
        id: id,
        sid: element["Scheme Code"],
        tid: tid,
        dir: getDirISIN(regularData, directData, element),
        name: element["Scheme Name"],
        type: getAssetType(element["Scheme Type"]),
        subt: getAssetSubType(element),
        price: parseFloat(element["Net Asset Value"]),
        mftype: mfType(element["Scheme Type"]),
        mcap: mCap(element),
        tf: element["Scheme Name"].includes("Tax") ? "Y" : "N",
      };

      Object.keys(dataToAdd).forEach((key) => {
        if (dataToAdd[key] === false) {
          delete dataToAdd[key];
        }
      });
      mfList.push(dataToAdd);
    });
    resolve(mfList);
  });
};

exports.handler = async (event) => {
  const data = await getData();
  return await pushData(data);
};
