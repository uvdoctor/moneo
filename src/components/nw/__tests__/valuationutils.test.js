import {
  loadInstrumentPrices,
  getInsPerfIds,
  loadInstruments,
  loadInsPerf,
  initializeInsData,
  getCashFlows,
  calculateDifferenceInYears,
  calculateDifferenceInMonths,
  calculateAddYears,
  calculateInsurance,
  calculateLoan,
} from "../valuationutils";
import { loadIndexPerf } from "../nwutils";
import simpleStorage from "simplestorage.js";

jest.mock("aws-amplify");
jest.mock("simplestorage.js");

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

describe("loadInstruments", () => {
  const insData = {
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
  test("Without cache - ( MF and Stock Ids ) ", async () => {
    loadIndexPerf = jest.fn();
    loadInstrumentPrices = jest.fn();
    getInsPerfIds = jest.fn();
    loadInsPerf = jest.fn();

    const ids = ["INE129A01019", "INE114A01011", "INF114A01011"];
    await loadInstruments(ids, true);
    expect(loadInstrumentPrices).toBeCalledTimes(2);
    expect(getInsPerfIds).toHaveBeenCalled();
  });

  // test("Without cache - unmatched ids", async () => {
  //   loadIndexPerf = jest.fn();
  //   loadInstrumentPrices.mockReturnValue(["INE114A01011"]);
  //   getInsPerfIds = jest.fn();
  //   loadInsPerf = jest.fn();

  //   const ids = [ "INF114A01011" ];
  //   await loadInstruments(ids, true);
  //   expect(loadInstrumentPrices).toBeCalledTimes(4)
  //   expect(getInsPerfIds).toHaveBeenCalled();
  // });

  test("With cache data", async () => {
    loadIndexPerf = jest.fn();
    loadInstrumentPrices = jest.fn();
    getInsPerfIds = jest.fn();
    loadInsPerf = jest.fn();
    simpleStorage.get.mockReturnValue(insData);
    const ids = ["INE129A01019", "INE114A01011", "INF114A01011"];
    const data = await loadInstruments(ids, true);
    expect(data).toEqual(insData);
    expect(getInsPerfIds).toHaveBeenCalled();
    expect(loadInsPerf).toHaveBeenCalled();
  });

  test("Without ids and cache data", async () => {
    loadIndexPerf = jest.fn();
    loadInstrumentPrices = jest.fn();
    getInsPerfIds = jest.fn();
    loadInsPerf = jest.fn();

    const ids = [];
    const data = await loadInstruments(ids, true);
    expect(data).toEqual(insData);
    expect(getInsPerfIds).toHaveBeenCalled();
    expect(loadInsPerf).toHaveBeenCalled();
  });
});

// describe("loadInsPerf", async () => {
//   const insperfData = {
//     INE129A01019: {
//       id: "INE129A01019",
//       sid: "GAIL",
//       subt: "S",
//       beta: 1,
//       yhigh: 10,
//     },
//     INE114A01011: {
//       id: "INE114A01011",
//       subt: "S",
//       sid: "SAIL",
//       beta: 1,
//       yhigh: 10,
//     },
//   };
//   test("Without cache", async () => {
//     loadInstrumentPrices = jest.fn();
//     const ids = ["INE129A01019", "INE114A01011"];
//     await loadInsPerf(ids);
//     expect(loadInstrumentPrices).toHaveBeenCalled();
//   });

//   test("With cache data", async () => {
//     loadInstrumentPrices = jest.fn();
//     simpleStorage.get.mockReturnValue(insperfData);
//     const ids = ["INE129A01019", "INE114A01011" ];
//     const data = await loadInsPerf(ids);
//     expect(data).toEqual(insperfData);
//     expect(loadInstrumentPrices).toHaveBeenCalled(0);
//   });

// });

describe("initializeInsData", () => {
  test("With data", async () => {
    loadInstruments = jest.fn();
    await initializeInsData(
      [
        {
          id: "INE129A01019",
          sid: "GAIL",
          subt: "S",
          qty: 10,
          fId: "",
          curr: "",
        },
        {
          id: "INE114A01011",
          sid: "SAIL",
          subt: "S",
          qty: 10,
          fId: "",
          curr: "",
        },
      ],
      true
    );
    expect(loadInstruments).toHaveBeenCalled();
  });

  test("Without data", async () => {
    loadInstruments = jest.fn();
    await initializeInsData([], false);
    expect(loadInstruments).toHaveBeenCalled();
  });
});

describe("getCashFlows", () => {
  test("Life Insurance - Yearly", () => {
    const data = getCashFlows(1000, 0, 3, 10, false, "L");
    expect(data).toEqual([1000, 1000, 1000, 1000]);
  });

  test("Life Insurance - Monthly", () => {
    const data = getCashFlows(1000, 6, 12, 10, true, "L");
    expect(data).toEqual([12000, 6000]);
  });

  test("Life Insurance - Monthly - With zero remaining duration", () => {
    const data = getCashFlows(1000, 6, 0, 10, true, "L");
    expect(data).toEqual([12000]);
  });

  test("Life Insurance - Yearly - With zero remaining duration", () => {
    const data = getCashFlows(1000, 2, 0, 10, false, "L");
    expect(data).toEqual([1000]);
  });

  test("Life Insurance - Monthly - With zero bygone duration", () => {
    const data = getCashFlows(1000, 0, 6, 10, true, "L");
    expect(data).toEqual([12000]);
  });

  test("Life Insurance - Yearly - With zero bygone duration", () => {
    const data = getCashFlows(1000, 0, 1, 10, false, "L");
    expect(data).toEqual([1000, 1000]);
  });

  test("Others Insurance - Yearly", () => {
    const data = getCashFlows(1000, 0, 3, 10, false, "V");
    expect(data).toEqual([1100, 1210, 1331, 1464.1000000000001]);
  });

  test("Others Insurance - Monthly", () => {
    const data = getCashFlows(1000, 6, 12, 10, true, "V");
    expect(data).toEqual([13256.556809295562, 6966.673978813547]);
  });

  test("Others Insurance - Monthly - With zero remaining duration", () => {
    const data = getCashFlows(1000, 6, 0, 10, true, "P");
    expect(data).toEqual([13256.556809295562]);
  });

  test("Others Insurance - Yearly - With zero remaining duration", () => {
    const data = getCashFlows(1000, 2, 0, 10, false, "P");
    expect(data).toEqual([1331.0000000000005]);
  });

  test("Others Insurance - Monthly - With zero bygone duration", () => {
    const data = getCashFlows(1000, 0, 6, 10, true, "P");
    expect(data).toEqual([12612.639759841979]);
  });

  test("Others Insurance - Yearly - With zero bygone duration", () => {
    const data = getCashFlows(1000, 0, 1, 10, false, "P");
    expect(data).toEqual([1100, 1210]);
  });
});

describe("calculateDifferenceInYears", () => {
  test("With data", () => {
    const data = calculateDifferenceInYears(1, 2022, 1, 2020);
    expect(data).toEqual(2);
  });

  test("Without Data", () => {
    const data = calculateDifferenceInYears();
    expect(data).toEqual(NaN);
  });
});

describe("calculateDifferenceInMonths", () => {
  test("With data - Ex1", () => {
    const data = calculateDifferenceInMonths(1, 2022, 1, 2020);
    expect(data).toEqual(24);
  });

  test("With data - Ex2", () => {
    const data = calculateDifferenceInMonths(1, 2022, 6, 2020);
    expect(data).toEqual(19);
  });

  test("Without Data", () => {
    const data = calculateDifferenceInMonths();
    expect(data).toEqual(NaN);
  });
});

describe("calculateAddYears", () => {
  test("With data - Ex1", () => {
    const data = calculateAddYears(1, 2022, 5);
    expect(data).toEqual({ month: 1, year: 2027 });
  });

  test("Without number of years to add", () => {
    const data = calculateAddYears(6, 2022, 0);
    expect(data).toEqual({ month: 6, year: 2022 });
  });

  test("Without Data", () => {
    const data = calculateAddYears();
    expect(data).toEqual({ month: NaN, year: NaN });
  });
});

describe("calculateInsurance", () => {
  test("LIfe Insurance", () => {
    const data = calculateInsurance(
      {
        amt: 1000,
        chg: 0,
        chgF: 1,
        curr: "INR",
        em: 12,
        ey: 2023,
        fId: "",
        sm: 1,
        subt: "L",
        sy: 2022,
      },
      50,
      "1-Apr-2000"
    );
    expect(data).toEqual({ subt: "L", cashflows: [1000, 1000] });
  });

  test("Health Insurance", () => {
    const data = calculateInsurance(
      {
        amt: 1000,
        chg: 0,
        chgF: 1,
        curr: "INR",
        em: 12,
        ey: 2023,
        fId: "",
        sm: 1,
        subt: "H",
        sy: 2022,
      },
      25,
      "1-Apr-2000"
    );
    expect(data).toEqual({ subt: "H", cashflows: [1000, 1000, 1000, 1000] });
  });

  test("Accident Insurance - With rate", () => {
    const data = calculateInsurance(
      {
        amt: 1000,
        chg: 10,
        chgF: 1,
        curr: "INR",
        em: 12,
        ey: 2023,
        fId: "",
        sm: 1,
        subt: "H",
        sy: 2022,
      },
      25,
      "1-Apr-2000"
    );
    expect(data).toEqual({
      subt: "H",
      cashflows: [1100, 1210, 1331, 1464.1000000000001],
    });
  });

  test("Others Insurance", () => {
    const data = calculateInsurance(
      {
        amt: 1000,
        chg: 0,
        chgF: 1,
        curr: "INR",
        em: 12,
        ey: 2023,
        fId: "",
        sm: 1,
        subt: "O",
        sy: 2022,
      },
      25,
      "1-Apr-2000"
    );
    expect(data).toEqual({ subt: "O", cashflows: [1000, 1000] });
  });

  test("Others Insurance - With rate", () => {
    const data = calculateInsurance(
      {
        amt: 1000,
        chg: 10,
        chgF: 1,
        curr: "INR",
        em: 12,
        ey: 2023,
        fId: "",
        sm: 1,
        subt: "O",
        sy: 2022,
      },
      25,
      "1-Apr-2000"
    );
    expect(data).toEqual({ subt: "O", cashflows: [1100, 1210] });
  });

  test("Without le and dob incase of Health Insurance", () => {
    const data = calculateInsurance({
      amt: 1000,
      chg: 0,
      chgF: 1,
      curr: "INR",
      em: 12,
      ey: 2023,
      fId: "",
      sm: 1,
      subt: "H",
      sy: 2022,
    });
    expect(data).toEqual({ subt: "H", cashflows: [1000, 1000] });
  });

  test("Without data", () => {
    try {
      const data = calculateInsurance();
    } catch (e) {
      expect(e.toString()).toEqual(
        "TypeError: Cannot read properties of undefined (reading 'sm')"
      );
    }
  });
});

describe("calculateLoan", () => {
  test("With data", () => {
    const data = calculateLoan({
      amt: 1000,
      chg: 10,
      chgF: 1,
      curr: "INR",
      em: 12,
      ey: 2023,
      fId: "",
      sm: 1,
      subt: "L",
      sy: 2022,
    });
    expect(data).toEqual(16651);
  });

  test("With data - without rate", () => {
    const data = calculateLoan({
      amt: 1000,
      chg: 0,
      chgF: 1,
      curr: "INR",
      em: 12,
      ey: 2023,
      fId: "",
      sm: 1,
      subt: "L",
      sy: 2022,
    });
    expect(data).toEqual(18000);
  });

  test("Without data", () => {
    try {
      const data = calculateLoan();
    } catch (e) {
      expect(e.toString()).toEqual(
        "TypeError: Cannot read properties of undefined (reading 'em')"
      );
    }
  });
});
