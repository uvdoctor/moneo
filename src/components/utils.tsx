import { Menu } from "antd";
import Link from "next/link";
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
    AUD: "Australian dollar",
    AED: "United Arab Emirates dirham",
    BHD: "Bahrain dinar",
    BZD: "Belize dollar",
    CUC: "Cuban convertible peso",
    DJF: "Djibouti franc",
    ERN: "Eritrea Nafka",
    HKD: "Hong Kong dollar",
    JOD: "Jordan dinar",
    LBP: "Lebanon pound",
    NZD: "New Zealand dollar",
    OMR: "Omani rial",
    PAB: "Panama balboa",
    QAR: "Qatari riyal",
    SAR: "Saudi riyal",
    SEK: "Swedish krona",
  };
}

export const getPeggedCurrencyRates = () => {
  return {
    USD: 1,
    BHD: 0.38,
    BZD: 2,
    CUC: 1,
    DJF: 177.721,
    ERN: 15.07,
    HKD: 7.76,
    JOD: 0.71,
    LBP: 1507.5,
    OMR: 0.385,
    PAB: 1,
    QAR: 3.64,
    SAR: 3.75,
    AED: 3.673
  }
};

const getNewLineBreaks = (newLineSeparator: string, newLineBreakCount: number) => {
  let str = newLineSeparator;
  for (let i = 2; i <= newLineBreakCount; i++) str += newLineSeparator;
  return str;
};

export const appendValue = (obj: any, prop: string | number, val: number | string | any, newLineSeparator: string = '\n', newLineBreakCount: number = 1) => {
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
    AUD: 2,
    AED: 5,
    BHD: 1,
    BZD: 2,
    CUC: 1,
    DJF: 200,
    ERN: 20,
    HKD: 10,
    JOD: 1,
    LBP: 2000,
    NZD: 2,
    OMR: 1,
    PAB: 1,
    QAR: 5,
    SAR: 5,
    SEK: 10,
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
    case ASSET_TYPES.INTERNATIONAL_BONDS:
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
    case ASSET_TYPES.REAL_ESTATE:
      return "#7cd9fd";
    case ASSET_TYPES.INDIA_FIXED_INCOME:
      return "#aa8dfa";
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
        ASSET_TYPES.INTERNATIONAL_BONDS,
        ASSET_TYPES.TAX_EXEMPT_BONDS,
        ASSET_TYPES.INDIA_FIXED_INCOME
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
      return [ASSET_TYPES.REIT, ASSET_TYPES.GOLD, ASSET_TYPES.REAL_ESTATE];
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

const months = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ];

export const getMonthName = (monthNum: number, shortForm: boolean = false) => {
  if (monthNum < 1 || monthNum > 12) return "";
  let monthName: string = MONTHS[monthNum];
  return shortForm ? monthName.substring(0, 3) : monthName;
};

export const getMonthIndex = (monthName: string) => months.indexOf(monthName)+1;

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

export const menuItem = (name: string, path: string, selectedKey: string, multiCol: boolean = false) => 
<Menu.Item key={path} className={multiCol ? "multi-col-submenu" : ""}>
  {selectedKey !== path ? (
    <Link href={path}>
      <a>{name}</a>
    </Link>
  ) : (
    <label style={{ color: COLORS.GREEN }}>{name}</label>
  )}
</Menu.Item>

export const includesAny = (value: string, items: Array<string>) => {
  if(!value || !items) return false;
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

export const getFXRate = (ratesData: any, currency: string) => {
	if(ratesData[currency]) return ratesData[currency];
	const peggedRates: any = getPeggedCurrencyRates();
	return peggedRates[currency];
}