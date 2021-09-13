const calc = {
  calcPFM: (name) => {
    const firstChar = name[0];
    return firstChar;
  },
  calcST: (name) => {
    if (name.includes("TIER II")) return "T2";
    if (name.includes("TIER I")) return "T1";
    if (name.includes("LITE")) return "Lite";
    if (name.includes("APY")) return "APY";
    if (name.includes("STATE")) return "SG";
    if (name.includes("CORPORATE-CG")) return "CCG";
    if (name.includes("CENTRAL")) return "CG";
  },
  calcType: (name) => {
    if (name.includes(" E ")) return "E";
    if (
      name.includes("CORPORATE-CG") ||
      name.includes("STATE") ||
      name.includes("CENTRAL") ||
      name.includes(" C ") ||
      name.includes(" G ") ||
      name.includes("LITE") ||
      name.includes("APY") ||
      name.includes(" A ")
    )
      return "F";
    if (name.includes("TAX")) return "H";
  },
  calcSubType: (name) => {
    if (name.includes("STATE")) return "GBO";
    if (name.includes("CENTRAL") || name.includes(" G ")) return "GB";
    if (name.includes("LITE")) return "HB";
    if (name.includes(" E ")) return "S";
    if (name.includes("APY") || name.includes(" A ") || name.includes("TAX"))
      return "HB";
    if (name.includes(" C ") || name.includes("CORPORATE-CG")) return "CB";
  },
};

module.exports = calc;
