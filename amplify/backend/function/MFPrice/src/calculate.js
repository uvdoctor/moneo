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

const mcap = (element) => {
  const type = element["Scheme Type"] ? element["Scheme Type"].toLowerCase() : '';
  const name = element["Scheme Name"] ? element["Scheme Name"].toLowerCase() : '';
  if (type.includes("equity") && type.includes("large")) return "Large";
  if (type.includes("equity") && type.includes("mid")) return "Mid";
  if (type.includes("equity") && type.includes("small")) return "Small";
  if (type.includes("equity")) return "Hybrid";
  if (name.includes('index')) {
    if (name.includes('next 50')) return 'Large';
    if (name.includes('sensex')) return 'Large';
    if (name.includes('nifty 500')) return 'Hybrid';
    if (name.includes('nifty')) return 'Large';
    if (name.includes('next')) return 'Large';
    if (name.includes('mid')) return 'Mid';
    if (name.includes('small')) return 'Small';
    else return 'Large';
  };
  if (name.includes('micro')) return 'Small';
  if (name.includes('small')) return 'Small';
  if (name.includes('multicap')) return 'Hybrid';
  if (name.includes('mid')) return 'Mid';
  if (name.includes('large')) return 'Large';
  return null;
};

const getName = (element) => {
  const type = element["Scheme Type"];
  const name = element["Scheme Name"];
  const hybridText = type.slice(type.indexOf("-"), -1);
  if (type.includes("Hybrid")) return `${name} ${hybridText}`;
  return name;
};

const calculateRisk = (subt, mcap) => {
  if(subt === "S" && mcap === "Large") return "M";
  if(subt === "S") return "A";
  if(subt === "GBO" || subt === "GB") return "VC";
  return "C";  
}

module.exports = {
  getType,
  getSubType,
  mfType,
  mcap,
  getName,
  calculateRisk
};
