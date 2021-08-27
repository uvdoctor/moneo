const graphqlOperation = require("./operation");

const getAssetType = (data) => {
  switch (true) {
    case data.includes("Equity"):
    case data.includes("ELSS"):
    case data.includes("Growth"):
      return "E";
    case data.includes("Debt"):
    case data.includes("Income"):
    case data.includes("Solution"):
    case data.includes("Gilt"):
    case data.includes("Index"):
      return "F";
    case data.includes("Hybrid"):
      return "H";
    case data.includes("Other"):
      return "A";
  }
};

const getAssetSubType = (element) => {
  const sType = element["Scheme Type"];
  const sName = element["Scheme Name"];
  if (sType.includes("Debt Scheme")) {
    if (
      sType.includes("Liquid") ||
      sType.includes("Money Market") ||
      sType.includes("Overnight")
    ) {
      return "L";
    } else if (
      sName.includes("Government") ||
      sName.includes("Treasury") ||
      sName.includes("Gilt") ||
      sName.includes("GILT")
    ) {
      return "GB";
    } else {
      return "CB";
    }
  } else if (sType.includes("Index")) {
    return "I";
  } else {
    return "S";
  }
};

const mfType = (data) => {
  switch (true) {
    case data.includes("Open"):
      return "O";
    case data.includes("Close"):
      return "C";
    case data.includes("Interval"):
      return "I";
  }
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
    return false;
  }
  let compareRegAndDir = directData.find((item) => name.includes(item.name));
  if (!compareRegAndDir) {
    name = name.substring(0, name.indexOf("regular") + "regular".length);
    compareRegAndDir = directData.find((item) => name.includes(item.name));
    if (!compareRegAndDir) {
      return false;
    }
  }
  return compareRegAndDir.ISIN;
};

const mCap = (element) => {
  const type = element["Scheme Type"].toLowerCase();
  if (type.includes("equity")) {
    if (type.includes("large")) {
      return "L";
    } else if (type.includes("mid")) {
      return "M";
    } else if (type.includes("small")) {
      return "S";
    } else {
      return "H";
    }
  } else {
    return false;
  }
};

const executeMutation = async (mutation, input) => {
  return await graphqlOperation({ input: input }, mutation);
};

const pushData = (data) => {
  let instrumentData = { updatedIDs: [], errorIDs: [] };
  return new Promise(async (resolve, reject) => {
    for (let i = 0; i < data.length; i++) {
      try {
        const updatedData = await executeMutation("UpdateInmf", data[i]);
        if (!updatedData.body.data.updateINMF) {
          await executeMutation("CreateInmf", data[i]);
        }
        // console.log(updatedData.body.data);
        updatedData.body.errors
          ? instrumentData.errorIDs.push({
              id: data[i].id,
              error: updatedData.body.errors,
            })
          : instrumentData.updatedIDs.push(data[i]);
      } catch (err) {
        console.log(err);
      }
    }
    console.log(instrumentData);
    resolve(instrumentData);
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
