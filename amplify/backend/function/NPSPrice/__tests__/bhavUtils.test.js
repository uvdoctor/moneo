const getDataFromTxtFile = require("../src/bhavUtils");
const {
  appendGenericFields,
} = require("../../moneoutilslayer/lib/nodejs/utility");
const calc = require("../src/calculate");
jest.mock("../../moneoutilslayer/lib/nodejs/utility");
jest.mock("../src/calculate");

describe("Test Bhavutils", () => {
  test("File Exists", async () => {
    calc.calcPFM.mockReturnValue("HDFC");
    calc.calcST.mockReturnValue("HDFC");
    calc.calcType.mockReturnValue("A");
    calc.calcSubType.mockReturnValue("F");
    appendGenericFields.mockReturnValue({});
    calc.calcRisk.mockReturnValue("C");
    // keep file in tmp/temp folder
    await expect(
      getDataFromTxtFile(`NAV_File_07062022.OUT`, "NPS", {}, false)
    ).resolves.toStrictEqual([
      [
        {
          PutRequest: {
            Item: {},
          },
        },
      ],
    ]);
  });
});
