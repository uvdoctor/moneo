const graphqlOperation = require("./operation");

const getType = (element) => {
  switch (true) {
    case element["Scheme Type"].includes("Equity"):
      return (subt = "E");
    case element["Scheme Type"].includes("Debt"):
      return (subt = "F");
    case element["Scheme Type"].includes("Hybrid"):
      return (subt = "H");
    case element["Scheme Type"].includes("ELSS"):
      return (subt = "E");
    case element["Scheme Type"].includes("Income"):
      return (subt = "F");
    case element["Scheme Type"].includes("Growth"):
      return (subt = "E");
    case element["Scheme Type"].includes("Other"):
      return (subt = "A");
    case element["Scheme Type"].includes("Floating"):
      return (subt = "F");
    case element["Scheme Type"].includes("Gilt"):
      return (subt = "F");
    case element["Scheme Type"].includes("Money Market"):
      return (subt = "F");
    case element["Scheme Type"].includes("Solution"):
      return (subt = "H");
  }
};

const mfType = (element) => {
  switch (true) {
    case element["Scheme Type"].includes("Open"):
      return (mftype = "O");
    case element["Scheme Type"].includes("Close"):
      return (mftype = "C");
    case element["Scheme Type"].includes("Interval"):
      return (mftype = "I");
  }
};

const getDataFromListInstruments = async () => {
  const getDataAtOnce = await graphqlOperation(
    { limit: 100000 },
    "ListInstruments"
  );

  let dataAlreadyAdded = [...getDataAtOnce.body.data.listInstruments.items];
  let token = getDataAtOnce.body.data.listInstruments.nextToken;

  const dataByToken = async (token) =>
    await graphqlOperation(
      { limit: 100000, nextToken: token },
      "ListInstruments"
    );

  const checkToken = async () => {
    const getDataFromToken = await dataByToken(token);
    token = getDataFromToken.body.data.listInstruments.nextToken;
    dataAlreadyAdded = dataAlreadyAdded.concat(
      getDataFromToken.body.data.listInstruments.items
    );

    if (token === null) {
      return dataAlreadyAdded;
    } else {
      await checkToken();
    }
  };

  await checkToken();
  return dataAlreadyAdded;
};

const pushData = (mfList) => {
  return new Promise(async (resolve, reject) => {
    const updatedData = [];
    const getInstrumentsArray = await getDataFromListInstruments();

    const getSubDividedArray = new Array(
      Math.ceil(getInstrumentsArray.length / 1000)
    )
      .fill()
      .map((_) => getInstrumentsArray.splice(0, 1000));

    for (let i = 0; i < mfList.length; i++) {
      let checkData = "";
      let insertedData = {};
      for (index in getSubDividedArray) {
        checkData = getSubDividedArray[index].some(
          (item) => item.id === mfList[i].id
        );
        if (checkData === true) {
          insertedData = await graphqlOperation(
            { input: mfList[i] },
            "UpdateInstrument"
          );
          // console.log(insertedData.body);
          updatedData.push(insertedData.body);
          break;
        }
      }
      if (checkData != true) {
        insertedData = await graphqlOperation(
          { input: mfList[i] },
          "CreateInstrument"
        );
        updatedData.push(insertedData.body);
        // console.log(insertedData.body);
      }
    }
    resolve(updatedData);
  });
};

module.exports = {
  getType,
  mfType,
  pushData,
};
