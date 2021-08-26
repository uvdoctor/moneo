
const calc = {
  BSE_EQUITY: {
    calcType: (type, subt, name) => {
      switch (true) {
        case type === "Q" && (subt === "F" || subt === "B"):
        case type === "B" || type === "D":
          return "F";
        case type === "Q" || type === "P":
          return "E";
        default:
          return "E";
      }
    },
    calcSubType: (type, subt, name) => {
      switch (true) {
        case name.includes("LIQUID"):
          return "L";
        case type === "Q" && subt === "F":
          return "GB";
        case type === "B" && subt === "G":
          return "GoldB";
        case type === "Q" && subt === "B":
          return "I";
        case (type === "B" || type === "D") && subt === "F":
          return "CB";
        case type === "Q" || type === "P":
          return "S";
        default:
          return "S";
      }
    },
    calcInsType: (type, subt, name) => {
      if (type === "Q" && subt === "E") {
        return "ETF";
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
        case type === "GC" || type === "GS":
          return "GB";
        case type === "GB":
          return "GoldB";
        case type === "RR" || type === "IV":
          return "R";
        case type.includes("N"):
        case type.includes("Y"):
        case type.includes("Z"):
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
