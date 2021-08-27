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
    const cb = [
      "BB",
      "BP",
      "BZ",
      "CF",
      "CI",
      "DB",
      "DC",
      "DP",
      "PS",
      "VD",
      "VF",
    ];
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
      case cb.some((item) => item === subt):
        return "CB";
      case gbo.some((item) => item === subt):
        return "GBO";
      case gb.some((item) => item === subt):
        return "GB";
    }
  },

  calcSM: (sDate) => {
    const month =
      monthsArray.indexOf(
        sDate.slice(sDate.indexOf("-") + 1, sDate.lastIndexOf("-"))
      ) + 1;
    return month;
  },

  calcSY: (sDate) => {
    const year = sDate.slice(sDate.lastIndexOf("-") + 1, sDate.length);
    return Number(year);
  },

  calcMM: (mDate) => {
    const matMonth =
      monthsArray.indexOf(
        mDate.slice(mDate.indexOf("-") + 1, mDate.lastIndexOf("-"))
      ) + 1;
    return matMonth;
  },

  calcMY: (mDate) => {
    const matYear = mDate.slice(mDate.lastIndexOf("-") + 1, mDate.length);
    return Number(matYear);
  },

  calcFR: (frate) => {
    if (frate === "RESET") {
      return "Y";
    }
    return "N"
  },

  calcTF: (subt) => {
    if (subt === "IF" || subt === "PF") {
      return "Y";
    }
    return "N"
  },

  calcCR: (crstr) => {
    switch (true) {
      case crstr.includes("AAA"):
        return "E";
      case crstr.includes("AA") || crstr.includes("A"):
        return "H";
      case crstr.includes("BB") || crstr.includes("BBB"):
        return "M";
      case crstr.includes("BB-"):
        return "L";
      default:
        return null
    }
  },
  calcPrice : (price)=>{
    if (!price) {
      return 100
    }
    return Number(price);
  },
 
};

const calcYTM = (record , codes ,rate) => {
  const fv=100
  const matrMonth = calc.calcMM(record[codes.mDate])
  const matrYear = calc.calcMY(record[codes.mDate])
  const startMonth = calc.calcSM(record[codes.sDate])
  const startYear = calc.calcSY(record[codes.sDate])
  const numOfYear = ((12 - startMonth) / 12) + ((matrYear - startYear) - 1) + (matrMonth / 12);
  const mPrice = calc.calcPrice(record[codes.price])
  const ytm = (Number(rate) + ((fv - mPrice) / numOfYear)) / ((fv + mPrice) / 2)
  const ytmFinal = Math.round(ytm*1000)/1000;
  return ytmFinal
}

const updateSchema = (record,codes,schema) =>{
  if (record[codes.subt] === "MC") {
      return;
    }
  Object.keys(schema).map((key) => {
    switch (key) {
      case "price":
        return (schema.price = calc.calcPrice(record[codes.price]));
      case "subt":
        return (schema.subt = calc.calcSubType(record[codes.subt]));
      case "sm":
        return (schema.sm = calc.calcSM(record[codes.sDate]));
      case "sy":
        return (schema.sy = calc.calcSY(record[codes.sDate]));
      case "mm":
        return (schema.mm = calc.calcMM(record[codes.mDate]));
      case "my":
        return (schema.my = calc.calcMY(record[codes.mDate]));
      case "fr":
        return (schema.fr = calc.calcFR(record[codes.frate]));
      case "tf":
        return (schema.tf = calc.calcTF(record[codes.subt]));
      case "cr":
        return (schema.cr = calc.calcCR(record[codes.crstr]));
      case "fv":
        return (schema.fv = 100);
      case "ytm":
        return (schema.ytm = calcYTM(record,codes,record[codes.rate],
        ));
      default:
        schema[key] = record[codes[key]];
  }
});
  return schema
}
module.exports = updateSchema;