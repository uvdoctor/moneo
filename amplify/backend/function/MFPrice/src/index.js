const mfdata = require("india-mutual-fund-info");
const  graphqlOperation = require("./operation");

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

const subType = () => {
  switch (true) {
    case element["Scheme Type"].includes("Open"):
      return (stype = "O");
    case element["Scheme Type"].includes("Close"):
      return (stype = "C");
    case element["Scheme Type"].includes("Interval"):
      return (stype = "I");
  }
};

const getData = () => {
  return new Promise(async (resolve, reject) => {
    const mfInfoArray = await mfdata.today();
    await Promise.all(
      mfInfoArray.map(async (element) => {
        const mfList = {
          id: element["ISIN Div Payout/ ISIN Growth"],
          sid: element["Scheme Code"],
          stype: subType(),
          tid: element["ISIN Div Reinvestment"],
          price: element["Net Asset Value"],
          name: element["Scheme Name"],
        //   amc: element["AMC Name"],
        id: String!
	sid: String
	tid: String
	name: String!
	exchg: String
	country: String!
	curr: String!
	type: InsType!
	subt: InsSubType!
	price: Float!
	prev: Float
	sm: Int
	sy: Int
	mm: Int
	my: Int
	rate: Float
	mftype: MFSchemeType
          country: "INR",
          curr: "INR",
          type: getType(element),
          mfType : element["Scheme Type"]
        };
        // console.log(mfList);
        // const alreadyInsertedData = await graphqlOperation(
        //     { Limit: 10000 },
        //     "ListEodPricess"
        //   );
        
        //   const insertedData =
        //     await alreadyInsertedData.body.data.listEODPricess.items.some(
        //       async (result) => {
        //         return await graphqlOperation(
        //           { id: code, price: close, name: code },
        //           result.id === code ? "UpdateEodPrices" : "CreateEodPrices"
        //         );
        //       }
        //     );
        
        //   console.log("Operation result:", insertedData.body);
        //   return insertedData;
        // };
      })
    );
  });
};
// getData();
export async function handler(event) {
  let data = await getData();
  return data;
}



