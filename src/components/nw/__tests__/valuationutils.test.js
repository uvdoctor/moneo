import { loadInstrumentPrices, getInsPerfIds } from "../valuationutils";

describe("LoadInstrumentPrices", () => {
  test("No unmatched ids", async () => {
    const fun = () => [{ id: "one" }, { id: "two" }, { id: "three" }];
    const data = await loadInstrumentPrices(fun, ["one", "two", "three"], {});
    expect(data).toBe(null);
  });

  test("Unmatched ids", async () => {
    const fun = () => [{ id: "one" }, { id: "two" }];
    const data = await loadInstrumentPrices(fun, ["one", "two", "three"], {});
    expect(data).toEqual(["three"]);
  });

  test("Check with sid instead of id", async () => {
    const fun = () => [
      { id: "one", sid: 1 },
      { id: "two", sid: 2 },
      { id: "three", sid: 3 },
    ];
    const data = await loadInstrumentPrices(fun, ["1", "2", "3"], {}, "sid");
    expect(data).toBe(null);
  });

  test("Without id", async () => {
    const fun = () => [];
    const data = await loadInstrumentPrices(fun, [], {});
    expect(data).toBe(null);
  });
});

describe("GetInsPerfIds", () => {
  test("With ids of stock and mfs data", () => {
    const ids = ["INE129A01019", "INE114A01011", "INF114A01011"];
    const allInsData = {
      INE129A01019: {
        id: "INE129A01019",
        sid: "GAIL",
        subt: "S",
        beta: 1,
        yhigh: 10,
      },
      INE114A01011: {
        id: "INE114A01011",
        subt: "S",
        sid: "SAIL",
        beta: 1,
        yhigh: 10,
      },
      INF114A01011: {
        id: "INF114A01011",
        subt: "S",
        sid: "ABC",
      },
    };
    const data = getInsPerfIds(ids, allInsData);
    expect(data).toEqual(["GAIL", "SAIL", "INF114A01011"]);
  });

  test("Without beta and yhigh data", () => {
    const ids = ["INE129A01019", "INE114A01011", "INF114A01011"];
    const allInsData = {
      INE129A01019: {
        id: "INE129A01019",
        sid: "GAIL",
        subt: "S",
      },
      INE114A01011: {
        id: "INE114A01011",
        subt: "S",
        sid: "SAIL",
      },
      INF114A01011: {
        id: "INF114A01011",
        subt: "S",
        sid: "ABC",
      },
    };
    const data = getInsPerfIds(ids, allInsData);
    expect(data).toEqual(["INF114A01011"]);
  });

  test("Without stock subtype", () => {
    const ids = ["INE129A01019", "INE114A01011", "INF114A01011"];
    const allInsData = {
      INE129A01019: {
        id: "INE129A01019",
        sid: "GAIL",
        subt: "S",
        beta: 1,
        yhigh: 10,
      },
      INE114A01011: {
        id: "INE114A01011",
        subt: "GB",
        sid: "SAIL",
        beta: 1,
        yhigh: 10,
      },
      INF114A01011: {
        id: "INF114A01011",
        subt: "CB",
        sid: "ABC",
      },
    };
    const data = getInsPerfIds(ids, allInsData);
    expect(data).toEqual(["GAIL"]);
  });

  test("With bond ids ", () => {
    const ids = ["IN0129A01019"];
    const allInsData = {
      IN0129A01019: {
        id: "IN0129A01019",
      },
    };
    const data = getInsPerfIds(ids, allInsData);
    expect(data).toEqual([]);
  });

  test("Without data ", () => {
    const ids = [];
    const allInsData = {};
    const data = getInsPerfIds(ids, allInsData);
    expect(data).toEqual([]);
  });
});
