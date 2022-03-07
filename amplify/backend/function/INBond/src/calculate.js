const { appendGenericFields } = require("/opt/nodejs/databaseUtils");

const calc = {
  calcSubType: (subt) => {
    if (
      [
        "AT",
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
        "BB",
        "BP",
        "BZ",
        "LF",
        "SF",
        "MZ",
        "PD",
        "PE",
        "FB",
        "IB",
        "IZ",
        "DI",
        "FP",
        "FF",
        "FZ",
        "FD",
        "FR",
        "CD",
        "BF",
      ].includes(subt)
    )
      return "GBO";
    if (["GF", "GI", "GS", "TB", "GZ", "GD", "GC", "GP"].includes(subt))
      return "GB";
    return "CB";
  },

  calcInsType: (subt) => {
    if (subt === "CP") return "CP";
    if (subt === "PE") return "CB";
    if (subt === "TB") return "TB";
    if (subt === "GI") return "IB";
    if (subt === "DB") return "DEB";
    if (["FF", "IF", "PF", "LF", "SF"].includes(subt)) return "TFB";
    if (subt === "CD") return "CD";
    if (["IP", "BP", "DP"].includes(subt)) return "PB";
    if (["FR", "GF", "PR", "FB", "BF", "CF"]) return "FRB";
    return null;
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
  return { month: monthsArray.indexOf(parts[1]) + 1, year: parseInt(parts[2]) };
};

const calculateYTM = (rate, sm, sy, mm, my, fv, mprice) => {
  const numOfYear = (12 - sm) / 12 + (my - sy - 1) + mm / 12;
  const couponAmt = (fv * Number(rate)) / 100;
  const ytm = (couponAmt + (fv - mprice) / numOfYear) / ((fv + mprice) / 2);
  const ytmFinal = Math.round(ytm * 1000) / 1000;
  if (
    ytmFinal < 0 ||
    isNaN(ytmFinal) ||
    ytmFinal === Infinity ||
    ytmFinal === -0
  )
    return 0;
  return ytmFinal;
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

const calculateRisk = (creditRating, subt) => {
  if (creditRating === "E") return "VC";
  if (creditRating === "H") return "C";
  if (creditRating === "M") return "M";
  if (creditRating === "L") return "A";
  if (creditRating === "J") return "VA";
  if (!creditRating && (subt === "GB" || subt === "GBO")) return "VC";
  return "C";
};

const calcSchema = (record, codes, schema, typeExchg, isinMap, table) => {
  if (!record[codes.id] || ["MC", "MF", "US"].includes(record[codes.subt]))
    return;
  schema.id = record[codes.id];
  if (!schema.id.startsWith("IN")) return;
  schema.sid = record[codes.sid].trim();
  schema.price = calc.calcPrice(record[codes.price]);
  schema.type = "F";
  schema.subt =
  typeExchg === "BSE"
      ? record[codes.name].includes("BANK")
        ? "GBO"
        : "CB"
      : calc.calcSubType(record[codes.subt]);
  schema.exchg = typeExchg;
  const startDate = getMonthYearByDate(
    codes.sDate ? record[codes.sDate].trim() : ""
  );
  const maturityDate = getMonthYearByDate(
    codes.sDate ? record[codes.mDate].trim() : ""
  );
  schema.itype = typeExchg === "BSE" ? null : calc.calcInsType(record[codes.subt]);
  schema.sm = startDate.month;
  schema.sy = startDate.year;
  schema.mm = maturityDate.month;
  schema.my = maturityDate.year;
  schema.name = record[codes.name]
    ? record[codes.name].trim()
    : record[codes.sid].trim();
  schema.cr = calc.calcCR(record[codes.crstr]);
  schema.rate = getRate(record, codes);
  schema.fv = 100;
  schema.ytm = calculateYTM(
    schema.rate,
    startDate.month,
    startDate.year,
    maturityDate.month,
    maturityDate.year,
    100,
    schema.price
  );
  schema.risk = calculateRisk(schema.cr, schema.subt);
  appendGenericFields(schema, table);
  isinMap[record[codes.id]] = record[codes.id];
  return schema;
};
module.exports = {
  calcSchema,
  calc,
  getMonthYearByDate,
  calculateYTM,
  getRate,
  calculateRisk,
};
