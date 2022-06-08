const {
  extractDataFromCSV,
  extractPartOfData,
  mergeEodAndExchgData,
} = require("../src/bhavUtils");
const { calcSchema } = require("../src/calculate");
const { cleanDirectory } = require("../../moneoutilslayer/lib/nodejs/downloadUtils");
jest.mock("../../moneoutilslayer/lib/nodejs/downloadUtils");

jest.mock("../src/calculate");

const schema = {
  id: "",
  sid: "",
  name: "",
  type: "",
  subt: "",
  itype: "",
  price: 0,
  prev: 0,
  risk: "M",
};

const codes = {
  sid: "SYMBOL",
  id: "ISIN",
  name: "SYMBOL",
  price: "LAST",
  prev: "PREVCLOSE",
  type: "SERIES",
  subt: "",
};

describe("Test Bhavutils", () => {
  cleanDirectory.mockReturnValue(true)
  test("File Exists", async () => {
    calcSchema.mockReturnValueOnce({
      updateSchema: {
        id: "INE144J01027",
        sid: "20MICRONS",
        name: "20MICRONS",
        risk: "M",
      },
      isBond: false,
    });
    // keep file in tmp/temp folder
    const data = await extractDataFromCSV(
      "cm07JUN2022bhav.csv",
      "NSE",
      codes,
      schema,
      "InExchg",
      {},
      {},
      {
        "20MICRONS": {
          yhigh: 108.25,
          ylow: 48.45,
          yhighd: "18-Jan-2022",
          ylowd: "23-Aug-2021",
        },
      },
      {},
      "INBond"
    );
    expect(data).toEqual({
      exchgData: [
        [
          {
            PutRequest: {
              Item: {
                id: "INE144J01027",
                name: "20MICRONS",
                risk: "M",
                sid: "20MICRONS",
                yhigh: 108.25,
                yhighd: "2022-01-18",
                ylow: 48.45,
                ylowd: "2021-08-23",
              },
            },
          },
        ],
      ],
      bondData: [],
    });
  });
});

describe("Test extractPartOfData", () => {
  cleanDirectory.mockReturnValue(true)
  test("File Exists", async () => {
    // keep file in tmp/temp folder
    const data = await extractPartOfData(
      "CM_52_wk_High_low_07062022.csv",
      { sid: "_0", yhigh: "_2", yhighd: "_3", ylow: "_4", ylowd: "_5" },
      {},
      {},
      {}
    );
    expect(data).toEqual(1);
  });
});

describe("Test extractPartOfData", () => {
  test("With every paramter data", async () => {
    const data = await mergeEodAndExchgData(
      [
        [
          {
            PutRequest: {
              Item: {
                id: "INE144J01027",
                name: "20MICRONS",
                risk: "M",
                sid: "20MICRONS",
                yhigh: 108.25,
                yhighd: "2022-01-18",
                ylow: 48.45,
                ylowd: "2021-08-23",
              },
            },
          },
        ],
      ],
      [
        {
          code: "20MICRONS",
          MarketCapitalization: 1909090,
          adjusted_close: 987,
          hi_250d: 878,
          lo_250d: 2732,
          Beta: 0.9,
          volume: 2371287312,
        },
      ],
      [{ date: "2017-01-05", code: "20MICRONS", split: "" }],
      [
        {
          code: "20MICRONS",
          date: "2017-01-05",
          recordDate: "2017-01-05",
          paymentDate: "2017-01-05",
          dividend: 90,
        },
      ],
      [
        {
          code: "20MICRONS",
          volume: 8298904,
        },
      ]
    );
    expect(data).toEqual([
      [
        {
          PutRequest: {
            Item: {
              beta: 0.9,
              div: 90,
              divdd: "2017-01-05",
              divpd: "2017-01-05",
              divrd: "2017-01-05",
              id: "INE144J01027",
              mcap: 1909090,
              name: undefined,
              prevol: 8298904,
              price: 987,
              risk: undefined,
              sid: "20MICRONS",
              split: "",
              splitd: "2017-01-05",
              vol: 2371287312,
              yhigh: 108.25,
              yhighd: "2022-01-18",
              ylow: 48.45,
              ylowd: "2021-08-23",
            },
          },
        },
      ],
    ]);
  });

  test("Without split and dividend data", async () => {
    const data = await mergeEodAndExchgData(
      [
        [
          {
            PutRequest: {
              Item: {
                id: "INE144J01027",
                name: "20MICRONS",
                risk: "M",
                sid: "20MICRONS",
                yhigh: 108.25,
                yhighd: "2022-01-18",
                ylow: 48.45,
                ylowd: "2021-08-23",
              },
            },
          },
        ],
      ],
      [
        {
          code: "20MICRONS",
          MarketCapitalization: 1909090,
          adjusted_close: 987,
          hi_250d: 878,
          lo_250d: 2732,
          Beta: 0.9,
          volume: 2371287312,
        },
      ],
      [{ date: "2017-01-05", code: "20MICRONS", split: "" }],
      [
        {
          code: "20MICRONS",
          date: "2017-01-05",
          recordDate: "2017-01-05",
          paymentDate: "2017-01-05",
          dividend: 90,
        },
      ],
      [
        {
          code: "20MICRONS",
          volume: 8298904,
        },
      ]
    );
    expect(data).toEqual([
      [
        {
          PutRequest: {
            Item: {
              beta: 0.9,
              div: 90,
              divdd: "2017-01-05",
              divpd: "2017-01-05",
              divrd: "2017-01-05",
              id: "INE144J01027",
              mcap: 1909090,
              name: undefined,
              prevol: 8298904,
              price: 987,
              risk: undefined,
              sid: "20MICRONS",
              split: "",
              splitd: "2017-01-05",
              vol: 2371287312,
              yhigh: 108.25,
              yhighd: "2022-01-18",
              ylow: 48.45,
              ylowd: "2021-08-23",
            },
          },
        },
      ],
    ]);
  });

  test("Withot eoddata data", async () => {
    const data = await mergeEodAndExchgData(
      [
        [
          {
            PutRequest: {
              Item: {
                id: "INE144J01027",
                name: "20MICRONS",
                risk: "M",
                sid: "20MICRONS",
                yhigh: 108.25,
                yhighd: "2022-01-18",
                ylow: 48.45,
                ylowd: "2021-08-23",
              },
            },
          },
        ],
      ],
      [
        {
          code: "20MICRONS",
          MarketCapitalization: 1909090,
          adjusted_close: 987,
          hi_250d: 878,
          lo_250d: 2732,
          Beta: 0.9,
          volume: 2371287312,
        },
      ],
      [{ date: "2017-01-05", code: "20MICRONS", split: "" }],
      [
        {
          code: "20MICRONS",
          date: "2017-01-05",
          recordDate: "2017-01-05",
          paymentDate: "2017-01-05",
          dividend: 90,
        },
      ],
      [
        {
          code: "20MICRONS",
          volume: 8298904,
        },
      ]
    );
    expect(data).toEqual([
      [
        {
          PutRequest: {
            Item: {
              beta: 0.9,
              div: 90,
              divdd: "2017-01-05",
              divpd: "2017-01-05",
              divrd: "2017-01-05",
              id: "INE144J01027",
              mcap: 1909090,
              name: undefined,
              prevol: 8298904,
              price: 987,
              risk: undefined,
              sid: "20MICRONS",
              split: "",
              splitd: "2017-01-05",
              vol: 2371287312,
              yhigh: 108.25,
              yhighd: "2022-01-18",
              ylow: 48.45,
              ylowd: "2021-08-23",
            },
          },
        },
      ],
    ]);
  });
});
