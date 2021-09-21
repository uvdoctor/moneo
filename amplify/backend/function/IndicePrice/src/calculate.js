const calcInd = (name) => {
  name = name.toLowerCase().trim();
  if (name.includes("basic materials")) return "BASM";
  if (name.includes("consumer durables")) return "CD";
  if (name.includes("energy")) return "E";
  if (name.includes("fast moving") || name.includes("fmcg")) return "FMCG";
  if (name.includes("financ")) return "F";
  if (name.includes("healthcare")) return "H";
  if (name.includes("pharma")) return "PH";
  if (name.includes("industrials")) return "I";
  if (name.includes("technology") || name.includes("nifty it")) return "IT";
  if (name.includes("telecom")) return "TC";
  if (name.includes("utilities")) return "U";
  if (name.includes("auto")) return "A";
  if (name.includes("bank")) return "B";
  if (name.includes("capital goods")) return "CG";
  if (name.includes("discretionary goods")) return "CDGS";
  if (name.includes("metal")) return "MET";
  if (name.includes("media")) return "MED";
  if (name.includes("psu bank")) return "PSB";
  if (name.includes("private bank")) return "PB";
  if (name.includes("oil")) return "OG";
  if (name.includes("power")) return "POW";
  if (name.includes("realty")) return "R";
  if (name.includes("teck")) return "TECH";
  return null;
};

module.exports = calcInd;
