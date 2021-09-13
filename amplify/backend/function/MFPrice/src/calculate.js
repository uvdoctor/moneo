const getType = (element) => {
  const type = element["Scheme Type"];
  const name = element["Scheme Name"];
  if (type.includes("Hybrid")) {
    if (name.includes("Debt") || name.includes("DEBT")) return "F";
    return "H";
  }
  if (
    type.includes("Debt") ||
    type.includes("Income") ||
    type.includes("Solution") ||
    type.includes("Gilt") ||
    (type.includes("Index") && (name.includes("Gilt") || name.includes("Bond")))
  )
    return "F";
  if (type.includes("Index") && type.includes("Other")) return "E";
  if (type.includes("Other")) return "A";
  return "E";
};

const getSubType = (element) => {
  const type = element["Scheme Type"];
  const name = element["Scheme Name"];
  if (
    type.includes("Hybrid") &&
    (name.includes("Debt") || name.includes("DEBT"))
  )
    return "HB";
  if (
    type.includes("Debt Scheme") &&
    (type.includes("Liquid") ||
      type.includes("Money Market") ||
      type.includes("Overnight"))
  )
    return "L";
  if (
    type.includes("Debt Scheme") &&
    (name.includes("Government") ||
      name.includes("Treasury") ||
      name.includes("Gilt") ||
      name.includes("GILT"))
  )
    return "GB";
  if (type.includes("Debt Scheme")) return "CB";
  if (type.includes("Index")) return "I";
  if (type.includes("Gilt")) return "GB";
  if (
    (type.includes("Close") || type.includes("Interval")) &&
    type.includes("Income")
  )
    return "HB";
  return "S";
};

const mfType = (data) => {
  if (data.includes("Open")) return "O";
  if (data.includes("Close")) return "C";
  if (data.includes("Interval")) return "I";
};

const mCap = (element) => {
  const type = element.toLowerCase();
  if (type.includes("equity") && type.includes("large")) return "L";
  if (type.includes("equity") && type.includes("mid")) return "M";
  if (type.includes("equity") && type.includes("small")) return "S";
  if (type.includes("equity")) return "H";
  return null;
};

const getName = (element) => {
  const type = element["Scheme Type"];
  const name = element["Scheme Name"];
  const hybridText = type.slice(type.indexOf("-"), -1);
  if (type.includes("Hybrid")) return `${name} ${hybridText}`;
  return name;
};

module.exports = {
  getType,
  getSubType,
  mfType,
  mCap,
  getName,
};
