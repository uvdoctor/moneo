const axios = require("axios");

const getData = async (url, table) => {
  let batches = [];
  let count = 0;
  let batchRecords = [];

  try {
    const { data } = await axios.get(url);
    data.RealTime.map((item) => {
      const schema = {
        id: item.INDX_CD,
        name: item.IndexName,
        price: item.Prev_Close,
        yhigh: Math.round(item.Week52High * 100) / 100,
        ylow: Math.round(item.Week52Low * 100) / 100,
        curr: "INR",
        __typename: table.slice(0, table.indexOf("-")),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      // const dataToPush = JSON.parse(JSON.stringify(schema));
      batches.push({ PutRequest: { Item: schema } });
      count++;
      if (count === 25) {
        batchRecords.push(batches);
        batches = [];
        count = 0;
      }
    });

    if (count < 25 && count > 0) {
      batchRecords.push(batches);
    }
    return batchRecords;
  } catch (err) {
    throw new Error(err.toString());
  }
};

module.exports = getData;
