const extractDataFromCSV = require("../src/bhavUtils");
const { utility } = require("../../moneoutilslayer/lib/nodejs/utility");

describe("Test Bhavutils", () => {
  const { date, month, yearFull } = utility(3);
  const file = `ind_close_all_${date}${month}${yearFull}`;
  test("File Exists", async () => {
    await expect(extractDataFromCSV(file)).resolves.toStrictEqual([]);
  });

  // test("Empty File", async () => {
  //   calcSchema.mockReturnValueOnce({
  //     exchg: "NSE",
  //     sid: "CG2036",
  //     name: "GOI LOAN 8.33% 2036",
  //     price: "108.65",
  //     id: "IN0020060045",
  //     STATUS: "Listed",
  //   });
  //   await expect(
  //     extractDataFromCSV(
  //       "empty_wdmlist_30052022.csv",

  //     )
  //   ).resolves.toStrictEqual([]);
  // });
});
