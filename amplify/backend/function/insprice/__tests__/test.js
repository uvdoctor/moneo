const { calc, calcSchema, calculateRisk } = require("../src/calculate");

describe("CalcSchema - Incase of Exchange Data", () => {
  const { updateSchema, isBond } = calcSchema(
    {
      SYMBOL: "20MICRONS",
      ISIN: "INE144J01027",
      LAST: "85.5",
      PREVCLOSE: "88.15",
      SERIES: "EQ",
    },
    {
      sid: "SYMBOL",
      id: "ISIN",
      name: "SYMBOL",
      price: "LAST",
      prev: "PREVCLOSE",
      type: "SERIES",
      subt: "",
    },
    {
      id: "",
      sid: "",
      name: "",
      type: "",
      subt: "",
      itype: "",
      price: 0,
      prev: 0,
    },
    "NSE",
    {},
    "Table",
    "BondTable"
  );
  test("Schema", () => {
    expect(updateSchema).toEqual({
      id: "INE144J01027",
      sid: "20MICRONS",
      name: "20MICRONS",
      type: "E",
      subt: "S",
      itype: null,
      price: 85.5,
      prev: 88.15,
      mcapt: "S",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      __typename: "Table",
      exchg: "NSE",
    });
  });
  test("isBond", () => {
    expect(isBond).toEqual(false);
  });
});

describe("CalcSchema - Incase of Bond Data", () => {
  const { updateSchema, isBond } = calcSchema(
    {
      SYMBOL: "BRITANNIA",
      ISIN: "INE216A07052",
      LAST: "31.2",
      PREVCLOSE: "31.2",
      SERIES: "N2",
    },
    {
      sid: "SYMBOL",
      id: "ISIN",
      name: "SYMBOL",
      price: "LAST",
      prev: "PREVCLOSE",
      type: "SERIES",
      subt: "",
    },
    {
      id: "",
      sid: "",
      name: "",
      type: "",
      subt: "",
      itype: "",
      price: 0,
      prev: 0,
    },
    "NSE",
    {},
    "Table",
    "BondTable"
  );
  test("Schema", () => {
    expect(updateSchema).toEqual({
      id: "INE216A07052",
      sid: "BRITANNIA",
      name: "BRITANNIA",
      type: "F",
      subt: "CB",
      price: 31.2,
      sm: 0,
      sy: 0,
      mm: 0,
      my: 0,
      fr: false,
      tf: false,
      cr: null,
      rate: -1,
      fv: 100,
      ytm: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      __typename: "BondTable",
      exchg: "NSE",
      itype: null,
      prev: 31.2,
    });
  });
  test("isBond", () => {
    expect(isBond).toEqual(true);
  });
});

describe("Test Asset Type", () => {
  test("Warrant - BSE", () => {
    const data = calc["BSE"].calcTypeAndSubtype(
      "B",
      "MOLDTKWARR",
      "INE893J13016",
      "W"
    );
    expect(data).toEqual({ type: "H", subt: "War" });
  });
  test("Stock ETF - BSE", () => {
    const data = calc["BSE"].calcTypeAndSubtype(
      "Q",
      "NETFNIF100",
      "INF204K014N5",
      "B"
    );
    expect(data).toEqual({ type: "E", subt: "S", itype: "ETF" });
  });
  test("Fixed ETF - BSE", () => {
    const data = calc["BSE"].calcTypeAndSubtype(
      "Q",
      "ICICILIQ",
      "INF109KC1KT9",
      "F"
    );
    expect(data).toEqual({ type: "F", subt: "L", itype: "ETF" });
  });
  test("Fixed(Liquid) ETF - BSE", () => {
    const data = calc["BSE"].calcTypeAndSubtype(
      "Q",
      "ABCRSPRG",
      "INF209KB1P65",
      "F"
    );
    expect(data).toEqual({ type: "F", subt: "CB", itype: "ETF" });
  });
  test("Gold - BSE", () => {
    const data = calc["BSE"].calcTypeAndSubtype(
      "Q",
      "ICICIGOLD",
      "INF109KC1NT3",
      "E"
    );
    expect(data).toEqual({ type: "A", subt: "Gold", itype: "ETF" });
  });
  test("Other Government Bond - BSE", () => {
    const data = calc["BSE"].calcTypeAndSubtype(
      "Q",
      "EBBETF0430",
      "INF754K01KO2",
      "F"
    );
    expect(data).toEqual({ type: "F", subt: "GBO", itype: "ETF"  });
  });
  test("Gold Bond - BSE", () => {
    const data = calc["BSE"].calcTypeAndSubtype(
      "B",
      "SGBAPR28",
      "IN0020200062",
      "G"
    );
    expect(data).toEqual({ type: "F", subt: "GoldB" });
  });
  test("Corporate Bond - BSE", () => {
    const data = calc["BSE"].calcTypeAndSubtype(
      "B",
      "740IIFCL33",
      "INE787H07156",
      "F"
    );
    expect(data).toEqual({ type: "F", subt: "CB" });
  });
  test("Stock - BSE", () => {
    const data = calc["BSE"].calcTypeAndSubtype(
      "P",
      "ZEE NCPS",
      "INE256A04022",
      "F"
    );
    expect(data).toEqual({ subt: "S", type: "E" });
  });
  test("REIT - BSE", () => {
    const data = calc["BSE"].calcTypeAndSubtype(
      "Q",
      "MINDSPACE",
      "INE041025011",
      "IF"
    );
    expect(data).toEqual({ type: "A", subt: "R", itype: "REIT" });
  });
  test("InvIT - BSE", () => {
    const data = calc["BSE"].calcTypeAndSubtype(
      "Q",
      "INDIGRID",
      "INE219X23014",
      "IF"
    );
    expect(data).toEqual({ type: "A", subt: "R", itype: "InvIT" });
  });
  test("REIT - NSE", () => {
    const data = calc["NSE"].calcTypeAndSubtype("RR", "BIRET", "INE0FDU25010");
    expect(data).toEqual({ type: "A", subt: "R", itype: "REIT" });
  });
  test("InvIT - NSE", () => {
    const data = calc["NSE"].calcTypeAndSubtype(
      "IV",
      "IRBINVIT",
      "INE183W23014"
    );
    expect(data).toEqual({ type: "A", subt: "R", itype: "InvIT" });
  });
  test("Warrant - NSE", () => {
    const data = calc["NSE"].calcTypeAndSubtype("W3", "HDFC", "INE001A13049");
    expect(data).toEqual({ type: "H", subt: "War" });
  });
  test("Government Bond - NSE", () => {
    const data = calc["NSE"].calcTypeAndSubtype(
      "GS",
      "719GS2060",
      "IN0020200039"
    );
    expect(data).toEqual({ type: "F", subt: "GB" });
  });
  test("Index - NSE", () => {
    const data = calc["NSE"].calcTypeAndSubtype(
      "EQ",
      "BSLNIFTY",
      "INF209KB19D1"
    );
    expect(data).toEqual({ type: "E", subt: "S", itype: "ETF" });
  });
  test("Bharat Bond - NSE", () => {
    const data = calc["NSE"].calcTypeAndSubtype(
      "EQ",
      "EBBETF0430",
      "INF754K01KO2"
    );
    expect(data).toEqual({ type: "F", subt: "GBO", itype: "ETF" });
  });
  test("Gold ETF - NSE", () => {
    const data = calc["NSE"].calcTypeAndSubtype(
      "EQ",
      "GOLDBEES",
      "INF204KB17I5"
    );
    expect(data).toEqual({ type: "A", subt: "Gold", itype: "ETF" });
  });
  test("Government ETF - NSE", () => {
    const data = calc["NSE"].calcTypeAndSubtype(
      "EQ",
      "SETF10GILT",
      "INF200KA1JT1"
    );
    expect(data).toEqual({ type: "F", subt: "GB", itype: "ETF" });
  });
  test("Liquid - NSE", () => {
    const data = calc["NSE"].calcTypeAndSubtype(
      "EQ",
      "LIQUIDBEES",
      "INF732E01037"
    );
    expect(data).toEqual({ type: "F", subt: "L", itype: "ETF" });
  });
  test("Stock ETF - NSE", () => {
    const data = calc["NSE"].calcTypeAndSubtype(
      "EQ",
      "ABSLBANETF",
      "INF209KB17D5"
    );
    expect(data).toEqual({ type: "E", subt: "S", itype: "ETF" });
  });

  test("Corporate Bond - NSE", () => {
    const data = calc["NSE"].calcTypeAndSubtype(
      "N8",
      "DHANILOANS",
      "INE614X07092"
    );
    expect(data).toEqual({ type: "F", subt: "CB" });
  });
  test("Gold Bond - NSE", () => {
    const data = calc["NSE"].calcTypeAndSubtype(
      "GB",
      "SGBDC27VII",
      "IN0020190461"
    );
    expect(data).toEqual({ type: "F", subt: "GoldB" });
  });
  test("Stock - NSE", () => {
    const data = calc["NSE"].calcTypeAndSubtype(
      "BE",
      "BLUECOAST",
      "INE472B01011"
    );
    expect(data).toEqual({ type: "E", subt: "S" });
  });
});

describe("Test Risk Profile", () => {
  test("Large cap with beta greater than 1", () => {
    const data = calculateRisk(1.78, "L", "S", "");
    expect(data).toEqual("A");
  });
  test("Large cap with beta less than 1", () => {
    const data = calculateRisk(0.9, "L", "S", "");
    expect(data).toEqual("M");
  });
  test("Mid cap with beta greater than 1", () => {
    const data = calculateRisk(1.78, "M", "S", "");
    expect(data).toEqual("VA");
  });
  test("Mid cap with beta less than 1", () => {
    const data = calculateRisk("", "M", "S", "");
    expect(data).toEqual("A");
  });
  test("Small Cap", () => {
    const data = calculateRisk(1.78, "S", "S", "");
    expect(data).toEqual("VA");
  });
  test("ETF - Index Fund", () => {
    const data = calculateRisk(1.78, "", "I", "ETF");
    expect(data).toEqual("M");
  });
  test("ETF - Gov bond", () => {
    const data = calculateRisk("", "", "GB", "ETF");
    expect(data).toEqual("VC");
  });
  test("ETF - others", () => {
    const data = calculateRisk("", "", "CB", "ETF");
    expect(data).toEqual("C");
  });
  test("Others", () => {
    const data = calculateRisk("", "", "R", "REIT");
    expect(data).toEqual("M");
  });
});
