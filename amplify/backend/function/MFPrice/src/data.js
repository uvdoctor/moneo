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

const pushData = (data) => {
  return new Promise(async (resolve, reject) => {
    const alreadyAddedData = await graphqlOperation(
      { limit: 10000 },
      "ListInstruments"
    );
    for (let i = 0; i < data.length; i++) {
      const insertedData =
        alreadyAddedData.body.data.listInstruments.items.some(
          (item) => item.id === data[i].id
        )
          ? await graphqlOperation({ input: data[i] }, "UpdateInstrument")
          : await graphqlOperation({ input: data[i] }, "CreateInstrument");
    //   console.log(insertedData.body);
      resolve(insertedData);
    }
  });
};

module.exports = {
  getType,
  mfType,
  pushData,
};
