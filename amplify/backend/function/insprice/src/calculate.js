const { appendGenericFields } = require('/opt/nodejs/insertIntoDB');

const calc = {
  BSE: {
    calcType: (type, subt, name) => {
      if (subt === "IF") return "A";
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
      if (name.includes("ETF") && type === "Q" && subt === "B") return "I";
      if (type === "Q" && subt === "F") return "GBO";
      if ((type === "B" && subt === "G") || (type === "Q" && subt === "E"))
        return "GoldB";
      if (subt === "W" || (subt === "F" && (type === "B" || type === "D")))
        return "CB";
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
      const fixed = ["GB", "GS", "W", "N", "Y", "Z"];
      if (type === "IV" || type === "RR") return "A";
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
      if (
        type.includes("N") ||
        type.includes("Y") ||
        type.includes("Z") ||
        type.includes("W")
      )
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

const calcSchema = (record, codes, schema, exchg, isinMap, table) => {
  const type = record[codes.type];
  const subt = record[codes.subt];
  const name = record[codes.name];
  const parse = (data) => (parseFloat(data) ? parseFloat(data) : parseFloat(0));
  Object.keys(schema).map((key) => {
    switch (key) {
      case "name":
        return (schema.name = name.trim());
      case "price":
        return (schema[key] = parse(record[codes[key]]));
      case "prev":
        return (schema[key] = parse(record[codes[key]]));
      case "type":
        return (schema.type = calc[exchg].calcType(type, subt, name));
      case "subt":
        return (schema.subt = calc[exchg].calcSubType(type, subt, name));
      case "itype":
        return (schema.itype = calc[exchg].calcInsType(type, subt, name));
      default:
        schema[key] = record[codes[key]];
    }
  });
  schema.exchg = exchg;
  appendGenericFields(schema, table)
  isinMap[record[codes.id]] = record[codes.id];
  return schema;
};
module.exports = { calc, calcSchema };
