const { calculateSchema } = require("../src/calculate");
const { appendGenericFields
} = require("../../moneoutilslayer/lib/nodejs/utility");

jest.mock("../../moneoutilslayer/lib/nodejs/utility")

describe("CalcSchema", () => {
  appendGenericFields.mockReturnValue({})
  test("Schema", () => {
    const data = calculateSchema(
      {
        0: {
          General: {
            Code: "21STCENMGM",
            Type: "Common Stock",
            Name: "21st Century Management Services Limited",
            Exchange: "NSE",
            CurrencyCode: "INR",
            CurrencyName: "Indian Rupee",
            CurrencySymbol: "INR",
            CountryName: "India",
            CountryISO: "IN",
            ISIN: "INE253B01015",
            Sector: "Financial Services",
            Industry: "Capital Markets",
            Description:
              "Twentyfirst Century Management Services Limited invests in capital and debt instruments in India. It invests and trades in shares and derivatives in the capital, and futures and options markets. The company was incorporated in 1986 and is based in Mumbai, India. Address: 2B, Grease House, Mumbai, India, 400015",
            FullTimeEmployees: 10,
            UpdatedAt: "2022-02-19",
          },
          Highlights: {
            MarketCapitalization: 358019744,
            MarketCapitalizationMln: 358.0197,
            EBITDA: 243228496,
            PERatio: 1.47,
            PEGRatio: null,
            WallStreetTargetPrice: null,
            BookValue: 60.19,
            DividendShare: 0,
            DividendYield: 0,
            EarningsShare: 23.095,
            EPSEstimateCurrentYear: 0,
            EPSEstimateNextYear: 0,
            EPSEstimateNextQuarter: 0,
            MostRecentQuarter: "2021-12-31",
            ProfitMargin: 0.0899,
            OperatingMarginTTM: 0.0898,
            ReturnOnAssetsTTM: 0.5734,
            ReturnOnEquityTTM: 0.1167,
            RevenueTTM: 2699094016,
            RevenuePerShareTTM: 256.947,
            QuarterlyRevenueGrowthYOY: 242.549,
            GrossProfitTTM: 72556000,
            DilutedEpsTTM: 23.095,
            QuarterlyEarningsGrowthYOY: 0,
          },
          Valuation: {
            TrailingPE: 1.47,
            ForwardPE: 0,
            PriceSalesTTM: 0.1326,
            PriceBookMRQ: 0.6215,
            EnterpriseValueRevenue: 0.1431,
            EnterpriseValueEbitda: 1.5866,
          },
          Technicals: {
            Beta: 0.4304,
            "52WeekHigh": 64,
            "52WeekLow": 11.6,
            "50DayMA": 45.199,
            "200DayMA": 37.519,
            SharesShort: 0,
            SharesShortPriorMonth: 0,
            ShortRatio: 0,
            ShortPercent: 0,
          },
          SplitsDividends: {
            ForwardAnnualDividendRate: 0,
            ForwardAnnualDividendYield: 0,
            PayoutRatio: 0,
            DividendDate: "0000-00-00",
            ExDividendDate: "2018-07-04",
            LastSplitFactor: "",
            LastSplitDate: "0000-00-00",
          },
          Earnings: {
            Last_0: {
              date: "0000-00-00",
              epsActual: 0,
              epsEstimate: 0,
              epsDifference: 0,
              surprisePercent: 0,
            },
            Last_1: {
              date: "0000-00-00",
              epsActual: 0,
              epsEstimate: 0,
              epsDifference: 0,
              surprisePercent: 0,
            },
            Last_2: {
              date: "0000-00-00",
              epsActual: 0,
              epsEstimate: 0,
              epsDifference: 0,
              surprisePercent: 0,
            },
            Last_3: {
              date: "0000-00-00",
              epsActual: 0,
              epsEstimate: 0,
              epsDifference: 0,
              surprisePercent: 0,
            },
          },
          Financials: {},
        },
      },
      {},
      "NSE",
      "Insfun"
    );
    expect(data).toEqual([
      [
        {
          PutRequest: {
            Item: {
              exchg: "NSE",
              id: "21STCENMGM",
              isin: "INE253B01015",
              val: {
                TrailingPE: 1.47,
                ForwardPE: 0,
                PriceSalesTTM: 0.1326,
                PriceBookMRQ: 0.6215,
                EnterpriseValueRevenue: 0.1431,
                EnterpriseValueEbitda: 1.5866,
              },
              tech: {
                Beta: 0.4304,
                "52WeekHigh": 64,
                "52WeekLow": 11.6,
                "50DayMA": 45.199,
                "200DayMA": 37.519,
                SharesShort: 0,
                SharesShortPriorMonth: 0,
                ShortRatio: 0,
                ShortPercent: 0,
              },
              sector: "Financial Services",
              ind: "Capital Markets",
            },
          },
        },
      ],
    ]);
  });
});
