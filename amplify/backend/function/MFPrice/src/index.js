const graphqlOperation = require("./operation");
const mfData = require("india-mutual-fund-info");

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
      console.log(insertedData.body);
      resolve(insertedData);
    }
  });
};

const getData = () => {
  return new Promise(async (resolve, reject) => {
    const mfInfoArray = await mfData.today();
    const mfList = [];
    await Promise.all(
      mfInfoArray.map(async (element) => {
        mfList.push({
          id: element["ISIN Div Payout/ ISIN Growth"],
          sid: element["Scheme Code"],
          tid: element["ISIN Div Reinvestment"],
          name: element["Scheme Name"],
          country: "IN",
          curr: "INR",
          type: getType(element),
          subt: "M",
          price: element["Net Asset Value"],
          mftype: mfType(element),
        });
      })
    );
    resolve(mfList);
  });
};

exports.handler = async (event) => {
  const data = await getData();
  return await pushData(data);
};
