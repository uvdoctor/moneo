const { getDiamondPrice } = require("../src/eodData");

describe("Test Diamond Price", () => {
  test("Diamond Price", async () => {
    const data = await getDiamondPrice([],"EODPrices-4cf7om4zvjc4xhdn4qk2auzbdm-newdev")
    expect(data).toEqual("5000");
  });
})