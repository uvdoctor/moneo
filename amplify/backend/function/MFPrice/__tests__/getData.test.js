let { getData } = require('../src/getData')
let { arrangeData, getPrevDate } = require('../src/arrangeData')
const {
  getTableNameFromInitialWord,
  pushData,
  pushDataForFeed,
} = require("../../moneoutilslayer/lib/nodejs/databaseUtils");
const {
 appendGenericFields, utility
} = require("../../moneoutilslayer/lib/nodejs/utility");
const mfData = require("india-mutual-fund-info");
const {
  getType,
  getSubType,
  mfType,
  mcap,
  getName,
  calculateRisk,
  directISIN, getDirISIN
} = require("../src/calculate");
const table = "INMFPrice";

jest.mock("../../moneoutilslayer/lib/nodejs/databaseUtils");
jest.mock("../../moneoutilslayer/lib/nodejs/utility");
jest.mock('../src/calculate');
jest.mock('../src/arrangeData');

describe("getData", () => {
  getTableNameFromInitialWord.mockReturnValue({});
  appendGenericFields.mockReturnValue({});
  directISIN.mockReturnValue({ regularData: {}, directData: {} })
  arrangeData.mockReturnValue({  currInfoArray: [], prevMapInfo: {} })
  pushData.mockReturnValue(true);
  pushDataForFeed.mockReturnValue(true);
  test("should resolve", async () => {
    const data = await getData();
    expect(data).toEqual([]);
  });

  test("should throw error", async () => {
    try {
      await getData();
    } catch (e) {
      expect(e.toString()).toMatch(
        "TypeError: Cannot destructure property 'data' of '(intermediate value)' as it is undefined."
      );
    }
  });
});

