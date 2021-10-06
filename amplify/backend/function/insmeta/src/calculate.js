const calcInd = (data) => {
  const indData = {
    A: "AUTOMOBILE",
    IM: "INDUSTRIAL MANUFACTURING",
    F: "FINANCIAL SERVICES",
    CG: "CONSUMER GOODS",
    CC: "CEMENT & CEMENT PRODUCTS",
    CH: "CHEMICALS",
    CS: "CONSUMER SERVICES",
    FP: "FERTILISERS & PESTICIDES",
    C: "CONSTRUCTION",
    H: "HEALTHCARE SERVICES",
    PH: "PHARMA",
    IT: "IT",
    MED: "MEDIA ENTERTAINMENT & PUBLICATION",
    MET: "METALS",
    OG: "OIL & GAS",
    POW: "POWER",
    S: "SERVICES",
    TC: "TELECOM",
    TEX: "TEXTILES",
  };
  return Object.keys(indData).find(key => indData[key] === data);
};

module.exports = calcInd;