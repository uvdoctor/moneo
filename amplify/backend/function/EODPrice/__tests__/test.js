const { getDiamondPrice } = require("../src/eodData");

describe("Test Diamond Price", () => {
  test("Check typeof Diamond Price", async () => {
    const data = await getDiamondPrice(
      "EODPrices-4cf7om4zvjc4xhdn4qk2auzbdm-newdev"
    );
    expect(typeof data.price).toEqual("number");
  });
});
