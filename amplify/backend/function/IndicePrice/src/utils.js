const { utility } = require("/opt/nodejs/utility");

const constructedApiArray = (diff) => {
  const { date, month, yearFull } = utility(diff);
  const fileName = `ind_close_all_${date}${month}${yearFull}`;

  const apiArray = [
    {
      fileName: fileName,
      url: `https://archives.nseindia.com/content/indices/${fileName}.csv`,
      exchg: "NSE",
      cat: "NSE",
      type: null,
      subt: null,
      schema: {
        id: "",
        price: 0,
        name: "",
        ind: "",
        pe: 0,
        pb: 0,
        chg: 0,
      },
      codes: {
        id: "Index Name",
        name: "Index Name",
        ind: "Index Name",
        price: "Closing Index Value",
        pe: "P/E",
        pb: "P/B",
        chg: "Change(%)"
      },
    },
    {
      url: "https://api.bseindia.com/BseIndiaAPI/api/MktCapBoard/w?type=2&cat=1",
      exchg: "BSE",
      cat: "MarketCap",
      type: "E",
      subt: "S",
      schema: {
        id: "",
        name: "",
        prev: 0,
        yhigh: 0,
        ylow: 0,
        price: 0,
      },
      codes: {
        id: "INDX_CD",
        name: "IndexName",
        prev: "Prev_Close",
        yhigh: "Week52High",
        ylow: "Week52Low",
        price: "Curvalue",
      },
    },
    {
      url: "https://api.bseindia.com/BseIndiaAPI/api/MktCapBoard/w?type=2&cat=2",
      exchg: "BSE",
      cat: "SectorAndInd",
      type: "E",
      subt: "S",
      schema: {
        id: "",
        name: "",
        prev: 0,
        yhigh: 0,
        ylow: 0,
        ind: "",
        price: 0,
      },
      codes: {
        id: "INDX_CD",
        name: "IndexName",
        prev: "Prev_Close",
        yhigh: "Week52High",
        ylow: "Week52Low",
        ind: "IndexName",
        price: "Curvalue",
      },
    },
    {
      url: "https://api.bseindia.com/BseIndiaAPI/api/MktCapBoard/w?type=2&cat=3",
      exchg: "BSE",
      cat: "Thematics",
      type: "E",
      subt: "S",
      schema: {
        id: "",
        name: "",
        prev: 0,
        yhigh: 0,
        ylow: 0,
        price: 0,
      },
      codes: {
        id: "INDX_CD",
        name: "IndexName",
        prev: "Prev_Close",
        yhigh: "Week52High",
        ylow: "Week52Low",
        price: "Curvalue",
      },
    },
    {
      url: "https://api.bseindia.com/BseIndiaAPI/api/MktCapBoard/w?type=2&cat=4",
      exchg: "BSE",
      cat: "Strategy",
      type: "E",
      subt: "S",
      schema: {
        id: "",
        name: "",
        prev: 0,
        yhigh: 0,
        ylow: 0,
        price: 0,
      },
      codes: {
        id: "INDX_CD",
        name: "IndexName",
        prev: "Prev_Close",
        yhigh: "Week52High",
        ylow: "Week52Low",
        price: "Curvalue",
      },
    },
    {
      url: "https://api.bseindia.com/BseIndiaAPI/api/MktCapBoard/w?type=2&cat=5",
      exchg: "BSE",
      cat: "Sustainability",
      type: "E",
      subt: "S",
      schema: {
        id: "",
        name: "",
        prev: 0,
        yhigh: 0,
        ylow: 0,
        price: 0,
      },
      codes: {
        id: "INDX_CD",
        name: "IndexName",
        prev: "Prev_Close",
        yhigh: "Week52High",
        ylow: "Week52Low",
        price: "Curvalue",
      },
    },
    {
      url: "https://api.bseindia.com/BseIndiaAPI/api/MktCapBoard/w?type=1&cat=6",
      exchg: "BSE",
      cat: "Volatility",
      type: "E",
      subt: "S",
      schema: {
        id: "",
        name: "",
        prev: 0,
        price: 0,
      },
      codes: {
        id: "INDEX_CODE",
        name: "IndicesWatchName",
        prev: "PrevDayClose",
        price: "Curvalue",
      },
    },
    {
      url: "https://api.bseindia.com/BseIndiaAPI/api/MktCapBoard/w?type=1&cat=7",
      exchg: "BSE",
      cat: "Composite",
      type: "F",
      subt: "CB",
      schema: {
        id: "",
        name: "",
        prev: 0,
        price: 0,
      },
      codes: {
        id: "INDEX_CODE",
        name: "IndicesWatchName",
        prev: "PrevDayClose",
        price: "Curvalue",
      },
    },
    {
      url: "https://api.bseindia.com/BseIndiaAPI/api/MktCapBoard/w?type=1&cat=8",
      exchg: "BSE",
      cat: "Government",
      type: "F",
      subt: "GB",
      schema: {
        id: "",
        name: "",
        prev: 0,
        price: 0,
      },
      codes: {
        id: "INDEX_CODE",
        name: "IndicesWatchName",
        prev: "PrevDayClose",
        price: "Curvalue",
      },
    },
    {
      url: "https://api.bseindia.com/BseIndiaAPI/api/MktCapBoard/w?type=1&cat=9",
      exchg: "BSE",
      cat: "Corporate",
      type: "F",
      subt: "CB",
      schema: {
        id: "",
        name: "",
        prev: 0,
        price: 0,
      },
      codes: {
        id: "INDEX_CODE",
        name: "IndicesWatchName",
        prev: "PrevDayClose",
        price: "Curvalue",
      },
    },
    {
      url: "https://api.bseindia.com/BseIndiaAPI/api/MktCapBoard/w?type=1&cat=10",
      exchg: "BSE",
      cat: "MoneyMarket",
      type: "F",
      subt: "L",
      schema: {
        id: "",
        name: "",
        prev: 0,
        price: 0,
      },
      codes: {
        id: "INDEX_CODE",
        name: "IndicesWatchName",
        prev: "PrevDayClose",
        price: "Curvalue",
      },
    },
  ];
  return apiArray;
};

module.exports = constructedApiArray;
