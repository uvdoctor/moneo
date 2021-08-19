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
    try {
      const updatedData = [];
      const alreadyAddedData = await graphqlOperation(
        { limit: 100000 },
        "ListInstruments"
      );
      for (i in mfList) {
        const insertedData =
          (await alreadyAddedData.body.data.listInstruments.items.some(
            (item) => item.id === mfList[i].id
          ))
            ? await graphqlOperation({ input: mfList[i] }, "UpdateInstrument")
            : await graphqlOperation({ input: mfList[i] }, "CreateInstrument");

        console.log(insertedData.body);
        updatedData.push(insertedData);
      }
      resolve(updatedData);
    } catch (err) {
      console.log(err);
      reject(err);
    }
  });
};

module.exports = {
  getType,
  mfType,
  pushData,
};
