const { getData } = require("../src/getData");
const {
  appendGenericFields,
} = require("../../moneoutilslayer/lib/nodejs/utility");

jest.mock("../../moneoutilslayer/lib/nodejs/utility");

describe("GetData", () => {
  appendGenericFields.mockReturnValue({});
  const fileName = `ind_close_all_03062022`;
  test("BSE", async () => {
    const data = await getData(
      [],
      "Table",
      "https://api.bseindia.com/BseIndiaAPI/api/MktCapBoard/w?type=2&cat=1",
      "Cat",
      "BSE",
      "F",
      {
        id: "",
        name: "",
        prev: 0,
        yhigh: 0,
        ylow: 0,
        price: 0,
      },
      {
        id: "INDX_CD",
        name: "IndexName",
        prev: "Prev_Close",
        yhigh: "Week52High",
        ylow: "Week52Low",
        price: "Curvalue",
      },
      "BSE"
    );
    expect(data).toEqual([
      [
        {
          PutRequest: {
            Item: {
              curr: "INR",
              exchg: "BSE",
              prev: 0,
              price: 8596.66,
              subt: "F",
              type: "BSE",
              yhigh: null,
              ylow: null,
            },
          },
        },
        {
          PutRequest: {
            Item: {
              curr: "INR",
              exchg: "BSE",
              prev: 0,
              price: 6713.99,
              subt: "F",
              type: "BSE",
              yhigh: null,
              ylow: null,
            },
          },
        },
        {
          PutRequest: {
            Item: {
              curr: "INR",
              exchg: "BSE",
              prev: 0,
              price: 6542.74,
              subt: "F",
              type: "BSE",
              yhigh: null,
              ylow: null,
            },
          },
        },
        {
          PutRequest: {
            Item: {
              curr: "INR",
              exchg: "BSE",
              prev: 0,
              price: 7121.95,
              subt: "F",
              type: "BSE",
              yhigh: null,
              ylow: null,
            },
          },
        },
        {
          PutRequest: {
            Item: {
              curr: "INR",
              exchg: "BSE",
              prev: 0,
              price: 5619.42,
              subt: "F",
              type: "BSE",
              yhigh: null,
              ylow: null,
            },
          },
        },
      ],
    ]);
  });

  test("NSE", async () => {
    const data = await getData(
      [
        {
          "Index Name": "HDFC",
          "Closing Index Value": 100,
          "P/E": 100,
          "P/B": 100,
          "Change(%)": 6,
        },
      ],
      "Table",
      `https://archives.nseindia.com/content/indices/${fileName}.csv`,
      "Cat",
      "NSE",
      "F",
      {
        id: "",
        price: 0,
        name: "",
        ind: "",
        pe: 0,
        pb: 0,
        prev: 0,
      },
      {
        id: "Index Name",
        name: "Index Name",
        ind: "Index Name",
        price: "Closing Index Value",
        pe: "P/E",
        pb: "P/B",
        chg: "Change(%)",
      },
      "NSE"
    );
    expect(data).toEqual([
      [
        {
          PutRequest: {
            Item: {
              curr: "INR",
              exchg: "NSE",
              id: "HDFC",
              ind: null,
              name: "HDFC",
              pb: 100,
              pe: 100,
              prev: 94.34,
              price: 100,
              subt: "F",
              type: "NSE",
            },
          },
        },
      ],
    ]);
  });
});
