const monthsArray = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
const calc = {
  calcSubType: (subt) => {
    const cb = [
      "BB",
      "BP",
      "BZ",
      "CF",
      "CI",
      "DB",
      "DC",
      "DP",
      "PS",
      "VD",
      "VF",
    ];
    const gbo = [
      "AT",
      "CP",
      "FT",
      "ID",
      "IF",
      "IP",
      "MT",
      "PF",
      "PG",
      "PI",
      "PR",
      "PT",
      "PZ",
      "SG",
      "TS",
    ];
    const gb = ["GF", "GI", "GS", "TB"];
    switch (true) {
      case cb.some((item) => item === subt):
        return "CB";
      case gbo.some((item) => item === subt):
        return "GBO";
      case gb.some((item) => item === subt):
        return "GB";
    }
  },

  calcSM: (sDate) => {
    const month =
      monthsArray.indexOf(
        sDate.slice(sDate.indexOf("-") + 1, sDate.lastIndexOf("-"))
      ) + 1;
    return month;
  },

  calcSY: (sDate) => {
    const year = sDate.slice(sDate.lastIndexOf("-") + 1, sDate.length);
    return year;
  },

  calcMM: (mDate) => {
    const matMonth =
      monthsArray.indexOf(
        mDate.slice(mDate.indexOf("-") + 1, mDate.lastIndexOf("-"))
      ) + 1;
    return matMonth;
  },

  calcMY: (mDate) => {
    const matYear = mDate.slice(mDate.lastIndexOf("-") + 1, mDate.length);
    return matYear;
  },

  calcFR: (frate) => {
    if (frate === "RESET") {
      return "Y";
    }
  },

  calcTF: (subt) => {
    if (subt === "IF" || subt === "PF") {
      return "Y";
    }
  },

  calcCR: (crstr) => {
    switch (true) {
      case crstr.includes("AA") || crstr.includes("A"):
        return "H";
      case crstr.includes("AAA"):
        return "E";
      case crstr.includes("BB-"):
        return "L";
      case crstr.includes("BB") || crstr.includes("BBB"):
        return "M";
    }
  },
  calcYTM: (sm, sy, mm, my, rate, fv, price) => {
    const numOfYear = ((12 - sm) / 12) + ((my - sy) - 1) + (mm / 12);
    const ytm = (rate + ((fv - price) / numOfYear)) / ((fv + price) / 2);
    return ytm;
  },
};

module.exports = calc;
