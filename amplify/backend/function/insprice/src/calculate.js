const { appendGenericFields } = require("/opt/nodejs/databaseUtils");
const calc = {
  BSE: {
    calcTypeAndSubtype: (type, name, id, subt) => {
      if (subt === "W") return { type: "H", subt: "War" };
      if (type === "Q" && id.startsWith("INF")) {
        if (subt === "A" || subt === "B")
          return { type: "E", subt: "S", itype: "ETF" };
        if (subt === "F") {
          return {
            type: "F",
            subt: name.includes("LIQ")
              ? "L"
              : name.includes("BBETF")
              ? "GBO"
              : "CB",
            itype: "ETF",
          };
        }
        if (subt === "E") return { type: "A", subt: "Gold", itype: "ETF" };
      }
      if (type === "Q" && subt === "F") return { type: "F", subt: "GBO" };
      if (type === "B" && subt === "G") return { type: "F", subt: "GoldB" };
      if (subt === "F" && (type === "B" || type === "D"))
        return { type: "F", subt: "CB" };
      if (subt === "IF") {
        if (name.includes("INVIT") || name.includes("GRID"))
          return { type: "A", subt: "R", itype: "InvIT" };
        else return { type: "A", subt: "R", itype: "REIT" };
      }
      return { type: "E", subt: "S" };
    },
  },

  NSE: {
    calcTypeAndSubtype: (type, name, id, subt) => {
      if (type === "RR") return { type: "A", subt: "R", itype: "REIT" };
      if (type === "IV") return { type: "A", subt: "R", itype: "InvIT" };
      if (type.startsWith("W")) return { type: "H", subt: "War" };
      if (type === "GC" || type === "GS") return { type: "F", subt: "GB" };
      if (id.startsWith("INF")) {
        if (
          name.includes("NIF") ||
          name.includes("50") ||
          name.includes("100") ||
          name.includes("SEN")
        )
          return { type: "E", subt: "S", itype: "ETF" };
        if (name.includes("BBETF"))
          return { type: "F", subt: "GBO", itype: "ETF" };
        if (name.includes("GOLD"))
          return { type: "A", subt: "Gold", itype: "ETF" };
        if (name.includes("GILT"))
          return { type: "F", subt: "GB", itype: "ETF" };
        if (name.includes("LIQ")) return { type: "F", subt: "L", itype: "ETF" };
        if (type === "EQ") return { type: "E", subt: "S", itype: "ETF" };
      }
      if (type.startsWith("N") || type.startsWith("Y") || type.startsWith("Z"))
        return { type: "F", subt: "CB" };
      if (type === "GB") return { type: "F", subt: "GoldB" };
      return { type: "E", subt: "S" };
    },
  },
};

const calculateRisk = (beta, mcapt, subt, itype) => {
  if (subt === "GB" || subt === "GBO" || subt === "GoldB") return "VC";
  if (itype === "ETF") {
    if (subt === "I" || subt === "S") return "M";
    return "C";
  }
  if (subt === "S") {
    if (mcapt === "Large") return beta && beta > 1 ? "A" : "M";
    if (mcapt === "Mid") return beta && beta > 1 ? "VA" : "A";
    return "VA";
  }
  return "M";
};

const calculateIsbond = (exchg, subtType, itype) => {
  if (itype) return false;
  if (
    (exchg === "BSE" && (subtType === "GBO" || subtType === "GB")) ||
    (exchg === "NSE" &&
      (subtType === "CB" || subtType === "GBO" || subtType === "GB"))
  ) {
    return true;
  }
  return false;
};

const parse = (data) => (parseFloat(data) ? parseFloat(data) : parseFloat(0));

const calcSchema = (
  record,
  codes,
  schema,
  exchg,
  isinMap,
  table,
  bondTable,
) => {
  let updateSchema = {};
  let isBond = false;
  if(!Object.keys(record).length) return { updateSchema, isBond }; 
  const typename = record[codes.type] ? record[codes.type].trim() : "";
  const subtname = record[codes.subt] ? record[codes.subt].trim() : "";
  const name = record[codes.name].trim();
  const id = record[codes.id];
  const { type, subt, itype } = calc[exchg].calcTypeAndSubtype(
    typename,
    name,
    id,
    subtname
  );
  isBond = calculateIsbond(exchg, subt, itype);
  if ((exchg === "BSE" && subt === "CB") || (exchg === "NSE" && subt === "MF"))
    return { updateSchema, isBond };
  updateSchema = JSON.parse(JSON.stringify(schema));
  updateSchema.id = id;
  updateSchema.sid = record[codes.sid].trim();
  updateSchema.name = name;
  updateSchema.type = type;
  updateSchema.subt = subt;
  updateSchema.price = parse(record[codes.price]);
  updateSchema.prev = parse(record[codes.prev]);
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
    updateSchema.itype = null;
    appendGenericFields(updateSchema, bondTable);
  } else {
    updateSchema.mcapt = subt === "S" ? "Small" : null;
    updateSchema.itype = itype ? itype : null;
    appendGenericFields(updateSchema, table);
  }
  updateSchema.exchg = exchg;
  isinMap[record[codes.id]] = record[codes.id];
  return { updateSchema, isBond };
};
module.exports = { calc, calcSchema, calculateRisk, calculateIsbond };
