const docClient = require("/opt/nodejs/insertIntoDB");
const getAssetType = (data) => {
  if (data.includes("Hybrid")) return "H";
  if (
    data.includes("Debt") ||
    data.includes("Income") ||
    data.includes("Solution") ||
    data.includes("Gilt") ||
    data.includes("Index")
  )
    return "F";
  if (data.includes("Other")) return "A";
  return "E";
};

const getAssetSubType = (element) => {
  const sType = element["Scheme Type"];
  const sName = element["Scheme Name"];
  if (
    sType.includes("Debt Scheme") &&
    (sType.includes("Liquid") ||
      sType.includes("Money Market") ||
      sType.includes("Overnight"))
  )
    return "L";
  if (
    sType.includes("Debt Scheme") &&
    (sName.includes("Government") ||
      sName.includes("Treasury") ||
      sName.includes("Gilt") ||
      sName.includes("GILT"))
  )
    return "GB";
  if (sType.includes("Debt Scheme")) return "CB";
  if (sType.includes("Index")) return "I";
  if (sType.includes("Gilt")) return "GB";
  if (
    (sType.includes("Close") || sType.includes("Interval")) &&
    sType.includes("Income")
  )
    return "HB";
  return "S";
};

const mfType = (data) => {
  if (data.includes("Open")) return "O";
  if (data.includes("Close")) return "C";
  if (data.includes("Interval")) return "I";
};

// direct ISIN as per comparison to Regular
const directISIN = (mfInfoArray) => {
  const regularData = [];
  const directData = [];
  mfInfoArray.map((item) => {
    let name = item["Scheme Name"].toLowerCase().replace(/\s/g, "");
    const ISIN =
      item["ISIN Div Payout/ ISIN Growth"] != "-"
        ? item["ISIN Div Payout/ ISIN Growth"]
        : item["ISIN Div Reinvestment"];
    if (name.includes("regular")) {
      regularData.push(name);
    } else if (name.includes("direct")) {
      name = name.replace("direct", "regular");
      directData.push({ ISIN, name });
    }
  });
  return { regularData, directData };
};

const getDirISIN = (regularData, directData, element) => {
  let name = element["Scheme Name"].toLowerCase().replace(/\s/g, "");
  const checkRegular = regularData.some((item) => item === name);
  if (!checkRegular) {
    return null;
  }
  let compareRegAndDir = directData.find((item) => name.includes(item.name));
  if (!compareRegAndDir) {
    name = name.substring(0, name.indexOf("regular") + "regular".length);
    compareRegAndDir = directData.find((item) => name.includes(item.name));
    if (!compareRegAndDir) {
      return null;
    }
  }
  return compareRegAndDir.ISIN;
};

const mCap = (element) => {
  const type = element["Scheme Type"].toLowerCase();
  if (type.includes("equity") && type.includes("large")) return "L";
  if (type.includes("equity") && type.includes("mid")) return "M";
  if (type.includes("equity") && type.includes("small")) return "S";
  if (type.includes("equity")) return "H";
  return null;
};

const pushData = async (data, table, index) => {
  return new Promise(async (resolve, reject) => {
    const params = {
      RequestItems: {
        [table]: data,
      },
    };
    try {
      const updateRecord = await docClient.batchWrite(params).promise();
      resolve(updateRecord);
    } catch (error) {
      reject(`Error in dynamoDB: ${JSON.stringify(error)}, ${index}`);
    }
  });
};

module.exports = {
  getAssetType,
  mfType,
  pushData,
  getAssetSubType,
  directISIN,
  getDirISIN,
  mCap,
};
