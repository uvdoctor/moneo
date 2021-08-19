const mfdata = require("india-mutual-fund-info");
const graphqlOperation = require("./operation");

const getType = (element) => {
  switch (true) {
    case element["Scheme Type"].includes("Equity"):
      return (type = "E");
    case element["Scheme Type"].includes("Debt"):
      return (type = "F");
    case element["Scheme Type"].includes("Hybrid"):
      return (type = "H");
    case element["Scheme Type"].includes("ELSS"):
      return (type = "E");
    case element["Scheme Type"].includes("Income"):
      return (type = "F");
    case element["Scheme Type"].includes("Growth"):
      return (type = "E");
    case element["Scheme Type"].includes("Other"):
      return (type = "A");
  }
};

const subType = (element) => {
  switch (true) {
    case element["Scheme Type"].includes("Open"):
      return (stype = "O");
    case element["Scheme Type"].includes("Close"):
      return (stype = "C");
    case element["Scheme Type"].includes("Interval"):
      return (stype = "I");
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
    const mfInfoArray = await mfdata.today();
    const mfList = [];
    mfInfoArray.map(async (element) => {
      mfList.push({
        id: element["ISIN Div Payout/ ISIN Growth"],
        sid: element["Scheme Code"],
        tid: element["ISIN Div Reinvestment"],
        name: element["Scheme Name"],
        country: "IN",
        curr: "INR",
        type: "M",
        subt: getType(element),
        price: element["Net Asset Value"],
        mfType: subType(element),
      });
    });
    resolve(mfList);
  });
};

export async function handler(event) {
  let data = await getData();
  return await pushData(data);
}
