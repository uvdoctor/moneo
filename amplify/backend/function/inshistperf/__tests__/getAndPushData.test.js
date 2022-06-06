const { getAndPushData, arrangeAndPushData } = require("../src/getAndPushData");
const { getExchgData, getFundData } = require('../src/getData')
const {
  divideArrayBySize,
  appendGenericFields,
} = require("../../moneoutilslayer/lib/nodejs/utility");
const {
  getTableNameFromInitialWord,
  pushData,
  pushDataForFeed,
} = require("../../moneoutilslayer/lib/nodejs/databaseUtils");
jest.mock("../../moneoutilslayer/lib/nodejs/databaseUtils");
jest.mock("../../moneoutilslayer/lib/nodejs/utility");
jest.mock('../src/getData');

describe("arrangeAndPushData", () => {
  appendGenericFields.mockReturnValue({});
  divideArrayBySize.mockReturnValue([[], []]);
  pushDataForFeed.mockReturnValue(true);
  pushData.mockReturnValue(true);
  test("", async () => {
    await arrangeAndPushData(
      ["GAIL"],
      [{ id: "GAIL", price: 100 }],
      [{ id: "GAIL", price: 100 }],
      [{ id: "GAIL", price: 100 }],
      "tableName",
      "type"
    );
    expect(divideArrayBySize).toHaveBeenCalled();
    expect(pushDataForFeed).toHaveBeenCalled();
    expect(pushData).toHaveBeenCalled();
  });
});

describe("getAndPushData", () => {
  getTableNameFromInitialWord.mockReturnValue({});
  getExchgData.mockReturnValue(true);
  getFundData.mockReturnValue(true);
  test("should resolve", async () => {
    const data = await getAndPushData();
    expect(data).toBe();
  });

  test("should throw error", async () => {
    getExchgData.mockReturnValue(false);
    try {
      await getAndPushData();
    } catch (e) {
      expect(e.toString()).toMatch(
        "TypeError: Cannot destructure property 'data' of '(intermediate value)' as it is undefined."
      );
    }
  });
});




