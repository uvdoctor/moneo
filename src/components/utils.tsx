import { ASSET_CATEGORIES, ASSET_TYPES, COLORS } from "../CONSTANTS";
import { getQty } from "./nw/parseutils";

export function getCurrencyList() {
  return {
    USD: "United States dollar",
    CAD: "Canadian dollar",
    GBP: "Pound sterling",
    EUR: "Euro",
    CHF: "Swiss franc",
    JPY: "Japanese yen",
    CNY: "Renminbi|Chinese yuan",
    INR: "Indian rupee",
    SGD: "Singapore dollar",
    AUD: "Australian dollar",
    AED: "United Arab Emirates dirham",
    AFN: "Afghan afghani",
    ALL: "Albanian lek",
    AMD: "Armenian dram",
    ANG: "Netherlands Antillean guilder",
    AOA: "Angolan kwanza",
    ARS: "Argentine peso",
    AWG: "Aruban florin",
    AZN: "Azerbaijani manat",
    BAM: "Bosnia and Herzegovina convertible mark",
    BBD: "Barbados dollar",
    BDT: "Bangladeshi taka",
    BGN: "Bulgarian lev",
    BHD: "Bahraini dinar",
    BIF: "Burundian franc",
    BMD: "Bermudian dollar",
    BND: "Brunei dollar",
    BOB: "Boliviano",
    BRL: "Brazilian real",
    BSD: "Bahamian dollar",
    BTN: "Bhutanese ngultrum",
    BWP: "Botswana pula",
    BYN: "New Belarusian ruble",
    BYR: "Belarusian ruble",
    BZD: "Belize dollar",
    CDF: "Congolese franc",
    CLF: "Unidad de Fomento",
    CLP: "Chilean peso",
    COP: "Colombian peso",
    CRC: "Costa Rican colon",
    CUC: "Cuban convertible peso",
    CUP: "Cuban peso",
    CVE: "Cape Verde escudo",
    CZK: "Czech koruna",
    DJF: "Djiboutian franc",
    DKK: "Danish krone",
    DOP: "Dominican peso",
    DZD: "Algerian dinar",
    EGP: "Egyptian pound",
    ERN: "Eritrean nakfa",
    ETB: "Ethiopian birr",
    FJD: "Fiji dollar",
    FKP: "Falkland Islands pound",
    GEL: "Georgian lari",
    GHS: "Ghanaian cedi",
    GIP: "Gibraltar pound",
    GMD: "Gambian dalasi",
    GNF: "Guinean franc",
    GTQ: "Guatemalan quetzal",
    GYD: "Guyanese dollar",
    HKD: "Hong Kong dollar",
    HNL: "Honduran lempira",
    HRK: "Croatian kuna",
    HTG: "Haitian gourde",
    HUF: "Hungarian forint",
    IDR: "Indonesian rupiah",
    ILS: "Israeli new shekel",
    IQD: "Iraqi dinar",
    IRR: "Iranian rial",
    ISK: "Icelandic króna",
    JMD: "Jamaican dollar",
    JOD: "Jordanian dinar",
    KES: "Kenyan shilling",
    KGS: "Kyrgyzstani som",
    KHR: "Cambodian riel",
    KMF: "Comoro franc",
    KPW: "North Korean won",
    KRW: "South Korean won",
    KWD: "Kuwaiti dinar",
    KYD: "Cayman Islands dollar",
    KZT: "Kazakhstani tenge",
    LAK: "Lao kip",
    LBP: "Lebanese pound",
    LKR: "Sri Lankan rupee",
    LRD: "Liberian dollar",
    LSL: "Lesotho loti",
    LYD: "Libyan dinar",
    MAD: "Moroccan dirham",
    MDL: "Moldovan leu",
    MGA: "Malagasy ariary",
    MKD: "Macedonian denar",
    MMK: "Myanmar kyat",
    MNT: "Mongolian tögrög",
    MOP: "Macanese pataca",
    MRO: "Mauritanian ouguiya",
    MUR: "Mauritian rupee",
    MVR: "Maldivian rufiyaa",
    MWK: "Malawian kwacha",
    MXN: "Mexican peso",
    MXV: "Mexican Unidad de Inversion",
    MYR: "Malaysian ringgit",
    MZN: "Mozambican metical",
    NAD: "Namibian dollar",
    NGN: "Nigerian naira",
    NIO: "Nicaraguan córdoba",
    NOK: "Norwegian krone",
    NPR: "Nepalese rupee",
    NZD: "New Zealand dollar",
    OMR: "Omani rial",
    PAB: "Panamanian balboa",
    PEN: "Peruvian Sol",
    PGK: "Papua New Guinean kina",
    PHP: "Philippine peso",
    PKR: "Pakistani rupee",
    PLN: "Polish złoty",
    PYG: "Paraguayan guaraní",
    QAR: "Qatari riyal",
    RON: "Romanian leu",
    RSD: "Serbian dinar",
    RUB: "Russian ruble",
    RWF: "Rwandan franc",
    SAR: "Saudi riyal",
    SBD: "Solomon Islands dollar",
    SCR: "Seychelles rupee",
    SDG: "Sudanese pound",
    SEK: "Swedish krona",
    SHP: "Saint Helena pound",
    SLL: "Sierra Leonean leone",
    SOS: "Somali shilling",
    SRD: "Surinamese dollar",
    SSP: "South Sudanese pound",
    STD: "São Tomé and Príncipe dobra",
    SVC: "Salvadoran colón",
    SYP: "Syrian pound",
    SZL: "Swazi lilangeni",
    THB: "Thai baht",
    TJS: "Tajikistani somoni",
    TMT: "Turkmenistani manat",
    TND: "Tunisian dinar",
    TOP: "Tongan paʻanga",
    TRY: "Turkish lira",
    TTD: "Trinidad and Tobago dollar",
    TWD: "New Taiwan dollar",
    TZS: "Tanzanian shilling",
    UAH: "Ukrainian hryvnia",
    UGX: "Ugandan shilling",
    UYI: "Uruguay Peso en Unidades Indexadas",
    UYU: "Uruguayan peso",
    UZS: "Uzbekistan som",
    VEF: "Venezuelan bolívar",
    VND: "Vietnamese đồng",
    VUV: "Vanuatu vatu",
    WST: "Samoan tala",
    XAF: "Central African CFA franc",
    XCD: "East Caribbean dollar",
    XOF: "West African CFA franc",
    XPF: "CFP franc",
    YER: "Yemeni rial",
    ZAR: "South African rand",
    ZMW: "Zambian kwacha",
    ZWL: "Zimbabwean dollar",
  };
}

const getNewLineBreaks = (newLineSeparator: string, newLineBreakCount: number) => {
  let str = newLineSeparator;
  for (let i = 2; i <= newLineBreakCount; i++) str += newLineSeparator;
  return str;
};

export const appendValue = (obj: any, prop: string | number, val: number | string, newLineSeparator: string = '\n', newLineBreakCount: number = 1) => {
  obj.hasOwnProperty(prop) ? (obj[prop] += typeof val === 'string' ? getNewLineBreaks(newLineSeparator, newLineBreakCount) + val : val) : (obj[prop] = val);
};

export const changeSelection = (
  str: string,
  setter: Function,
  increment: number = 0
) => setter(parseInt(str) + increment);

export const toCurrency = (
  num: number | undefined,
  currency: string,
  decimal: boolean = false
) => {
  const formatter = new Intl.NumberFormat(navigator.language, {
    style: "currency",
    currency: currency,
    minimumFractionDigits: decimal ? 2 : 0,
    maximumFractionDigits: decimal ? 2 : 0,
  });
  return num ? formatter.format(num) : formatter.format(0);
};

export const getCurrencySymbol = (currency: string) =>
  toCurrency(0, currency).replace("0", "");

export const toReadableNumber = (num: number, decimalDigits: number = 0) => {
  const formatter = new Intl.NumberFormat(navigator.language, {
    minimumFractionDigits: decimalDigits,
    maximumFractionDigits: decimalDigits,
  });
  return num ? formatter.format(num) : formatter.format(0);
};

export const parseNumber = (str: string, currency: string | null = null) => {
  const formatter = currency
    ? new Intl.NumberFormat(navigator.language, {
        style: "currency",
        currency: currency,
      })
    : new Intl.NumberFormat(navigator.language);
  const parts = formatter.formatToParts(12345.6);
  const numerals = [
    ...new Intl.NumberFormat(navigator.language, { useGrouping: false }).format(
      9876543210
    ),
  ].reverse();
  const index = new Map(numerals.map((d, i) => [d, i]));
  let currencyRegex = null;
  if (currency)
    currencyRegex = new RegExp(
      `[${parts.find((d) => d.type === "currency")?.value}]`,
      "g"
    );
  const groupRegex = new RegExp(
    `[${parts.find((d) => d.type === "group")?.value}]`,
    "g"
  );
  const decimalRegex = new RegExp(
    `[${parts.find((d) => d.type === "decimal")?.value}]`
  );
  const numeralRegex = new RegExp(`[${numerals.join("")}]`, "g");
  let retVal = str.trim();
  if (currencyRegex) retVal = retVal.replace(currencyRegex, "");
  retVal = retVal.replace(groupRegex, "").replace(decimalRegex, ".");
  retVal = retVal.replace(
    numeralRegex,
    //@ts-ignore
    (d: string) => index.get(d)
  );
  return retVal;
};

export function initOptions(
  startYear: number,
  duration: number,
  step: number = 1,
  exclusions: Array<number> = []
) {
  let years: any = {};
  for (
    let i = startYear;
    duration > 0 ? i <= startYear + duration : i >= startYear + duration;
    duration > 0 ? (i += step) : (i -= step)
  ) {
    if (!exclusions.includes(i)) years["" + i] = "" + i;
  }
  return years;
}

export const buildArray = (
  fromYear: number,
  toYear: number,
  num: number = 0
) => {
  let arr: Array<number> = [];
  for (let year = fromYear; year <= toYear; year++) arr.push(num);
  return arr;
};

export const buildYearsArray = (startYear: number, endYear: number) => {
  let years = [];
  for (let i = startYear; i <= endYear; i++) years.push(i);
  return years;
};

export const convertPerToDec = (arr: Array<number>) => {
  let retArr: Array<number> = [];
  arr.forEach((val) => retArr.push(val / 100));
  return retArr;
};

export const toStringArr = (
  startNum: number,
  endNum: number,
  step: number = 1
) => {
  let returnArr: Array<string> = [];
  for (let i = startNum; i <= endNum; i += step) {
    if (step < 1) returnArr.push(toReadableNumber(i, 1));
    else returnArr.push("" + i);
  }
  return returnArr;
};

export const removeFromArray = (arr: Array<any>, attr: string, value: any) => {
  let i = arr.length;
  while (i--) {
    if (arr[i] && arr[i].hasOwnProperty(attr) && arr[i][attr] === value) {
      arr.splice(i, 1);
    }
  }
};

export const getRangeFactor = (currency: string) => {
  const factor = {
    USD: 1,
    CAD: 1,
    GBP: 1,
    EUR: 1,
    CHF: 1,
    JPY: 100,
    CNY: 10,
    INR: 100,
    SGD: 2,
    AUD: 2,
    AED: 5,
    AFN: 100,
    ALL: 100,
    AMD: 500,
    ANG: 1,
    AOA: 500,
    ARS: 70,
    AWG: 1,
    AZN: 1,
    BAM: 1,
    BBD: 1,
    BDT: 100,
    BGN: 1,
    BHD: 1,
    BIF: 2000,
    BMD: 1,
    BND: 1,
    BOB: 10,
    BRL: 10,
    BSD: 1,
    BTN: 100,
    BWP: 10,
    BYN: 1,
    BYR: 1,
    BZD: 1,
    CDF: 2000,
    CLF: 1,
    CLP: 1000,
    COP: 3000,
    CRC: 500,
    CUC: 1,
    CUP: 1,
    CVE: 100,
    CZK: 20,
    DJF: 200,
    DKK: 10,
    DOP: 50,
    DZD: 200,
    EGP: 20,
    ERN: 20,
    ETB: 50,
    FJD: 5,
    FKP: 1,
    GEL: 5,
    GHS: 5,
    GIP: 1,
    GMD: 50,
    GNF: 10000,
    GTQ: 10,
    GYD: 200,
    HKD: 10,
    HNL: 50,
    HRK: 10,
    HTG: 100,
    HUF: 300,
    IDR: 15000,
    ILS: 10,
    IQD: 2000,
    IRR: 50000,
    ISK: 150,
    JMD: 140,
    JOD: 1,
    KES: 100,
    KGS: 100,
    KHR: 4000,
    KMF: 500,
    KPW: 1000,
    KRW: 2000,
    KWD: 1,
    KYD: 1,
    KZT: 500,
    LAK: 10000,
    LBP: 2000,
    LKR: 200,
    LRD: 200,
    LSL: 20,
    LYD: 1,
    MAD: 10,
    MDL: 20,
    MGA: 4000,
    MKD: 50,
    MMK: 1000,
    MNT: 3000,
    MOP: 10,
    MRO: 50,
    MUR: 50,
    MVR: 20,
    MWK: 1000,
    MXN: 20,
    MXV: 10,
    MYR: 10,
    MZN: 100,
    NAD: 20,
    NGN: 500,
    NIO: 50,
    NOK: 10,
    NPR: 200,
    NZD: 1,
    OMR: 1,
    PAB: 1,
    PEN: 10,
    PGK: 10,
    PHP: 50,
    PKR: 200,
    PLN: 10,
    PYG: 7000,
    QAR: 5,
    RON: 20,
    RSD: 100,
    RUB: 100,
    RWF: 1000,
    SAR: 5,
    SBD: 10,
    SCR: 20,
    SDG: 50,
    SEK: 10,
    SHP: 1,
    SLL: 100,
    SOS: 500,
    SRD: 10,
    SSP: 10000,
    STD: 10000,
    SVC: 10,
    SYP: 500,
    SZL: 20,
    THB: 50,
    TJS: 10,
    TMT: 5,
    TND: 5,
    TOP: 1,
    TRY: 10,
    TTD: 10,
    TWD: 50,
    TZS: 2000,
    UAH: 50,
    UGX: 4000,
    UYI: 50,
    UYU: 50,
    UZS: 10000,
    VEF: 10,
    VND: 20000,
    VUV: 100,
    WST: 1,
    XAF: 500,
    XCD: 1,
    XOF: 500,
    XPF: 100,
    YER: 250,
    ZAR: 20,
    ZMW: 20,
    ZWL: 500,
  };
  //@ts-ignore
  return factor[currency];
};

export function compareValues(key: string, order: string = "asc") {
  return function innerSort(a: any, b: any) {
    if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
      // property doesn't exist on either object
      return 0;
    }

    const varA = typeof a[key] === "string" ? a[key].toUpperCase() : a[key];
    const varB = typeof b[key] === "string" ? b[key].toUpperCase() : b[key];

    let comparison = 0;
    if (varA > varB) comparison = 1;
    else if (varA < varB) comparison = -1;
    return order === "desc" ? comparison * -1 : comparison;
  };
}

export const getAssetColour = (type: string) => {
  switch (type) {
    case ASSET_CATEGORIES.CASH:
      return COLORS.WHITE;
    case ASSET_TYPES.SAVINGS:
      return "#befe95";
    case ASSET_TYPES.DEPOSITS:
      return "#82d949";
    case ASSET_CATEGORIES.BONDS:
      return COLORS.WHITE;
    case ASSET_TYPES.MED_TERM_BONDS:
      return "#aa8dfa";
    case ASSET_TYPES.EMERGING_BONDS:
      return "#855cf8";
    case ASSET_TYPES.TAX_EXEMPT_BONDS:
      return "#e7defe";
    case ASSET_CATEGORIES.STOCKS:
      return COLORS.WHITE;
    case ASSET_TYPES.LARGE_CAP_STOCKS:
      return "#fdd0cb";
    case ASSET_TYPES.MID_CAP_STOCKS:
      return "#e78284";
    case ASSET_TYPES.SMALL_CAP_STOCKS:
      return "#cf544e";
    case ASSET_TYPES.INTERNATIONAL_STOCKS:
      return "#f9aaa6";
    case ASSET_TYPES.DIVIDEND_GROWTH_STOCKS:
      return "#ffa75c";
    case ASSET_CATEGORIES.ALTERNATIVE:
      return COLORS.WHITE;
    case ASSET_TYPES.GOLD:
      return "#f6e05e";
    case ASSET_TYPES.REIT:
      return "#7cd9fd";
    default:
      return "";
  }
};

export const getAllAssetCategories = () => [
  ASSET_CATEGORIES.CASH,
  ASSET_CATEGORIES.BONDS,
  ASSET_CATEGORIES.STOCKS,
  ASSET_CATEGORIES.ALTERNATIVE,
];

export const getAllAssetTypesByCategory = (category: string) => {
  switch (category) {
    case ASSET_CATEGORIES.CASH:
      return [ASSET_TYPES.SAVINGS, ASSET_TYPES.DEPOSITS];
    case ASSET_CATEGORIES.BONDS:
      return [
        ASSET_TYPES.MED_TERM_BONDS,
        ASSET_TYPES.EMERGING_BONDS,
        ASSET_TYPES.TAX_EXEMPT_BONDS,
      ];
    case ASSET_CATEGORIES.STOCKS:
      return [
        ASSET_TYPES.LARGE_CAP_STOCKS,
        ASSET_TYPES.MID_CAP_STOCKS,
        ASSET_TYPES.SMALL_CAP_STOCKS,
        ASSET_TYPES.INTERNATIONAL_STOCKS,
        ASSET_TYPES.DIVIDEND_GROWTH_STOCKS,
      ];
    case ASSET_CATEGORIES.ALTERNATIVE:
      return [ASSET_TYPES.REIT, ASSET_TYPES.GOLD];
    default:
      return [];
  }
};

export const getAllAssetTypes = () => Object.values(ASSET_TYPES);

export const buildTabsArray = (items: any) => {
  let result: Array<any> = [];
  let keys = Object.keys(items);
  keys.forEach((key, i) => {
    result.push({ label: key, order: i + 1, active: true, svg: items[key] });
  });
  return result;
};

export const isTopBottomLayout = (fsb: any) => fsb.info.innerWidth < 1024;

export const isMobileDevice = (fsb: any) => fsb.info.innerWidth < 768;

export const MONTHS: any = {
  1: "January",
  2: "February",
  3: "March",
  4: "April",
  5: "May",
  6: "June",
  7: "July",
  8: "August",
  9: "September",
  10: "October",
  11: "November",
  12: "December",
};

export const getMonthName = (monthNum: number, shortForm: boolean = false) => {
  if (monthNum < 1 || monthNum > 12) return "";
  let monthName: string = MONTHS[monthNum];
  return shortForm ? monthName.substring(0, 3) : monthName;
};

export const toHumanFriendlyCurrency = (val: number, currency: string) => {
  if (val < 100000) return toCurrency(val, currency);
  const lakhs = currency === "INR";
  let divider = lakhs ? 100000 : 1000000;
  let unit = lakhs ? "lakhs" : "million";
  const largeMultiplier = lakhs ? 100 : 1000;
  if (val >= divider * largeMultiplier) {
    divider *= largeMultiplier;
    unit = lakhs ? "crores" : "billion";
  }
  const decimals = val % divider === 0 ? 0 : 2;
  return `${getCurrencySymbol(currency)}${(val / divider).toFixed(
    decimals
  )} ${unit}`;
};

export const validateCaptcha = async (action: String, executeRecaptcha: Function) => {
  const token = await executeRecaptcha(action);

  await fetch('/api/verifycaptcha', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify({
      token: token
    })
  }).then((captchRes: any) => 
    captchRes.json()
  ).then((data: any) => {
    return data.success;
  }).catch((e : any) => {
    console.log("error while validating captcha ", e);
    return false;
  });
}

export const sendMail = async (to: String, from: String, template: String, templateData: any) => {
  await fetch('/api/sendemail', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify({
      to: to.split(";"),
      from: from.split(";"),
      template: template,
      templateData: templateData
    })
  }).then((res: any) => 
    res.json()
  ).then((data: any) => {
    return data.success;
  }).catch(() => {
    return false;
  });
}

const dateToUTC = (date: string) => {
  let constituents = date.split("/");
  return Date.UTC(parseInt(constituents[2]), parseInt(constituents[0]), parseInt(constituents[1]));
};

export const getDaysDiff = (dateTime: string) => {
  const dateFormat = Intl.DateTimeFormat('en-US', {
    timeZone: 'America/New_York'
  });
  const formattedDate = dateFormat.format(new Date(dateTime));
  const formattedNow = dateFormat.format(new Date());
  const nowUTC = dateToUTC(formattedNow);
  const dateUTC = dateToUTC(formattedDate);
  const diff = nowUTC - dateUTC;
  if (!diff) return 'Today';
  const dayInMs = 24 * 3600000;
  if (diff <= dayInMs) return 'Yesterday';
  return Math.round(diff / dayInMs) + ' days ago';
}

export const includesAny = (value: string, items: Array<string>) => {
  let v = value.trim().toLowerCase();
  for (let item of items) {
    if (v.includes(item.toLowerCase())) return true;
  }
  return false;
}

export const replaceIfFound = (value: string, items: Array<string>, replacement: string = "", endsWith: boolean = false) => {
  for (let item of items) {
    if (endsWith ? value.endsWith(item) : value.includes(item)) 
      value = value.replace(item, replacement);
  }
  return value.trim();
};

export const getValueBefore = (value: string, items: Array<string>) => {
  for (let item of items) {
    value = value.split(item)[0].trim();
  }
  return value;
}

export const getNumberAtEnd = (value: string) => {
  let words = value.split(" ");
  let endWord = words[words.length - 1].trim();
  return getQty(endWord);
}

export const countWords = (value: string) => {
  let words = value.split(" ");
  let numOfWords = 0;
  for (let word of words) {
    if (word.trim().length) numOfWords++;
  }
  return numOfWords;
}

export const removeDuplicates = (value: string) => {
  let values = value.split(" ");
  for (let i = 2; i < values.length; i++) {
    let v = values[i].trim();
    for (let j = 1; j < i; j++) {
      let token = values[j].trim();
      if (v === token) value = value.replace(token, "");
    }
  }
  return value.trim();
};

