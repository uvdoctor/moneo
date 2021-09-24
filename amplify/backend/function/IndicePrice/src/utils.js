const utility = require("opt/nodejs/utility");
const { date, month, monthChar, year, yearFull } = utility();
const fileName = `ind_close_all_${date}${month}${yearFull}`;
const apiArray = [
  // {
  //   file: fileName,
  //   url: `https://archives.nseindia.com/content/indices/${fileName}.csv`,
  //   schema: {
  //     id: "",
  //     price: 0,
  //   },
  //   codes: {
  //     indexName: "Index Name",
  //     price: "Closing Index Value",
  //   },
  // },
  {
    url: "https://api.bseindia.com/BseIndiaAPI/api/MktCapBoard/w?type=2&cat=1",
    sector: "marketCap",
  },
  {
    url: "https://api.bseindia.com/BseIndiaAPI/api/MktCapBoard/w?type=2&cat=2",
    sector: "sectorAndIndustry",
  },
  {
    url: "https://api.bseindia.com/BseIndiaAPI/api/MktCapBoard/w?type=2&cat=3",
    sector: "thematics",
  },
  {
    url: "https://api.bseindia.com/BseIndiaAPI/api/MktCapBoard/w?type=2&cat=4",
    sector: "strategy",
  },
  {
    url: "https://api.bseindia.com/BseIndiaAPI/api/MktCapBoard/w?type=2&cat=5",
    sector: "sustainability",
  },
  {
    url: "https://api.bseindia.com/BseIndiaAPI/api/MktCapBoard/w?type=1&cat=6",
    sector: "volatility",
  },
  {
    url: "https://api.bseindia.com/BseIndiaAPI/api/MktCapBoard/w?type=1&cat=7",
    sector: "composite",
  },
  {
    url: "https://api.bseindia.com/BseIndiaAPI/api/MktCapBoard/w?type=1&cat=8",
    sector: "government",
  },
  {
    url: "https://api.bseindia.com/BseIndiaAPI/api/MktCapBoard/w?type=1&cat=9",
    sector: "corporate",
  },
  {
    url: "https://api.bseindia.com/BseIndiaAPI/api/MktCapBoard/w?type=1&cat=10",
    sector: "moneyMarket",
  },
];
module.exports = apiArray;
