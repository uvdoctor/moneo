let { getAndPushData } = require("../src/getData");
const {
  pushData,
  pushDataForFeed,
  getTableNameFromInitialWord,
} = require("../../moneoutilslayer/lib/nodejs/databaseUtils");
const { calculateSchema } = require("../src/calculate");
const {
  getFundamentalDataByLimit,
} = require("../../moneopricelayer/lib/nodejs/eod");

jest.mock("../../moneoutilslayer/lib/nodejs/databaseUtils");
jest.mock("../src/calculate");
jest.mock("../../moneopricelayer/lib/nodejs/eod");

describe("Test GetAndPushData", () => {
  beforeEach(() => {
    getTableNameFromInitialWord.mockReturnValue("Table");
    getFundamentalDataByLimit.mockReturnValue({
      data: {
        0: {
          General: {
            Code: "EQUITAS",
            Type: "Common Stock",
            Name: "Equitas Holdings Limited",
            Exchange: "NSE",
            CurrencyCode: "INR",
            CurrencyName: "Indian Rupee",
            CurrencySymbol: "INR",
            CountryName: "India",
            CountryISO: "IN",
            ISIN: "INE988K01017",
            Sector: "Financial Services",
            Industry: "Credit Services",
            Description:
              "Equitas Holdings Limited, through its subsidiaries, operates as a non-banking financial institution in India. The company operates in Banking and Finance, and Others segments. It accepts current and savings accounts, and term deposits; and offers micro finance loans, vehicle finance, housing finance, micro and small enterprises loans, agri loans, gold loans, business loans, etc. The company also offers online freight facilitation services under the Wowtruck brand name. It serves individuals, and micro and small enterprises. The company was incorporated in 2007 and is based in Chennai, India. Address: 410A, Spencer Plaza, Chennai, India, 600002",
            FullTimeEmployees: 0,
            UpdatedAt: "2022-06-06",
          },
          Highlights: {
            MarketCapitalization: 30709624832,
            MarketCapitalizationMln: 30709.6248,
            EBITDA: null,
            PERatio: 15.0924,
            PEGRatio: null,
            WallStreetTargetPrice: 183.5,
            BookValue: 141.758,
            DividendShare: 0,
            DividendYield: 0,
            EarningsShare: 5.95,
            EPSEstimateCurrentYear: 5.11,
            EPSEstimateNextYear: 8.51,
            EPSEstimateNextQuarter: 0,
            MostRecentQuarter: "2022-03-31",
            ProfitMargin: 0.0743,
            OperatingMarginTTM: 0.1698,
            ReturnOnAssetsTTM: 0.0076,
            ReturnOnEquityTTM: 0.05,
            RevenueTTM: 20629800960,
            RevenuePerShareTTM: 80.127,
            QuarterlyRevenueGrowthYOY: 0.407,
            GrossProfitTTM: 20629800000,
            DilutedEpsTTM: 5.95,
            QuarterlyEarningsGrowthYOY: 0.498,
          },
          Valuation: {
            TrailingPE: 15.0924,
            ForwardPE: 0,
            PriceSalesTTM: 1.4886,
            PriceBookMRQ: 1.2609,
            EnterpriseValueRevenue: 1.134,
            EnterpriseValueEbitda: 8.7936,
          },
          Technicals: {
            Beta: 1.0073,
            "52WeekHigh": 145,
            "52WeekLow": 88.4,
            "50DayMA": 108.995,
            "200DayMA": 116.2665,
            SharesShort: 0,
            SharesShortPriorMonth: 0,
            ShortRatio: 0,
            ShortPercent: 0,
          },
          SplitsDividends: {
            ForwardAnnualDividendRate: 4,
            ForwardAnnualDividendYield: 0.034,
            PayoutRatio: 0,
            DividendDate: "0000-00-00",
            ExDividendDate: "2021-02-11",
            LastSplitFactor: "",
            LastSplitDate: "0000-00-00",
          },
          Earnings: {
            Last_0: {
              date: "2018-03-31",
              epsActual: 1.02,
              epsEstimate: 0.87,
              epsDifference: 0.15,
              surprisePercent: 17.2414,
            },
            Last_1: {
              date: "2017-12-31",
              epsActual: -0.89,
              epsEstimate: 0.6,
              epsDifference: -1.49,
              surprisePercent: -248.3333,
            },
            Last_2: {
              date: "2017-09-30",
              epsActual: 0.32,
              epsEstimate: 0.37,
              epsDifference: -0.05,
              surprisePercent: -13.5135,
            },
            Last_3: {
              date: "2017-06-30",
              epsActual: 0.45,
              epsEstimate: 0.63,
              epsDifference: -0.18,
              surprisePercent: -28.5714,
            },
          },
        },
      },
      url: "url",
    });
    pushData.mockReturnValueOnce(true);
    calculateSchema.mockReturnValueOnce(true);
    pushDataForFeed.mockReturnValue(true);
  });

  test("should resolve", async () => {
    const data = await getAndPushData();
    expect(data).toBe();
  });

  test("should throw error", async () => {
    getFundamentalDataByLimit.mockReturnValue({ data: {}, url: "url" });
    try {
      await getAndPushData();
    } catch (e) {
      expect(e.toString()).toMatch(
        "TypeError: Cannot destructure property 'data' of '(intermediate value)' as it is undefined."
      );
    }
  });
});
