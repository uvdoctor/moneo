const eodData = require("./eodData");
const apiListData = require("./apiList");
const { commodityAbbr, cryptoAbbr, currencyAbbr, apiToCall } = apiListData;
const { getData, pushData } = eodData;
const table = "EODPrices-bvyjaqmusfh5zelcbeeji6xxoe-dev";
const eodPrice = () => {
  return new Promise(async (resolve, reject) => {
    const eodList = [];
    await Promise.all(
      apiToCall.map(async (element) => {
        index = 0;
        const result = await getData(element, index);
        let { code, close } = await result;

        switch (element.type) {
          case commodityAbbr:
            close = Number((close / 31.1).toFixed(2));
            code = code.slice(0, code.lastIndexOf("."));
            break;
          case cryptoAbbr:
            code = code.slice(0, code.lastIndexOf("-"));
            break;
          default:
            code = code.slice(0, code.lastIndexOf("."));
            break;
        }
        const dataToAdd = {
          __typename: "EODPrices",
          id: code,
          price: close,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        eodList.push({ PutRequest: { Item: dataToAdd } });
      })
    );
    resolve(eodList);
  });
};

exports.handler = async (event) => {
  let data = await eodPrice();
  return await pushData(data, table);
};
