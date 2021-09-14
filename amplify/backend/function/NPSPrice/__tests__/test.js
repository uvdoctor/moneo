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

describe("Test Asset Type", () => {
  test("Fixed in case of C", () => {
    const data = calc.calcType(
      "ADITYA BIRLA SUNLIFE PENSION FUND SCHEME C - TIER II"
    );
    expect(data).toEqual("F");
  });
  test("Fixed in case of State", () => {
    const data = calc.calcType(
      "UTI RETIREMENT SOLUTIONS PENSION FUND SCHEME- STATE GOVT"
    );
    expect(data).toEqual("F");
  });
  test("Hybrid", () => {
    const data = calc.calcType(
      "ADITYA BIRLA SUN LIFE PENSION FUND SCHEME TAX SAVER TIER II"
    );
    expect(data).toEqual("H");
  });
  test("Equity", () => {
    const data = calc.calcType(
      "HDFC PENSION MANAGEMENT COMPANY LIMITED SCHEME E - TIER I"
    );
    expect(data).toEqual("E");
  });
});

describe("Test Asset Subtype", () => {
  test("Other Gov. Bond", () => {
    const data = calc.calcSubType(
      "UTI RETIREMENT SOLUTIONS PENSION FUND SCHEME- STATE GOVT"
    );
    expect(data).toEqual("GBO");
  });
  test("Gov. Bond", () => {
    const data = calc.calcSubType(
      "ICICI PRUDENTIAL PENSION FUND SCHEME G - TIER II"
    );
    expect(data).toEqual("GB");
  });
  test("Corporate Bond", () => {
    const data = calc.calcSubType(
      "ICICI PRUDENTIAL PENSION FUND SCHEME C - TIER I"
    );
    expect(data).toEqual("CB");
  });
  test("Hybrid Bond", () => {
    const data = calc.calcSubType("KOTAK PENSION FUND SCHEME A - TIER II");
    expect(data).toEqual("HB");
  });
  test("Stock", () => {
    const data = calc.calcSubType("KOTAK PENSION FUND SCHEME E - TIER II");
    expect(data).toEqual("S");
  });
});
