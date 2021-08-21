const mfData = require("india-mutual-fund-info");
const dataInfo = require("./data");
const { getAssetType, mfType, pushData } = dataInfo;

const getData = () => {
  return new Promise(async (resolve, reject) => {
    const mfInfoArray = await mfData.today();
    const mfList = [];
    mfInfoArray.map((element) => {
      const tidToCompare = element["ISIN Div Reinvestment"];
      const idToCompare = element["ISIN Div Payout/ ISIN Growth"];
      const id = idToCompare === "-" ? tidToCompare : idToCompare;
      const tid = idToCompare === "-" ? idToCompare : tidToCompare;

      if (id === "-" && tid === "-") {
        return;
      }
      mfList.push({
        id: id,
        sid: element["Scheme Code"],
        tid: tid,
        name: element["Scheme Name"],
        type: getAssetType(element["Scheme Type"]),
        subt: "M",
        // subt: getAssetSubType(element["Scheme Type"]),
        nav: parseFloat(element["Net Asset Value"]),
        mftype: mfType(element["Scheme Type"]),
        // mcap: MCap,
        tf: element["Scheme Name"].includes("Tax") ? "Y" : "N",
      });
    });
    resolve(mfList);
  });
};

exports.handler = async (event) => {
  const data = await getData();
  return await pushData(data);
};
