const { appendGenericFields } = require("/opt/nodejs/insertIntoDB");

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

const getRate = (record, codes) => {
  const reset = record[codes.rate];
  const name = record[codes.name];
  let rate = reset.includes("RESET") || reset > 20 ? 0 : parseFloat(reset);
  if (isNaN(rate)) {
    name.startsWith("0") ? (rate = parseFloat(0)) : (rate = -1);
  }
  return rate;
};

const calcSchema = (record, codes, schema, typeExchg, isinMap, table) => {
  if (!record[codes.id] || record[codes.subt] === "MC") return;
  schema.id = record[codes.id];
  if (!schema.id.startsWith("IN")) return;
  schema.sid = record[codes.sid].trim();
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
  schema.sm = startDate.month;
  schema.sy = startDate.year;
  schema.mm = maturityDate.month;
  schema.my = maturityDate.year;
  schema.name = record[codes.name] ? record[codes.name].trim() : record[codes.sid].trim();
  schema.fr = calc.calcFR(record[codes.frate]);
  schema.tf = calc.calcTF(record[codes.subt]);
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
  appendGenericFields(schema, table);
  isinMap[record[codes.id]] = record[codes.id];
  return schema;
};
module.exports = { calcSchema, calc };
