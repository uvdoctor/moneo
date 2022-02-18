const { appendGenericFields } = require("/opt/nodejs/insertIntoDB");
const calc = {
  BSE: {
    calcType: (type, subt, name) => {
      if (subt === "IF") return "A";
      if (subt === "W") return "H";
      if (
        (name.includes("ETF") && type === "Q" && subt === "B") ||
        (type === "Q" && (subt === "F" || subt === "E")) ||
        type === "B" ||
        type === "D"
      )
        return "F";
      return "E";
    },

    calcSubType: (type, subt, name) => {
      if (name.includes("LIQUID")) return "L";
      if (subt === "W") return "War";
      if (name.includes("ETF") && type === "Q" && subt === "B") return "I";
      if (type === "Q" && subt === "F") return "GBO";
      if ((type === "B" && subt === "G") || (type === "Q" && subt === "E"))
        return "GoldB";
      if (subt === "F" && (type === "B" || type === "D")) return "CB";
      if (subt === "IF") return "R";
      return "S";
    },

    calcInsType: (type, subt, name) => {
      if (type === "Q" && subt === "E") return "ETF";
      if (subt === "IF" && (name.includes("INVIT") || name.includes("GRID")))
        return "InvIT";
      if (subt === "IF") return "REIT";
    },
  },

  NSE: {
    calcType: (type, subt, name) => {
      const fixed = ["GB", "GS", "N", "Y", "Z"];
      if (type === "IV" || type === "RR") return "A";
      if (type.startsWith("W")) return "H";
      if (
        (name.includes("ETF") &&
          (name.includes("GOLD") ||
            name.includes("GILT") ||
            name.includes("BBETF") ||
            name.includes("LIQUID"))) ||
        name.includes("NIF") ||
        name.includes("50") ||
        name.includes("100") ||
        name.includes("SEN") ||
        fixed.some((item) => item === type || type.startsWith(item))
      )
        return "F";
      return "E";
    },

    calcSubType: (type, subt, name) => {
      if (name.includes("LIQUID")) return "L";
      if (type === "RR" || type === "IV") return "R";
      if (name.includes("ETF") && name.includes("GOLD")) return "Gold";
      if (type.startsWith("W")) return "War";
      if (
        (name.includes("ETF") && name.includes("GILT")) ||
        type === "GC" ||
        type === "GS"
      )
        return "GB";
      if (name.includes("ETF") && name.includes("BBETF")) return "GBO";
      if (
        name.includes("NIF") ||
        name.includes("50") ||
        name.includes("100") ||
        name.includes("SEN")
      )
        return "I";
      if (type.includes("N") || type.includes("Y") || type.includes("Z"))
        return "CB";
      if (type === "GB") return "GoldB";
      return "S";
    },

    calcInsType: (type, subt, name) => {
      if (name.includes("ETF")) return "ETF";
      if (type === "IV") return "InvIT";
      if (type === "RR") return "REIT";
    },
  },
};

const calculateRisk = (beta, mcapt, subt, itype) => {
  if (itype === "ETF") {
    if (subt === "GB" || subt === "GBO") return "VC";
    if (subt === "I") return "M";
    if (mcapt === "L" && subt === "S") return "M";
    if (mcapt !== "L" && subt === "S") return "A";
    return "C";
  }
  if (subt === "S") {
    if (mcapt === "L") return beta && beta > 1 ? "A" : "M";
    if (mcapt === "M") return beta && beta > 1 ? "VA" : "A";
    return "VA";
  }
  return "M";
};

const calcSchema = (
  record,
  codes,
  schema,
  exchg,
  isinMap,
  table,
  bondTable
) => {
  let updateSchema = {};
  const type = record[codes.type].trim();
  const subt = record[codes.subt] ? record[codes.subt].trim() : "";
  const name = record[codes.name].trim();
  const parse = (data) => (parseFloat(data) ? parseFloat(data) : parseFloat(0));
  const subtType = calc[exchg].calcSubType(type, subt, name);
  const assetType = calc[exchg].calcType(type, subt, name);
  const isBond =
    (exchg === "BSE" && subtType === "GBO") ||
    (exchg === "NSE" &&
      assetType === "F" &&
      (subtType === "CB" || subtType === "GBO"))
      ? true
      : false;
  if (subtType === "L") return { updateSchema, isBond };
  updateSchema = JSON.parse(JSON.stringify(schema));
  updateSchema.id = record[codes.id];
  updateSchema.sid = record[codes.sid].trim();
  updateSchema.name = name;
  updateSchema.type = assetType;
  updateSchema.subt = subtType;
  updateSchema.price = parse(record[codes.price]);
  if (isBond) {
    updateSchema.sm = 0;
    updateSchema.sy = 0;
    updateSchema.mm = 0;
    updateSchema.my = 0;
    updateSchema.fr = false;
    updateSchema.tf = false;
    updateSchema.cr = null;
    updateSchema.rate = -1;
    updateSchema.fv = 100;
    updateSchema.ytm = 0;
    delete updateSchema.itype;
    delete updateSchema.prev;
    appendGenericFields(updateSchema, bondTable);
  } else {
    updateSchema.mcapt = "S";
    updateSchema.itype = calc[exchg].calcInsType(type, subt, name);
    updateSchema.prev = parse(record[codes.prev]);
    if (updateSchema.id.startsWith("INF")) updateSchema.itype = "ETF";
    appendGenericFields(updateSchema, table);
  }
  updateSchema.exchg = exchg;
  isinMap[record[codes.id]] = record[codes.id];
  return { updateSchema, isBond };
};
module.exports = { calc, calcSchema, calculateRisk };
