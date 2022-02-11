const axios = require("axios");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const getMonthYearByDate = (date) => {
  if (!date) return { month: 0, year: 0 };
  const monthsArray = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const parts = date.split("-");
  return { month: monthsArray.indexOf(parts[1]) + 1, year: parts[2] };
};

const calculateYTM = (rate, sm, sy, mm, my, fv, mprice) => {
  const numOfYear = (12 - sm) / 12 + (my - sy - 1) + mm / 12;
  const couponAmt = (fv * Number(rate)) / 100;
  const ytm = (couponAmt + (fv - mprice) / numOfYear) / ((fv + mprice) / 2);
  const ytmFinal = Math.round(ytm * 1000) / 1000;
  if (ytmFinal < 0 || isNaN(ytmFinal) || ytmFinal === Infinity) return 0;
  return ytmFinal;
};

const getCBDataByISIN = (isin) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { data } = await axios.get(
        `https://www1.nseindia.com/products/dynaContent/debt/corp_bonds/cbm_hist.jsp?isin=${isin}`
      );
      const dom = new JSDOM(data);
      let schema = {};
      dom.window.document
        .querySelectorAll("table > tbody > tr")
        .forEach((link) => {
          const data = link.textContent.trim();
          const dataWithValue = data.includes("\n");
          if (dataWithValue) {
            const replaceCharactersByComma = data.replace(
              /[^\x20-\x7E]/gim,
              ","
            );
            const splitByComma = replaceCharactersByComma.split(",");
            const array = splitByComma.filter((item) => item);
            if (!array.length) return;
            schema[array[0]] = array[1];
          }
        });
      if (Object.keys(schema).length === 0) resolve();
      const start = getMonthYearByDate(schema["Issue Date"]);
      const end = getMonthYearByDate(schema["Maturity Date"]);
      const updatedSchema = {
        sid: schema["Security Name"] ? schema["Security Name"] : "",
        type: schema["Security Type"] ? schema["Security Type"] : "",
        name: schema.Issuer ? schema.Issuer : "",
        rate: schema["Issue Name"]
          ? Number(schema["Issue Name"].replace("%", ""))
          : -1,
        fv: schema["Face Value"] ? Number(schema["Face Value"]) : 100,
        sm: start.month,
        sy: start.year,
        mm: end.month,
        my: end.year,
      };
      resolve(updatedSchema);
    } catch (error) {
      resolve();
    }
  });
};

module.exports = { getCBDataByISIN, getMonthYearByDate, calculateYTM };
