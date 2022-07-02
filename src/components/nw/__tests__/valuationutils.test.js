import {
  loadInstrumentPrices,
  getInsPerfIds,
  loadInstruments,
  initializeInsData,
  getCashFlows,
  loadInsPerf,
  calculateDifferenceInYears,
  calculateDifferenceInMonths,
  calculateAddYears,
  calculateInsurance,
  calculateLoan,
  calculateCompundingIncome,
  calculateProperty,
  calculateVehicle,
  calculateCrypto,
  calculatePM,
  calculateProvidentFund,
  calculateNPS,
  priceInstruments,
  pricePM,
  priceProperties,
  priceLoans,
  priceLendings,
  priceLtdep,
  calculateBalance,
  priceInsurance,
  priceCrypto,
  pricePF,
  priceNPS,
  calculateTotalAssets,
  priceVehicles,
  priceSavings,
  priceOthers,
  priceAngel,
  priceP2P,
  priceCredit,
  calculateTotalLiabilities,
  calculatePrice,
  calculateAlerts,
  isIndISIN,
  otherISIN,
  initializeWatchlist,
} from "../valuationutils";
import {
  getCommodityRate,
  getCryptoRate,
  initializeNPSData,
  loadIndexPerf,
} from "../nwutils";
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
    expect(data).toEqual([12000, 7000]);
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
    const data = getCashFlows(
      1000,
      0,
      12 - (new Date().getMonth() + 1),
      10,
      true,
      "L"
    );
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
    const data = getCashFlows(
      1000,
      6,
      12 - (new Date().getMonth() + 1),
      10,
      true,
      "V"
    );
    expect(data).toEqual([13146.998488557585]);
  });

  test("Others Insurance - Monthly - With zero remaining duration", () => {
    const data = getCashFlows(1000, 6, 0, 10, true, "P");
    expect(data.length).toEqual(1);
  });

  test("Others Insurance - Yearly - With zero remaining duration", () => {
    const data = getCashFlows(1000, 2, 0, 10, false, "P");
    expect(data).toEqual([1331.0000000000005]);
  });

  test("Others Insurance - Monthly - With zero bygone duration", () => {
    const data = getCashFlows(
      1000,
      0,
      12 - (new Date().getMonth() + 1),
      10,
      true,
      "P"
    );
    expect(data.length).toEqual(1);
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
    expect(data).toEqual(15790);
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
    expect(data).toEqual(17000);
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

describe("calculateCompundingIncome", () => {
  test("Without chgF", () => {
    const data = calculateCompundingIncome({
      amt: 1000,
      chg: 0,
      chgF: 0,
      curr: "INR",
      em: 12,
      ey: 2023,
      fId: "",
      sm: 1,
      subt: "P2P",
      sy: 2022,
    });
    expect(data).toEqual({
      maturityAmt: 1000,
      valuation: 1000,
      isShortTerm: false,
    });
  });

  test("Maturity less than one year", () => {
    const data = calculateCompundingIncome({
      amt: 1000,
      chg: 0,
      chgF: 0,
      curr: "INR",
      em: 12,
      ey: 2022,
      fId: "",
      sm: 1,
      subt: "P2P",
      sy: 2021,
    });
    expect(data).toEqual({
      maturityAmt: 1000,
      valuation: 1000,
      isShortTerm: true,
    });
  });

  test("With chgF", () => {
    const data = calculateCompundingIncome({
      amt: 1000,
      chg: 0,
      chgF: 1,
      curr: "INR",
      em: 12,
      ey: 2024,
      fId: "",
      sm: 1,
      subt: "P2P",
      sy: 2022,
    });
    expect(data).toEqual({
      maturityAmt: 1000,
      valuation: 1000,
      isShortTerm: false,
    });
  });

  test("With rate", () => {
    const data = calculateCompundingIncome({
      amt: 1000,
      chg: 10,
      chgF: 1,
      curr: "INR",
      em: 12,
      ey: 2024,
      fId: "",
      sm: 1,
      subt: "P2P",
      sy: 2022,
    });

    expect(data.maturityAmt).toBeCloseTo(1210);
    expect(data.valuation).toBeCloseTo(1000);
  });

  test("With rate - with different year", () => {
    const data = calculateCompundingIncome({
      amt: 1000,
      chg: 10,
      chgF: 1,
      curr: "INR",
      em: 12,
      ey: 2024,
      fId: "",
      sm: 1,
      subt: "P2P",
      sy: 2020,
    });
    expect(data.maturityAmt).toBeCloseTo(1464.1);
    expect(data.valuation).toBeCloseTo(1210);
  });

  test("Without data", () => {
    try {
      calculateCompundingIncome();
    } catch (e) {
      expect(e.toString()).toEqual(
        "TypeError: Cannot read properties of undefined (reading 'em')"
      );
    }
  });
});

describe("calculateProperty", () => {
  test("With chnage mvm and mvy", () => {
    const data = calculateProperty(
      {
        curr: "INR",
        mv: "500000",
        mvm: "1",
        mvy: "2021",
        own: [
          {
            fId: "one",
            per: "100",
          },
        ],
        pin: "382480",
        purchase: {
          amt: "450000",
          month: "1",
          qty: "1",
          year: "2020",
        },
        rate: "8",
        res: false,
        state: "Gujarat",
        type: "A",
      },
      ["All"]
    );
    expect(data).toEqual({
      total: 540000,
      valuationByMembers: [],
    });
  });

  test("With one member", () => {
    const data = calculateProperty(
      {
        curr: "INR",
        mv: "500000",
        mvm: "6",
        mvy: "2022",
        own: [
          {
            fId: "one",
            per: "100",
          },
        ],
        pin: "382480",
        purchase: {
          amt: "450000",
          month: "1",
          qty: "1",
          year: "2020",
        },
        rate: "8",
        res: false,
        state: "Gujarat",
        type: "A",
      },
      ["All"]
    );
    expect(data).toEqual({
      total: 500000,
      valuationByMembers: [],
    });
  });

  test("All member selected ", () => {
    const data = calculateProperty(
      {
        curr: "INR",
        mv: "500000",
        mvm: "6",
        mvy: "2022",
        own: [
          {
            fId: "one",
            per: "50",
          },
          {
            fId: "two",
            per: "50",
          },
        ],
        pin: "382480",
        purchase: {
          amt: "450000",
          month: "1",
          qty: "1",
          year: "2020",
        },
        rate: "8",
        res: false,
        state: "Gujarat",
        type: "P",
      },
      ["All"]
    );
    expect(data).toEqual({
      total: 500000,
      valuationByMembers: [],
    });
  });

  test("With selected member", () => {
    const data = calculateProperty(
      {
        curr: "INR",
        mv: "500000",
        mvm: "6",
        mvy: "2022",
        own: [
          {
            fId: "one",
            per: "50",
          },
          {
            fId: "two",
            per: "50",
          },
        ],
        pin: "382480",
        purchase: {
          amt: "450000",
          month: "1",
          qty: "1",
          year: "2020",
        },
        rate: "8",
        res: false,
        state: "Gujarat",
        type: "P",
      },
      ["one"]
    );
    expect(data).toEqual({
      total: 500000,
      valuationByMembers: [
        {
          fid: "one",
          value: 250000,
        },
      ],
    });
  });

  test("Without data", () => {
    try {
      calculateProperty();
    } catch (e) {
      expect(e.toString()).toEqual(
        "TypeError: Cannot read properties of undefined (reading 'mvm')"
      );
    }
  });
});

describe("calculateVehicle", () => {
  test("With data - purchase year other than present year", () => {
    const data = calculateVehicle({
      amt: 10000,
      chg: 15,
      chgF: 1,
      curr: "INR",
      fId: "",
      sm: 1,
      subt: "2",
      sy: 2020,
    });
    expect(data).toBeCloseTo(7224.999999999999);
  });

  test("With data - purchase in present year", () => {
    const data = calculateVehicle({
      amt: 10000,
      chg: 15,
      chgF: 1,
      curr: "INR",
      fId: "",
      sm: 1,
      subt: "2",
      sy: new Date().getFullYear(),
    });
    expect(data).toBeCloseTo(10000);
  });

  test("Without data", () => {
    try {
      calculateVehicle();
    } catch (e) {
      expect(e.toString()).toEqual(
        "TypeError: Cannot read properties of undefined (reading 'sm')"
      );
    }
  });
});

describe("calculateCrypto", () => {
  test("Resolved Value", async () => {
    getCryptoRate = jest.fn();
    getCryptoRate.mockReturnValueOnce(1000);
    const data = await calculateCrypto(
      {
        type: "A",
        subt: "C",
        name: "BTC-USD",
        curr: "INR",
        fId: "",
        qty: 10,
      },
      "INR",
      75
    );
    expect(data).toBeCloseTo(10000);
  });

  test("Rejected Value", async () => {
    getCryptoRate = jest.fn();
    getCryptoRate.mockRejectedValue(0);
    try {
      const data = await calculateCrypto(
        {
          type: "A",
          subt: "C",
          name: "BTC-USD",
          curr: "INR",
          fId: "",
          qty: 10,
        },
        "INR",
        75
      );
    } catch (e) {
      expect(e.toString()).toEqual(0);
    }
  });

  test("Without data", async () => {
    try {
      await calculateCrypto();
    } catch (e) {
      expect(e.toString()).toEqual(0);
    }
  });
});

describe("calculatePM", () => {
  test("Resolved Value", async () => {
    getCommodityRate = jest.fn();
    getCommodityRate.mockReturnValueOnce(1000);
    const data = await calculatePM(
      {
        type: "A",
        subt: "Gold",
        name: "8",
        curr: "INR",
        fId: "",
        qty: 10,
      },
      "INR",
      75
    );
    expect(data).toBeCloseTo(10000);
  });

  test("Rejected Value", async () => {
    getCommodityRate = jest.fn();
    getCommodityRate.mockRejectedValue(0);
    try {
      const data = await calculatePM(
        {
          type: "A",
          subt: "Gold",
          name: "8",
          curr: "INR",
          fId: "",
          qty: 10,
        },
        "INR",
        75
      );
    } catch (e) {
      expect(e.toString()).toEqual(0);
    }
  });

  test("Without data", async () => {
    try {
      await calculatePM();
    } catch (e) {
      expect(e.toString()).toEqual(0);
    }
  });
});

describe("calculateProvidentFund", () => {
  test("With data", () => {
    const data = calculateProvidentFund({
      amt: 10000,
      chg: 10,
      chgF: 1,
      curr: "INR",
      fId: "",
      sm: 1,
      sy: 2020,
      em: 12,
      ey: 2024,
    });
    expect(data).toBeCloseTo(10000);
  });

  test("Without data", () => {
    try {
      calculateProvidentFund();
    } catch (e) {
      expect(e.toString()).toEqual(
        "TypeError: Cannot read properties of undefined (reading 'amt')"
      );
    }
  });
});

describe("calculateNPS", () => {
  test("With data - equity", async () => {
    initializeNPSData = jest.fn();
    initializeNPSData.mockReturnValueOnce([
      {
        price: 23.48,
        id: "SM003010",
        type: "E",
      },
    ]);
    const data = await calculateNPS({
      subt: "L",
      name: "SM003010",
      qty: 10,
    });
    expect(data).toEqual({
      equity: 234.8,
      fixed: 0,
      value: 234.8,
    });
  });

  test("With data - fixed", async () => {
    initializeNPSData = jest.fn();
    initializeNPSData.mockReturnValueOnce([
      {
        price: 23.48,
        id: "SM003010",
        type: "F",
      },
    ]);
    const data = await calculateNPS({
      subt: "L",
      name: "SM003010",
      qty: 10,
    });
    expect(data).toEqual({
      equity: 0,
      fixed: 234.8,
      value: 234.8,
    });
  });

  test("Without data", async () => {
    try {
      await calculateNPS();
    } catch (e) {
      expect(e.toString()).toEqual(
        "TypeError: Cannot read properties of undefined (reading 'amt')"
      );
    }
  });
});

describe("priceInstruments", () => {
  const insData = {
    INF879O01027: {
      id: "INF879O01027",
      sid: "122639",
      tid: "",
      dir: null,
      name: "Parag Parikh Flexi Cap Fund - Direct Plan - Growth",
      type: "E",
      subt: "S",
      price: 47.3139,
      prev: 47.5907,
      mftype: "O",
      mcapt: "Hybrid",
      tf: false,
      risk: "A",
    },
    INF277K01Z77: {
      id: "INF277K01Z77",
      sid: "135800",
      tid: "",
      dir: null,
      name: "Tata Digital India Fund-Direct Plan-Growth",
      type: "E",
      subt: "S",
      price: 34.4705,
      prev: 34.379,
      mftype: "O",
      mcapt: "Hybrid",
      tf: false,
      risk: "A",
    },
    INE129A01019: {
      id: "INE129A01019",
      sid: "GAIL",
      name: "GAIL (India) Limited",
      exchg: "NSE",
      type: "E",
      subt: "S",
      itype: null,
      price: 139.25,
      prev: 136.9,
      fv: null,
      under: null,
      yhigh: 173.5,
      yhighd: "2022-04-19",
      ylow: 125.2,
      ylowd: "2021-12-20",
      split: null,
      div: null,
      splitd: null,
      divdd: null,
      divrd: null,
      divpd: null,
      beta: 0.7622,
      mcap: 607889391616,
      mcapt: "Large",
      sector: null,
      ind: null,
      risk: "M",
      vol: 9917657,
      prevol: 6604729,
    },
    INE028A01039: {
      id: "INE028A01039",
      sid: "BANKBARODA",
      name: "Bank of Baroda",
      exchg: "NSE",
      type: "E",
      subt: "S",
      itype: null,
      price: 101.15,
      prev: 101.55,
      fv: null,
      under: null,
      yhigh: 122.7,
      yhighd: "2022-04-11",
      ylow: 72.5,
      ylowd: "2021-08-23",
      split: null,
      div: null,
      splitd: null,
      divdd: null,
      divrd: null,
      divpd: null,
      beta: 0.8139,
      mcap: 518469943296,
      mcapt: "Large",
      sector: null,
      ind: null,
      risk: "M",
      vol: 16407378,
      prevol: 16394684,
    },
    INE752E01010: {
      id: "INE752E01010",
      sid: "POWERGRID",
      name: "Power Grid Corporation of India Limited",
      exchg: "NSE",
      type: "E",
      subt: "S",
      itype: null,
      price: 211.1,
      prev: 210.3,
      fv: null,
      under: null,
      yhigh: 248.35,
      yhighd: "2022-05-10",
      ylow: 167.15,
      ylowd: "2021-07-29",
      split: null,
      div: null,
      splitd: null,
      divdd: null,
      divrd: null,
      divpd: null,
      beta: 0.2348,
      mcap: 1472517505024,
      mcapt: "Large",
      sector: null,
      ind: null,
      risk: "M",
      vol: 31125548,
      prevol: 5077566,
    },
    INE522F01014: {
      id: "INE522F01014",
      sid: "COALINDIA",
      name: "Coal India Limited",
      exchg: "NSE",
      type: "E",
      subt: "S",
      itype: null,
      price: 188.75,
      prev: 186.4,
      fv: null,
      under: null,
      yhigh: 209,
      yhighd: "2022-04-22",
      ylow: 132.75,
      ylowd: "2021-08-23",
      split: null,
      div: null,
      splitd: null,
      divdd: null,
      divrd: null,
      divpd: null,
      beta: 0.4535,
      mcap: 1144727142400,
      mcapt: "Large",
      sector: null,
      ind: null,
      risk: "M",
      vol: 16855901,
      prevol: 9844211,
    },
  };
  const ins = [
    {
      id: "INE522F01014",
      sid: "COALINDIA",
      exchg: "NSE",
      qty: 10,
      pur: null,
      fId: "70ec5237-133f-4f45-bfda-3aa516f7de26",
      curr: "INR",
      type: "E",
      subt: "S",
      key: 0,
    },
    {
      id: "INE752E01010",
      sid: "POWERGRID",
      exchg: "NSE",
      qty: 10,
      pur: null,
      fId: "70ec5237-133f-4f45-bfda-3aa516f7de26",
      curr: "INR",
      type: "E",
      subt: "S",
      key: 1,
    },
    {
      id: "INE129A01019",
      sid: "GAIL",
      exchg: "NSE",
      qty: 43,
      pur: null,
      fId: "70ec5237-133f-4f45-bfda-3aa516f7de26",
      curr: "INR",
      type: "E",
      subt: "S",
      key: 3,
    },
    {
      id: "INE028A01039",
      sid: "BANKBARODA",
      exchg: "NSE",
      qty: 50,
      pur: null,
      fId: "70ec5237-133f-4f45-bfda-3aa516f7de26",
      curr: "INR",
      type: "E",
      subt: "S",
      key: 6,
    },
    {
      id: "INF277K01Z77",
      sid: "135800",
      exchg: null,
      qty: 63.779,
      pur: null,
      fId: "70ec5237-133f-4f45-bfda-3aa516f7de26",
      curr: "INR",
      type: "E",
      subt: "S",
      key: 7,
    },
    {
      id: "INF109K01Z48",
      sid: "120594",
      exchg: null,
      qty: 12.653,
      pur: null,
      fId: "70ec5237-133f-4f45-bfda-3aa516f7de26",
      curr: "INR",
      type: "E",
      subt: "S",
      key: 8,
    },
    {
      id: "INF879O01027",
      sid: "122639",
      exchg: null,
      qty: 158.769,
      pur: null,
      fId: "70ec5237-133f-4f45-bfda-3aa516f7de26",
      curr: "INR",
      type: "E",
      subt: "S",
      key: 9,
    },
  ];
  const blankdata = {
    total: 0,
    totalFGold: 0,
    totalFEquity: 0,
    totalFRE: 0,
    totalFFixed: 0,
    totalInv: 0,
    totalStocks: 0,
    totalBondsAllocation: 0,
    totalBonds: 0,
    totalETFs: 0,
    totalMFs: 0,
    largeCapStocks: 0,
    largeCapFunds: 0,
    largeCapETFs: 0,
    multiCap: 0,
    indexFunds: 0,
    fmp: 0,
    intervalFunds: 0,
    liquidFunds: 0,
    riskTotals: {
      VC: { stocks: 0, bonds: 0, mfs: 0, etfs: 0, reit: 0, others: 0 },
      C: { stocks: 0, bonds: 0, mfs: 0, etfs: 0, reit: 0, others: 0 },
      M: { stocks: 0, bonds: 0, mfs: 0, etfs: 0, reit: 0, others: 0 },
      A: { stocks: 0, bonds: 0, mfs: 0, etfs: 0, reit: 0, others: 0 },
      VA: { stocks: 0, bonds: 0, mfs: 0, etfs: 0, reit: 0, others: 0 },
    },
  };

  test("With data", async () => {
    initializeInsData = jest.fn();
    initializeInsData.mockReturnValueOnce(insData);
    const data = await priceInstruments(
      ins,
      ["70ec5237-133f-4f45-bfda-3aa516f7de26"],
      "INR",
      true
    );
    expect(data).toEqual({
      total: 24754.2246086,
      totalFGold: 0,
      totalFEquity: 24754.2246086,
      totalFRE: 0,
      totalFFixed: 0,
      totalInv: 0,
      totalStocks: 15043.75,
      totalBondsAllocation: 0,
      totalBonds: 0,
      totalETFs: 0,
      totalMFs: 9710.4746086,
      largeCapStocks: 15043.75,
      largeCapFunds: 0,
      largeCapETFs: 0,
      multiCap: 9710.4746086,
      indexFunds: 0,
      fmp: 0,
      intervalFunds: 0,
      liquidFunds: 0,
      riskTotals: {
        VC: { stocks: 0, bonds: 0, mfs: 0, etfs: 0, reit: 0, others: 0 },
        C: { stocks: 0, bonds: 0, mfs: 0, etfs: 0, reit: 0, others: 0 },
        M: { stocks: 15043.75, bonds: 0, mfs: 0, etfs: 0, reit: 0, others: 0 },
        A: {
          stocks: 0,
          bonds: 0,
          mfs: 9710.4746086,
          etfs: 0,
          reit: 0,
          others: 0,
        },
        VA: { stocks: 0, bonds: 0, mfs: 0, etfs: 0, reit: 0, others: 0 },
      },
    });
  });

  test("Without selected members", async () => {
    initializeInsData = jest.fn();
    initializeInsData.mockReturnValueOnce(insData);
    const data = await priceInstruments(ins, [], "INR", true);
    expect(data).toEqual(blankdata);
  });

  test("Without cached data", async () => {
    initializeInsData = jest.fn();
    initializeInsData.mockReturnValueOnce({});
    const data = await priceInstruments(
      ins,
      ["70ec5237-133f-4f45-bfda-3aa516f7de26"],
      "INR",
      true
    );
    expect(data).toEqual(blankdata);
  });

  test("With blank instruments", async () => {
    initializeInsData = jest.fn();
    initializeInsData.mockReturnValueOnce(insData);
    const data = await priceInstruments(
      [],
      ["70ec5237-133f-4f45-bfda-3aa516f7de26"],
      "INR",
      true
    );
    expect(data).toEqual(blankdata);
  });

  test("Without data", async () => {
    try {
      await priceInstruments();
    } catch (e) {
      expect(e.toString()).toEqual(
        "TypeError: Cannot read properties of undefined (reading 'forEach')"
      );
    }
  });
});

describe("pricePM", () => {
  const pmdata = [
    {
      id: "",
      qty: 10,
      fId: "70ec5237-133f-4f45-bfda-3aa516f7de26",
      curr: "USD",
      type: "A",
      subt: "Gold",
      name: "8",
    },
    {
      id: "",
      qty: 10,
      fId: "70ec5237-133f-4f45-bfda-3aa516f7de26",
      curr: "USD",
      type: "A",
      subt: "SI",
      name: "100",
    },
  ];

  test("With data", async () => {
    calculatePM = jest.fn();
    calculatePM.mockReturnValue(10);
    const data = await pricePM(
      pmdata,
      ["70ec5237-133f-4f45-bfda-3aa516f7de26"],
      "INR",
      75
    );
    expect(data).toEqual({ total: 20, totalPGold: 10 });
  });

  test("Without calculatePM data", async () => {
    calculatePM = jest.fn();
    calculatePM.mockReturnValue(0);
    const data = await pricePM(
      pmdata,
      ["70ec5237-133f-4f45-bfda-3aa516f7de26"],
      "INR",
      75
    );
    expect(data).toEqual({ total: 0, totalPGold: 0 });
  });

  test("Without holdings", async () => {
    initializeInsData = jest.fn();
    initializeInsData.mockReturnValueOnce(10);
    const data = await pricePM(
      [],
      ["70ec5237-133f-4f45-bfda-3aa516f7de26"],
      "INR",
      75
    );
    expect(data).toEqual({ total: 0, totalPGold: 0 });
  });

  test("Without data", async () => {
    try {
      await pricePM();
    } catch (e) {
      expect(e.toString()).toContain("TypeError:");
    }
  });
});

describe("priceProperties", () => {
  const propertiesData = [
    {
      country: "India",
      curr: "INR",
      mv: 1469.3280768000006,
      mvm: 6,
      mvy: 2022,
      name: "",
      own: [
        {
          fId: "70ec5237-133f-4f45-bfda-3aa516f7de26",
          per: 100,
        },
      ],
      pin: 0,
      purchase: { amt: 10000, month: 4, year: 2017, qty: 1 },
      rate: 8,
      res: false,
      type: "P",
    },
  ];

  test("With data", () => {
    calculateProperty = jest.fn();
    calculateProperty.mockReturnValue({
      total: 50000,
      valuationByMembers: [],
    });
    const data = priceProperties(propertiesData, ["All"], "INR");
    expect(data).toEqual({
      total: 50000,
      totalCommercial: 0,
      totalOtherProperty: 0,
      totalPlot: 50000,
      totalResidential: 0,
    });
  });

  test("With multiple holdings", () => {
    calculateProperty = jest.fn();
    calculateProperty.mockReturnValue({
      total: 50000,
      valuationByMembers: [],
    });
    const data = priceProperties(
      [
        ...propertiesData,
        ...[
          {
            country: "India",
            curr: "INR",
            mv: 1469.3280768000006,
            mvm: 6,
            mvy: 2022,
            name: "",
            own: [
              {
                fId: "70ec5237-133f-4f45-bfda-3aa516f7de26",
                per: 100,
              },
            ],
            pin: 0,
            purchase: { amt: 10000, month: 4, year: 2017, qty: 1 },
            rate: 8,
            res: false,
            type: "COMM",
          },
        ],
      ],
      ["All"],
      "INR"
    );
    expect(data).toEqual({
      total: 100000,
      totalCommercial: 50000,
      totalOtherProperty: 0,
      totalPlot: 50000,
      totalResidential: 0,
    });
  });

  test("With selected members", async () => {
    calculateProperty = jest.fn();
    calculateProperty.mockReturnValue({
      total: 50000,
      valuationByMembers: [
        {
          fid: "one",
          value: 50000,
        },
      ],
    });
    const data = priceProperties(
      [
        {
          country: "India",
          curr: "INR",
          mv: 1469.3280768000006,
          mvm: 6,
          mvy: 2022,
          name: "",
          own: [
            {
              fId: "one",
              per: 50,
            },
            {
              fId: "two",
              per: 50,
            },
          ],
          pin: 0,
          purchase: { amt: 10000, month: 4, year: 2017, qty: 1 },
          rate: 8,
          res: false,
          state: "",
          type: "H",
        },
      ],
      ["one"],
      "INR"
    );
    expect(data).toEqual({
      total: 50000,
      totalCommercial: 0,
      totalOtherProperty: 0,
      totalPlot: 0,
      totalResidential: 50000,
    });
  });

  test("Without holdings", async () => {
    calculateProperty = jest.fn();
    calculateProperty.mockReturnValue({
      total: 50000,
      valuationByMembers: ["70ec5237-133f-4f45-bfda-3aa516f7de26"],
    });
    const data = priceProperties(
      [],
      ["70ec5237-133f-4f45-bfda-3aa516f7de26"],
      "INR"
    );
    expect(data).toEqual({
      total: 0,
      totalCommercial: 0,
      totalOtherProperty: 0,
      totalPlot: 0,
      totalResidential: 0,
    });
  });

  test("Without data", async () => {
    try {
      priceProperties();
    } catch (e) {
      expect(e.toString()).toContain("TypeError:");
    }
  });
});

describe("priceLoans", () => {
  const holdings = [
    {
      amt: 1000,
      curr: "INR",
      fId: "one",
    },
    {
      amt: 1000,
      curr: "INR",
      fId: "two",
    },
  ];

  test("With data", () => {
    calculateLoan = jest.fn();
    calculateLoan.mockReturnValue(10000);
    const data = priceLoans(holdings, ["All"], "INR");
    expect(data).toEqual(20000);
  });

  test("With selected members", () => {
    calculateLoan = jest.fn();
    calculateLoan.mockReturnValue(10000);
    const data = priceLoans(holdings, ["one"], "INR");
    expect(data).toEqual(10000);
  });

  test("Without holdings", async () => {
    calculateLoan = jest.fn();
    calculateLoan.mockReturnValue(10000);
    const data = priceLoans([], ["All"], "INR");
    expect(data).toEqual(0);
  });

  test("Without data", async () => {
    try {
      priceLoans();
    } catch (e) {
      expect(e.toString()).toContain("TypeError:");
    }
  });
});

describe("priceLendings", () => {
  const holdings = [
    {
      amt: 1000,
      curr: "INR",
      fId: "one",
    },
    {
      amt: 1000,
      curr: "INR",
      fId: "two",
    },
  ];

  test("With data", () => {
    calculateCompundingIncome = jest.fn();
    calculateCompundingIncome.mockReturnValue({
      valuation: 1000,
      isShortTerm: true,
    });
    const data = priceLendings(holdings, ["All"], "INR");
    expect(data).toEqual({ total: 2000, totalShortTerm: 2000 });
  });

  test("With selected members", () => {
    calculateLoan = jest.fn();
    calculateLoan.mockReturnValueOnce({ valuation: 1000, isShortTerm: true });
    const data = priceLendings(holdings, ["one"], "INR");
    expect(data).toEqual({ total: 1000, totalShortTerm: 1000 });
  });

  test("Without holdings", async () => {
    calculateLoan = jest.fn();
    calculateLoan.mockReturnValue({ valuation: 1000, isShortTerm: false });
    const data = priceLendings([], ["All"], "INR");
    expect(data).toEqual({ total: 0, totalShortTerm: 0 });
  });

  test("Without data", async () => {
    try {
      priceLendings();
    } catch (e) {
      expect(e.toString()).toContain("TypeError:");
    }
  });
});

describe("priceLtdep", () => {
  const holdings = [
    { amt: 1000, curr: "INR", fId: "one" },
    { amt: 1000, curr: "INR", fId: "two" },
  ];

  test("With data", () => {
    calculateCompundingIncome = jest.fn();
    calculateCompundingIncome.mockReturnValue({
      valuation: 1000,
    });
    const data = priceLtdep(holdings, ["All"], "INR");
    expect(data).toEqual(2000);
  });

  test("With selected members", () => {
    calculateLoan = jest.fn();
    calculateLoan.mockReturnValueOnce({ valuation: 1000 });
    const data = priceLtdep(holdings, ["one"], "INR");
    expect(data).toEqual(1000);
  });

  test("Without holdings", async () => {
    const data = priceLtdep([], ["All"], "INR");
    expect(data).toEqual(0);
  });

  test("Without data", async () => {
    try {
      priceLtdep();
    } catch (e) {
      expect(e.toString()).toContain("TypeError:");
    }
  });
});

describe("calculateBalance", () => {
  const holdings = [
    { amt: 1000, curr: "INR", fId: "one" },
    { amt: 1000, curr: "INR", fId: "two" },
  ];

  test("With data", () => {
    const data = calculateBalance(holdings, ["All"], "INR");
    expect(data).toEqual(2000);
  });

  test("With selected members", () => {
    const data = calculateBalance(holdings, ["one"], "INR");
    expect(data).toEqual(1000);
  });

  test("Without holdings", async () => {
    const data = calculateBalance([], ["All"], "INR");
    expect(data).toEqual(0);
  });

  test("Without data", async () => {
    try {
      calculateBalance();
    } catch (e) {
      expect(e.toString()).toContain("TypeError:");
    }
  });
});

describe("priceInsurance", () => {
  const holdings = [
    { amt: 1000, curr: "INR", fId: "one", subt: "L" },
    { amt: 1000, curr: "INR", fId: "two", subt: "L" },
  ];

  test("With data", () => {
    calculateInsurance = jest.fn();
    calculateInsurance.mockReturnValue({
      subt: "L",
      cashflows: [1000, 1000, 1000, 10000],
    });
    const data = priceInsurance(holdings, ["All"], "INR", {}, 50);
    expect(data).toEqual({
      presentYearValue: { L: 1000 },
      yearlyCashflow: { 2022: 2000, 2023: 2000, 2024: 2000, 2025: 20000 },
    });
  });

  test("With selected members", () => {
    const data = priceInsurance(holdings, ["one"], "INR");
    expect(data).toEqual({
      presentYearValue: { L: 1000 },
      yearlyCashflow: { 2022: 1000, 2023: 1000, 2024: 1000, 2025: 10000 },
    });
  });

  test("Without holdings", async () => {
    const data = priceInsurance([], ["All"], "INR");
    expect(data).toEqual({ presentYearValue: {}, yearlyCashflow: {} });
  });

  test("Without data", async () => {
    try {
      priceInsurance();
    } catch (e) {
      expect(e.toString()).toContain("TypeError:");
    }
  });
});

describe("priceCrypto", () => {
  const cryptoData = [
    {
      type: "A",
      subt: "C",
      name: "BTC-USD",
      curr: "INR",
      fId: "one",
      qty: 10,
    },
    {
      type: "A",
      subt: "C",
      name: "BTC-USD",
      curr: "INR",
      fId: "two",
      qty: 10,
    },
  ];

  test("With data", async () => {
    calculateCrypto = jest.fn();
    calculateCrypto.mockReturnValue(100);
    const data = await priceCrypto(cryptoData, ["All"], "INR", 75);
    expect(data).toEqual(200);
  });

  test("With selected members", async () => {
    calculateCrypto = jest.fn();
    calculateCrypto.mockReturnValue(100);
    const data = await priceCrypto(cryptoData, ["one"], "INR", 75);
    expect(data).toEqual(100);
  });

  test("Without holdings", async () => {
    const data = await priceCrypto([], ["All"], "INR", 75);
    expect(data).toEqual(0);
  });

  test("Without data", async () => {
    try {
      await priceCrypto();
    } catch (e) {
      expect(e.toString()).toContain("TypeError:");
    }
  });
});

describe("pricePF", () => {
  const holdings = [
    { amt: 1000, curr: "INR", fId: "one", subt: "PF" },
    { amt: 1000, curr: "INR", fId: "two", subt: "PF" },
  ];

  test("With data", () => {
    calculateProvidentFund = jest.fn();
    calculateProvidentFund.mockReturnValue(1000);
    const data = pricePF(holdings, ["All"], "INR");
    expect(data).toEqual({
      total: 2000,
      totalEPF: 0,
      totalPPF: 2000,
      totalVPF: 0,
    });
  });

  test("With different subt type", () => {
    calculateProvidentFund = jest.fn();
    calculateProvidentFund.mockReturnValue(1000);
    const holdings = [
      { amt: 1000, curr: "INR", fId: "one", subt: "VF" },
      { amt: 1000, curr: "INR", fId: "two", subt: "EF" },
    ];
    const data = pricePF(holdings, ["All"], "INR");
    expect(data).toEqual({
      total: 2000,
      totalEPF: 1000,
      totalPPF: 0,
      totalVPF: 1000,
    });
  });

  test("With selected members", () => {
    calculateProvidentFund = jest.fn();
    calculateProvidentFund.mockReturnValue(1000);
    const data = pricePF(holdings, ["one"], "INR");
    expect(data).toEqual({
      total: 1000,
      totalEPF: 0,
      totalPPF: 1000,
      totalVPF: 0,
    });
  });

  test("Without holdings", async () => {
    const data = pricePF([], ["All"], "INR");
    expect(data).toEqual({ total: 0, totalEPF: 0, totalPPF: 0, totalVPF: 0 });
  });

  test("Without data", async () => {
    try {
      pricePF();
    } catch (e) {
      expect(e.toString()).toContain("TypeError:");
    }
  });
});

describe("priceNPS", () => {
  const holdings = [
    { name: "SM003010", curr: "INR", fId: "one", subt: "", qty: 10 },
    { name: "SM003011", curr: "INR", fId: "two", subt: "CB", qty: 10 },
  ];

  test("With data", async () => {
    calculateNPS = jest.fn();
    calculateNPS.mockReturnValue({
      equity: 240,
      fixed: 0,
      value: 240,
    });
    const data = await priceNPS(holdings, ["All"], "INR");
    expect(data).toEqual({
      total: 480,
      totalNPSCFixed: 0,
      totalNPSEquity: 480,
      totalNPSGFixed: 0,
    });
  });

  test("With different subt type", async () => {
    calculateNPS = jest.fn();
    calculateNPS.mockReturnValue({
      equity: 0,
      fixed: 240,
      value: 240,
    });
    const data = await priceNPS(holdings, ["All"], "INR");
    expect(data).toEqual({
      total: 480,
      totalNPSCFixed: 240,
      totalNPSEquity: 0,
      totalNPSGFixed: 240,
    });
  });

  test("With selected members", async () => {
    calculateNPS = jest.fn();
    calculateNPS.mockReturnValue({
      equity: 240,
      fixed: 0,
      value: 240,
    });
    const data = await priceNPS(holdings, ["one"], "INR");
    expect(data).toEqual({
      total: 240,
      totalNPSCFixed: 0,
      totalNPSEquity: 240,
      totalNPSGFixed: 0,
    });
  });

  test("Without holdings", async () => {
    const data = await priceNPS([], ["All"], "INR");
    expect(data).toEqual({
      total: 0,
      totalNPSCFixed: 0,
      totalNPSEquity: 0,
      totalNPSGFixed: 0,
    });
  });

  test("Without data", async () => {
    try {
      await priceNPS();
    } catch (e) {
      expect(e.toString()).toContain("TypeError:");
    }
  });
});

describe("calculateTotalAssets", () => {
  const ins = [
    {
      id: "INE522F01014",
      sid: "COALINDIA",
      exchg: "NSE",
      qty: 10,
      pur: null,
      fId: "one",
      curr: "INR",
      type: "E",
      subt: "S",
      key: 0,
    },
    {
      id: "INE752E01010",
      sid: "POWERGRID",
      exchg: "NSE",
      qty: 10,
      pur: null,
      fId: "one",
      curr: "INR",
      type: "E",
      subt: "S",
      key: 1,
    },
    {
      id: "INE129A01019",
      sid: "GAIL",
      exchg: "NSE",
      qty: 43,
      pur: null,
      fId: "one",
      curr: "INR",
      type: "E",
      subt: "S",
      key: 3,
    },
    {
      id: "INE028A01039",
      sid: "BANKBARODA",
      exchg: "NSE",
      qty: 50,
      pur: null,
      fId: "one",
      curr: "INR",
      type: "E",
      subt: "S",
      key: 6,
    },
    {
      id: "INF277K01Z77",
      sid: "135800",
      exchg: null,
      qty: 63.779,
      pur: null,
      fId: "one",
      curr: "INR",
      type: "E",
      subt: "S",
      key: 7,
    },
    {
      id: "INF109K01Z48",
      sid: "120594",
      exchg: null,
      qty: 12.653,
      pur: null,
      fId: "one",
      curr: "INR",
      type: "E",
      subt: "S",
      key: 8,
    },
    {
      id: "INF879O01027",
      sid: "122639",
      exchg: null,
      qty: 158.769,
      pur: null,
      fId: "one",
      curr: "INR",
      type: "E",
      subt: "S",
      key: 9,
    },
  ];

  const holdings = {
    uname: "abc",
    dep: [
      {
        amt: 1000,
        chg: 0,
        chgF: 0,
        curr: "INR",
        em: 12,
        ey: 2023,
        fId: "two",
        sm: 1,
        subt: "BD",
        sy: 2022,
      },
    ],
    pm: [
      {
        id: "",
        qty: 10,
        fId: "one",
        type: "A",
        subt: "Gold",
        name: "8",
      },
    ],
    crypto: [
      {
        type: "A",
        subt: "C",
        name: "BTC-USD",
        curr: "INR",
        fId: "two",
        qty: 10,
      },
    ],
    pf: [{ amt: 1000, curr: "INR", fId: "two", subt: "PF" }],
    nps: [{ name: "SM003010", curr: "INR", fId: "one", subt: "", qty: 10 }],
    vehicles: [
      {
        amt: 10000,
        chg: 15,
        chgF: 1,
        curr: "INR",
        fId: "one",
        sm: 1,
        subt: "2",
        sy: 2020,
      },
    ],
    property: [
      {
        country: "India",
        curr: "INR",
        mv: 1500,
        mvm: 6,
        mvy: 2022,
        name: "",
        own: [
          {
            fId: "two",
            per: 100,
          },
        ],
        pin: 0,
        purchase: { amt: 10000, month: 4, year: 2017, qty: 1 },
        rate: 8,
        res: false,
        type: "P",
      },
    ],
    savings: [{ amt: 1000, curr: "INR", fId: "two" }],
    other: [{ amt: 1000, curr: "INR", fId: "one" }],
    ltdep: [
      {
        amt: 1000,
        chg: 0,
        chgF: 0,
        curr: "INR",
        em: 12,
        ey: 2023,
        fId: "one",
        sm: 1,
        subt: "SSY",
        sy: 2022,
      },
    ],
    angel: [{ amt: 1000, curr: "INR", fId: "one" }],
    p2p: [
      {
        amt: 1000,
        chg: 0,
        chgF: 0,
        curr: "INR",
        em: 12,
        ey: 2023,
        fId: "two",
        sm: 1,
        subt: "P2P",
        sy: 2022,
      },
    ],
  };

  test("With data", async () => {
    priceInstruments = jest.fn();
    pricePM = jest.fn();
    priceCrypto = jest.fn();
    pricePM = jest.fn();
    priceCrypto = jest.fn();
    pricePF = jest.fn();
    priceNPS = jest.fn();
    priceVehicles = jest.fn();
    priceProperties = jest.fn();
    priceSavings = jest.fn();
    priceLendings = jest.fn();
    priceLtdep = jest.fn();
    priceOthers = jest.fn();
    priceAngel = jest.fn();
    priceP2P = jest.fn();

    priceInstruments.mockReturnValue({
      total: 24754.2246086,
      totalFGold: 0,
      totalFEquity: 24754.2246086,
      totalFRE: 0,
      totalFFixed: 0,
      totalInv: 0,
      totalStocks: 15043.75,
      totalBondsAllocation: 0,
      totalBonds: 0,
      totalETFs: 0,
      totalMFs: 9710.4746086,
      largeCapStocks: 15043.75,
      largeCapFunds: 0,
      largeCapETFs: 0,
      multiCap: 9710.4746086,
      indexFunds: 0,
      fmp: 0,
      intervalFunds: 0,
      liquidFunds: 0,
      riskTotals: {
        VC: { stocks: 0, bonds: 0, mfs: 0, etfs: 0, reit: 0, others: 0 },
        C: { stocks: 0, bonds: 0, mfs: 0, etfs: 0, reit: 0, others: 0 },
        M: { stocks: 15043.75, bonds: 0, mfs: 0, etfs: 0, reit: 0, others: 0 },
        A: {
          stocks: 0,
          bonds: 0,
          mfs: 9710.4746086,
          etfs: 0,
          reit: 0,
          others: 0,
        },
        VA: { stocks: 0, bonds: 0, mfs: 0, etfs: 0, reit: 0, others: 0 },
      },
    });
    pricePM.mockReturnValue({ total: 20, totalPGold: 10 });
    priceCrypto.mockReturnValue(2000);
    pricePF.mockReturnValue({
      total: 2000,
      totalEPF: 0,
      totalPPF: 2000,
      totalVPF: 0,
    });
    priceNPS.mockReturnValue({
      total: 480,
      totalNPSCFixed: 0,
      totalNPSEquity: 480,
      totalNPSGFixed: 0,
    });
    priceVehicles.mockReturnValue(1000);
    priceProperties.mockReturnValue({
      total: 5000,
      totalOtherProperty: 1000,
      totalCommercial: 1000,
      totalResidential: 2000,
      totalPlot: 1000,
    });
    priceSavings.mockReturnValue(1000);
    priceLendings.mockReturnValue({ total: 1000, totalShortTerm: 500 });
    priceLtdep.mockReturnValue(1000);
    priceOthers.mockReturnValue(1000);
    priceAngel.mockReturnValue(1000);
    priceP2P.mockReturnValue(1000);

    const data = await calculateTotalAssets(
      holdings,
      { uname: "abc", ins: ins },
      ["All"],
      "INR",
      75,
      true
    );

    expect(data.totalCash).toEqual(5000);
    expect(data.totalSavings).toEqual(1000);
    expect(data.totalAssets).toEqual(41254.2246086);
    expect(data.totalMultiCap).toBeCloseTo(9710.4746086);
  });

  test("Without holdings data", async () => {
    priceInstruments = jest.fn();
    priceInstruments.mockReturnValue({
      total: 24754.2246086,
      totalFGold: 0,
      totalFEquity: 24754.2246086,
      totalFRE: 0,
      totalFFixed: 0,
      totalInv: 0,
      totalStocks: 15043.75,
      totalBondsAllocation: 0,
      totalBonds: 0,
      totalETFs: 0,
      totalMFs: 9710.4746086,
      largeCapStocks: 15043.75,
      largeCapFunds: 0,
      largeCapETFs: 0,
      multiCap: 9710.4746086,
      indexFunds: 0,
      fmp: 0,
      intervalFunds: 0,
      liquidFunds: 0,
      riskTotals: {
        VC: { stocks: 0, bonds: 0, mfs: 0, etfs: 0, reit: 0, others: 0 },
        C: { stocks: 0, bonds: 0, mfs: 0, etfs: 0, reit: 0, others: 0 },
        M: { stocks: 15043.75, bonds: 0, mfs: 0, etfs: 0, reit: 0, others: 0 },
        A: {
          stocks: 0,
          bonds: 0,
          mfs: 9710.4746086,
          etfs: 0,
          reit: 0,
          others: 0,
        },
        VA: { stocks: 0, bonds: 0, mfs: 0, etfs: 0, reit: 0, others: 0 },
      },
    });

    const data = await calculateTotalAssets(
      null,
      { uname: "abc", ins: ins },
      ["one"],
      "INR",
      75,
      true
    );

    expect(data.totalCash).toEqual(0);
    expect(data.totalSavings).toEqual(0);
    expect(data.totalAssets).toEqual(24754.2246086);
    expect(data.totalMultiCap).toBeCloseTo(9710.4746086);
  });

  test("Without holdings and ins data", async () => {
    const data = await calculateTotalAssets({}, {}, ["All"], "INR", 75, true);
    expect(data.totalCash).toEqual(0);
    expect(data.totalSavings).toEqual(0);
    expect(data.totalAssets).toEqual(0);
    expect(data.totalMultiCap).toBeCloseTo(0);
  });

  test("Without data", async () => {
    try {
      await calculateTotalAssets();
    } catch (e) {
      expect(e.toString()).toContain("TypeError:");
    }
  });
});

describe("calculateTotalLiabilities", () => {
  const holdings = {
    uname: "abc",
    loans: [
      {
        amt: 1000,
        chg: 0,
        chgF: 1,
        curr: "INR",
        em: 12,
        ey: 2023,
        fId: "two",
        sm: 1,
        subt: "L",
        sy: 2022,
      },
    ],
    credit: [
      {
        id: "",
        amt: 100000,
        fId: "one",
      },
    ],
  };

  test("With data", () => {
    priceLoans = jest.fn();
    priceCredit = jest.fn();

    priceLoans.mockReturnValue(0);
    priceCredit.mockReturnValue(10000);

    const data = calculateTotalLiabilities(holdings, ["All"], "INR");
    expect(data).toEqual(10000);
  });

  test("Without holdings data", () => {
    const data = calculateTotalLiabilities(null, ["All"], "INR");
    expect(data).toEqual(0);
  });

  test("With selected members", async () => {
    priceLoans = jest.fn();
    priceCredit = jest.fn();

    priceLoans.mockReturnValue(10000);
    priceCredit.mockReturnValue(10000);

    const data = calculateTotalLiabilities(holdings, ["one"], "INR");
    expect(data).toEqual(20000);
  });

  test("Without data", () => {
    try {
      calculateTotalLiabilities();
    } catch (e) {
      expect(e.toString()).toContain("TypeError:");
    }
  });
});

describe("calculatePrice", () => {
  const ins = [
    {
      id: "INE522F01014",
      sid: "COALINDIA",
      exchg: "NSE",
      qty: 10,
      pur: null,
      fId: "one",
      curr: "INR",
      type: "E",
      subt: "S",
      key: 0,
    },
    {
      id: "INE129A01019",
      sid: "GAIL",
      exchg: "NSE",
      qty: 43,
      pur: null,
      fId: "one",
      curr: "INR",
      type: "E",
      subt: "S",
      key: 3,
    },
    {
      id: "INE028A01039",
      sid: "BANKBARODA",
      exchg: "NSE",
      qty: 50,
      pur: null,
      fId: "one",
      curr: "INR",
      type: "E",
      subt: "S",
      key: 6,
    },
    {
      id: "INF109K01Z48",
      sid: "120594",
      exchg: null,
      qty: 12.653,
      pur: null,
      fId: "one",
      curr: "INR",
      type: "E",
      subt: "S",
      key: 8,
    },
    {
      id: "INF879O01027",
      sid: "122639",
      exchg: null,
      qty: 158.769,
      pur: null,
      fId: "one",
      curr: "INR",
      type: "E",
      subt: "S",
      key: 9,
    },
  ];

  const insData = {
    INF879O01027: {
      id: "INF879O01027",
      sid: "122639",
      tid: "",
      dir: null,
      name: "Parag Parikh Flexi Cap Fund - Direct Plan - Growth",
      type: "E",
      subt: "S",
      price: 46.8274,
      prev: 46.715,
      mftype: "O",
      mcapt: "Hybrid",
      tf: false,
      risk: "A",
      createdAt: "2022-07-01T13:30:42.082Z",
      updatedAt: "2022-07-01T13:30:42.082Z",
    },
    INF109K01Z48: {
      id: "INF109K01Z48",
      sid: "120594",
      tid: "",
      dir: null,
      name: "ICICI Prudential Technology Fund - Direct Plan -  Growth",
      type: "E",
      subt: "S",
      price: 139.49,
      prev: 140.45,
      mftype: "O",
      mcapt: "Hybrid",
      tf: false,
      risk: "A",
      createdAt: "2022-07-01T13:30:35.222Z",
      updatedAt: "2022-07-01T13:30:35.222Z",
    },
    INE129A01019: {
      id: "INE129A01019",
      sid: "GAIL",
      name: "GAIL (India) Limited",
      exchg: "NSE",
      type: "E",
      subt: "S",
      itype: null,
      price: 132.35,
      prev: 135.2,
      fv: null,
      under: null,
      yhigh: 173.5,
      yhighd: "2022-04-19",
      ylow: 125.2,
      ylowd: "2021-12-20",
      split: null,
      div: null,
      splitd: null,
      divdd: null,
      divrd: null,
      divpd: null,
      beta: 0.7622,
      mcap: 592635625472,
      mcapt: "Large",
      sector: null,
      ind: null,
      risk: "M",
      vol: 10075505,
      prevol: 9851023,
      createdAt: "2022-07-01T13:30:58.747Z",
      updatedAt: "2022-07-01T13:30:58.747Z",
    },
    INE028A01039: {
      id: "INE028A01039",
      sid: "BANKBARODA",
      name: "Bank of Baroda",
      exchg: "NSE",
      type: "E",
      subt: "S",
      itype: null,
      price: 96.95,
      prev: 97.4,
      fv: null,
      under: null,
      yhigh: 122.7,
      yhighd: "2022-04-11",
      ylow: 72.5,
      ylowd: "2021-08-23",
      split: null,
      div: null,
      splitd: null,
      divdd: null,
      divrd: null,
      divpd: null,
      beta: 0.8139,
      mcap: 497484791808,
      mcapt: "Large",
      sector: null,
      ind: null,
      risk: "M",
      vol: 32281337,
      prevol: 24612161,
      createdAt: "2022-07-01T13:30:58.407Z",
      updatedAt: "2022-07-01T13:30:58.407Z",
    },
    INE522F01014: {
      id: "INE522F01014",
      sid: "COALINDIA",
      name: "Coal India Limited",
      exchg: "NSE",
      type: "E",
      subt: "S",
      itype: null,
      price: 183.25,
      prev: 185.6,
      fv: null,
      under: null,
      yhigh: 209,
      yhighd: "2022-04-22",
      ylow: 132.75,
      ylowd: "2021-08-23",
      split: null,
      div: null,
      splitd: null,
      divdd: null,
      divrd: null,
      divpd: null,
      beta: 0.4535,
      mcap: 1095733411840,
      mcapt: "Large",
      sector: null,
      ind: null,
      risk: "M",
      vol: 17245911,
      prevol: 8693744,
      createdAt: "2022-07-01T13:30:58.665Z",
      updatedAt: "2022-07-01T13:30:58.665Z",
    },
  };

  const crypto = [
    {
      type: "A",
      subt: "C",
      name: "BTC-USD",
      curr: "INR",
      fId: "one",
      qty: 10,
    },
  ];

  const nps = [
    { name: "SM003010", curr: "INR", fId: "one", subt: "", qty: 10 },
  ];

  test("With data", async () => {
    simpleStorage.get.mockReturnValue(insData);
    const data = await calculatePrice(ins, [], [], 75, "INR");
    expect(data).toEqual({
      gainers: [
        {
          name: "Parag Parikh Flexi Cap Fund - Direct Plan - Growth",
          result: 0.24,
          id: "INF879O01027",
          value: 46.8274,
        },
      ],
      losers: [
        {
          name: "GAIL (India) Limited",
          result: -2.11,
          id: "INE129A01019",
          value: 132.35,
        },
        {
          name: "Coal India Limited",
          result: -1.27,
          id: "INE522F01014",
          value: 183.25,
        },
        {
          name: "ICICI Prudential Technology Fund - Direct Plan -  Growth",
          result: -0.68,
          id: "INF109K01Z48",
          value: 139.49,
        },
      ],
      yhighList: [],
      ylowList: [],
      volGainers: [
        {
          name: "Coal India Limited",
          result: 98.37,
          id: "INE522F01014",
          value: 17245911,
        },
        {
          name: "Bank of Baroda",
          result: 31.16,
          id: "INE028A01039",
          value: 32281337,
        },
        {
          name: "GAIL (India) Limited",
          result: 2.28,
          id: "INE129A01019",
          value: 10075505,
        },
      ],
      volLosers: [],
    });
  });

  test("With blank data", async () => {
    getCryptoRate.mockReturnValue(1000);
    const data = await calculatePrice([], [], [], 75, "INR");
    expect(data).toEqual({
      gainers: [],
      losers: [],
      volGainers: [],
      volLosers: [],
      yhighList: [],
      ylowList: [],
    });
  });

  test("With nps and crypto data", async () => {
    simpleStorage.get.mockReturnValue([
      {
        price: 23,
        id: "SM003010",
        name: "LIC",
        prev: 24,
        type: "F",
      },
    ]);
    getCryptoRate = jest.fn();
    getCryptoRate.mockReturnValue(1000);
    const data = await calculatePrice([], crypto, nps, 75, "INR");
    expect(data).toEqual({
      gainers: [],
      losers: [
        { id: "SM003010", name: "LIC", result: -4.17, value: 23 },
        { id: "BTC-USD", name: "BTC-USD", result: 0, value: 1000 },
      ],
      volGainers: [],
      volLosers: [],
      yhighList: [],
      ylowList: [],
    });
  });

  test("Without data", async () => {
    try {
      await calculatePrice();
    } catch (e) {
      expect(e.toString()).toContain("TypeError:");
    }
  });
});

describe("calculateAlerts", () => {
  const ins = [
    {
      id: "INE522F01014",
      sid: "COALINDIA",
      exchg: "NSE",
      qty: 10,
      pur: null,
      fId: "one",
      curr: "INR",
      type: "E",
      subt: "S",
      key: 0,
    },
    {
      id: "INE129A01019",
      sid: "GAIL",
      exchg: "NSE",
      qty: 43,
      pur: null,
      fId: "one",
      curr: "INR",
      type: "E",
      subt: "S",
      key: 3,
    },
    {
      id: "INE028A01039",
      sid: "BANKBARODA",
      exchg: "NSE",
      qty: 50,
      pur: null,
      fId: "one",
      curr: "INR",
      type: "E",
      subt: "S",
      key: 6,
    },
    {
      id: "INF109K01Z48",
      sid: "120594",
      exchg: null,
      qty: 12.653,
      pur: null,
      fId: "one",
      curr: "INR",
      type: "E",
      subt: "S",
      key: 8,
    },
    {
      id: "INF879O01027",
      sid: "122639",
      exchg: null,
      qty: 158.769,
      pur: null,
      fId: "one",
      curr: "INR",
      type: "E",
      subt: "S",
      key: 9,
    },
  ];

  const holdings = {
    uname: "abc",
    crypto: [
      {
        type: "A",
        subt: "C",
        name: "BTC-USD",
        curr: "INR",
        fId: "two",
        qty: 10,
      },
    ],
    nps: [{ name: "SM003010", curr: "INR", fId: "one", subt: "", qty: 10 }],
  };

  test("With data", async () => {
    simpleStorage.get.mockReturnValue(null);
    initializeInsData = jest.fn();
    initializeNPSData = jest.fn();
    calculatePrice = jest.fn();
    initializeInsData.mockReturnValue(true);
    initializeNPSData.mockReturnValue(true);
    calculatePrice.mockReturnValue(true);
    await calculateAlerts(
      holdings,
      { uname: "abc", ins: ins },
      75,
      "INR",
      true
    );

    expect(initializeInsData).toHaveBeenCalled();
    expect(initializeNPSData).toHaveBeenCalled();
    expect(calculatePrice).toHaveBeenCalled();
  });

  test("Without ins data", async () => {
    initializeInsData = jest.fn();
    initializeNPSData = jest.fn();
    calculatePrice = jest.fn();
    initializeInsData.mockReturnValue(true);
    initializeNPSData.mockReturnValue(true);
    calculatePrice.mockReturnValue(true);
    await calculateAlerts(holdings, null, 75, "INR", true);

    expect(initializeInsData).toBeCalledTimes(0);
    expect(initializeNPSData).toHaveBeenCalled();
    expect(calculatePrice).toHaveBeenCalled();
  });

  test("Without holding data", async () => {
    initializeInsData = jest.fn();
    initializeNPSData = jest.fn();
    calculatePrice = jest.fn();
    initializeInsData.mockReturnValue(true);
    initializeNPSData.mockReturnValue(true);
    calculatePrice.mockReturnValue(true);
    await calculateAlerts(null, { uname: "abc", ins }, 75, "INR", true);

    expect(initializeInsData).toHaveBeenCalled();
    expect(initializeNPSData).toBeCalledTimes(0);
    expect(calculatePrice).toHaveBeenCalled();
  });

  test("Without data", async () => {
    try {
      await calculateAlerts();
    } catch (e) {
      expect(e.toString()).toContain("TypeError:");
    }
  });
});

describe("isIndISIN", () => {
  test("With indian isin - ex 1", () => {
    expect(isIndISIN("INE522F01014")).toEqual(true);
  });

  test("With indian isin - ex 2", () => {
    expect(isIndISIN("INF522F01014")).toEqual(true);
  });

  test("other isin", () => {
    expect(isIndISIN("IPE522F01014")).toEqual(false);
  });

  test("less than 12 char", () => {
    expect(isIndISIN("IPE522F0114")).toEqual(false);
  });

  test("Without id", () => {
    try {
      isIndISIN();
    } catch (e) {
      expect(e.toString()).toContain("TypeError:");
    }
  });
});

describe("otherISIN", () => {
  test("With indian isin - ex 1", () => {
    expect(otherISIN("INE522F01014")).toEqual(false);
  });

  test("With indian isin - ex 2", () => {
    expect(otherISIN("INF522F01014")).toEqual(false);
  });

  test("other isin - ex 1", () => {
    expect(otherISIN("USE522F01014")).toEqual(true);
  });

  test("other isin - ex 2", () => {
    expect(otherISIN("CAE522F01014")).toEqual(true);
  });

  test("less than 12 char", () => {
    expect(otherISIN("IPE522F0114")).toEqual(false);
  });

  test("Without id", () => {
    try {
      otherISIN();
    } catch (e) {
      expect(e.toString()).toContain("TypeError:");
    }
  });
});

describe("initializeWatchlist", () => {
  const insData = {
    INF879O01027: {
      id: "INF879O01027",
      sid: "122639",
      tid: "",
      dir: null,
      name: "Parag Parikh Flexi Cap Fund - Direct Plan - Growth",
      type: "E",
      subt: "S",
      price: 46.8274,
      prev: 46.715,
      mftype: "O",
      mcapt: "Hybrid",
      tf: false,
      risk: "A",
      createdAt: "2022-07-01T13:30:42.082Z",
      updatedAt: "2022-07-01T13:30:42.082Z",
    },
    INF109K01Z48: {
      id: "INF109K01Z48",
      sid: "120594",
      tid: "",
      dir: null,
      name: "ICICI Prudential Technology Fund - Direct Plan -  Growth",
      type: "E",
      subt: "S",
      price: 139.49,
      prev: 140.45,
      mftype: "O",
      mcapt: "Hybrid",
      tf: false,
      risk: "A",
      createdAt: "2022-07-01T13:30:35.222Z",
      updatedAt: "2022-07-01T13:30:35.222Z",
    },
    INE129A01019: {
      id: "INE129A01019",
      sid: "GAIL",
      name: "GAIL (India) Limited",
      exchg: "NSE",
      type: "E",
      subt: "S",
      itype: null,
      price: 132.35,
      prev: 135.2,
      fv: null,
      under: null,
      yhigh: 173.5,
      yhighd: "2022-04-19",
      ylow: 125.2,
      ylowd: "2021-12-20",
      split: null,
      div: null,
      splitd: null,
      divdd: null,
      divrd: null,
      divpd: null,
      beta: 0.7622,
      mcap: 592635625472,
      mcapt: "Large",
      sector: null,
      ind: null,
      risk: "M",
      vol: 10075505,
      prevol: 9851023,
      createdAt: "2022-07-01T13:30:58.747Z",
      updatedAt: "2022-07-01T13:30:58.747Z",
    },
    INE028A01039: {
      id: "INE028A01039",
      sid: "BANKBARODA",
      name: "Bank of Baroda",
      exchg: "NSE",
      type: "E",
      subt: "S",
      itype: null,
      price: 96.95,
      prev: 97.4,
      fv: null,
      under: null,
      yhigh: 122.7,
      yhighd: "2022-04-11",
      ylow: 72.5,
      ylowd: "2021-08-23",
      split: null,
      div: null,
      splitd: null,
      divdd: null,
      divrd: null,
      divpd: null,
      beta: 0.8139,
      mcap: 497484791808,
      mcapt: "Large",
      sector: null,
      ind: null,
      risk: "M",
      vol: 32281337,
      prevol: 24612161,
      createdAt: "2022-07-01T13:30:58.407Z",
      updatedAt: "2022-07-01T13:30:58.407Z",
    },
    INE522F01014: {
      id: "INE522F01014",
      sid: "COALINDIA",
      name: "Coal India Limited",
      exchg: "NSE",
      type: "E",
      subt: "S",
      itype: null,
      price: 183.25,
      prev: 185.6,
      fv: null,
      under: null,
      yhigh: 209,
      yhighd: "2022-04-22",
      ylow: 132.75,
      ylowd: "2021-08-23",
      split: null,
      div: null,
      splitd: null,
      divdd: null,
      divrd: null,
      divpd: null,
      beta: 0.4535,
      mcap: 1095733411840,
      mcapt: "Large",
      sector: null,
      ind: null,
      risk: "M",
      vol: 17245911,
      prevol: 8693744,
      createdAt: "2022-07-01T13:30:58.665Z",
      updatedAt: "2022-07-01T13:30:58.665Z",
    },
    INF277K01Z77: {
      id: "INF277K01Z77",
      sid: "135800",
      tid: "",
      dir: null,
      name: "Tata Digital India Fund-Direct Plan-Growth",
      type: "E",
      subt: "S",
      price: 33.7926,
      prev: 34.1017,
      mftype: "O",
      mcapt: "Hybrid",
      tf: false,
      risk: "A",
      createdAt: "2022-07-01T13:30:35.482Z",
      updatedAt: "2022-07-01T13:30:35.482Z",
    },
    INE752E01010: {
      id: "INE752E01010",
      sid: "POWERGRID",
      name: "Power Grid Corporation of India Limited",
      exchg: "NSE",
      type: "E",
      subt: "S",
      itype: null,
      price: 206.5,
      prev: 211.9,
      fv: null,
      under: null,
      yhigh: 248.35,
      yhighd: "2022-05-10",
      ylow: 167.15,
      ylowd: "2021-07-29",
      split: null,
      div: null,
      splitd: null,
      divdd: null,
      divrd: null,
      divpd: null,
      beta: 0.2348,
      mcap: 1440430424064,
      mcapt: "Large",
      sector: null,
      ind: null,
      risk: "M",
      vol: 8345302,
      prevol: 16695542,
      createdAt: "2022-07-01T13:30:59.447Z",
      updatedAt: "2022-07-01T13:30:59.447Z",
    },

    INE848E01016: {
      id: "INE848E01016",
      sid: "NHPC",
      name: "NHPC Limited",
      exchg: "NSE",
      type: "E",
      subt: "S",
      itype: null,
      price: 30.85,
      prev: 30.75,
      fv: null,
      under: null,
      yhigh: 37.6,
      yhighd: "2022-04-22",
      ylow: 25.3,
      ylowd: "2021-08-11",
      split: null,
      div: null,
      splitd: null,
      divdd: null,
      divrd: null,
      divpd: null,
      beta: 0.1209,
      mcap: 308883750912,
      mcapt: "Mid",
      sector: null,
      ind: null,
      risk: "A",
      vol: 6808255,
      prevol: 8400492,
      createdAt: "2022-07-01T13:30:59.328Z",
      updatedAt: "2022-07-01T13:30:59.328Z",
    },
  };

  const watchlist = [
    {
      id: "INF277K01Z77",
      sid: "135800",
      curr: "INR",
      type: null,
      subt: null,
      itype: null,
    },
    {
      id: "INE752E01010",
      sid: "POWERGRID",
      curr: "INR",
      type: "E",
      subt: "S",
      itype: null,
    },
    {
      id: "INE848E01016",
      sid: "NHPC",
      type: "E",
      subt: "S",
      itype: null,
    },
  ];

  test("With ins and crypto data", async () => {
    loadInstruments = jest.fn();
    simpleStorage.get.mockReturnValue(insData);

    const ins = [
      {
        id: "INE522F01014",
        sid: "COALINDIA",
        exchg: "NSE",
        fId: "one",
        curr: "INR",
        type: "E",
        subt: "S",
        key: 0,
      },
      {
        id: "INE129A01019",
        sid: "GAIL",
        exchg: "NSE",
        fId: "one",
        curr: "INR",
        type: "E",
        subt: "S",
        key: 3,
      },
      {
        id: "INE028A01039",
        sid: "BANKBARODA",
        exchg: "NSE",
        qty: 50,
        pur: null,
        fId: "one",
        curr: "INR",
        type: "E",
        subt: "S",
        key: 6,
      },
      {
        id: "INF109K01Z48",
        sid: "120594",
        exchg: null,
        qty: 12.653,
        pur: null,
        fId: "one",
        curr: "INR",
        type: "E",
        subt: "S",
        key: 8,
      },
      {
        id: "INF879O01027",
        sid: "122639",
        exchg: null,
        qty: 158.769,
        pur: null,
        fId: "one",
        curr: "INR",
        type: "E",
        subt: "S",
        key: 9,
      },
    ];
    const data = await initializeWatchlist(true, watchlist, ins, [
      {
        type: "A",
        subt: "C",
        name: "BTC-USD",
        curr: "INR",
      },
    ]);
    expect(loadInstruments).toHaveBeenCalled();
    expect(data).toEqual([
      {
        id: "INE522F01014",
        type: "E",
        subt: "S",
        itype: null,
        sid: "COALINDIA",
      },
      {
        id: "INE129A01019",
        type: "E",
        subt: "S",
        itype: null,
        sid: "GAIL",
      },
      {
        id: "INE028A01039",
        type: "E",
        subt: "S",
        itype: null,
        sid: "BANKBARODA",
      },
      {
        id: "INF109K01Z48",
        type: "E",
        subt: "S",
        itype: undefined,
        sid: "120594",
      },
      {
        id: "INF879O01027",
        type: "E",
        subt: "S",
        itype: undefined,
        sid: "122639",
      },
      { id: "BTC-USD", sid: "BTC-USD", type: "A", subt: "C" },
    ]);
  });

  test("Without ins and crypto data", async () => {
    loadInstruments = jest.fn();
    simpleStorage.get.mockReturnValue(insData);
    const data = await initializeWatchlist(true, watchlist, [], []);
    expect(loadInstruments).toHaveBeenCalled();
    expect(data).toEqual([]);
  });

  test("With blank data", async () => {
    loadInstruments = jest.fn();
    simpleStorage.get.mockReturnValue(insData);

    const data = await initializeWatchlist(true, [], [], []);
    expect(loadInstruments).toBeCalledTimes(1);
    expect(data).toEqual([]);
  });

  test("Without data", async () => {
    try {
      await initializeWatchlist();
    } catch (e) {
      expect(e.toString()).toContain("TypeError:");
    }
  });
});
