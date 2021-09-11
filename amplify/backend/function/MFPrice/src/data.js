const docClient = require("/opt/nodejs/insertIntoDB");

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

const getName = (element) => {
  const type = element["Scheme Type"];
  const name = element["Scheme Name"];
  const hybridText = type.slice(type.indexOf("-"));
  if (type.includes("Hybrid")) return `${name}${hybridText}`;
  return name;
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
  pushData,
  directISIN,
  getDirISIN,
  mCap,
  getName,
};
