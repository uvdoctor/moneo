const {
  getType,
  getSubType,
  mfType,
  mCap,
  getName,
} = require("../src/calculate");

describe("Test Asset Type", () => {
  test("Fixed", () => {
    const data = getType({
      "Scheme Name":
        "Nippon India Gilt Securities Fund -Growth Plan - Growth Option",
      "Scheme Type": "Open Ended Schemes(Debt Scheme - Gilt Fund)",
    });
    expect(data).toEqual("F");
  });
  test("Equity", () => {
    const data = getType({
      "Scheme Name": "UTI - NIFTY Index Fund-Growth Option- Direct",
      "Scheme Type": "Open Ended Schemes(Other Scheme - Index Funds)",
    });
    expect(data).toEqual("E");
  });
  test("Alternative", () => {
    const data = getType({
      "Scheme Name": "Aditya Birla Sun Life Gold Fund-Growth",
      "Scheme Type": "Open Ended Schemes(Other Scheme - FoF Domestic)",
    });
    expect(data).toEqual("A");
  });
  test("Hybrid", () => {
    const data = getType({
      "Scheme Name": "IDFC Arbitrage Fund - Plan B - Dividend",
      "Scheme Type": "Open Ended Schemes(Hybrid Scheme - Arbitrage Fund)",
    });
    expect(data).toEqual("H");
  });
});

describe("Test Asset Subtype", () => {
  test("Hybrid Bond", () => {
    const data = getSubType({
      "Scheme Name": "HDFC Hybrid Debt Fund - IDCW Quarterly",
      "Scheme Type":
        "Open Ended Schemes(Hybrid Scheme - Conservative Hybrid Fund)",
    });
    expect(data).toEqual("HB");
  });
  test("Liquid", () => {
    const data = getSubType({
      "Scheme Name": "Aditya Birla Sun Life Liquid Fund - Growth",
      "Scheme Type": "Open Ended Schemes(Debt Scheme - Liquid Fund)",
    });
    expect(data).toEqual("L");
  });
  test("Government Bond", () => {
    const data = getSubType({
      "Scheme Name": "Invesco India Treasury Advantage Fund - Bonus",
      "Scheme Type": "Open Ended Schemes(Debt Scheme - Low Duration Fund)",
    });
    expect(data).toEqual("GB");
  });
  test("Corporate Bond", () => {
    const data = getSubType({
      "Scheme Name": "LIC MF Savings Fund-Direct Plan-Growth",
      "Scheme Type": "Open Ended Schemes(Debt Scheme - Low Duration Fund)",
    });
    expect(data).toEqual("CB");
  });
  test("Index", () => {
    const data = getSubType({
      "Scheme Name": "Axis Nifty 100 Index Fund - Direct Plan - IDCW",
      "Scheme Type": "Open Ended Schemes(Other Scheme - Index Funds)",
    });
    expect(data).toEqual("I");
  });
  test("Interval-Hybrid Bond", () => {
    const data = getSubType({
      "Scheme Name": "IDFC YS Interval Fund - Series II-Regular Plan-Dividend",
      "Scheme Type": "Interval Fund Schemes(Income)",
    });
    expect(data).toEqual("HB");
  });
  test("Stock", () => {
    const data = getSubType({
      "Scheme Name": "Aditya Birla Sun Life Multi-Cap Fund-Regular Growth",
      "Scheme Type": "Open Ended Schemes(Equity Scheme - Multi Cap Fund)",
    });
    expect(data).toEqual("S");
  });
});

describe("Test Mutual Fund Type", () => {
  test("Open Ended", () => {
    const data = mfType("Open Ended Schemes(Other Scheme - Index Funds)");
    expect(data).toEqual("O");
  });
  test("Close Ended", () => {
    const data = mfType("Close Ended Schemes(ELSS)");
    expect(data).toEqual("C");
  });
  test("Interval", () => {
    const data = mfType("Interval Fund Schemes(Income)");
    expect(data).toEqual("I");
  });
});

describe("Test Mutual Cap Size", () => {
  test("Large Cap", () => {
    const data = mCap(
      "Open Ended Schemes(Equity Scheme - Large & Mid Cap Fund)"
    );
    expect(data).toEqual("L");
  });
  test("Mid Cap", () => {
    const data = mCap("Open Ended Schemes(Equity Scheme - Mid Cap Fund)");
    expect(data).toEqual("M");
  });
  test("Small Cap", () => {
    const data = mCap("Open Ended Schemes(Equity Scheme - Small Cap Fund)");
    expect(data).toEqual("S");
  });
});

describe("Test Name", () => {
  test("Hybrid Data", () => {
    const data = getName({
      "Scheme Name": "Axis Regular Saver Fund - Direct Plan - Quarterly",
      "Scheme Type":
        "Open Ended Schemes(Hybrid Scheme - Conservative Hybrid Fund)",
    });
    expect(data).toEqual(
      "Axis Regular Saver Fund - Direct Plan - Quarterly - Conservative Hybrid Fund"
    );
  });
  test("Any", () => {
    const data = getName({
      "Scheme Name": "DSP Banking & PSU Debt Fund - Direct Plan - IDCW",
      "Scheme Type": "Open Ended Schemes(Debt Scheme - Banking and PSU Fund)",
    });
    expect(data).toEqual("DSP Banking & PSU Debt Fund - Direct Plan - IDCW");
  });
});
