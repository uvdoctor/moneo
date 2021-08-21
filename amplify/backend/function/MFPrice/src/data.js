const graphqlOperation = require("./operation");

const getAssetType = (data) => {
  switch (true) {
    case data.includes("Equity"):
      return (subt = "E");
    case data.includes("Debt"):
      return (subt = "F");
    case data.includes("Hybrid"):
      return (subt = "H");
    case data.includes("ELSS"):
      return (subt = "E");
    case data.includes("Income"):
      return (subt = "F");
    case data.includes("Growth"):
      return (subt = "E");
    case data.includes("Other"):
      return (subt = "A");
    case data.includes("Floating"):
      return (subt = "F");
    case data.includes("Gilt"):
      return (subt = "F");
    case data.includes("Money Market"):
      return (subt = "F");
    case data.includes("Solution"):
      return (subt = "H");
  }
};

const mfType = (data) => {
  switch (true) {
    case data.includes("Open"):
      return (mftype = "O");
    case data.includes("Close"):
      return (mftype = "C");
    case data.includes("Interval"):
      return (mftype = "I");
  }
};

const getDataFromListInstruments = async () => {
  const getDataAtOnce = await graphqlOperation(
    {
      limit: 100000,
      // filter: { subt: { eq: "M" } } },
    },
    "ListInmf"
  );

  let dataAlreadyAdded = [...getDataAtOnce.body.data.listInmf.items];
  let token = getDataAtOnce.body.data.listInmf.nextToken;

  const dataByToken = async (token) =>
    await graphqlOperation({ limit: 100000, nextToken: token }, "ListInmf");

  const checkToken = async () => {
    const getDataFromToken = await dataByToken(token);
    token = getDataFromToken.body.data.listInmf.nextToken;
    dataAlreadyAdded = dataAlreadyAdded.concat(
      getDataFromToken.body.data.listInmf.items
    );

    if (!token) {
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
        if (checkData) {
          insertedData = await graphqlOperation(
            { input: mfList[i] },
            "UpdateInmf"
          );
          console.log(insertedData.body);
          updatedData.push(insertedData.body);
          break;
        }
      }
      if (!checkData) {
        insertedData = await graphqlOperation(
          { input: mfList[i] },
          "CreateInmf"
        );
        updatedData.push(insertedData.body);
        console.log(insertedData.body);
      }
    }
    resolve(updatedData);
  });
};

module.exports = {
  getAssetType,
  mfType,
  pushData,
};
