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

const pushData = (mfList) => {
  return new Promise(async (resolve, reject) => {
    const updatedData = [];
    const alreadyAddedData = await graphqlOperation(
      { limit: 100000 },
      "ListInstruments"
    );
    console.log(alreadyAddedData);
    for (result of mfList) {
      console.log(
        alreadyAddedData.body.data.listInstruments.items[0].id === result.id
      );
      const insertedData =
        (await alreadyAddedData.body.data.listInstruments.items.some(
          (item) => item.id === result.id
        ))
          ? await graphqlOperation({ input: result }, "UpdateInstrument")
          : await graphqlOperation({ input: result }, "CreateInstrument");
      console.log(insertedData.body);
      updatedData.push(insertedData);
    }
    resolve(updatedData);
  });
};

module.exports = {
  getType,
  mfType,
  pushData,
};
