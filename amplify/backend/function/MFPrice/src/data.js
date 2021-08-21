const { registerGeometry } = require("bizcharts");
const { isTryStatement } = require("typescript");
const graphqlOperation = require("./operation");

const getAssetType = (data) => {
  switch (true) {
    case data.includes("Equity"):
      return "E";
    case data.includes("Debt"):
      return "F";
    case data.includes("Hybrid"):
      return "H";
    case data.includes("ELSS"):
      return "E";
    case data.includes("Income"):
      return "F";
    case data.includes("Growth"):
      return "E";
    case data.includes("Other"):
      return "A";
    case data.includes("Solution"):
      return "F";
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
    let name = item["Scheme Name"].toLowerCase();
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
  const name = element["Scheme Name"].toLowerCase();
  const checkRegular = regularData.some((item) => item === name);
  if (!checkRegular) {
    return false;
  }
  const compareRegAndDir = directData.some((item) => {
    if (item.name === name) {
      return item.ISIN;
    }
    
  });
  // console.log(compareRegAndDir);
  return compareRegAndDir;
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

const getDataFromListInmfs = async () => {
  // const getDataAtOnce = await graphqlOperation({ limit: 100000 }, "ListInmfs");
  // let dataAlreadyAdded = [...getDataAtOnce.body.data.listInmfs.items];
  // let token = getDataAtOnce.body.data.listInmfs.nextToken;
  // const dataByToken = async (token) =>
  //   await graphqlOperation({ limit: 100000, nextToken: token }, "ListInmfs");
  // const checkToken = async () => {
  //   const getDataFromToken = await dataByToken(token);
  //   token = getDataFromToken.body.data.listInmfs.nextToken;
  //   dataAlreadyAdded = dataAlreadyAdded.concat(
  //     getDataFromToken.body.data.listInmfs.items
  //   );
  //   if (!token) {
  //     return dataAlreadyAdded;
  //   } else {
  //     await checkToken();
  //   }
  // };
  // await checkToken();
  // return dataAlreadyAdded;
};

const pushData = (mfList) => {
  return new Promise(async (resolve, reject) => {
    // const updatedData = [];
    // const getInstrumentsArray = await getDataFromListInmfs();
    // const getSubDividedArray = new Array(
    //   Math.ceil(getInstrumentsArray.length / 1000)
    // )
    //   .fill()
    //   .map((_) => getInstrumentsArray.splice(0, 1000));
    // for (let i = 0; i < mfList.length; i++) {
    //   let checkData = "";
    //   let insertedData = {};
    //   for (index in getSubDividedArray) {
    //     checkData = getSubDividedArray[index].some(
    //       (item) => item.id === mfList[i].id
    //     );
    //     if (checkData) {
    //       insertedData = await graphqlOperation(
    //         { input: mfList[i] },
    //         "UpdateInmf"
    //       );
    //       console.log(insertedData.body);
    //       updatedData.push(insertedData.body);
    //       break;
    //     }
    //   }
    //   if (!checkData) {
    //     insertedData = await graphqlOperation(
    //       { input: mfList[i] },
    //       "CreateInmf"
    //     );
    //     updatedData.push(insertedData.body);
    //     console.log(insertedData.body);
    //   }
    // }
    // resolve(updatedData);
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
