let { getInfo, arrangeAndPushData } = require("../src/getAndPushData");
const { getFundData, getExchgData } = require("../src/getData");
const { getEODdataByDate } = require("../../moneopricelayer/lib/nodejs/eod");
jest.mock("../src/getAndPushData");
jest.mock("../../moneopricelayer/lib/nodejs/eod");

describe("getFundData", () => {
  getInfo.mockReturnValue([
    {
      "Scheme Code": "119250",
      "Scheme Name": "DSP Top 100 Equity Fund - Direct Plan - Growth",
      "ISIN Div Payout/ISIN Growth": "INF740K01PR3",
      "ISIN Div Reinvestment": "",
      "Net Asset Value": "282.928",
      "Repurchase Price": "",
      "Sale Price": "",
      Date: "03-Jun-2022",
      "AMC Name": "DSP Mutual Fund",
      "Scheme Type": "Open Ended Schemes ( Equity Scheme - Large Cap Fund )",
    },
    {
      "Scheme Code": "119249",
      "Scheme Name": "DSP Top 100 Equity Fund - Direct Plan - IDCW",
      "ISIN Div Payout/ISIN Growth": "INF740K01PS1",
      "ISIN Div Reinvestment": "INF740K01PT9",
      "Net Asset Value": "21.336",
      "Repurchase Price": "",
      "Sale Price": "",
      Date: "03-Jun-2022",
      "AMC Name": "DSP Mutual Fund",
      "Scheme Type": "Open Ended Schemes ( Equity Scheme - Large Cap Fund )",
    },
  ]);
  arrangeAndPushData.mockReturnValue([]);
  test("With data", async () => {
    const data = await getFundData([2021], "table");
    expect(data).toEqual([]);
  });

  test("Without data", async () => {
    getInfo.mockReturnValue(undefined);
    try {
      await getFundData([2021], "table");
    } catch (err) {
      expect(err.toString()).toEqual(
        "TypeError: Cannot read properties of undefined (reading 'forEach')"
      );
    }
  });
});

describe("getExchgData", () => {
  getEODdataByDate.mockReturnValue([]);
  arrangeAndPushData.mockReturnValue([]);
  test("With data", async () => {
    const data = await getExchgData([2021], "table");
    expect(data).toEqual([]);
  });

  test("Without data", async () => {
    getEODdataByDate.mockReturnValue(undefined);
    try {
      await getExchgData([2021], "table");
    } catch (err) {
      expect(err.toString()).toEqual(
        "TypeError: Cannot read properties of undefined (reading 'map')"
      );
    }
  });
});
