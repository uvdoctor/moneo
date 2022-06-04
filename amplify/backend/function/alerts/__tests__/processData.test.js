const { getInstrumentsData } = require("../src/processData");
const {
  getTableNameFromInitialWord,
  batchReadItem
} = require("../../moneoutilslayer/lib/nodejs/databaseUtils");

jest.mock("../../moneoutilslayer/lib/nodejs/databaseUtils");

describe("getInstrumentsData", () => {
  getTableNameFromInitialWord.mockReturnValue("Table");
  batchReadItem.mockReturnValue([
    { id: "GAIL", price: 100 },
    { id: "SAIL", price: 100 },
  ]);

  test("With ids", async () => {
    await expect(
      getInstrumentsData(new Set(["GAIL", "SAIL"]), "Table", {})
    ).resolves.toStrictEqual({
      GAIL: { id: "GAIL", price: 100 },
      SAIL: { id: "SAIL", price: 100 },
    });
  });

  test("With Infomap", async () => {
    await expect(
      getInstrumentsData(new Set(["GAIL", "SAIL"]), "Table", {
        ITC: { id: "ITC", price: 100 },
      })
    ).resolves.toStrictEqual({
      GAIL: { id: "GAIL", price: 100 },
      SAIL: { id: "SAIL", price: 100 },
      ITC: { id: "ITC", price: 100 },
    });
  });
});


