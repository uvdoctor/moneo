const { appendGenericFields } = require("/opt/nodejs/insertIntoDB");
const {
  calculateYTM,
  getMonthYearByDate,
  getCBDataByISIN,
} = require("/opt/nodejs/corporateBond");

const calc = {
  calcSubType: (subt) => {
    const gbo = [
      "AT",
      "CP",
      "FT",
      "ID",
      "IF",
      "IP",
      "MT",
      "PF",
      "PG",
      "PI",
      "PR",
      "PT",
      "PZ",
      "SG",
      "TS",
    ];
    const gb = ["GF", "GI", "GS", "TB"];
    switch (true) {
      case gbo.indexOf(subt) > -1:
        return "GBO";
      case gb.indexOf(subt) > -1:
        return "GB";
      default:
        return "CB";
    }
  },

  calcFR: (frate) => {
    if (frate === "RESET") return true;
    return false;
  },

  calcTF: (subt) => {
    if (subt === "IF" || subt === "PF") return true;
    return false;
  },

  calcCR: (crstr) => {
    if (!crstr) return null;
    if (crstr.includes("AA") && !crstr.includes("-")) return "E";
    if (crstr.includes("BBB") || crstr.includes("B+")) return "M";
    if (crstr.includes("A")) return "H";
    if (crstr.includes("BB") && !crstr.includes("+")) return "L";
    return "J";
  },

  calcPrice: (price) => {
    const value = Number(price);
    if (!value) return 100;
    return Number(value);
  },
};

const getRate = (record, codes) => {
  const reset = record[codes.rate];
  const name = record[codes.name];
  let rate = reset.includes("RESET") || reset > 20 ? 0 : parseFloat(reset);
  if (isNaN(rate)) {
    name.startsWith("0") ? (rate = parseFloat(0)) : (rate = -1);
  }
  return rate;
};

const calcSchema = async (record, codes, schema, typeExchg, isinMap, table) => {
  if (!record[codes.id] || record[codes.subt] === "MC") return;
  schema.id = record[codes.id];
  if (!schema.id.startsWith("IN")) return;
  schema.sid = record[codes.sid];
  schema.price = calc.calcPrice(record[codes.price]);
  schema.type = "F";
  schema.subt = calc.calcSubType(record[codes.subt]);
  schema.exchg = typeExchg;
  const startDate = getMonthYearByDate(
    codes.sDate ? record[codes.sDate].trim() : ""
  );
  const maturityDate = getMonthYearByDate(
    codes.sDate ? record[codes.mDate].trim() : ""
  );
  let cbdata;
  // if (!record[codes.sDate] && schema.subt === "CB") {
    // cbdata = await getCBDataByISIN(schema.id);
  // }
  schema.sm = cbdata ? cbdata.sm : startDate.month;
  schema.sy = cbdata ? cbdata.sy : startDate.year;
  schema.mm = cbdata ? cbdata.mm : maturityDate.month;
  schema.my = cbdata ? cbdata.my : maturityDate.year;
  schema.name = cbdata
    ? cbdata.name
    : record[codes.name]
    ? record[codes.name]
    : record[codes.sid];
  schema.fr = calc.calcFR(record[codes.frate]);
  schema.tf = calc.calcTF(record[codes.subt]);
  schema.cr = calc.calcCR(record[codes.crstr]);
  schema.rate = cbdata ? cbdata.rate : getRate(record, codes);
  schema.fv = cbdata ? cbdata.fv : 100;
  schema.ytm = cbdata
    ? calculateYTM(
        cbdata.rate,
        cbdata.sm,
        cbdata.sy,
        cbdata.mm,
        cbdata.my,
        cbdata.fv,
        schema.price
      )
    : calculateYTM(
        schema.rate,
        startDate.month,
        startDate.year,
        maturityDate.month,
        maturityDate.year,
        100,
        schema.price
      );
  appendGenericFields(schema, table);
  isinMap[record[codes.id]] = record[codes.id];
  return schema;
};
module.exports = { calcSchema, calc };
