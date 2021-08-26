const calc = {
  BSE_EQUITY: {
    calcType: (type, subt, name) => {
      switch (true) {
        case type === "Q" && subt === "F":
        case name.includes("ETF") && type === "Q" && subt === "B":
        case type === "B" || type === "D":
        case type === "Q" && subt === "E":
          return "F";
        case type === "Q" || type === "P":
          return "E";
        case type === "IF":
          return "A";
        default:
          return "E";
      }
    },
    calcSubType: (type, subt, name) => {
      switch (true) {
        case name.includes("LIQUID"):
          return "L";
        case name.includes("ETF") && type === "Q" && subt === "B":
          return "I";
        case type === "Q" && subt === "F":
          return "GBO";
        case type === "B" && subt === "G":
        case type === "Q" && subt === "E":
          return "GoldB";
        case (type === "B" || type === "D") && subt === "F":
        case subt === "W":
          return "CB";
        case type === "Q" || type === "P":
          return "S";
        case type === "IF":
          return "R";
        default:
          return "S";
      }
    },
    calcInsType: (type, subt, name) => {
      if (type === "Q" && subt === "E") {
        return "ETF";
      } else if (type === "IF") {
        return "InvIT";
      }
    },
  },
  NSE_EQUITY: {
    calcType: (type, subt, name) => {
      const equity = ["EQ", "BE", "BZ", "E1", "SM", "ST", "X1", "P1", "P2"];
      const fixed = ["GB", "GS", "W", "N", "Y", "Z"];
      switch (true) {
        case name.includes("ETF"):
          switch (true) {
            case name.includes("GOLD"):
            case name.includes("GILT"):
            case name.includes("BBETF"):
            case name.includes("LIQUID"):
              return "F";
            default:
              return "E";
          }
        case name.includes("NIF") ||
          name.includes("50") ||
          name.includes("100") ||
          name.includes("SEN"):
          return "F";
        case equity.some((item) => item === type):
          return "E";
        case fixed.some((item) => item === type || type.startsWith(item)):
          return "F";
        case type === "IV" || type === "RR":
          return "A";
        default:
          return "E";
      }
    },
    calcSubType: (type, subt, name) => {
      switch (true) {
        case name.includes("ETF"):
          switch (true) {
            case name.includes("GOLD"):
              return "Gold";
            case name.includes("GILT"):
              return "GB";
            case name.includes("BBETF"):
              return "GBO";
            case name.includes("LIQUID"):
              return "L";
            default:
              return "I";
          }
        case name.includes("NIF") ||
          name.includes("50") ||
          name.includes("100") ||
          name.includes("SEN"):
          return "I";
        case type === "GC" || type === "GS":
          return "GB";
        case type === "GB":
          return "GoldB";
        case type === "RR" || type === "IV":
          return "R";
        case type.includes("N"):
        case type.includes("Y"):
        case type.includes("Z"):
        case type.includes("W"):
          return "CB";
        default:
          return "S";
      }
    },
    calcInsType: (type, subt, name) => {
      switch (true) {
        case name.includes("ETF"):
          return "ETF";
        case type === "IV":
          return "InvIT";
        case type === "RR":
          return "REIT";
      }
    },
  },
};

module.exports = calc;
