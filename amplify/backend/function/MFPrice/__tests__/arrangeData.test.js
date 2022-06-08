const { arrangeData } = require('../src/arrangeData')

describe("getInfo", () => {
  test("Data Length", async () => {
    const data = await arrangeData();
    expect(data.currInfoArray.length > 2000).toEqual(true);
    expect(Object.keys(data.prevInfoMap).length > 2000).toEqual(true);
  });
});
