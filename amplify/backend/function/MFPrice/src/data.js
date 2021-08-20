const graphqlOperation = require("./operation");
const nextToken =
  "eyJ2ZXJzaW9uIjoyLCJ0b2tlbiI6IkFRSUNBSGg5OUIvN3BjWU41eE96NDZJMW5GeGM4WUNGeG1acmFOMUpqajZLWkFDQ25BRWh2MVBOOGRmSWFDNktkaUJUV3Q1cUFBQUIvekNDQWZzR0NTcUdTSWIzRFFFSEJxQ0NBZXd3Z2dIb0FnRUFNSUlCNFFZSktvWklodmNOQVFjQk1CNEdDV0NHU0FGbEF3UUJMakFSQkF4TDgzZkhVU1ptWmtjdHBhNENBUkNBZ2dHeStxVmFPQ25NUWU2d1E1U0RpZmFhWFRmQUFqRG9GU1JkZ0t3a3dhM0x6VzcrWm4vNDF0KzlXNkFtUVB6RXUwUHFWSTNVaElTT1Z4NkJHUXFxL1hxblJtdUpadGd4MjFSVzhyM0JGNWVPRFIyN09LZzE1TDZJQzJTc0FzSS9TejNIb2owN0dLUmZlNUpzeThOQVI2emxUdnFuRlhKcUxGZUZEendxY2c0NE9RVVRNOXJCbFdhTk5UU1RwRkl6dlZ2c2JuL2pSWkhPZXd3Q1RSdC9nRTVxWjkyd2kxd24vd0hFWS9uMDlmUGQ3SGhiTCtqT3d6M2N0Mm11b3loYS9kY01Ba2NIaWlPRHd6V1FnT1FMZ24wTkhGeWtqZzg3ZmxYUHBUbUg5bDA1aEc5dGQ1RGpTaTNmT1pESGFIWTZqRGdxRXBlOEdSTkdyY2VURlpES093dzhPQmM0Q3RBUURGQlpvUVZ4VFBRWFAxVSsyWk9YKzhLd3RaNUNocDNEVkZkT2xXMVhIb0xoZmFQbTJ2TWw4TldGSVI0T1lzY2p0SGtkbUJBeHlKK0RaemQ2aTFsbXpnK1JmV09SQnNXWEdGckFlSFdidzJYTmFlY2ZWOU5SQUN5QlJjT2ZERjB3N0hCVy9sbm15emtQMmREaDlWdVc5RGl2RER1d1Y3VUdsYU1ubysyWVc3OWRwRGhRdjIvaHdxN3FHUEpqbnpDM0xWbkwvOVdTQzI1VklmQzdNMUtGV0xYZERKL3lFdEtsUVFYM2duOD0ifQ==";

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
      // let alreadyAddedData = [];
      // const getAlreadyAddedData = await graphqlOperation
      // );
      // const data = await graphqlOperation(
      //   { limit: 100000, nextToken: nextToken },
      //   "ListInstruments"
      // );
      // alreadyAddedData = [...getAlreadyAddedData.body.data.listInstruments.items, ...data.body.data.listInstruments.items];
      // console.log(alreadyAddedData);
      // console.log(alreadyAddedData.length);

      // const alreadyAddedData = await graphqlOperation(
      //   { limit: 100000, nextToken: },
      //   "ListInstruments"
      // );
      // console.log(alreadyAddedData.body.data.listInstruments);
      for (let i = 0; i < mfList.length; i++) {
        // const insertedData =
        //   (alreadyAddedData.body.data.listInstruments.items.some(
        //     (item) => item.id === mfList[i].id
        //   ))
        //     ? await graphqlOperation({ input: mfList[i] }, "UpdateInstrument")
        //     : await graphqlOperation({ input: mfList[i] }, "CreateInstrument");
        // console.log(insertedData.body);
        // updatedData.push(insertedData);
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
