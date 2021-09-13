const calc = require("../src/calculate");

describe("Test PFM Initial Letter", () => {
  test("Any", () => {
    const data = calc.calcPFM(
      "ADITYA BIRLA SUNLIFE PENSION FUND SCHEME C - TIER II"
    );
    expect(data).toEqual("A");
  });
});

describe("Test PFM Scheme Type", () => {
  test("Tier I", () => {
    const data = calc.calcST(
      "HDFC PENSION MANAGEMENT COMPANY LIMITED SCHEME E - TIER I"
    );
    expect(data).toEqual("T1");
  });
  test("Tier II", () => {
    const data = calc.calcST(
      "ICICI PRUDENTIAL PENSION FUND SCHEME A - TIER II"
    );
    expect(data).toEqual("T2");
  });
  test("LITE", () => {
    const data = calc.calcST(
      "NPS TRUST A/C-KOTAK MAHINDRA PENSION FUND LIMITED- NPS LITE SCHEME - GOVT. PATTERN"
    );
    expect(data).toEqual("Lite");
  });
  test("APY", () => {
    const data = calc.calcST(
      "NPS TRUST - A/C LIC PENSION FUND SCHEME - ATAL PENSION YOJANA (APY)"
    );
    expect(data).toEqual("APY");
  });
  test("Central Gov.", () => {
    const data = calc.calcST("LIC PENSION FUND SCHEME - CENTRAL GOVT");
    expect(data).toEqual("CG");
  });
  test("State Gov.", () => {
    const data = calc.calcST(
      "UTI RETIREMENT SOLUTIONS PENSION FUND SCHEME- STATE GOVT"
    );
    expect(data).toEqual("SG");
  });
  test("Corporate Gov.", () => {
    const data = calc.calcST(
      "UTI RETIREMENT SOLUTIONS PENSION FUND SCHEME - CORPORATE-CG"
    );
    expect(data).toEqual("CCG");
  });
});

// describe("Test Asset Type", () => {
//   test("Fixed in Case of ETF - BSE", () => {
//     const data = calc["BSE"].calcType("Q", "B", "NETFNIF100");
//     expect(data).toEqual("F");
//   });
//   test("Fixed in Case of Gold - BSE", () => {
//     const data = calc["BSE"].calcType("Q", "E", "AXISGOLD");
//     expect(data).toEqual("F");
//   });
//   test("Alternative - BSE", () => {
//     const data = calc["BSE"].calcType("Q", "IF", "INDIGRID");
//     expect(data).toEqual("A");
//   });
//   test("Equity - BSE", () => {
//     const data = calc["BSE"].calcType("Q", "A", "KOTAK MAH.BK");
//     expect(data).toEqual("E");
//   });
// });

// describe("Test Asset Subtype", () => {
//   test("Liquid - BSE", () => {
//     const data = calc["BSE"].calcSubType("Q", "F", "LIQUIDBEES");
//     expect(data).toEqual("L");
//   });
//   test("Index - BSE", () => {
//     const data = calc["BSE"].calcSubType("Q", "B", "LICNETFSEN");
//     expect(data).toEqual("I");
//   });
//   test("Other Gov. Bond - BSE", () => {
//     const data = calc["BSE"].calcSubType("Q", "F", "ABDBSPDG");
//     expect(data).toEqual("GBO");
//   });
//   test("Gold Bond - BSE", () => {
//     const data = calc["BSE"].calcSubType("B", "G", "SGBFEB27");
//     expect(data).toEqual("GoldB");
//   });
// });


