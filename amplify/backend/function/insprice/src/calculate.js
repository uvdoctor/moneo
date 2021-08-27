const calc = {
  BSE_EQUITY: {
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

  NSE_EQUITY: {
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

const calcSchema = (record, codes, schema, typeIdentifier, typeExchg) => {
  const type = record[codes.type];
  const subt = record[codes.subt];
  const name = record[codes.name];
  Object.keys(schema).map((key) => {
    if (key === "type") {
      schema.type = calc[typeIdentifier].calcType(type, subt, name);
    } else if (key === "subt") {
      schema.subt = calc[typeIdentifier].calcSubType(type, subt, name);
    } else if (key === "itype") {
      schema.itype = calc[typeIdentifier].calcInsType(type, subt, name);
    } else if (key === "exchg") {
      schema.exchg = typeExchg;
    } else if (key === "name") {
      schema.name = name.trim();
    } else {
      schema[key] = record[codes[key]];
    }
  });
  return schema;
};
module.exports = calcSchema;
