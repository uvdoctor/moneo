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

  calcSM: (sDate) => {
    if (!sDate) return null;
    const month =
      monthsArray.indexOf(
        sDate.slice(sDate.indexOf("-") + 1, sDate.lastIndexOf("-"))
      ) + 1;
    return month;
  },

  calcSY: (sDate) => {
    if (!sDate) return null;
    const year = sDate.slice(sDate.lastIndexOf("-") + 1, sDate.length);
    return Number(year);
  },

  calcMM: (mDate) => {
    if (!mDate) return null;
    const matMonth =
      monthsArray.indexOf(
        mDate.slice(mDate.indexOf("-") + 1, mDate.lastIndexOf("-"))
      ) + 1;
    return matMonth;
  },

  calcMY: (mDate) => {
    if (!mDate) return null;
    const matYear = mDate.slice(mDate.lastIndexOf("-") + 1, mDate.length);
    return Number(matYear);
  },

  calcFR: (frate) => {
    if (frate === "RESET") return "Y";
    return "N";
  },

  calcTF: (subt) => {
    if (subt === "IF" || subt === "PF") return "Y";
    return "N";
  },

  calcCR: (crstr) => {
    if (!crstr) return null;
    if (crstr.includes("AA") && !crstr.includes("-")) return "E";
    if (crstr.includes("A")) return "H";
    if (crstr.includes("BBB") || crstr.includes("+")) return "M";
    if (crstr.includes("BB")) return "L";
    return "J";
  },

  calcPrice: (price) => {
    const value = Number(price)
    if (!value) return 100;
    return value
  },
};

const calcYTM = (record, codes) => {
  const reset = record[codes.rate];
  const rate = reset.includes("RESET") || reset >= 20 ? 0 : reset;
  const fv = 100;
  const matrMonth = calc.calcMM(record[codes.mDate]);
  const matrYear = calc.calcMY(record[codes.mDate]);
  const startMonth = calc.calcSM(record[codes.sDate]);
  const startYear = calc.calcSY(record[codes.sDate]);
  const numOfYear =
    (12 - startMonth) / 12 + (matrYear - startYear - 1) + matrMonth / 12;
  const mPrice = calc.calcPrice(record[codes.price]);
  const ytm = (Number(rate) + (fv - mPrice) / numOfYear) / ((fv + mPrice) / 2);
  const ytmFinal = Math.round(ytm * 1000) / 1000;
  return ytmFinal;
};

const calcSchema = (record, codes, schema, typeExchg, isinMap, table) => {
  if (!record[codes.id] || record[codes.subt] === "MC") return;
  schema.__typename = table.slice(0, table.indexOf("-"));
  schema.id = record[codes.id];
  schema.sid = record[codes.sid];
  schema.name = record[codes.name] ? record[codes.name] : record[codes.sid];
  schema.price = calc.calcPrice(record[codes.price]);
  schema.subt = calc.calcSubType(record[codes.subt]);
  schema.exchg = typeExchg;
  schema.sm = calc.calcSM(record[codes.sDate]);
  schema.sy = calc.calcSY(record[codes.sDate]);
  schema.mm = calc.calcMM(record[codes.mDate]);
  schema.my = calc.calcMY(record[codes.mDate]);
  schema.fr = calc.calcFR(record[codes.frate]);
  schema.tf = calc.calcTF(record[codes.subt]);
  schema.cr = calc.calcCR(record[codes.crstr]);
  const reset = record[codes.rate];
  schema.rate = reset.includes("RESET") || reset > 20 ? 0 : parseFloat(reset);
  schema.fv = 100;
  schema.ytm = calcYTM(record, codes);
  schema.createdAt = new Date().toISOString();
  schema.updatedAt = new Date().toISOString();
  isinMap[record[codes.id]] = record[codes.id];
  return schema;
};
module.exports = calcSchema;
