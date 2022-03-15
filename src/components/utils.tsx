import { Menu } from "antd";
import Link from "next/link";
import simpleStorage from "simplestorage.js";
import { RiskProfile, TaxLiability } from "../api/goals";
import { ASSET_CATEGORIES, COLORS, LOCAL_DATA_TTL } from "../CONSTANTS";

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
    AED: 3.673,
  };
};

const getNewLineBreaks = (
  newLineSeparator: string,
  newLineBreakCount: number
) => {
  let str = newLineSeparator;
  for (let i = 2; i <= newLineBreakCount; i++) str += newLineSeparator;
  return str;
};

export const appendValue = (
  obj: any,
  prop: string | number,
  val: number | string | any,
  newLineSeparator: string = "\n",
  newLineBreakCount: number = 1
) => {
  obj.hasOwnProperty(prop)
    ? (obj[prop] +=
        typeof val === "string"
          ? getNewLineBreaks(newLineSeparator, newLineBreakCount) + val
          : val)
    : (obj[prop] = val);
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
    minimumFractionDigits: 0,
    maximumFractionDigits: decimalDigits,
  });
  return formatter.format(num ? num : 0);
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

export const getAllAssetDetails = () => {
  return {
    cash: {
      label: "Emergency Cash",
      color: COLORS.GREEN,
      cat: "Cash",
    },
    ltdep: {
      label: "Retirement Funds",
      color: "#82d949",
      cat: "Cash",
    },
    mtb: {
      label: "Intermediate-term Bonds",
      color: "#aa8dfa",
      cat: ASSET_CATEGORIES.BONDS,
    },
    hyb: {
      label: "High-yield Bonds",
      color: "#befe95",
      cat: ASSET_CATEGORIES.BONDS,
    },
    imtb: {
      label: "International Intermediate-term Bonds",
      color: "#855cf8",
      cat: ASSET_CATEGORIES.BONDS,
    },
    ihyb: {
      label: "International High-yield Bonds",
      color: "#befe95",
      cat: ASSET_CATEGORIES.BONDS,
    },
    teb: {
      label: "Tax-exempt Bonds",
      color: "#e7defe",
      cat: ASSET_CATEGORIES.BONDS,
    },
    reit: {
      label: "REITs",
      color: "#ffc107",
      cat: ASSET_CATEGORIES.ALTERNATIVE,
    },
    reitETF: {
      label: "REIT ETFs",
      color: "#ffca28",
      cat: ASSET_CATEGORIES.ALTERNATIVE,
    },
    ireit: {
      label: "International REITs",
      color: "#ff6f00",
      cat: ASSET_CATEGORIES.ALTERNATIVE,
    },
    ireitETF: {
      label: "International REIT ETFs",
      color: "#ff8f00",
      cat: ASSET_CATEGORIES.ALTERNATIVE,
    },
    gold: {
      label: "Gold",
      color: "#f6e05e",
      cat: ASSET_CATEGORIES.ALTERNATIVE,
    },
    goldb: {
      label: "Gold Bonds",
      color: "#f6e05e",
      cat: ASSET_CATEGORIES.ALTERNATIVE,
    },
    lcetf: {
      label: "Large-cap ETFs",
      color: "#fdd0ab",
      cat: ASSET_CATEGORIES.STOCKS,
    },
    ilcetf: {
      label: "International Large-cap ETFs",
      color: "#f9aaa6",
      cat: ASSET_CATEGORIES.STOCKS,
    },
    lcs: {
      label: "Large-cap Stocks & Funds",
      color: "#fdd0cb",
      cat: ASSET_CATEGORIES.STOCKS,
    },
    mscs: {
      label: "Multi-cap Stocks & Funds",
      color: "#e78284",
      cat: ASSET_CATEGORIES.STOCKS,
    },
    imscs: {
      label: "International Multi-cap Stocks & Funds",
      color: "#cf544e",
      cat: ASSET_CATEGORIES.STOCKS,
    },
    ilcs: {
      label: "International Large-cap Stocks & Funds",
      color: "#f9aaa6",
      cat: ASSET_CATEGORIES.STOCKS,
    },
    dgs: {
      label: "Dividend-growth Stocks",
      color: "#ffa75c",
      cat: ASSET_CATEGORIES.STOCKS,
    },
    re: {
      label: "Real-estate",
      color: "#7cd9fd",
      cat: ASSET_CATEGORIES.ALTERNATIVE,
    },
    uc: {
      label: "Start-up Investments & Collections",
      color: "#ffab00",
      cat: ASSET_CATEGORIES.ALTERNATIVE,
    },
    crypto: {
      label: "Crypto",
      color: COLORS.RED,
      cat: ASSET_CATEGORIES.ALTERNATIVE,
    },
    p2p: {
      label: "P2P Lending",
      color: COLORS.ORANGE,
      cat: ASSET_CATEGORIES.ALTERNATIVE,
    },
  };
};

export const getAssetColour = (label: string) => {
  const allAssetDetails: any = getAllAssetDetails();
  for (let at of Object.keys(allAssetDetails)) {
    if (allAssetDetails[at].label === label) return allAssetDetails[at].color;
  }
  return COLORS.WHITE;
};

export const getAssetName = (type: string) => {
  const allAssetDetails: any = getAllAssetDetails();
  if (allAssetDetails[type]) return allAssetDetails[type].label;
  return "";
};

export const getAllAssetCategories = () => [
  ASSET_CATEGORIES.BONDS,
  ASSET_CATEGORIES.STOCKS,
  ASSET_CATEGORIES.ALTERNATIVE,
];

export const getAllAssetTypesByCategory = (category: string) => {
  const result: Array<string> = [];
  const allAssetDetails: any = getAllAssetDetails();
  for (let assetType of Object.keys(allAssetDetails)) {
    if (allAssetDetails[assetType].cat === category) result.push(assetType);
  }
  return result;
};

export const getAllAssetTypes = () => Object.keys(getAllAssetDetails());

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

const months = [
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

export const getMonthName = (monthNum: number, shortForm: boolean = false) => {
  if (monthNum < 1 || monthNum > 12) return "";
  let monthName: string = MONTHS[monthNum];
  return shortForm ? monthName.substring(0, 3) : monthName;
};

export const getMonthIndex = (monthName: string) =>
  months.indexOf(monthName) + 1;

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

const dateToUTC = (date: string) => {
  let constituents = date.split("/");
  return Date.UTC(
    parseInt(constituents[2]),
    parseInt(constituents[0]),
    parseInt(constituents[1])
  );
};

export const getDaysDiff = (dateTime: string) => {
  const dateFormat = Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
  });
  const formattedDate = dateFormat.format(new Date(dateTime));
  const formattedNow = dateFormat.format(new Date());
  const nowUTC = dateToUTC(formattedNow);
  const dateUTC = dateToUTC(formattedDate);
  const diff = nowUTC - dateUTC;
  if (!diff) return "Today";
  const dayInMs = 24 * 3600000;
  if (diff <= dayInMs) return "Yesterday";
  return Math.round(diff / dayInMs) + " days ago";
};

export const menuItem = (
  name: string,
  path: string,
  selectedKey: string,
  icon?: any | null,
  key?: string,
  multiCol?: boolean
) => (
  <Menu.Item
    key={key ? key : path}
    icon={icon ? icon : null}
    className={multiCol ? "multi-col-submenu" : ""}
  >
    {selectedKey !== path ? (
      <Link href={path}>
        <a>{name}</a>
      </Link>
    ) : (
      <label style={{ color: COLORS.GREEN }}>{name}</label>
    )}
  </Menu.Item>
);

export const includesAny = (value: string, items: Array<string>) => {
  if (!value || !items) return false;
  let v = value.trim().toLowerCase();
  for (let item of items) {
    if (v.includes(item.toLowerCase())) return true;
  }
  return false;
};

export const getFXRate = (fxRates: any, currency: string) => {
  if (fxRates[currency]) return fxRates[currency];
  const peggedRates: any = getPeggedCurrencyRates();
  return peggedRates[currency];
};

export const countrylist = [
  { countryCode: "US", value: "+1", label: "USA (+1)" },
  { countryCode: "GB", value: "+44", label: "UK (+44)" },
  { countryCode: "DZ", value: "+213", label: "Algeria (+213)" },
  { countryCode: "AD", value: "+376", label: "Andorra (+376)" },
  { countryCode: "AO", value: "+244", label: "Angola (+244)" },
  { countryCode: "AI", value: "+1264", label: "Anguilla (+1264)" },
  { countryCode: "AG", value: "+1268", label: "Antigua & Barbuda (+1268)" },
  { countryCode: "AR", value: "+54", label: "Argentina (+54)" },
  { countryCode: "AM", value: "+374", label: "Armenia (+374)" },
  { countryCode: "AW", value: "+297", label: "Aruba (+297)" },
  { countryCode: "AU", value: "+61", label: "Australia (+61)" },
  { countryCode: "AT", value: "+43", label: "Austria (+43)" },
  { countryCode: "AZ", value: "+994", label: "Azerbaijan (+994)" },
  { countryCode: "BS", value: "+1242", label: "Bahamas (+1242)" },
  { countryCode: "BH", value: "+973", label: "Bahrain (+973)" },
  { countryCode: "BD", value: "+880", label: "Bangladesh (+880)" },
  { countryCode: "BB", value: "+1246", label: "Barbados (+1246)" },
  { countryCode: "BY", value: "+375", label: "Belarus (+375)" },
  { countryCode: "BE", value: "+32", label: "Belgium (+32)" },
  { countryCode: "BZ", value: "+501", label: "Belize (+501)" },
  { countryCode: "BJ", value: "+229", label: "Benin (+229)" },
  { countryCode: "BM", value: "+1441", label: "Bermuda (+1441)" },
  { countryCode: "BT", value: "+975", label: "Bhutan (+975)" },
  { countryCode: "BO", value: "+591", label: "Bolivia (+591)" },
  { countryCode: "BA", value: "+387", label: "Bosnia Herzegovina (+387)" },
  { countryCode: "BW", value: "+267", label: "Botswana (+267)" },
  { countryCode: "BR", value: "+55", label: "Brazil (+55)" },
  { countryCode: "BN", value: "+673", label: "Brunei (+673)" },
  { countryCode: "BG", value: "+359", label: "Bulgaria (+359)" },
  { countryCode: "BF", value: "+226", label: "Burkina Faso (+226)" },
  { countryCode: "BI", value: "+257", label: "Burundi (+257)" },
  { countryCode: "KH", value: "+855", label: "Cambodia (+855)" },
  { countryCode: "CM", value: "+237", label: "Cameroon (+237)" },
  { countryCode: "CA", value: "+1", label: "Canada (+1)" },
  { countryCode: "CV", value: "+238", label: "Cape Verde Islands (+238)" },
  { countryCode: "KY", value: "+1345", label: "Cayman Islands (+1345)" },
  {
    countryCode: "CF",
    value: "+236",
    label: "Central African Republic (+236)",
  },
  { countryCode: "CL", value: "+56", label: "Chile (+56)" },
  { countryCode: "CN", value: "+86", label: "China (+86)" },
  { countryCode: "CO", value: "+57", label: "Colombia (+57)" },
  { countryCode: "KM", value: "+269", label: "Comoros (+269)" },
  { countryCode: "CG", value: "+242", label: "Congo (+242)" },
  { countryCode: "CK", value: "+682", label: "Cook Islands (+682)" },
  { countryCode: "CR", value: "+506", label: "Costa Rica (+506)" },
  { countryCode: "HR", value: "+385", label: "Croatia (+385)" },
  { countryCode: "CU", value: "+53", label: "Cuba (+53)" },
  { countryCode: "CW", value: "+599", label: "Curacao (+599)" },
  { countryCode: "CY", value: "+90392", label: "Cyprus North (+90392)" },
  { countryCode: "CY", value: "+357", label: "Cyprus South (+357)" },
  { countryCode: "CZ", value: "+420", label: "Czech Republic (+420)" },
  { countryCode: "DK", value: "+45", label: "Denmark (+45)" },
  { countryCode: "DJ", value: "+253", label: "Djibouti (+253)" },
  { countryCode: "DM", value: "+1809", label: "Dominica (+1809)" },
  { countryCode: "DO", value: "+1809", label: "Dominican Republic (+1809)" },
  { countryCode: "EC", value: "+593", label: "Ecuador (+593)" },
  { countryCode: "EG", value: "+20", label: "Egypt (+20)" },
  { countryCode: "SV", value: "+503", label: "El Salvador (+503)" },
  { countryCode: "GQ", value: "+240", label: "Equatorial Guinea (+240)" },
  { countryCode: "ER", value: "+291", label: "Eritrea (+291)" },
  { countryCode: "EE", value: "+372", label: "Estonia (+372)" },
  { countryCode: "ET", value: "+251", label: "Ethiopia (+251)" },
  { countryCode: "FK", value: "+500", label: "Falkland Islands (+500)" },
  { countryCode: "FO", value: "+298", label: "Faroe Islands (+298)" },
  { countryCode: "FJ", value: "+679", label: "Fiji (+679)" },
  { countryCode: "FI", value: "+358", label: "Finland (+358)" },
  { countryCode: "FR", value: "+33", label: "France (+33)" },
  { countryCode: "GF", value: "+594", label: "French Guiana (+594)" },
  { countryCode: "PF", value: "+689", label: "French Polynesia (+689)" },
  { countryCode: "GA", value: "+241", label: "Gabon (+241)" },
  { countryCode: "GM", value: "+220", label: "Gambia (+220)" },
  { countryCode: "GE", value: "+7880", label: "Georgia (+7880)" },
  { countryCode: "DE", value: "+49", label: "Germany (+49)" },
  { countryCode: "GH", value: "+233", label: "Ghana (+233)" },
  { countryCode: "GI", value: "+350", label: "Gibraltar (+350)" },
  { countryCode: "GR", value: "+30", label: "Greece (+30)" },
  { countryCode: "GL", value: "+299", label: "Greenland (+299)" },
  { countryCode: "GD", value: "+1473", label: "Grenada (+1473)" },
  { countryCode: "GP", value: "+590", label: "Guadeloupe (+590)" },
  { countryCode: "GU", value: "+671", label: "Guam (+671)" },
  { countryCode: "GT", value: "+502", label: "Guatemala (+502)" },
  { countryCode: "GN", value: "+224", label: "Guinea (+224)" },
  { countryCode: "GW", value: "+245", label: "Guinea - Bissau (+245)" },
  { countryCode: "GY", value: "+592", label: "Guyana (+592)" },
  { countryCode: "HT", value: "+509", label: "Haiti (+509)" },
  { countryCode: "HN", value: "+504", label: "Honduras (+504)" },
  { countryCode: "HK", value: "+852", label: "Hong Kong (+852)" },
  { countryCode: "HU", value: "+36", label: "Hungary (+36)" },
  { countryCode: "IS", value: "+354", label: "Iceland (+354)" },
  { countryCode: "IN", value: "+91", label: "India (+91)" },
  { countryCode: "ID", value: "+62", label: "Indonesia (+62)" },
  { countryCode: "IR", value: "+98", label: "Iran (+98)" },
  { countryCode: "IQ", value: "+964", label: "Iraq (+964)" },
  { countryCode: "IE", value: "+353", label: "Ireland (+353)" },
  { countryCode: "IL", value: "+972", label: "Israel (+972)" },
  { countryCode: "IT", value: "+39", label: "Italy (+39)" },
  { countryCode: "JM", value: "+1876", label: "Jamaica (+1876)" },
  { countryCode: "JP", value: "+81", label: "Japan (+81)" },
  { countryCode: "JO", value: "+962", label: "Jordan (+962)" },
  { countryCode: "KZ", value: "+7", label: "Kazakhstan (+7)" },
  { countryCode: "KE", value: "+254", label: "Kenya (+254)" },
  { countryCode: "KI", value: "+686", label: "Kiribati (+686)" },
  { countryCode: "KP", value: "+850", label: "Korea North (+850)" },
  { countryCode: "KR", value: "+82", label: "Korea South (+82)" },
  { countryCode: "KW", value: "+965", label: "Kuwait (+965)" },
  { countryCode: "KG", value: "+996", label: "Kyrgyzstan (+996)" },
  { countryCode: "LA", value: "+856", label: "Laos (+856)" },
  { countryCode: "LV", value: "+371", label: "Latvia (+371)" },
  { countryCode: "LB", value: "+961", label: "Lebanon (+961)" },
  { countryCode: "LS", value: "+266", label: "Lesotho (+266)" },
  { countryCode: "LR", value: "+231", label: "Liberia (+231)" },
  { countryCode: "LY", value: "+218", label: "Libya (+218)" },
  { countryCode: "LI", value: "+417", label: "Liechtenstein (+417)" },
  { countryCode: "LT", value: "+370", label: "Lithuania (+370)" },
  { countryCode: "LU", value: "+352", label: "Luxembourg (+352)" },
  { countryCode: "MO", value: "+853", label: "Macao (+853)" },
  { countryCode: "MK", value: "+389", label: "Macedonia (+389)" },
  { countryCode: "MG", value: "+261", label: "Madagascar (+261)" },
  { countryCode: "MW", value: "+265", label: "Malawi (+265)" },
  { countryCode: "MY", value: "+60", label: "Malaysia (+60)" },
  { countryCode: "MV", value: "+960", label: "Maldives (+960)" },
  { countryCode: "ML", value: "+223", label: "Mali (+223)" },
  { countryCode: "MT", value: "+356", label: "Malta (+356)" },
  { countryCode: "MH", value: "+692", label: "Marshall Islands (+692)" },
  { countryCode: "MQ", value: "+596", label: "Martinique (+596)" },
  { countryCode: "MR", value: "+222", label: "Mauritania (+222)" },
  { countryCode: "YT", value: "+269", label: "Mayotte (+269)" },
  { countryCode: "MX", value: "+52", label: "Mexico (+52)" },
  { countryCode: "FM", value: "+691", label: "Micronesia (+691)" },
  { countryCode: "MD", value: "+373", label: "Moldova (+373)" },
  { countryCode: "MC", value: "+377", label: "Monaco (+377)" },
  { countryCode: "MN", value: "+976", label: "Mongolia (+976)" },
  { countryCode: "MS", value: "+1664", label: "Montserrat (+1664)" },
  { countryCode: "MA", value: "+212", label: "Morocco (+212)" },
  { countryCode: "MZ", value: "+258", label: "Mozambique (+258)" },
  { countryCode: "MN", value: "+95", label: "Myanmar (+95)" },
  { countryCode: "NA", value: "+264", label: "Namibia (+264)" },
  { countryCode: "NR", value: "+674", label: "Nauru (+674)" },
  { countryCode: "NP", value: "+977", label: "Nepal (+977)" },
  { countryCode: "NL", value: "+31", label: "Netherlands (+31)" },
  { countryCode: "NC", value: "+687", label: "New Caledonia (+687)" },
  { countryCode: "NZ", value: "+64", label: "New Zealand (+64)" },
  { countryCode: "NI", value: "+505", label: "Nicaragua (+505)" },
  { countryCode: "NE", value: "+227", label: "Niger (+227)" },
  { countryCode: "NG", value: "+234", label: "Nigeria (+234)" },
  { countryCode: "NU", value: "+683", label: "Niue (+683)" },
  { countryCode: "NF", value: "+672", label: "Norfolk Islands (+672)" },
  { countryCode: "NP", value: "+670", label: "Northern Marianas (+670)" },
  { countryCode: "NO", value: "+47", label: "Norway (+47)" },
  { countryCode: "OM", value: "+968", label: "Oman (+968)" },
  { countryCode: "PW", value: "+680", label: "Palau (+680)" },
  { countryCode: "PA", value: "+507", label: "Panama (+507)" },
  { countryCode: "PG", value: "+675", label: "Papua New Guinea (+675)" },
  { countryCode: "PY", value: "+595", label: "Paraguay (+595)" },
  { countryCode: "PE", value: "+51", label: "Peru (+51)" },
  { countryCode: "PH", value: "+63", label: "Philippines (+63)" },
  { countryCode: "PL", value: "+48", label: "Poland (+48)" },
  { countryCode: "PT", value: "+351", label: "Portugal (+351)" },
  { countryCode: "PR", value: "+1787", label: "Puerto Rico (+1787)" },
  { countryCode: "QA", value: "+974", label: "Qatar (+974)" },
  { countryCode: "RE", value: "+262", label: "Reunion (+262)" },
  { countryCode: "RO", value: "+40", label: "Romania (+40)" },
  { countryCode: "RU", value: "+7", label: "Russia (+7)" },
  { countryCode: "RW", value: "+250", label: "Rwanda (+250)" },
  { countryCode: "SM", value: "+378", label: "San Marino (+378)" },
  { countryCode: "ST", value: "+239", label: "Sao Tome & Principe (+239)" },
  { countryCode: "SA", value: "+966", label: "Saudi Arabia (+966)" },
  { countryCode: "SN", value: "+221", label: "Senegal (+221)" },
  { countryCode: "CS", value: "+381", label: "Serbia (+381)" },
  { countryCode: "SC", value: "+248", label: "Seychelles (+248)" },
  { countryCode: "SL", value: "+232", label: "Sierra Leone (+232)" },
  { countryCode: "SX", value: "+1", label: "Sint Maarten (+1)" },
  { countryCode: "SG", value: "+65", label: "Singapore (+65)" },
  { countryCode: "SK", value: "+421", label: "Slovak Republic (+421)" },
  { countryCode: "SI", value: "+386", label: "Slovenia (+386)" },
  { countryCode: "SB", value: "+677", label: "Solomon Islands (+677)" },
  { countryCode: "SO", value: "+252", label: "Somalia (+252)" },
  { countryCode: "ZA", value: "+27", label: "South Africa (+27)" },
  { countryCode: "ES", value: "+34", label: "Spain (+34)" },
  { countryCode: "LK", value: "+94", label: "Sri Lanka (+94)" },
  { countryCode: "SH", value: "+290", label: "St. Helena (+290)" },
  { countryCode: "KN", value: "+1869", label: "St. Kitts (+1869)" },
  { countryCode: "SC", value: "+1758", label: "St. Lucia (+1758)" },
  { countryCode: "SD", value: "+249", label: "Sudan (+249)" },
  { countryCode: "SR", value: "+597", label: "Suriname (+597)" },
  { countryCode: "SZ", value: "+268", label: "Swaziland (+268)" },
  { countryCode: "SE", value: "+46", label: "Sweden (+46)" },
  { countryCode: "CH", value: "+41", label: "Switzerland (+41)" },
  { countryCode: "SI", value: "+963", label: "Syria (+963)" },
  { countryCode: "TW", value: "+886", label: "Taiwan (+886)" },
  { countryCode: "TJ", value: "+7", label: "Tajikstan (+7)" },
  { countryCode: "TH", value: "+66", label: "Thailand (+66)" },
  { countryCode: "TG", value: "+228", label: "Togo (+228)" },
  { countryCode: "TO", value: "+676", label: "Tonga (+676)" },
  { countryCode: "TT", value: "+1868", label: "Trinidad & Tobago (+1868)" },
  { countryCode: "TN", value: "+216", label: "Tunisia (+216)" },
  { countryCode: "TR", value: "+90", label: "Turkey (+90)" },
  { countryCode: "TM", value: "+7", label: "Turkmenistan (+7)" },
  { countryCode: "TM", value: "+993", label: "Turkmenistan (+993)" },
  {
    countryCode: "TC",
    value: "+1649",
    label: "Turks & Caicos Islands (+1649)",
  },
  { countryCode: "TV", value: "+688", label: "Tuvalu (+688)" },
  { countryCode: "UG", value: "+256", label: "Uganda (+256)" },
  { countryCode: "UA", value: "+380", label: "Ukraine (+380)" },
  { countryCode: "AE", value: "+971", label: "United Arab Emirates (+971)" },
  { countryCode: "UY", value: "+598", label: "Uruguay (+598)" },
  { countryCode: "UZ", value: "+7", label: "Uzbekistan (+7)" },
  { countryCode: "VU", value: "+678", label: "Vanuatu (+678)" },
  { countryCode: "VA", value: "+379", label: "Vatican City (+379)" },
  { countryCode: "VE", value: "+58", label: "Venezuela (+58)" },
  { countryCode: "VN", value: "+84", label: "Vietnam (+84)" },
  {
    countryCode: "VG",
    value: "+84",
    label: "Virgin Islands - British (+1284)",
  },
  { countryCode: "VI", value: "+84", label: "Virgin Islands - US (+1340)" },
  { countryCode: "WF", value: "+681", label: "Wallis and Futuna (+681)" },
  { countryCode: "YE", value: "+969", label: "Yemen (North) (+969)" },
  { countryCode: "YE", value: "+967", label: "Yemen (South) (+967)" },
  { countryCode: "ZM", value: "+260", label: "Zambia (+260)" },
  { countryCode: "ZW", value: "+263", label: "Zimbabwe (+263)" },
];

export const getRiskProfileOptions = () => {
  return {
    [RiskProfile.VC]: "Up to 0%",
    [RiskProfile.C]: "Up to 10%",
    [RiskProfile.M]: "Up to 20%",
    [RiskProfile.A]: "Up to 30%",
    [RiskProfile.VA]: "Up to 50%",
  };
};

export const getTaxLiabilityOptions = () => {
  return {
    [TaxLiability.NIL]: "Less than 4 lakhs",
    [TaxLiability.L]: "Between 4 lakhs to 7 lakhs",
    [TaxLiability.M]: "Between 7 to 10 lakhs",
    [TaxLiability.H]: "Between 10 to 15 lakhs",
    [TaxLiability.VH]: "More than 15 lakhs",
  };
};

export const getDiscountRate = (rp: string, country: string) => {
  const percent = country === "IN" ? 5 : 1;
  switch (rp) {
    case RiskProfile.VC:
      return percent;
    case RiskProfile.C:
      return percent + 2;
    case RiskProfile.M:
      return percent + 4;
    case RiskProfile.A:
      return percent + 6;
    case RiskProfile.VA:
      return percent + 10;
  }
};

export const presentMonth = new Date().getMonth() + 1;
export const presentYear = new Date().getFullYear();

export const getFXData = async (token: string) => {
  const defaultFXRates: { [key: string]: number } = {
    AUD: 1.4135,
    CAD: 1.2717,
    CHF: 0.9248,
    CNY: 6.3496,
    EUR: 0.8913,
    GBP: 0.7448,
    INR: 75.19,
    JPY: 114.658,
    NZD: 1.5134,
    SEK: 9.3483,
  };
  const currencyList = Object.keys(defaultFXRates);
  for (let curr of currencyList) {
    try {
      const data = await fetch(
        `https://eodhistoricaldata.com/api/real-time/${curr}.FOREX?api_token=${token}&fmt=json`
      );
      const response = await data.json();
      defaultFXRates[curr] = response.close;
    } catch {
      break;
    }
  }
  return defaultFXRates;
};

export const getPrice = async (id: string, type: string) => {
  let rate = simpleStorage.get(id);
  if (rate) return rate;
  return await fetch("/api/price", {
    method: "POST",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
    body: JSON.stringify({
      id: id,
      type: type,
    }),
  })
    .then(async (res: any) => {
      const re = await res.json();
      simpleStorage.set(id, re.rate, LOCAL_DATA_TTL);
      return re.rate;
    })
    .catch(() => {
      return defaultPrices[id];
    });
};

export const defaultPrices: { [key: string]: number } = {
  BTC: 36392.3,
  LTC: 107.26,
  ETH: 2456.48,
  XRP: 0.60529,
  DASH: 90.95,
  XMR: 144.3,
  ETC: 24.04,
  BCH: 286.53,
  DOGE: 0.14,
  XLM: 36.23,
  GC: 58.45,
  PL: 33.19,
  SI: 0.76,
  PA: 74.66,
};

export const cryptoList: Array<any> = [
  {
    Code: "$ANRX-USD",
    Name: "AnRKey X",
  },
  {
    Code: "$KING-USD",
    Name: "King Swap",
  },
  {
    Code: "$TRDL-USD",
    Name: "Strudel Finance",
  },
  {
    Code: "0xBTC-USD",
    Name: "0xBitcoin",
  },
  {
    Code: "0xMR-USD",
    Name: "0xMonero",
  },
  {
    Code: "1337-USD",
    Name: "Elite",
  },
  {
    Code: "1810-USD",
    Name: "Xiaomi corp.",
  },
  {
    Code: "1GOLD-USD",
    Name: "1irstGold",
  },
  {
    Code: "1INCH-USD",
    Name: "1INCH",
  },
  {
    Code: "1MT-USD",
    Name: "1Million Token",
  },
  {
    Code: "1WO-USD",
    Name: "1World",
  },
  {
    Code: "1X2-USD",
    Name: "1X2 COIN",
  },
  {
    Code: "2GIVE-USD",
    Name: "2GIVE",
  },
  {
    Code: "2KEY-USD",
    Name: "2key.network",
  },
  {
    Code: "2X2-USD",
    Name: "2X2",
  },
  {
    Code: "300-USD",
    Name: "Spartan",
  },
  {
    Code: "3Cs-USD",
    Name: "Crypto Cricket Club",
  },
  {
    Code: "3X-LONG-BITCOIN-TOKEN-USD",
    Name: "3X Long Bitcoin Token",
  },
  {
    Code: "404-USD",
    Name: "404 coin",
  },
  {
    Code: "42-USD",
    Name: "42-coin",
  },
  {
    Code: "4ART-USD",
    Name: "4ART",
  },
  {
    Code: "611-USD",
    Name: "SixEleven",
  },
  {
    Code: "777-USD",
    Name: "777 Jackpot",
  },
  {
    Code: "7ADD-USD",
    Name: "HoldToWin",
  },
  {
    Code: "808TA-USD",
    Name: "808TA",
  },
  {
    Code: "9988-USD",
    Name: "Alibaba Group Holding Limited",
  },
  {
    Code: "A-USD",
    Name: "Alpha Token",
  },
  {
    Code: "A5T-USD",
    Name: "Alpha5",
  },
  {
    Code: "AA-USD",
    Name: "Alcoa",
  },
  {
    Code: "AAA-USD",
    Name: "AAAchain",
  },
  {
    Code: "AAB-USD",
    Name: "AAX Token",
  },
  {
    Code: "AAC-USD",
    Name: "Acute Angle Cloud",
  },
  {
    Code: "AAPL-USD",
    Name: "Apple Inc",
  },
  {
    Code: "AAVE-USD",
    Name: "Aave",
  },
  {
    Code: "ABAT-USD",
    Name: "Aave BAT",
  },
  {
    Code: "ABBC-USD",
    Name: "ABBC Coin",
  },
  {
    Code: "ABBV-USD",
    Name: "Abbvie",
  },
  {
    Code: "ABC-USD",
    Name: "Alphabit",
  },
  {
    Code: "ABCC-TOKEN-USD",
    Name: "ABCC Token",
  },
  {
    Code: "Abet-USD",
    Name: "Altbet",
  },
  {
    Code: "ABL-USD",
    Name: "Airbloc",
  },
  {
    Code: "ABNB-USD",
    Name: "Airbnb Inc.",
  },
  {
    Code: "ABS-USD",
    Name: "Absolute",
  },
  {
    Code: "ABST-USD",
    Name: "Abitshadow Token",
  },
  {
    Code: "ABT-USD",
    Name: "Arcblock",
  },
  {
    Code: "ABUSD-USD",
    Name: "Aave BUSD",
  },
  {
    Code: "ABX-USD",
    Name: "Arbidex",
  },
  {
    Code: "ABY-USD",
    Name: "ArtByte",
  },
  {
    Code: "ABYSS-USD",
    Name: "Abyss Token",
  },
  {
    Code: "AC-USD",
    Name: "ACoconut",
  },
  {
    Code: "ACA-USD",
    Name: "Acash Coin",
  },
  {
    Code: "ACA1-USD",
    Name: "Acala Token",
  },
  {
    Code: "ACAT-USD",
    Name: "Alphacat",
  },
  {
    Code: "ACDC-USD",
    Name: "Volt",
  },
  {
    Code: "ACES-USD",
    Name: "Aces",
  },
  {
    Code: "ACH1-USD",
    Name: "Alchemy Pay\r\n",
  },
  {
    Code: "ACM-USD",
    Name: "Actinium",
  },
  {
    Code: "ACOIN-USD",
    Name: "Acoin",
  },
  {
    Code: "ACS-USD",
    Name: "ACryptoS",
  },
  {
    Code: "ACT-USD",
    Name: "Achain",
  },
  {
    Code: "ACTINIUM-USD",
    Name: "Actinium",
  },
  {
    Code: "ACTN-USD",
    Name: "Action Coin",
  },
  {
    Code: "ACTP-USD",
    Name: "Archetypal Network",
  },
  {
    Code: "ACXT-USD",
    Name: "AC eXchange Token",
  },
  {
    Code: "ADA-BTC",
    Name: "ADA/BTC - Cardano Bitcoin",
    Country: "Unknown",
    Exchange: "CC",
    Currency: "NA",
    Type: "Currency",
    Isin: null,
  },
  {
    Code: "ADA-USD",
    Name: "Cardano",
  },
  {
    Code: "ADABEAR-USD",
    Name: "3X Short Cardano Token",
  },
  {
    Code: "ADABULL-USD",
    Name: "3X Long Cardano Token",
  },
  {
    Code: "ADADOWN-USD",
    Name: "ADADOWN",
  },
  {
    Code: "ADAI-USD",
    Name: "Aave DAI",
  },
  {
    Code: "ADAUP-USD",
    Name: "ADAUP",
  },
  {
    Code: "ADAX-USD",
    Name: "ADAX",
  },
  {
    Code: "ADB-USD",
    Name: "adbank",
  },
  {
    Code: "ADBE-USD",
    Name: "Adobe Systems Inc",
  },
  {
    Code: "ADC-USD",
    Name: "AudioCoin",
  },
  {
    Code: "ADEL-USD",
    Name: "Akropolis Delphi",
  },
  {
    Code: "ADI-USD",
    Name: "Aditus",
  },
  {
    Code: "ADK-USD",
    Name: "Aidos Kuneen",
  },
  {
    Code: "ADL-USD",
    Name: "Adelphoi",
  },
  {
    Code: "ADM-USD",
    Name: "ADAMANT Messenger",
  },
  {
    Code: "ADMN-USD",
    Name: "Adioman",
  },
  {
    Code: "ADP-USD",
    Name: "Adappter Token",
  },
  {
    Code: "ADS-USD",
    Name: "Adshares",
  },
  {
    Code: "ADX-USD",
    Name: "AdEx",
  },
  {
    Code: "ADZ-USD",
    Name: "Adzcoin",
  },
  {
    Code: "AE-USD",
    Name: "Aeternity",
  },
  {
    Code: "aENJ-USD",
    Name: "Aave Enjin",
  },
  {
    Code: "AENS-USD",
    Name: "AEN Smart Token",
  },
  {
    Code: "AEON-USD",
    Name: "Aeon",
  },
  {
    Code: "AER-USD",
    Name: "Aerdrop",
  },
  {
    Code: "AERGO-USD",
    Name: "Aergo",
  },
  {
    Code: "AET-USD",
    Name: "AeroToken",
  },
  {
    Code: "aEth-USD",
    Name: "ankrETH",
  },
  {
    Code: "AEX-USD",
    Name: "AEX 25 Token",
  },
  {
    Code: "AFC-USD",
    Name: "Apiary Fund Coin",
  },
  {
    Code: "AFIN-USD",
    Name: "Asian Fintech",
  },
  {
    Code: "AFRO-USD",
    Name: "Afro",
  },
  {
    Code: "AfroX-USD",
    Name: "AfroDex",
  },
  {
    Code: "AGCMN-USD",
    Name: "Agricoin Masternode",
  },
  {
    Code: "AGIX-USD",
    Name: "Singularity NET",
  },
  {
    Code: "AGLD-USD",
    Name: "Adventure Gold",
  },
  {
    Code: "AGS-USD",
    Name: "Aegis",
  },
  {
    Code: "AGU-USD",
    Name: "Agouti",
  },
  {
    Code: "AGVC-USD",
    Name: "AgaveCoin",
  },
  {
    Code: "AHF-USD",
    Name: "AmericanHorror.Finance",
  },
  {
    Code: "AIAS-USD",
    Name: "AIAS Coin",
  },
  {
    Code: "AIB-USD",
    Name: "Advanced Internet Blocks",
  },
  {
    Code: "AIDOC-USD",
    Name: "AI Doctor",
  },
  {
    Code: "AIDUS-USD",
    Name: "AIDUS TOKEN",
  },
  {
    Code: "AIM-USD",
    Name: "ModiHost",
  },
  {
    Code: "AIN-USD",
    Name: "AINORI",
  },
  {
    Code: "AION-USD",
    Name: "Aion",
  },
  {
    Code: "AIT-USD",
    Name: "AICHAIN",
  },
  {
    Code: "AITRA-USD",
    Name: "Aitra",
  },
  {
    Code: "AK12-USD",
    Name: "AK12",
  },
  {
    Code: "AKA-USD",
    Name: "Akroma",
  },
  {
    Code: "AKITA-USD",
    Name: "Akita Inu",
  },
  {
    Code: "AKN-USD",
    Name: "Akoin",
  },
  {
    Code: "AKRO-USD",
    Name: "Akropolis",
  },
  {
    Code: "AKT-USD",
    Name: "Akash Network",
  },
  {
    Code: "ALA-USD",
    Name: "AladiEx",
  },
  {
    Code: "ALAYA-USD",
    Name: "Alaya",
  },
  {
    Code: "ALBT-USD",
    Name: "AllianceBlock",
  },
  {
    Code: "ALCHEMY-USD",
    Name: "Alchemy",
  },
  {
    Code: "ALD-USD",
    Name: "Aludra Network",
  },
  {
    Code: "ALEPH-USD",
    Name: "aleph.im",
  },
  {
    Code: "ALG-USD",
    Name: "Algory",
  },
  {
    Code: "ALGO-USD",
    Name: "Algorand",
  },
  {
    Code: "ALGOBULL-USD",
    Name: "3X Long Algorand Token",
  },
  {
    Code: "ALI-USD",
    Name: "AiLink Token",
  },
  {
    Code: "ALIAS-USD",
    Name: "Alias",
  },
  {
    Code: "ALIBABA-TOKENIZED-STOCK-BITTREX-USD",
    Name: "Alibaba tokenized stock Bittrex",
  },
  {
    Code: "ALICE-USD",
    Name: "My Neighbor Alice",
  },
  {
    Code: "ALINK-USD",
    Name: "Aave LINK",
  },
  {
    Code: "ALIS-USD",
    Name: "ALIS",
  },
  {
    Code: "ALLBI-USD",
    Name: "ALL BEST ICO",
  },
  {
    Code: "ALLY-USD",
    Name: "Ally Financial",
  },
  {
    Code: "ALOHA-USD",
    Name: "Aloha",
  },
  {
    Code: "ALPA-USD",
    Name: "Alpaca City",
  },
  {
    Code: "ALPACA-USD",
    Name: "Alpaca Finance",
  },
  {
    Code: "ALPHA-USD",
    Name: "Alpha Finance",
  },
  {
    Code: "ALT-USD",
    Name: "Alt.Estate token",
  },
  {
    Code: "ALTBULL-USD",
    Name: "3X Long Altcoin Index Token",
  },
  {
    Code: "ALTC-USD",
    Name: "Antilitecoin",
  },
  {
    Code: "ALTCOMMUNITY-COIN-USD",
    Name: "SONO",
  },
  {
    Code: "ALTM-USD",
    Name: "Altmarkets Coin",
  },
  {
    Code: "ALY-USD",
    Name: "Ally",
  },
  {
    Code: "AMA-USD",
    Name: "MrWeb Finance",
  },
  {
    Code: "AMAZON-TOKENIZED-STOCK-FTX-USD",
    Name: "Amazon tokenized stock FTX",
  },
  {
    Code: "AMB-USD",
    Name: "Ambrosus",
  },
  {
    Code: "AMBER-USD",
    Name: "AmberCoin",
  },
  {
    Code: "AMC-USD",
    Name: "AMC",
  },
  {
    Code: "AMD-USD",
    Name: "Advanced Micro Devices Inc",
  },
  {
    Code: "AME-USD",
    Name: "Amepay",
  },
  {
    Code: "AMKR-USD",
    Name: "Aave MKR",
  },
  {
    Code: "AMLT-USD",
    Name: "AMLT",
  },
  {
    Code: "AMM-USD",
    Name: "MicroMoney",
  },
  {
    Code: "AMN-USD",
    Name: "Amon",
  },
  {
    Code: "AMO-USD",
    Name: "AMO Coin",
  },
  {
    Code: "AMON-USD",
    Name: "AmonD",
  },
  {
    Code: "AMP-BTC",
    Name: "AMP/BTC - HyperSpace Bitcoin\r\n",
    Country: "Unknown",
    Exchange: "CC",
    Currency: "NA",
    Type: "Currency",
    Isin: null,
  },
  {
    Code: "AMP-USD",
    Name: "Amp",
  },
  {
    Code: "AMPL-USD",
    Name: "Ampleforth",
  },
  {
    Code: "AMS-USD",
    Name: "AmsterdamCoin",
  },
  {
    Code: "AMZ-USD",
    Name: "AmazonasCoin",
  },
  {
    Code: "AMZN-USD",
    Name: "Amazon.com Inc",
  },
  {
    Code: "ANC-USD",
    Name: "Anoncoin",
  },
  {
    Code: "ANC1-USD",
    Name: "Anchor Protocol",
  },
  {
    Code: "ANCHOR-USD",
    Name: "AnchorSwap",
  },
  {
    Code: "ANCT-USD",
    Name: "Anchor",
  },
  {
    Code: "ANG-USD",
    Name: "Aureus Nummus Gold",
  },
  {
    Code: "ANI-USD",
    Name: "Animecoin",
  },
  {
    Code: "ANJ-USD",
    Name: "Aragon Court",
  },
  {
    Code: "ANKR-USD",
    Name: "Ankr",
  },
  {
    Code: "ANON-USD",
    Name: "ANON",
  },
  {
    Code: "ANT-USD",
    Name: "Aragon",
  },
  {
    Code: "ANTI-USD",
    Name: "AntiBitcoin",
  },
  {
    Code: "ANTISCAMTOKEN-USD",
    Name: "AntiscamToken",
  },
  {
    Code: "ANW-USD",
    Name: "Anchor Neural World Token",
  },
  {
    Code: "ANY-USD",
    Name: "Anyswap",
  },
  {
    Code: "AOA-USD",
    Name: "Aurora",
  },
  {
    Code: "AOG-USD",
    Name: "smARTOFGIVING",
  },
  {
    Code: "APC-USD",
    Name: "Alpha Coin",
  },
  {
    Code: "APE-USD",
    Name: "SpaceApesInuErc",
  },
  {
    Code: "API3-USD",
    Name: "API3",
  },
  {
    Code: "APIX-USD",
    Name: "APIX",
  },
  {
    Code: "APL-USD",
    Name: "Apollo Currency",
  },
  {
    Code: "APLP-USD",
    Name: "Apple Finance",
  },
  {
    Code: "APM-USD",
    Name: "apM Coin",
  },
  {
    Code: "APOLLO-USD",
    Name: "Apollo DAO",
  },
  {
    Code: "APOLLON-LIMASSOL-USD",
    Name: "Apollon Limassol",
  },
  {
    Code: "APPC-USD",
    Name: "AppCoins",
  },
  {
    Code: "APPLE-TOKENIZED-STOCK-FTX-USD",
    Name: "Apple tokenized stock FTX",
  },
  {
    Code: "APY-USD",
    Name: "APY.Finance",
  },
  {
    Code: "APY-VISION-USD",
    Name: "APY.Finance",
  },
  {
    Code: "AQT-USD",
    Name: "Alpha Quark Token",
  },
  {
    Code: "AR-USD",
    Name: "Arweave",
  },
  {
    Code: "ARAW-USD",
    Name: "ARAW",
  },
  {
    Code: "ARB-USD",
    Name: "ARbit",
  },
  {
    Code: "ARC-USD",
    Name: "Advanced Technology Coin",
  },
  {
    Code: "ARCG-USD",
    Name: "Arch Crypton Game",
  },
  {
    Code: "ARCH-USD",
    Name: "Archer DAO Governance Token",
  },
  {
    Code: "ARCO-USD",
    Name: "AquariusCoin",
  },
  {
    Code: "ARCONA-USD",
    Name: "Arcona",
  },
  {
    Code: "ARCT-USD",
    Name: "ArbitrageCT",
  },
  {
    Code: "ARDR-BTC",
    Name: "ARDR/BTC - Ardor Bitcoin",
    Country: "Unknown",
    Exchange: "CC",
    Currency: "NA",
    Type: "Currency",
    Isin: null,
  },
  {
    Code: "ARDR-USD",
    Name: "Ardor",
  },
  {
    Code: "ARDX-USD",
    Name: "ArdCoin",
  },
  {
    Code: "AREPA-USD",
    Name: "Arepacoin",
  },
  {
    Code: "ARGUS-USD",
    Name: "Argus",
  },
  {
    Code: "ARIA20-USD",
    Name: "Arianee",
  },
  {
    Code: "ARION-USD",
    Name: "Arion",
  },
  {
    Code: "ARK-USD",
    Name: "Ark",
  },
  {
    Code: "ARKK-USD",
    Name: "ARK Innovation ETF",
  },
  {
    Code: "ARMOR-USD",
    Name: "Armor Finance",
  },
  {
    Code: "ARMS-USD",
    Name: "2ACoin",
  },
  {
    Code: "ARNX-USD",
    Name: "Aeron",
  },
  {
    Code: "arNXM-USD",
    Name: "Armor NXM",
  },
  {
    Code: "ARO-USD",
    Name: "Arionum",
  },
  {
    Code: "ARPA-USD",
    Name: "ARPA Chain",
  },
  {
    Code: "ARQ-USD",
    Name: "Arqma",
  },
  {
    Code: "ARRR-USD",
    Name: "Pirate",
  },
  {
    Code: "ART-USD",
    Name: "Maecenas",
  },
  {
    Code: "ARTE-USD",
    Name: "ethArt",
  },
  {
    Code: "ARW-USD",
    Name: "Arrow",
  },
  {
    Code: "ARX-USD",
    Name: "ARCS",
  },
  {
    Code: "ASAFE-USD",
    Name: "AllSafe",
  },
  {
    Code: "ASD-USD",
    Name: "AscendEx Token",
  },
  {
    Code: "ASH-USD",
    Name: "Aeneas",
  },
  {
    Code: "ASK-USD",
    Name: "Permission Coin",
  },
  {
    Code: "ASKO-USD",
    Name: "Asko",
  },
  {
    Code: "ASM-USD",
    Name: "Assemble Protocol",
  },
  {
    Code: "ASNX-USD",
    Name: "Aave SNX",
  },
  {
    Code: "ASP-USD",
    Name: "Aspire",
  },
  {
    Code: "ASR-USD",
    Name: "AS Roma Fan Token",
  },
  {
    Code: "AST-USD",
    Name: "AirSwap",
  },
  {
    Code: "ASTA-USD",
    Name: "ASTA",
  },
  {
    Code: "ASTRO1-USD",
    Name: "Astroport",
  },
  {
    Code: "ASY-USD",
    Name: "ASYAGRO",
  },
  {
    Code: "AT-USD",
    Name: "ABCC Token",
  },
  {
    Code: "ATA-USD",
    Name: "Automata",
  },
  {
    Code: "ATB-USD",
    Name: "ATBCoin",
  },
  {
    Code: "ATCC-USD",
    Name: "ATC Coin",
  },
  {
    Code: "ATH-USD",
    Name: "Atheios",
  },
  {
    Code: "ATL-USD",
    Name: "ATLANT",
  },
  {
    Code: "ATLO-USD",
    Name: "Atlo",
  },
  {
    Code: "ATM1-USD",
    Name: "Atletico De Madrid Fan Token",
  },
  {
    Code: "ATMOS-USD",
    Name: "Atmos",
  },
  {
    Code: "ATN-USD",
    Name: "ATN",
  },
  {
    Code: "ATOM-USD",
    Name: "Cosmos",
  },
  {
    Code: "ATOMBULL-USD",
    Name: "3X Long Cosmos Token",
  },
  {
    Code: "ATP-USD",
    Name: "Atlas Protocol",
  },
  {
    Code: "ATRI-USD",
    Name: "Atari Token",
  },
  {
    Code: "ATT-USD",
    Name: "Attila",
  },
  {
    Code: "ATTN-USD",
    Name: "ATTN",
  },
  {
    Code: "ATUSD-USD",
    Name: "Aave TUSD",
  },
  {
    Code: "ATVI-USD",
    Name: "Activision Blizzard Inc",
  },
  {
    Code: "AUC-USD",
    Name: "Auctus",
  },
  {
    Code: "AUCTION-USD",
    Name: "Bounce Token",
  },
  {
    Code: "AUD-USD",
    Name: "Australian Dollar Token",
  },
  {
    Code: "AUDAX-USD",
    Name: "Audax",
  },
  {
    Code: "AUDIO-USD",
    Name: "Audius",
  },
  {
    Code: "AUDT-USD",
    Name: "Australian Dollar Token",
  },
  {
    Code: "AUOP-USD",
    Name: "Opalcoin",
  },
  {
    Code: "AUR-USD",
    Name: "Auroracoin",
  },
  {
    Code: "AURORA-USD",
    Name: "Arctic Finance",
  },
  {
    Code: "AURORA1-USD",
    Name: "Aurora",
  },
  {
    Code: "AUS-USD",
    Name: "Australia Cash",
  },
  {
    Code: "AUSCM-USD",
    Name: "Auric Network",
  },
  {
    Code: "AUTO1-USD",
    Name: "Auto",
  },
  {
    Code: "AUTOFARM-USD",
    Name: "Auto",
  },
  {
    Code: "AUX-USD",
    Name: "Auxilium",
  },
  {
    Code: "AV-USD",
    Name: "AvatarCoin",
  },
  {
    Code: "AVA-USD",
    Name: "Travala.com",
  },
  {
    Code: "AVAX-USD",
    Name: "Avalanche",
  },
  {
    Code: "AVC-USD",
    Name: "AVCCOIN",
  },
  {
    Code: "AVN-USD",
    Name: "Avantage",
  },
  {
    Code: "AWC-USD",
    Name: "Atomic Wallet Coin",
  },
  {
    Code: "AWG-USD",
    Name: "AurusGOLD",
  },
  {
    Code: "AWX-USD",
    Name: "AurusDeFi",
  },
  {
    Code: "AXA-USD",
    Name: "AXA Foundation",
  },
  {
    Code: "AXE-USD",
    Name: "Axe",
  },
  {
    Code: "AXEL-USD",
    Name: "AXEL",
  },
  {
    Code: "AXI-USD",
    Name: "Axioms",
  },
  {
    Code: "AXIA-USD",
    Name: "Axia Protocol",
  },
  {
    Code: "AXIOM-USD",
    Name: "Axiom",
  },
  {
    Code: "AXIS-USD",
    Name: "Axis DeFi",
  },
  {
    Code: "AXL-USD",
    Name: "AXiaL",
  },
  {
    Code: "AXPR-USD",
    Name: "aXpire",
  },
  {
    Code: "AXS-USD",
    Name: "Axie Infinity",
  },
  {
    Code: "AYA-USD",
    Name: "Aryacoin",
  },
  {
    Code: "AZ-USD",
    Name: "Azbit",
  },
  {
    Code: "AZT-USD",
    Name: "AZ Fundchain",
  },
  {
    Code: "AZUKI-USD",
    Name: "Azuki",
  },
  {
    Code: "AZUM-USD",
    Name: "Azuma coin",
  },
  {
    Code: "B1P-USD",
    Name: "B ONE PAYMENT",
  },
  {
    Code: "B20-USD",
    Name: "B20",
  },
  {
    Code: "B21-USD",
    Name: "B21",
  },
  {
    Code: "B2B-USD",
    Name: "B2BX",
  },
  {
    Code: "B2M-USD",
    Name: "Bit2Me",
  },
  {
    Code: "B2X-USD",
    Name: "SegWit2x",
  },
  {
    Code: "BA-USD",
    Name: "Boeing",
  },
  {
    Code: "BABA-USD",
    Name: "Alibaba Group Holding Limited",
  },
  {
    Code: "BAC-USD",
    Name: "BitAlphaCoin",
  },
  {
    Code: "BADGER-USD",
    Name: "Badger",
  },
  {
    Code: "BAK-USD",
    Name: "BaconCoin",
  },
  {
    Code: "BAKE-USD",
    Name: "BakerySwap",
  },
  {
    Code: "BAL-USD",
    Name: "Balancer",
  },
  {
    Code: "BALI-USD",
    Name: "Bali Coin",
  },
  {
    Code: "BALLS-USD",
    Name: "SpaceBalls",
  },
  {
    Code: "BAMBOO-USD",
    Name: "BambooDeFi",
  },
  {
    Code: "BAN-USD",
    Name: "Banano",
  },
  {
    Code: "BANANA-USD",
    Name: "ApeSwap Finance",
  },
  {
    Code: "BANCA-USD",
    Name: "Banca",
  },
  {
    Code: "BAND-USD",
    Name: "Band Protocol",
  },
  {
    Code: "BANKROLL-VAULT-USD",
    Name: "Bankroll Vault",
  },
  {
    Code: "BAO-USD",
    Name: "Bao Finance",
  },
  {
    Code: "BAR-USD",
    Name: "Titanium Blockchain",
  },
  {
    Code: "BARE-USD",
    Name: "BARE",
  },
  {
    Code: "BART-USD",
    Name: "BarterTrade",
  },
  {
    Code: "BAS-USD",
    Name: "BitAsean",
  },
  {
    Code: "BASE-USD",
    Name: "Base Protocol",
  },
  {
    Code: "BASH-USD",
    Name: "LuckChain",
  },
  {
    Code: "BASIC-USD",
    Name: "BASIC",
  },
  {
    Code: "BASID-USD",
    Name: "Basid Coin",
  },
  {
    Code: "BASIS-DOLLAR-USD",
    Name: "Basis Dollar",
  },
  {
    Code: "BASX-USD",
    Name: "Basix",
  },
  {
    Code: "BAT-USD",
    Name: "Basic Attention Token",
  },
  {
    Code: "BAX-USD",
    Name: "BABB",
  },
  {
    Code: "BAZ-USD",
    Name: "Bazooka Token",
  },
  {
    Code: "BB-USD",
    Name: "BlackBerry Limited",
  },
  {
    Code: "BBBY-USD",
    Name: "Bed Bath & Beyond Inc.",
  },
  {
    Code: "BBGC-USD",
    Name: "Big Bang Game Coin",
  },
  {
    Code: "BBI-USD",
    Name: "BelugaPay",
  },
  {
    Code: "BBK-USD",
    Name: "Bitblocks",
  },
  {
    Code: "BBO-USD",
    Name: "Bigbom",
  },
  {
    Code: "BBOO-USD",
    Name: "Panda Yield",
  },
  {
    Code: "BBP-USD",
    Name: "BiblePay",
  },
  {
    Code: "BBR-USD",
    Name: "Boolberry",
  },
  {
    Code: "BBS-USD",
    Name: "BBSCoin",
  },
  {
    Code: "BBT-USD",
    Name: "BitBoost",
  },
  {
    Code: "BBY-USD",
    Name: "Best Buy",
  },
  {
    Code: "BC-USD",
    Name: "Bitcoin Confidential",
  },
  {
    Code: "BCA-USD",
    Name: "Bitcoin Atom",
  },
  {
    Code: "BCASH-USD",
    Name: "Bankcoin",
  },
  {
    Code: "BCCX-USD",
    Name: "BCCXGenesis",
  },
  {
    Code: "BCD-USD",
    Name: "Bitcoin Diamond",
  },
  {
    Code: "BCDN-USD",
    Name: "BlockCDN",
  },
  {
    Code: "BCEO-USD",
    Name: "bitCEO",
  },
  {
    Code: "BCF-USD",
    Name: "Bitcoin Fast",
  },
  {
    Code: "BCH-BTC",
    Name: "BCH/BTC - Bitcoin Cash Bitcoin\r\n",
    Country: "Unknown",
    Exchange: "CC",
    Currency: "NA",
    Type: "Currency",
    Isin: null,
  },
  {
    Code: "BCH-USD",
    Name: "Bitcoin Cash",
  },
  {
    Code: "BCHBEAR-USD",
    Name: "3x Short Bitcoin Cash Token",
  },
  {
    Code: "BCHBULL-USD",
    Name: "3x Long Bitcoin Cash Token",
  },
  {
    Code: "BCHC-USD",
    Name: "BitCherry",
  },
  {
    Code: "BCHIP-USD",
    Name: "BLUECHIPS Token",
  },
  {
    Code: "BCN-USD",
    Name: "Bytecoin",
  },
  {
    Code: "BCNA-USD",
    Name: "BitCanna",
  },
  {
    Code: "BCNT-USD",
    Name: "Bincentive",
  },
  {
    Code: "BCP-USD",
    Name: "BCP TOKEN",
  },
  {
    Code: "BCPT-USD",
    Name: "BlockMason Credit Protocol",
  },
  {
    Code: "BCS-USD",
    Name: "Business Credit Substitute",
  },
  {
    Code: "BCT-USD",
    Name: "BitcoinTrust",
  },
  {
    Code: "BCV-USD",
    Name: "BitCapitalVendor",
  },
  {
    Code: "BCX-USD",
    Name: "BitcoinX",
  },
  {
    Code: "BCZ-USD",
    Name: "Bitcoin CZ",
  },
  {
    Code: "BCZERO-USD",
    Name: "Buggyra Coin Zero",
  },
  {
    Code: "BDAY-USD",
    Name: "Birthday Cake",
  },
  {
    Code: "BDCASH-USD",
    Name: "BigdataCash",
  },
  {
    Code: "BDCC-USD",
    Name: "BITICA COIN",
  },
  {
    Code: "BDG-USD",
    Name: "BitDegree",
  },
  {
    Code: "BDL-USD",
    Name: "Bundle Dao",
  },
  {
    Code: "BDO-USD",
    Name: "bDollar",
  },
  {
    Code: "BDP-USD",
    Name: "BidiPass",
  },
  {
    Code: "BDT-USD",
    Name: "Bitdepositary",
  },
  {
    Code: "BDX-USD",
    Name: "Beldex",
  },
  {
    Code: "BEAM-USD",
    Name: "Beam",
  },
  {
    Code: "BEAR-USD",
    Name: "BEAR Coin",
  },
  {
    Code: "BECN-USD",
    Name: "Beacon",
  },
  {
    Code: "BEEFY-FINANCE-USD",
    Name: "Beefy.Finance",
  },
  {
    Code: "BEET-USD",
    Name: "Beetle Coin",
  },
  {
    Code: "BEETS-USD",
    Name: "Beethoven X",
  },
  {
    Code: "BEL-USD",
    Name: "Bella Protocol",
  },
  {
    Code: "BELA-USD",
    Name: "Bela",
  },
  {
    Code: "BEPRO-USD",
    Name: "BetProtocol",
  },
  {
    Code: "BERN-USD",
    Name: "BERNcash",
  },
  {
    Code: "BERRY-USD",
    Name: "Berry",
  },
  {
    Code: "BEST-USD",
    Name: "Bitpanda Ecosystem Token",
  },
  {
    Code: "BETA-USD",
    Name: "PolyBeta Finance",
  },
  {
    Code: "BETA1-USD",
    Name: "PolyBeta Finance",
  },
  {
    Code: "BETH-USD",
    Name: "Beacon ETH",
  },
  {
    Code: "BETHER-USD",
    Name: "Bethereum",
  },
  {
    Code: "BETS-USD",
    Name: "BetsCoin",
  },
  {
    Code: "BF-USD",
    Name: "Bitforex",
  },
  {
    Code: "BFF-USD",
    Name: "BFFDoom",
  },
  {
    Code: "BFLY-USD",
    Name: "Butterfly Protocol",
  },
  {
    Code: "BFT-USD",
    Name: "BnkToTheFuture",
  },
  {
    Code: "BGG-USD",
    Name: "Bgogo Token",
  },
  {
    Code: "BGL-USD",
    Name: "Bitgesell",
  },
  {
    Code: "BGTT-USD",
    Name: "Baguette Token",
  },
  {
    Code: "BHAO-USD",
    Name: "Bithao",
  },
  {
    Code: "BHC-USD",
    Name: "BillionHappiness",
  },
  {
    Code: "BHD-USD",
    Name: "Bitcoin HD",
  },
  {
    Code: "BHIG-USD",
    Name: "BuckHathCoin",
  },
  {
    Code: "BHP-USD",
    Name: "BHPCoin",
  },
  {
    Code: "BID-USD",
    Name: "Bidao",
  },
  {
    Code: "BIDAO-USD",
    Name: "Bidao",
  },
  {
    Code: "BIDR-USD",
    Name: "BinanceIDR",
  },
  {
    Code: "BIDU-USD",
    Name: "Baidu Inc.",
  },
  {
    Code: "BIFI-USD",
    Name: "BiFi",
  },
  {
    Code: "BIG-USD",
    Name: "Big Lots",
  },
  {
    Code: "BIGBANG-CORE-USD",
    Name: "BigBang Core",
  },
  {
    Code: "BIGONE-TOKEN-USD",
    Name: "BigONE Token",
  },
  {
    Code: "BIGUP-USD",
    Name: "BigUp",
  },
  {
    Code: "BIIB-USD",
    Name: "Biogen Inc.",
  },
  {
    Code: "BILI-USD",
    Name: "Bilibili Inc.",
  },
  {
    Code: "BILL-USD",
    Name: "Bill.com Inc",
  },
  {
    Code: "BILLIBILLI-TOKENIZED-STOCK-BITTREX-USD",
    Name: "Billibilli tokenized stock Bittrex",
  },
  {
    Code: "BIO-USD",
    Name: "BioCoin",
  },
  {
    Code: "BIOB-USD",
    Name: "BioBar",
  },
  {
    Code: "BIONTECH-TOKENIZED-STOCK-BITTREX-USD",
    Name: "BioNTech tokenized stock Bittrex",
  },
  {
    Code: "BIONTECH-TOKENIZED-STOCK-FTX-USD",
    Name: "BioNTech tokenized stock FTX",
  },
  {
    Code: "BIOS-USD",
    Name: "BiosCrypto",
  },
  {
    Code: "BIP-USD",
    Name: "Minter",
  },
  {
    Code: "BIR-USD",
    Name: "Birake",
  },
  {
    Code: "BIRDCHAIN-USD",
    Name: "Birdchain",
  },
  {
    Code: "BIS-USD",
    Name: "Bismuth",
  },
  {
    Code: "BIT-FINANCIAL-USD",
    Name: "BitRewards",
  },
  {
    Code: "BIT-USD",
    Name: "BitRewards",
  },
  {
    Code: "BIT1-USD",
    Name: "BitDAO",
  },
  {
    Code: "BITALGO-USD",
    Name: "Bitalgo",
  },
  {
    Code: "BITB-USD",
    Name: "Bean Cash",
  },
  {
    Code: "BITC-USD",
    Name: "BitCash",
  },
  {
    Code: "BITCI-USD",
    Name: "Bitcicoin",
  },
  {
    Code: "BITCNY-USD",
    Name: "bitCNY",
  },
  {
    Code: "BITCOIN-CLASSIC-USD",
    Name: "Bitcoin Classic",
  },
  {
    Code: "BITCOIN-FILE-USD",
    Name: "Bitcoin File",
  },
  {
    Code: "BITCOINV-USD",
    Name: "BitcoinV",
  },
  {
    Code: "BITCOIVA-USD",
    Name: "Bitcoiva",
  },
  {
    Code: "BITETHER-USD",
    Name: "Bitether",
  },
  {
    Code: "BITO-USD",
    Name: "BitoPro Exchange Token",
  },
  {
    Code: "BITOK-USD",
    Name: "Bitok",
  },
  {
    Code: "BITPAYER-TOKEN-USD",
    Name: "Bitpayer Token",
  },
  {
    Code: "BITS-USD",
    Name: "Bitstar",
  },
  {
    Code: "BITSTAR-USD",
    Name: "Bitstar",
  },
  {
    Code: "BITSTEN-TOKEN-USD",
    Name: "Bitsten Token",
  },
  {
    Code: "BITT-USD",
    Name: "BITToken",
  },
  {
    Code: "BITTO-USD",
    Name: "BITTO",
  },
  {
    Code: "BITX-USD",
    Name: "BitScreener Token",
  },
  {
    Code: "BITZ-USD",
    Name: "Bitz",
  },
  {
    Code: "BIX-USD",
    Name: "Bibox Token",
  },
  {
    Code: "BIZZ-USD",
    Name: "BIZZCOIN",
  },
  {
    Code: "BKBT-USD",
    Name: "BeeKan",
  },
  {
    Code: "BKK-USD",
    Name: "BKEX Chain",
  },
  {
    Code: "BKKG-USD",
    Name: "BIOKKOIN",
  },
  {
    Code: "BLACK-USD",
    Name: "eosBLACK",
  },
  {
    Code: "BLAS-USD",
    Name: "BlakeStar 2.0",
  },
  {
    Code: "BLAST-USD",
    Name: "BLAST",
  },
  {
    Code: "BLAZR-USD",
    Name: "BlazerCoin",
  },
  {
    Code: "BLCT-USD",
    Name: "Bloomzed Loyalty Club Ticket",
  },
  {
    Code: "BLINK-USD",
    Name: "Blockmason Link",
  },
  {
    Code: "BLK-USD",
    Name: "BlackCoin",
  },
  {
    Code: "BLOC-USD",
    Name: "BLOC.MONEY",
  },
  {
    Code: "BLOCK-DUELERS-USD",
    Name: "Blocknet",
  },
  {
    Code: "BLOCK-USD",
    Name: "Blocknet",
  },
  {
    Code: "BLOCKCLOUD-USD",
    Name: "Blockcloud",
  },
  {
    Code: "BLOCKIDCOIN-USD",
    Name: "BLOCKIDCOIN",
  },
  {
    Code: "BLOCKMASON-LINK-USD",
    Name: "Blockmason Link",
  },
  {
    Code: "BLRY-USD",
    Name: "BillaryCoin",
  },
  {
    Code: "BLT-USD",
    Name: "Bloom",
  },
  {
    Code: "BLTG-USD",
    Name: "Block-Logic",
  },
  {
    Code: "BLU-USD",
    Name: "BlueCoin",
  },
  {
    Code: "BLUE-BAIKAL-USD",
    Name: "bluebird bio Inc.",
  },
  {
    Code: "BLUE-USD",
    Name: "Blue Protocol",
  },
  {
    Code: "BLURT-USD",
    Name: "BLURT",
  },
  {
    Code: "BLV-USD",
    Name: "Bellevue Network",
  },
  {
    Code: "BLX-USD",
    Name: "Blockchain Index",
  },
  {
    Code: "BLY-USD",
    Name: "Blocery",
  },
  {
    Code: "BLZ-USD",
    Name: "Bluezelle",
  },
  {
    Code: "BMC-USD",
    Name: "Blackmoon",
  },
  {
    Code: "BMH-USD",
    Name: "BlockMesh",
  },
  {
    Code: "BMI-USD",
    Name: "Bridge Mutual",
  },
  {
    Code: "BMP-USD",
    Name: "Brother Music Platform",
  },
  {
    Code: "BMRN-USD",
    Name: "BioMarin Pharmaceutical Inc",
  },
  {
    Code: "BMX-USD",
    Name: "BitMart Token",
  },
  {
    Code: "BMY-USD",
    Name: "Bristol-Myers Squibb",
  },
  {
    Code: "BNA-USD",
    Name: "BananaTok",
  },
  {
    Code: "BNANA-USD",
    Name: "Chimpion",
  },
  {
    Code: "BNB-USD",
    Name: "Binance Coin",
  },
  {
    Code: "BNBBEAR-USD",
    Name: "3X Short BNB Token",
  },
  {
    Code: "BNBBULL-USD",
    Name: "3X Long BNB Token",
  },
  {
    Code: "BNBDOWN-USD",
    Name: "BNBDOWN",
  },
  {
    Code: "BNBUP-USD",
    Name: "BNBUP",
  },
  {
    Code: "BNC-USD",
    Name: "Bionic",
  },
  {
    Code: "BNF-USD",
    Name: "BonFi",
  },
  {
    Code: "BNJ-USD",
    Name: "Binjitcoin",
  },
  {
    Code: "BNK-USD",
    Name: "Bankera",
  },
  {
    Code: "BNOX-USD",
    Name: "BlockNoteX",
  },
  {
    Code: "BNP-USD",
    Name: "BenePit Protocol",
  },
  {
    Code: "BNS-USD",
    Name: "BNS Token",
  },
  {
    Code: "BNSD-USD",
    Name: "BNSD Finance",
  },
  {
    Code: "BNT-USD",
    Name: "Bancor",
  },
  {
    Code: "BNTX-USD",
    Name: "Biontech SE",
  },
  {
    Code: "BNTY-USD",
    Name: "Bounty0x",
  },
  {
    Code: "BNZ-USD",
    Name: "BonezYard",
  },
  {
    Code: "BOA-USD",
    Name: "BOSAGORA",
  },
  {
    Code: "BOB-USD",
    Name: "Bob's Repair",
  },
  {
    Code: "BOLD-USD",
    Name: "Boldman Capital",
  },
  {
    Code: "BOLI-USD",
    Name: "Bolivarcoin",
  },
  {
    Code: "BOLT-USD",
    Name: "BOLT",
  },
  {
    Code: "BOLTT-USD",
    Name: "Boltt Coin",
  },
  {
    Code: "BOMB-USD",
    Name: "BOMB",
  },
  {
    Code: "BOND-USD",
    Name: "BarnBridge",
  },
  {
    Code: "BONDLY-USD",
    Name: "Bondly",
  },
  {
    Code: "BONE-USD",
    Name: "BONE",
  },
  {
    Code: "BONK-USD",
    Name: "Bonk",
  },
  {
    Code: "BONO-USD",
    Name: "Bonorum",
  },
  {
    Code: "BOO-USD",
    Name: "Bamboo",
  },
  {
    Code: "BOOST-USD",
    Name: "Boost",
  },
  {
    Code: "BOR-USD",
    Name: "BoringDAO",
  },
  {
    Code: "BORA-USD",
    Name: "BORA",
  },
  {
    Code: "BOSCORE-USD",
    Name: "BOSCore",
  },
  {
    Code: "BOTS-USD",
    Name: "BotOcean",
  },
  {
    Code: "BOUTS-USD",
    Name: "BoutsPro",
  },
  {
    Code: "BOX-USD",
    Name: "ContentBox",
  },
  {
    Code: "BPLC-USD",
    Name: "BlackPearl Token",
  },
  {
    Code: "BPP-USD",
    Name: "Bitpower",
  },
  {
    Code: "BPS-USD",
    Name: "BitcoinPoS",
  },
  {
    Code: "BPX-USD",
    Name: "Bispex",
  },
  {
    Code: "BQT-USD",
    Name: "Blockchain Quotations Index Token",
  },
  {
    Code: "BQTX-USD",
    Name: "BQT",
  },
  {
    Code: "BRAIN-USD",
    Name: "Braincoin",
  },
  {
    Code: "BRAT-USD",
    Name: "BROTHER",
  },
  {
    Code: "BRAVO-USD",
    Name: "BravoCoin",
  },
  {
    Code: "BRD-USD",
    Name: "Bread",
  },
  {
    Code: "BRDG-USD",
    Name: "Bridge Protocol",
  },
  {
    Code: "BREW-USD",
    Name: "CafeSwap Token",
  },
  {
    Code: "BRIX-USD",
    Name: "BrixCoin",
  },
  {
    Code: "BRO-USD",
    Name: "Bitradio",
  },
  {
    Code: "BRY-USD",
    Name: "Berry Data",
  },
  {
    Code: "BRZ-USD",
    Name: "Brazilian Digital Token",
  },
  {
    Code: "BRZE-USD",
    Name: "Breezecoin",
  },
  {
    Code: "BSC-FARM-USD",
    Name: "BowsCoin",
  },
  {
    Code: "BSC-USD",
    Name: "BowsCoin",
  },
  {
    Code: "BSCX-USD",
    Name: "BSCEX",
  },
  {
    Code: "BSD-USD",
    Name: "BitSend",
  },
  {
    Code: "BSDS-USD",
    Name: "Basis Dollar Share",
  },
  {
    Code: "BSE-USD",
    Name: "Best Shitcoin Ever",
  },
  {
    Code: "BSH-USD",
    Name: "Bitcoin Stash",
  },
  {
    Code: "BSOV-USD",
    Name: "BitcoinSoV",
  },
  {
    Code: "BSP-USD",
    Name: "Ballswap",
  },
  {
    Code: "BST-USD",
    Name: "BlockStamp",
  },
  {
    Code: "BST1-USD",
    Name: "Blueshare Token",
  },
  {
    Code: "BSTAR-USD",
    Name: "Blackstar",
  },
  {
    Code: "BSTY-USD",
    Name: "GlobalBoost-Y",
  },
  {
    Code: "BSV-USD",
    Name: "Bitcoin SV",
  },
  {
    Code: "BSVBEAR-USD",
    Name: "3x Short Bitcoin SV Token",
  },
  {
    Code: "BSVBULL-USD",
    Name: "3x Long Bitcoin SV Token",
  },
  {
    Code: "BSX-USD",
    Name: "Boston Scientific",
  },
  {
    Code: "BSY-USD",
    Name: "Bestay",
  },
  {
    Code: "BSYS-USD",
    Name: "BSYS",
  },
  {
    Code: "BT-USD",
    Name: "BT.Finance",
  },
  {
    Code: "BTA-USD",
    Name: "Bata",
  },
  {
    Code: "BTAD-USD",
    Name: "Bitcoin Adult",
  },
  {
    Code: "BTB-USD",
    Name: "BitBall",
  },
  {
    Code: "BTC-USD",
    Name: "Bitcoin",
  },
  {
    Code: "BTC2-USD",
    Name: "Bitcoin 2",
  },
  {
    Code: "BTCB-USD",
    Name: "Bitcoin BEP2",
  },
  {
    Code: "BTCDOWN-USD",
    Name: "BTCDOWN",
  },
  {
    Code: "BTCHG-USD",
    Name: "BITCOINHEDGE",
  },
  {
    Code: "BTCL-USD",
    Name: "BTC Lite",
  },
  {
    Code: "BTCM-USD",
    Name: "BTCMoon",
  },
  {
    Code: "BTCN-USD",
    Name: "BitcoiNote",
  },
  {
    Code: "BTCONE-USD",
    Name: "BitCoin One",
  },
  {
    Code: "BTCP-USD",
    Name: "Bitcoin Private",
  },
  {
    Code: "BTCR-USD",
    Name: "Bitcurrency",
  },
  {
    Code: "BTCRED-USD",
    Name: "Bitcoin Red",
  },
  {
    Code: "BTCS-USD",
    Name: "Bitcoin Silver",
  },
  {
    Code: "BTCST-USD",
    Name: "Bitcoin Standard Hashrate Token",
  },
  {
    Code: "BTCT-USD",
    Name: "Bitcoin Token",
  },
  {
    Code: "BTCUP-USD",
    Name: "BTCUP",
  },
  {
    Code: "BTCV-USD",
    Name: "BitcoinV",
  },
  {
    Code: "BTCZ-USD",
    Name: "BitcoinZ",
  },
  {
    Code: "BTD-USD",
    Name: "Bat True Dollar",
  },
  {
    Code: "BTDX-USD",
    Name: "Bitcloud",
  },
  {
    Code: "BTFC-USD",
    Name: "Bitcoin Flash Cash",
  },
  {
    Code: "BTG-USD",
    Name: "Bitgem",
  },
  {
    Code: "BTG1-USD",
    Name: "Bitcoin Gold",
  },
  {
    Code: "BTM-USD",
    Name: "BTM",
  },
  {
    Code: "BTMX-USD",
    Name: "BitMax Token",
  },
  {
    Code: "BTNYX-USD",
    Name: "BitOnyx Token",
  },
  {
    Code: "BTO-USD",
    Name: "Bottos",
  },
  {
    Code: "BTR-USD",
    Name: "Bitrue Coin",
  },
  {
    Code: "BTRL-USD",
    Name: "BitcoinRegular",
  },
  {
    Code: "BTRN-USD",
    Name: "Biotron",
  },
  {
    Code: "BTRS-USD",
    Name: "Bitball Treasure",
  },
  {
    Code: "BTS-BTC",
    Name: "BTS/BTC - BitShares Bitcoin\r\n",
    Country: "Unknown",
    Exchange: "CC",
    Currency: "NA",
    Type: "Currency",
    Isin: null,
  },
  {
    Code: "BTS-USD",
    Name: "BitShares",
  },
  {
    Code: "BTSC-USD",
    Name: "Beyond The Scene Coin",
  },
  {
    Code: "BTSE-USD",
    Name: "BTSE Token",
  },
  {
    Code: "BTSHK-USD",
    Name: "Bitshark",
  },
  {
    Code: "BTT-USD",
    Name: "BitTorrent",
  },
  {
    Code: "BTT1-USD",
    Name: "BitTorrent",
  },
  {
    Code: "BTTR-USD",
    Name: "BittrackSystems",
  },
  {
    Code: "BTU-USD",
    Name: "BTU Protocol",
  },
  {
    Code: "BTW-USD",
    Name: "BitWhite",
  },
  {
    Code: "BTX-USD",
    Name: "Bitcore",
  },
  {
    Code: "BTZC-USD",
    Name: "BeatzCoin",
  },
  {
    Code: "BUB-USD",
    Name: "Bubble",
  },
  {
    Code: "BUD-USD",
    Name: "BUDDY",
  },
  {
    Code: "BUIDL-USD",
    Name: "dfohub",
  },
  {
    Code: "BUILD-USD",
    Name: "BUILD Finance",
  },
  {
    Code: "BUL-USD",
    Name: "Bulleon",
  },
  {
    Code: "BULL-USD",
    Name: "BuySell",
  },
  {
    Code: "BULLS-USD",
    Name: "BULLS",
  },
  {
    Code: "BULLSHIT-USD",
    Name: "3X Long Shitcoin Index Token",
  },
  {
    Code: "BUND-USD",
    Name: "Bundles Finance",
  },
  {
    Code: "BUNNY-USD",
    Name: "BunnyToken",
  },
  {
    Code: "BUP-USD",
    Name: "BuildUp",
  },
  {
    Code: "BURGER-USD",
    Name: "Burger Swap",
  },
  {
    Code: "BURN-USD",
    Name: "Blockburn",
  },
  {
    Code: "BUSD-USD",
    Name: "Binance USD",
  },
  {
    Code: "BUT-USD",
    Name: "BitUP Token",
  },
  {
    Code: "BUX-USD",
    Name: "BUX Token",
  },
  {
    Code: "BUXCOIN-USD",
    Name: "Buxcoin",
  },
  {
    Code: "BUY-USD",
    Name: "Burency",
  },
  {
    Code: "BUZZ-USD",
    Name: "BUZZCoin",
  },
  {
    Code: "BVL-USD",
    Name: "Bullswap Protocol",
  },
  {
    Code: "BVOL-USD",
    Name: "1x Long Bitcoin Implied Volatility Token",
  },
  {
    Code: "BWB-USD",
    Name: "Bit World Token",
  },
  {
    Code: "BWX-USD",
    Name: "Blue Whale EXchange",
  },
  {
    Code: "BXA-USD",
    Name: "Blockchain Exchange Alliance",
  },
  {
    Code: "BXC-USD",
    Name: "BonusCloud",
  },
  {
    Code: "BXY-USD",
    Name: "Beaxy",
  },
  {
    Code: "BYND-USD",
    Name: "Beyondcoin",
  },
  {
    Code: "BYRON-USD",
    Name: "Byron",
  },
  {
    Code: "BYTE-USD",
    Name: "BTC Network Demand Set II",
  },
  {
    Code: "BZE-USD",
    Name: "BZEdge",
  },
  {
    Code: "BZNT-USD",
    Name: "Bezant",
  },
  {
    Code: "BZRX-USD",
    Name: "bZx Protocol",
  },
  {
    Code: "BZUN-USD",
    Name: "Baozun Inc.",
  },
  {
    Code: "BZX-USD",
    Name: "Bitcoin Zero",
  },
  {
    Code: "C-USD",
    Name: "Citigroup Inc",
  },
  {
    Code: "C2-USD",
    Name: "Coin2.1",
  },
  {
    Code: "C20-USD",
    Name: "CRYPTO20",
  },
  {
    Code: "C24-USD",
    Name: "Cryptex",
  },
  {
    Code: "C2C-USD",
    Name: "C2C System",
  },
  {
    Code: "C2O-USD",
    Name: "CryptoWater",
  },
  {
    Code: "C4T-USD",
    Name: "Coin4Trade",
  },
  {
    Code: "C98-USD",
    Name: "Coin98",
  },
  {
    Code: "CAB-USD",
    Name: "Cabbage",
  },
  {
    Code: "CAC-USD",
    Name: "CAC 40 Token",
  },
  {
    Code: "CAD-USD",
    Name: "Canadian Dollar Token",
  },
  {
    Code: "CAI-USD",
    Name: "Cai Token",
  },
  {
    Code: "CAKE-USD",
    Name: "PancakeSwap",
  },
  {
    Code: "CAMP-USD",
    Name: "Camp",
  },
  {
    Code: "CAN-USD",
    Name: "CanYaCoin",
  },
  {
    Code: "CANN-USD",
    Name: "CannabisCoin",
  },
  {
    Code: "CAP-USD",
    Name: "Cap",
  },
  {
    Code: "CAPITAL-FINANCE-USD",
    Name: "Capital.Finance",
  },
  {
    Code: "CAPP-USD",
    Name: "Cappasity",
  },
  {
    Code: "CARAT-USD",
    Name: "CARAT",
  },
  {
    Code: "CARBON-USD",
    Name: "Carboncoin",
  },
  {
    Code: "CARD-USD",
    Name: "Cardstack",
  },
  {
    Code: "CARE-USD",
    Name: "Carebit",
  },
  {
    Code: "CAS-USD",
    Name: "Cashaa",
  },
  {
    Code: "CASH-USD",
    Name: "Litecash",
  },
  {
    Code: "CAT-USD",
    Name: "BitClave",
  },
  {
    Code: "CATO-USD",
    Name: "CatoCoin",
  },
  {
    Code: "CATS-USD",
    Name: "Catscoin",
  },
  {
    Code: "CATT-USD",
    Name: "Catex Token",
  },
  {
    Code: "CATX-USD",
    Name: "CAT.trade Protocol",
  },
  {
    Code: "CAVO-USD",
    Name: "EXCAVO FINANCE",
  },
  {
    Code: "CBANK-USD",
    Name: "Crypto Bank",
  },
  {
    Code: "CBAT-USD",
    Name: "Compound Basic Attention Token",
  },
  {
    Code: "CBC-USD",
    Name: "CashBet Coin",
  },
  {
    Code: "CBET-USD",
    Name: "CryptoBet",
  },
  {
    Code: "CBIX-USD",
    Name: "Cubiex",
  },
  {
    Code: "CBK-USD",
    Name: "Commerzbank AG",
  },
  {
    Code: "CBM-USD",
    Name: "CryptoBonusMiles",
  },
  {
    Code: "CBP-USD",
    Name: "CashBackPro",
  },
  {
    Code: "CBSE-USD",
    Name: "Coinbase Pre-IPO tokenized stock FTX",
  },
  {
    Code: "CBTC-USD",
    Name: "Classic Bitcoin",
  },
  {
    Code: "CBX-USD",
    Name: "Bullion",
  },
  {
    Code: "CC-USD",
    Name: "CyberCoin",
  },
  {
    Code: "CCA-USD",
    Name: "Counos Coin",
  },
  {
    Code: "CCE-USD",
    Name: "CloudCoin",
  },
  {
    Code: "CCL-USD",
    Name: "CYCLEAN",
  },
  {
    Code: "CCN-USD",
    Name: "CustomContractNetwork",
  },
  {
    Code: "CCO-USD",
    Name: "Ccore",
  },
  {
    Code: "CCS-USD",
    Name: "CloutContracts",
  },
  {
    Code: "CCT-USD",
    Name: "Crystal Clear",
  },
  {
    Code: "CCX-USD",
    Name: "Conceal",
  },
  {
    Code: "CCXX-USD",
    Name: "CounosX",
  },
  {
    Code: "CDAI-USD",
    Name: "Compound Dai",
  },
  {
    Code: "CDEX-USD",
    Name: "Codex",
  },
  {
    Code: "CDL-USD",
    Name: "CoinDeal Token",
  },
  {
    Code: "CDM-USD",
    Name: "CDMCOIN",
  },
  {
    Code: "CDN-USD",
    Name: "Canada eCoin",
  },
  {
    Code: "CDT-USD",
    Name: "Blox",
  },
  {
    Code: "CEDS-USD",
    Name: "CEDARS",
  },
  {
    Code: "CEEK-USD",
    Name: "CEEK VR",
  },
  {
    Code: "CEL-USD",
    Name: "Celsius",
  },
  {
    Code: "CELL-USD",
    Name: "Cellframe",
  },
  {
    Code: "CELO-USD",
    Name: "Celo",
  },
  {
    Code: "CELR-USD",
    Name: "Celer Network",
  },
  {
    Code: "CENNZ-USD",
    Name: "Centrality",
  },
  {
    Code: "CENT-USD",
    Name: "CENTERCOIN",
  },
  {
    Code: "CERE-USD",
    Name: "Cere Network",
  },
  {
    Code: "CESC-USD",
    Name: "CryptoEscudo",
  },
  {
    Code: "CET-USD",
    Name: "CoinEx Token",
  },
  {
    Code: "CF-USD",
    Name: "Californium",
  },
  {
    Code: "CFi-USD",
    Name: "Cofound.it",
  },
  {
    Code: "CFL-USD",
    Name: "Cryptoflow",
  },
  {
    Code: "CFX-USD",
    Name: "Conflux Network",
  },
  {
    Code: "CGT-USD",
    Name: "CACHE Gold",
  },
  {
    Code: "CHADS-USD",
    Name: "CHADS VC",
  },
  {
    Code: "CHAIN-USD",
    Name: "Chain Games",
  },
  {
    Code: "CHAINPAY-USD",
    Name: "Chainpay",
  },
  {
    Code: "CHAINZ-ARENA-USD",
    Name: "ChainZ Arena",
  },
  {
    Code: "CHAN-USD",
    Name: "ChanCoin",
  },
  {
    Code: "CHANNELS-USD",
    Name: "Channels",
  },
  {
    Code: "CHART-USD",
    Name: "ChartEx",
  },
  {
    Code: "CHAT-USD",
    Name: "ChatCoin",
  },
  {
    Code: "CHBT-USD",
    Name: "CHBT",
  },
  {
    Code: "CHEESE-USD",
    Name: "Cheesecoin",
  },
  {
    Code: "CHESS-USD",
    Name: "ChessCoin",
  },
  {
    Code: "CHF-USD",
    Name: "Swiss Franc Token",
  },
  {
    Code: "CHFT-USD",
    Name: "Crypto Holding Frank Token",
  },
  {
    Code: "CHG-USD",
    Name: "Charg Coin",
  },
  {
    Code: "CHI-GASTOKEN-USD",
    Name: "XAYA",
  },
  {
    Code: "CHI-USD",
    Name: "XAYA",
  },
  {
    Code: "CHIK-USD",
    Name: "Chickenkebab Finance",
  },
  {
    Code: "CHIPS-USD",
    Name: "Chipstars",
  },
  {
    Code: "CHM-USD",
    Name: "Cryptochrome",
  },
  {
    Code: "CHND-USD",
    Name: "CashHand",
  },
  {
    Code: "CHONK-USD",
    Name: "Chonk",
  },
  {
    Code: "CHP-USD",
    Name: "CoinPoker",
  },
  {
    Code: "CHR-USD",
    Name: "Chromia",
  },
  {
    Code: "CHS-USD",
    Name: "Chainsquare",
  },
  {
    Code: "CHSB-USD",
    Name: "SwissBorg",
  },
  {
    Code: "CHX-USD",
    Name: "Own",
  },
  {
    Code: "CHZ-USD",
    Name: "Chiliz",
  },
  {
    Code: "CIPHC-USD",
    Name: "Cipher Core Token",
  },
  {
    Code: "CIR-USD",
    Name: "Ciredo",
  },
  {
    Code: "CITY-USD",
    Name: "City Coin",
  },
  {
    Code: "CIV-USD",
    Name: "Civitas",
  },
  {
    Code: "CIX100-USD",
    Name: "Cryptoindex.com 100",
  },
  {
    Code: "CJ-USD",
    Name: "Cryptojacks",
  },
  {
    Code: "CJT-USD",
    Name: "ConnectJob",
  },
  {
    Code: "CKB-USD",
    Name: "Nervos Network",
  },
  {
    Code: "CLA-USD",
    Name: "Candela Coin",
  },
  {
    Code: "CLAM-USD",
    Name: "Clams",
  },
  {
    Code: "CLB-USD",
    Name: "Cloudbric",
  },
  {
    Code: "CLBR-USD",
    Name: "Colibri Protocol",
  },
  {
    Code: "CLC-USD",
    Name: "CaluraCoin",
  },
  {
    Code: "CLG-USD",
    Name: "Collegicoin",
  },
  {
    Code: "CLIQ-USD",
    Name: "DefiCliq",
  },
  {
    Code: "CLO-USD",
    Name: "Callisto Network",
  },
  {
    Code: "CLOAK-USD",
    Name: "CloakCoin",
  },
  {
    Code: "CLOG-USD",
    Name: "CLO GOLD",
  },
  {
    Code: "CLOUT-USD",
    Name: "BitClout",
  },
  {
    Code: "CLR-USD",
    Name: "Color Platform",
  },
  {
    Code: "CLT-USD",
    Name: "Cexlt",
  },
  {
    Code: "CLUB-USD",
    Name: "ClubCoin",
  },
  {
    Code: "CLV-USD",
    Name: "Clover Finance",
  },
  {
    Code: "CLVS-USD",
    Name: "Clovis Oncology Inc.",
  },
  {
    Code: "CLX-USD",
    Name: "Celeum",
  },
  {
    Code: "CME-USD",
    Name: "Cashme",
  },
  {
    Code: "CMIT-USD",
    Name: "CMITCOIN",
  },
  {
    Code: "CMM-USD",
    Name: "Commercium",
  },
  {
    Code: "CMS-USD",
    Name: "COMSA [ETH]",
  },
  {
    Code: "CMT-USD",
    Name: "CyberMiles",
  },
  {
    Code: "CN50-USD",
    Name: "FTSE China A50 Token",
  },
  {
    Code: "CNB-USD",
    Name: "Coinsbit Token",
  },
  {
    Code: "CNC-USD",
    Name: "Global China Cash",
  },
  {
    Code: "CND-USD",
    Name: "Cindicator",
  },
  {
    Code: "CNFI-USD",
    Name: "Connect Financial",
  },
  {
    Code: "CNN-USD",
    Name: "Content Neutrality Network",
  },
  {
    Code: "CNNC-USD",
    Name: "Cannation",
  },
  {
    Code: "CNNS-USD",
    Name: "CNNS",
  },
  {
    Code: "CNRG-USD",
    Name: "CryptoEnergy",
  },
  {
    Code: "CNS-USD",
    Name: "Centric Cash",
  },
  {
    Code: "CNT-USD",
    Name: "Centurion",
  },
  {
    Code: "CNTM-USD",
    Name: "Connectome",
  },
  {
    Code: "CNTR-USD",
    Name: "Centaur",
  },
  {
    Code: "CNTX-USD",
    Name: "CENTEX",
  },
  {
    Code: "CNX-USD",
    Name: "Cryptonex",
  },
  {
    Code: "CNZ-USD",
    Name: "Coinzo Token",
  },
  {
    Code: "COAL-USD",
    Name: "BitCoal",
  },
  {
    Code: "COCO-USD",
    Name: "Coco Swap",
  },
  {
    Code: "COCOS-USD",
    Name: "Cocos-BCX",
  },
  {
    Code: "CODEO-USD",
    Name: "CODEO TOKEN",
  },
  {
    Code: "COF-USD",
    Name: "CoffeeCoin",
  },
  {
    Code: "COFI-USD",
    Name: "CoinFi",
  },
  {
    Code: "COFIX-USD",
    Name: "CoFiX",
  },
  {
    Code: "COIL-USD",
    Name: "COIL",
  },
  {
    Code: "COIN-USD",
    Name: "coin",
  },
  {
    Code: "COLX-USD",
    Name: "ColossusXT",
  },
  {
    Code: "COMB-USD",
    Name: "Combo",
  },
  {
    Code: "COMBINE-FINANCE-USD",
    Name: "Combine.finance",
  },
  {
    Code: "COMBO-USD",
    Name: "Furucombo",
  },
  {
    Code: "COMET-USD",
    Name: "Comet",
  },
  {
    Code: "COMM-USD",
    Name: "CommScope Holding Company Inc.",
  },
  {
    Code: "COMP-USD",
    Name: "Compound Coin",
  },
  {
    Code: "CON-USD",
    Name: "CONUN",
  },
  {
    Code: "CONTENTBOX-USD",
    Name: "ContentBox",
  },
  {
    Code: "CONX-USD",
    Name: "Concoin",
  },
  {
    Code: "COR-USD",
    Name: "CORION",
  },
  {
    Code: "CORAL-USD",
    Name: "Coral Swap",
  },
  {
    Code: "CORE-USD",
    Name: "Cvault.finance",
  },
  {
    Code: "CORN-USD",
    Name: "Cornichon",
  },
  {
    Code: "CORNICHON-USD",
    Name: "Cornichon",
  },
  {
    Code: "CORX-USD",
    Name: "CorionX",
  },
  {
    Code: "COS-USD",
    Name: "Contentos",
  },
  {
    Code: "COT-USD",
    Name: "CoTrader",
  },
  {
    Code: "COTI-USD",
    Name: "COTI",
  },
  {
    Code: "COU-USD",
    Name: "Couchain",
  },
  {
    Code: "COV-USD",
    Name: "Covesting",
  },
  {
    Code: "COVA-USD",
    Name: "COVA",
  },
  {
    Code: "COVAL-USD",
    Name: "Circuits of Value",
  },
  {
    Code: "COW-USD",
    Name: "COWRY",
  },
  {
    Code: "CPAY-USD",
    Name: "Cryptopay",
  },
  {
    Code: "CPB-USD",
    Name: "Campbell Soup",
  },
  {
    Code: "CPC-USD",
    Name: "Capricoin",
  },
  {
    Code: "CPI-USD",
    Name: "Crypto Price Index",
  },
  {
    Code: "CPR-USD",
    Name: "CIPHER",
  },
  {
    Code: "CPT-USD",
    Name: "Cryptaur",
  },
  {
    Code: "CPU-USD",
    Name: "CPUchain",
  },
  {
    Code: "CPUCOIN-USD",
    Name: "CPUcoin",
  },
  {
    Code: "CQT-USD",
    Name: "Covalent",
  },
  {
    Code: "CRAFT-USD",
    Name: "deCraft Finance",
  },
  {
    Code: "CRAVE-USD",
    Name: "Crave",
  },
  {
    Code: "CRBN-USD",
    Name: "Carbon",
  },
  {
    Code: "CRC-USD",
    Name: "CryCash",
  },
  {
    Code: "CRD-USD",
    Name: "CryptalDash",
  },
  {
    Code: "CRDT-USD",
    Name: "CRDT",
  },
  {
    Code: "CRE-USD",
    Name: "Carry",
  },
  {
    Code: "CREAM-USD",
    Name: "CREAM",
  },
  {
    Code: "CRED-USD",
    Name: "Verify",
  },
  {
    Code: "CREDIT-USD",
    Name: "TerraCredit",
  },
  {
    Code: "CREP-USD",
    Name: "Compound Augur",
  },
  {
    Code: "CREX-USD",
    Name: "Crex Token",
  },
  {
    Code: "CRM-USD",
    Name: "Cream",
  },
  {
    Code: "CRO-USD",
    Name: "Crypto.com Coin",
  },
  {
    Code: "CROAT-USD",
    Name: "CROAT",
  },
  {
    Code: "CRP-USD",
    Name: "Cryply",
  },
  {
    Code: "CRPT-USD",
    Name: "Crypterium",
  },
  {
    Code: "CRT-USD",
    Name: "CRTCoin",
  },
  {
    Code: "CRU-USD",
    Name: "Curium",
  },
  {
    Code: "CRV1-USD",
    Name: "Curve DAO Token",
  },
  {
    Code: "CRW-USD",
    Name: "Crown",
  },
  {
    Code: "CRX-USD",
    Name: "Chronos",
  },
  {
    Code: "CRYPTOBHARATCOIN-USD",
    Name: "CryptoBharatCoin",
  },
  {
    Code: "CRYPTOBOSSCOIN-USD",
    Name: "CryptoBossCoin",
  },
  {
    Code: "CRYPTOSOUL-USD",
    Name: "CryptoSoul",
  },
  {
    Code: "CS-USD",
    Name: "Credits",
  },
  {
    Code: "CSC-USD",
    Name: "CasinoCoin",
  },
  {
    Code: "CSCO-USD",
    Name: "Cisco Systems",
  },
  {
    Code: "CSP-USD",
    Name: "Caspian",
  },
  {
    Code: "CSPN-USD",
    Name: "Crypto Sports",
  },
  {
    Code: "CSPR-USD",
    Name: "Casper",
  },
  {
    Code: "CSTL-USD",
    Name: "Castle",
  },
  {
    Code: "CTASK-USD",
    Name: "CryptoTask",
  },
  {
    Code: "CTC-USD",
    Name: "Culture Ticket Chain",
  },
  {
    Code: "CTCN-USD",
    Name: "Contracoin",
  },
  {
    Code: "CTI-USD",
    Name: "ClinTex CTi",
  },
  {
    Code: "CTK-USD",
    Name: "Certik",
  },
  {
    Code: "CTL-USD",
    Name: "Citadel",
  },
  {
    Code: "CTRT-USD",
    Name: "Cryptrust",
  },
  {
    Code: "CTSC-USD",
    Name: "Crypto Trading Solutions Coin",
  },
  {
    Code: "CTSI-USD",
    Name: "Cartesi",
  },
  {
    Code: "CTT-USD",
    Name: "Cryptoinvest",
  },
  {
    Code: "CTX1-USD",
    Name: "Cryptex Finance",
  },
  {
    Code: "CTXC-USD",
    Name: "Cortex",
  },
  {
    Code: "CUBE1-USD",
    Name: "Somnium Space Cubes",
  },
  {
    Code: "CUDOS-USD",
    Name: "CUDOS",
  },
  {
    Code: "CULTURE-TICKET-CHAIN-USD",
    Name: "Culture Ticket Chain",
  },
  {
    Code: "CURE-USD",
    Name: "Curecoin",
  },
  {
    Code: "CURIO-GOVERNANCE-USD",
    Name: "Curio Governance",
  },
  {
    Code: "CURVE-USD",
    Name: "Curvehash Coin",
  },
  {
    Code: "CUSDC-USD",
    Name: "Compound USD Coin",
  },
  {
    Code: "CUSDT-USD",
    Name: "Compound USDT",
  },
  {
    Code: "CUT-USD",
    Name: "CUTcoin",
  },
  {
    Code: "CV-USD",
    Name: "carVertical",
  },
  {
    Code: "CVA-USD",
    Name: "Crypto Village Accelerator",
  },
  {
    Code: "CVC-USD",
    Name: "Civic",
  },
  {
    Code: "CVCC-USD",
    Name: "CryptoVerificationCoin",
  },
  {
    Code: "CVN-USD",
    Name: "CVCoin",
  },
  {
    Code: "CVNT-USD",
    Name: "Content Value Network",
  },
  {
    Code: "CVP-USD",
    Name: "PowerPool Concentrated Voting Power",
  },
  {
    Code: "CVR-USD",
    Name: "CVR",
  },
  {
    Code: "CVT-USD",
    Name: "CyberVein",
  },
  {
    Code: "CWBTC-USD",
    Name: "Compound Wrapped BTC",
  },
  {
    Code: "CWS-USD",
    Name: "Crowns",
  },
  {
    Code: "CWV-USD",
    Name: "CWV Chain",
  },
  {
    Code: "CWXT-USD",
    Name: "CryptoWorldX Token",
  },
  {
    Code: "CXC-USD",
    Name: "CAPITAL X CELL",
  },
  {
    Code: "CXN-USD",
    Name: "CXN Network",
  },
  {
    Code: "CXO-USD",
    Name: "CargoX",
  },
  {
    Code: "CXT-USD",
    Name: "Coinonat",
  },
  {
    Code: "CYC-USD",
    Name: "Cycling Coin",
  },
  {
    Code: "CYFM-USD",
    Name: "CyberFM",
  },
  {
    Code: "CYL-USD",
    Name: "Crystal Token",
  },
  {
    Code: "CYMT-USD",
    Name: "CyberMusic",
  },
  {
    Code: "CYP-USD",
    Name: "Cypher",
  },
  {
    Code: "CYT-USD",
    Name: "Coinary Token",
  },
  {
    Code: "CYTR-USD",
    Name: "Cyclops Treasure",
  },
  {
    Code: "CZRX-USD",
    Name: "Compound 0x",
  },
  {
    Code: "D-USD",
    Name: "Denarius",
  },
  {
    Code: "D100-USD",
    Name: "DeFi100",
  },
  {
    Code: "D4RK-USD",
    Name: "DarkPay",
  },
  {
    Code: "DAB-USD",
    Name: "DABANKING",
  },
  {
    Code: "DAC-USD",
    Name: "Davinci Coin",
  },
  {
    Code: "DACC-USD",
    Name: "DACC",
  },
  {
    Code: "DACS-USD",
    Name: "DACSEE",
  },
  {
    Code: "DAD-USD",
    Name: "DAD Chain",
  },
  {
    Code: "DAG-USD",
    Name: "Constellation",
  },
  {
    Code: "DAI-USD",
    Name: "Dai",
  },
  {
    Code: "DALC-USD",
    Name: "Dalecoin",
  },
  {
    Code: "DAM-USD",
    Name: "Datamine",
  },
  {
    Code: "DANK-USD",
    Name: "Dank",
  },
  {
    Code: "DAO-USD",
    Name: "GameDAO",
  },
  {
    Code: "DAPP-USD",
    Name: "LiquidApps",
  },
  {
    Code: "DAPPT-USD",
    Name: "Dapp Token",
  },
  {
    Code: "DAPS-USD",
    Name: "DAPS Coin",
  },
  {
    Code: "DARA-USD",
    Name: "Immutable",
  },
  {
    Code: "DARK-ENERGY-CRYSTALS-USD",
    Name: "Dark.Build v1",
  },
  {
    Code: "DASH-BTC",
    Name: "DASH/BTC - Dash Bitcoin",
    Country: "Unknown",
    Exchange: "CC",
    Currency: "NA",
    Type: "Currency",
    Isin: null,
  },
  {
    Code: "DASH-USD",
    Name: "Dash",
  },
  {
    Code: "DASHG-USD",
    Name: "Dash Green",
  },
  {
    Code: "DATA-USD",
    Name: "Streamr DATAcoin",
  },
  {
    Code: "DATP-USD",
    Name: "Decentralized Asset Trading Platform",
  },
  {
    Code: "DATX-USD",
    Name: "DATx",
  },
  {
    Code: "DAV-USD",
    Name: "DAV Coin",
  },
  {
    Code: "DAWN-USD",
    Name: "Dawn Protocol",
  },
  {
    Code: "DAX-USD",
    Name: "DAEX",
  },
  {
    Code: "DAY-USD",
    Name: "Chronologic",
  },
  {
    Code: "DBC-USD",
    Name: "DeepBrain Chain",
  },
  {
    Code: "DBET-USD",
    Name: "DecentBet",
  },
  {
    Code: "DBG-USD",
    Name: "Digital Bullion Gold",
  },
  {
    Code: "DBTC-USD",
    Name: "Debitcoin",
  },
  {
    Code: "DBX-USD",
    Name: "DropBox",
  },
  {
    Code: "DCA-USD",
    Name: "Decentralize Currency Assets",
  },
  {
    Code: "DCD-USD",
    Name: "Digital Currency Daily",
  },
  {
    Code: "DCG-USD",
    Name: "Daily Crypto Giveaways",
  },
  {
    Code: "DCL-USD",
    Name: "Delphi Chain Link",
  },
  {
    Code: "DCN-USD",
    Name: "DualCoin",
  },
  {
    Code: "DCNT-USD",
    Name: "Decenturion",
  },
  {
    Code: "DCNTR-USD",
    Name: "Decentrahub Coin",
  },
  {
    Code: "DCR-USD",
    Name: "Decred",
  },
  {
    Code: "DCRE-USD",
    Name: "DeltaCredits",
  },
  {
    Code: "DDD-USD",
    Name: "Scry.info",
  },
  {
    Code: "DDIM-USD",
    Name: "DuckDaoDime",
  },
  {
    Code: "DDK-USD",
    Name: "DDKoin",
  },
  {
    Code: "DDOG-USD",
    Name: "Datadog Inc",
  },
  {
    Code: "DDR-USD",
    Name: "DigiDinar",
  },
  {
    Code: "DDRT-USD",
    Name: "DigiDinar Token",
  },
  {
    Code: "DDX-USD",
    Name: "dietbitcoin",
  },
  {
    Code: "DEB-USD",
    Name: "Debitum",
  },
  {
    Code: "DECURIAN-USD",
    Name: "Decurian",
  },
  {
    Code: "DEEP-USD",
    Name: "DeepCloud AI",
  },
  {
    Code: "DEFI-USD",
    Name: "Defi",
  },
  {
    Code: "DEFI++-USD",
    Name: "PieDAO DEFI++",
  },
  {
    Code: "DEFI+L-USD",
    Name: "PieDAO DEFI Large Cap",
  },
  {
    Code: "DEFI+S-USD",
    Name: "PieDAO DEFI Small Cap",
  },
  {
    Code: "DEFIAT-USD",
    Name: "DeFiat",
  },
  {
    Code: "DEFIBOX-USD",
    Name: "DefiBox",
  },
  {
    Code: "DEFLCT-USD",
    Name: "Deflect",
  },
  {
    Code: "DEFO-USD",
    Name: "DefHold",
  },
  {
    Code: "DEGO-USD",
    Name: "DeroGold",
  },
  {
    Code: "DEM-USD",
    Name: "Deutsche eMark",
  },
  {
    Code: "DENT-USD",
    Name: "Dent",
  },
  {
    Code: "DEP-USD",
    Name: "DEAPcoin",
  },
  {
    Code: "DEPAY-USD",
    Name: "DePay",
  },
  {
    Code: "DEQ-USD",
    Name: "Dequant",
  },
  {
    Code: "DERI-USD",
    Name: "Deri Protocol",
  },
  {
    Code: "DERO-USD",
    Name: "Dero",
  },
  {
    Code: "DES-USD",
    Name: "Destiny",
  },
  {
    Code: "DESH-USD",
    Name: "DeCash",
  },
  {
    Code: "DETS-USD",
    Name: "Dextrust",
  },
  {
    Code: "DEV-USD",
    Name: "DeviantCoin",
  },
  {
    Code: "DEVA-USD",
    Name: "DEVA TOKEN",
  },
  {
    Code: "DEXA-USD",
    Name: "DEXA COIN",
  },
  {
    Code: "DEXE-USD",
    Name: "DeXe",
  },
  {
    Code: "DEXG-USD",
    Name: "DexToken Governance",
  },
  {
    Code: "DEXM-USD",
    Name: "Dexmex",
  },
  {
    Code: "DF-USD",
    Name: "dForce Token",
  },
  {
    Code: "DFD-USD",
    Name: "DefiDollar DAO",
  },
  {
    Code: "DFE-USD",
    Name: "Decentralized Finance Europe",
  },
  {
    Code: "DFGL-USD",
    Name: "DeFi Gold",
  },
  {
    Code: "DFI-USD",
    Name: "DeFi Chain",
  },
  {
    Code: "DFINANCE-USD",
    Name: "Dfinance",
  },
  {
    Code: "DFIO-USD",
    Name: "DeFi Omega",
  },
  {
    Code: "DFIP-USD",
    Name: "DeFi Insurance Protocol",
  },
  {
    Code: "DFL-USD",
    Name: "DeFi Land",
  },
  {
    Code: "DFORCE-USDX-USD",
    Name: "dForce USDx",
  },
  {
    Code: "DFS-USD",
    Name: "DFSCoin",
  },
  {
    Code: "DFT-USD",
    Name: "DraftCoin",
  },
  {
    Code: "DFX-USD",
    Name: "Defirex",
  },
  {
    Code: "DG-USD",
    Name: "Dollar General",
  },
  {
    Code: "DGB-BTC",
    Name: "DGB/BTC - DigiByte Bitcoin",
    Country: "Unknown",
    Exchange: "CC",
    Currency: "NA",
    Type: "Currency",
    Isin: null,
  },
  {
    Code: "DGB-USD",
    Name: "DigiByte",
  },
  {
    Code: "DGC-USD",
    Name: "Digitalcoin",
  },
  {
    Code: "DGCL-USD",
    Name: "DigiCol Token",
  },
  {
    Code: "DGCS-USD",
    Name: "Digital Credits",
  },
  {
    Code: "DGD-USD",
    Name: "DigixDAO",
  },
  {
    Code: "DGP-USD",
    Name: "DGPayment",
  },
  {
    Code: "DGTX-USD",
    Name: "Digitex Futures",
  },
  {
    Code: "DGVC-USD",
    Name: "DegenVC",
  },
  {
    Code: "DGX-USD",
    Name: "Digix Gold Token",
  },
  {
    Code: "DHT-USD",
    Name: "dHEDGE",
  },
  {
    Code: "DIA-USD",
    Name: "DIA",
  },
  {
    Code: "DIAMOND-USD",
    Name: "Diamond",
  },
  {
    Code: "DIAMOND-VOUCHER-USD",
    Name: "Diamond Voucher",
  },
  {
    Code: "DIC-USD",
    Name: "DAIKICOIN",
  },
  {
    Code: "DICE-USD",
    Name: "Etheroll",
  },
  {
    Code: "DIFY-FINANCE-USD",
    Name: "DiFy.Finance",
  },
  {
    Code: "DIGEX-USD",
    Name: "Digex",
  },
  {
    Code: "DIGG-USD",
    Name: "Digg",
  },
  {
    Code: "DIGIFINEXTOKEN-USD",
    Name: "DigiFinexToken",
  },
  {
    Code: "DIGITAL-RESERVE-CURRENCY-USD",
    Name: "Digital Reserve Currency",
  },
  {
    Code: "DILI-USD",
    Name: "D Community",
  },
  {
    Code: "DIME-USD",
    Name: "Dimecoin",
  },
  {
    Code: "DIMI-USD",
    Name: "Diminutive Coin",
  },
  {
    Code: "DIN-USD",
    Name: "Dinero",
  },
  {
    Code: "DIO-USD",
    Name: "Deimos Token",
  },
  {
    Code: "DION-USD",
    Name: "Dionpay",
  },
  {
    Code: "DIP-USD",
    Name: "Dipper Network",
  },
  {
    Code: "DIPPER-NETWORK-USD",
    Name: "Dipper Network",
  },
  {
    Code: "DIS-USD",
    Name: "Walt Disney",
  },
  {
    Code: "DISK-USD",
    Name: "DarkLisk",
  },
  {
    Code: "DISTX-USD",
    Name: "DistX",
  },
  {
    Code: "DIT-USD",
    Name: "Digital Insurance Token",
  },
  {
    Code: "DITTO-USD",
    Name: "Ditto",
  },
  {
    Code: "DIVI-USD",
    Name: "Divi",
  },
  {
    Code: "DJ15-USD",
    Name: "Davincij15 Token",
  },
  {
    Code: "DJ30-USD",
    Name: "Dow Jones 30 Token",
  },
  {
    Code: "DJV-USD",
    Name: "DEJAVE",
  },
  {
    Code: "DKA-USD",
    Name: "dKargo",
  },
  {
    Code: "DKYC-USD",
    Name: "DataKYC",
  },
  {
    Code: "DLC-USD",
    Name: "Dollarcoin",
  },
  {
    Code: "DLISK-USD",
    Name: "DAPPSTER",
  },
  {
    Code: "DLN-USD",
    Name: "Delion",
  },
  {
    Code: "DLT-USD",
    Name: "Agrello",
  },
  {
    Code: "DMB-USD",
    Name: "Digital Money Bits",
  },
  {
    Code: "DMCH-USD",
    Name: "Darma Cash",
  },
  {
    Code: "DMD-USD",
    Name: "DMD",
  },
  {
    Code: "DMG-USD",
    Name: "DMM: Governance",
  },
  {
    Code: "DML-USD",
    Name: "Decentralized Machine Learning",
  },
  {
    Code: "DMME-USD",
    Name: "DMme",
  },
  {
    Code: "DMS-USD",
    Name: "Documentchain",
  },
  {
    Code: "DMST-USD",
    Name: "DMScript",
  },
  {
    Code: "DMT-USD",
    Name: "DMarket",
  },
  {
    Code: "DMTC-USD",
    Name: "Demeter Chain",
  },
  {
    Code: "DMX-USD",
    Name: "Dymmax",
  },
  {
    Code: "DNA-USD",
    Name: "Idena",
  },
  {
    Code: "DNT-USD",
    Name: "district0x",
  },
  {
    Code: "DOCK-USD",
    Name: "Dock",
  },
  {
    Code: "DODO-USD",
    Name: "DODO",
  },
  {
    Code: "DOGDEFI-USD",
    Name: "DogDeFiCoin",
  },
  {
    Code: "DOGE-BTC",
    Name: "DOGE/BTC - Dogecoin Bitcoin",
    Country: "Unknown",
    Exchange: "CC",
    Currency: "NA",
    Type: "Currency",
    Isin: null,
  },
  {
    Code: "DOGE-USD",
    Name: "Dogecoin",
  },
  {
    Code: "DOGEBULL-USD",
    Name: "3X Long Dogecoin Token",
  },
  {
    Code: "DOGEC-USD",
    Name: "DogeCash",
  },
  {
    Code: "DOGEFI-USD",
    Name: "DOGEFI",
  },
  {
    Code: "DOGES-USD",
    Name: "Dogeswap",
  },
  {
    Code: "DOGY-USD",
    Name: "DogeYield",
  },
  {
    Code: "DOGZ-USD",
    Name: "Dogz",
  },
  {
    Code: "DOKI-USD",
    Name: "Doki Doki",
  },
  {
    Code: "DON-USD",
    Name: "Donationcoin",
  },
  {
    Code: "DONU-USD",
    Name: "Donu",
  },
  {
    Code: "DONUT-USD",
    Name: "Donut",
  },
  {
    Code: "DOOS-USD",
    Name: "DOOS TOKEN",
  },
  {
    Code: "DOS-USD",
    Name: "DOS Network",
  },
  {
    Code: "DOT-USD",
    Name: "Polkadot [IOU]",
  },
  {
    Code: "DOTDOWN-USD",
    Name: "DOTDOWN",
  },
  {
    Code: "DOTUP-USD",
    Name: "DOTUP",
  },
  {
    Code: "DOTX-USD",
    Name: "DeFi of Thrones",
  },
  {
    Code: "DOUGH-USD",
    Name: "PieDAO DOUGH v2",
  },
  {
    Code: "DOV-USD",
    Name: "Dovu",
  },
  {
    Code: "DOW-USD",
    Name: "DOWCOIN",
  },
  {
    Code: "DP-USD",
    Name: "DigitalPrice",
  },
  {
    Code: "DPC-USD",
    Name: "DAPPCENTS",
  },
  {
    Code: "DPI-USD",
    Name: "DeFi Pulse Index",
  },
  {
    Code: "DPY-USD",
    Name: "Delphy",
  },
  {
    Code: "DRAGON-TOKEN-USD",
    Name: "Dragon Option",
  },
  {
    Code: "DRC-MOBILITY-USD",
    Name: "Digital Reserve Currency",
  },
  {
    Code: "DRC-USD",
    Name: "Digital Reserve Currency",
  },
  {
    Code: "DREAMCOIN-USD",
    Name: "Dreamcoin",
  },
  {
    Code: "DREP-USD",
    Name: "DREP",
  },
  {
    Code: "DRG-USD",
    Name: "Dragon Coins",
  },
  {
    Code: "DRGB-USD",
    Name: "Dragonbit",
  },
  {
    Code: "DRGN-USD",
    Name: "Dragonchain",
  },
  {
    Code: "DRGNBULL-USD",
    Name: "3X Long Dragon Index Token",
  },
  {
    Code: "DRM-USD",
    Name: "Dreamcoin",
  },
  {
    Code: "DRS-USD",
    Name: "Digital Rupees",
  },
  {
    Code: "DRT-USD",
    Name: "DomRaider",
  },
  {
    Code: "DS-USD",
    Name: "DeStorage",
  },
  {
    Code: "DSD-USD",
    Name: "Dynamic Set Dollar",
  },
  {
    Code: "DSLA-USD",
    Name: "DSLA Protocol",
  },
  {
    Code: "DSS-USD",
    Name: "Defi Shopping Stake",
  },
  {
    Code: "DSYS-USD",
    Name: "DSYS",
  },
  {
    Code: "DT-USD",
    Name: "Dragon Token",
  },
  {
    Code: "DTA-USD",
    Name: "DATA",
  },
  {
    Code: "DTEP-USD",
    Name: "DECOIN",
  },
  {
    Code: "DTH-USD",
    Name: "Dether",
  },
  {
    Code: "DTOP-USD",
    Name: "dHEDGE Top Index",
  },
  {
    Code: "DTX-USD",
    Name: "DaTa eXchange",
  },
  {
    Code: "DUCATO-USD",
    Name: "Ducato Protocol Token",
  },
  {
    Code: "DUCK-USD",
    Name: "Unit Protocol New",
  },
  {
    Code: "DUCK1-USD",
    Name: "DLP Duck Token",
  },
  {
    Code: "DUN-USD",
    Name: "Dune",
  },
  {
    Code: "DUO-USD",
    Name: "DUO Network Token",
  },
  {
    Code: "DUSD-USD",
    Name: "DefiDollar",
  },
  {
    Code: "DUSK-USD",
    Name: "Dusk Network",
  },
  {
    Code: "DVC-USD",
    Name: "DragonVein",
  },
  {
    Code: "DVG-USD",
    Name: "DAOventures",
  },
  {
    Code: "DVI-USD",
    Name: "Dvision Network",
  },
  {
    Code: "DVP-USD",
    Name: "Decentralized Vulnerability Platform",
  },
  {
    Code: "DVT-USD",
    Name: "DeVault",
  },
  {
    Code: "DVX-USD",
    Name: "DRIVENx",
  },
  {
    Code: "DWDP-USD",
    Name: "DowDuPont Inc.",
  },
  {
    Code: "DX-USD",
    Name: "DxChain Token",
  },
  {
    Code: "DXB-USD",
    Name: "Dexzbitz",
  },
  {
    Code: "DXF-USD",
    Name: "Dexfin",
  },
  {
    Code: "DYDX-USD",
    Name: "dYdX",
  },
  {
    Code: "DYN-USD",
    Name: "Dynamic",
  },
  {
    Code: "DYNMT-USD",
    Name: "Dynamite",
  },
  {
    Code: "DYP-USD",
    Name: "DeFi Yield Protocol",
  },
  {
    Code: "DYT-USD",
    Name: "DoYourTip",
  },
  {
    Code: "EAC-USD",
    Name: "EarthCoin",
  },
  {
    Code: "EARN-DEFI-USD",
    Name: "Yearn Classic Finance",
  },
  {
    Code: "EARN-USD",
    Name: "Yearn Classic Finance",
  },
  {
    Code: "EARNBET-USD",
    Name: "EarnBet",
  },
  {
    Code: "EBAY-USD",
    Name: "eBay",
  },
  {
    Code: "EBST-USD",
    Name: "eBoost",
  },
  {
    Code: "EC-USD",
    Name: "Echoin",
  },
  {
    Code: "ECA-USD",
    Name: "Electra",
  },
  {
    Code: "ECASH-USD",
    Name: "Ethereum Cash",
  },
  {
    Code: "ECC-USD",
    Name: "ECC",
  },
  {
    Code: "ECELL-USD",
    Name: "Consensus Cell Network",
  },
  {
    Code: "ECHT-USD",
    Name: "e-Chat",
  },
  {
    Code: "ECN-USD",
    Name: "E-coin",
  },
  {
    Code: "ECO-USD",
    Name: "EcoCoin",
  },
  {
    Code: "ECO-VALUE-COIN-USD",
    Name: "EcoCoin",
  },
  {
    Code: "ECOB-USD",
    Name: "Ecobit",
  },
  {
    Code: "ECOIN-USD",
    Name: "Ecoin",
  },
  {
    Code: "ECOM-USD",
    Name: "Omnitude",
  },
  {
    Code: "ECOS-USD",
    Name: "EcoDollar",
  },
  {
    Code: "ECU-USD",
    Name: "ECOSC",
  },
  {
    Code: "EDC-USD",
    Name: "EDC Blockchain",
  },
  {
    Code: "EDG-USD",
    Name: "Edgeless",
  },
  {
    Code: "EDGELESS-USD",
    Name: "Edgeless",
  },
  {
    Code: "EDI-USD",
    Name: "Freight Trust & Clearing Network",
  },
  {
    Code: "EDN-USD",
    Name: "Eden",
  },
  {
    Code: "EDO-USD",
    Name: "Eidoo",
  },
  {
    Code: "EDR-USD",
    Name: "Endor Protocol",
  },
  {
    Code: "EDRC-USD",
    Name: "EDRCoin",
  },
  {
    Code: "EDU-USD",
    Name: "EduCoin",
  },
  {
    Code: "EFI-USD",
    Name: "Efinity",
  },
  {
    Code: "eFIN-USD",
    Name: "eFIN",
  },
  {
    Code: "EFK-USD",
    Name: "Refork",
  },
  {
    Code: "EFL-USD",
    Name: "e-Gulden",
  },
  {
    Code: "EFX-USD",
    Name: "Effect.AI",
  },
  {
    Code: "EGCC-USD",
    Name: "Engine",
  },
  {
    Code: "EGEM-USD",
    Name: "EtherGem",
  },
  {
    Code: "EGG-USD",
    Name: "Nestree",
  },
  {
    Code: "EGLD-USD",
    Name: "Elrond",
  },
  {
    Code: "EGO-USD",
    Name: "EGO",
  },
  {
    Code: "EGT-USD",
    Name: "Egretia",
  },
  {
    Code: "EHRT-USD",
    Name: "Eight Hours",
  },
  {
    Code: "EIDOS-USD",
    Name: "EIDOS",
  },
  {
    Code: "EKO-USD",
    Name: "EchoLink",
  },
  {
    Code: "EKT-USD",
    Name: "EDUCare",
  },
  {
    Code: "ELA-USD",
    Name: "Elastos",
  },
  {
    Code: "ELD-USD",
    Name: "electrumdark",
  },
  {
    Code: "ELE-USD",
    Name: "Elementrem",
  },
  {
    Code: "ELEC-USD",
    Name: "Electrify.Asia",
  },
  {
    Code: "ELF-USD",
    Name: "aelf",
  },
  {
    Code: "ELG-USD",
    Name: "Escoin Token",
  },
  {
    Code: "ELITE-USD",
    Name: "Ethereum Lite",
  },
  {
    Code: "ELLA-USD",
    Name: "Ellaism",
  },
  {
    Code: "ELON-USD",
    Name: "Dogelon Mars",
  },
  {
    Code: "ELP-USD",
    Name: "The Everlasting Parachain",
  },
  {
    Code: "ELPH-USD",
    Name: "Elphyrecoin",
  },
  {
    Code: "ELT-USD",
    Name: "Elite Swap",
  },
  {
    Code: "ELTCOIN-USD",
    Name: "ELTCOIN",
  },
  {
    Code: "ELX-USD",
    Name: "Energy Ledger",
  },
  {
    Code: "ELY-USD",
    Name: "Elysian",
  },
  {
    Code: "EM-USD",
    Name: "Empow",
  },
  {
    Code: "EMB-USD",
    Name: "EmberCoin",
  },
  {
    Code: "EMC-USD",
    Name: "Emercoin",
  },
  {
    Code: "EMC2-USD",
    Name: "Einsteinium",
  },
  {
    Code: "EMD-USD",
    Name: "Emerald Crypto",
  },
  {
    Code: "EMOGI-NETWORK-USD",
    Name: "EMOGI Network",
  },
  {
    Code: "EMPOW-USD",
    Name: "Empow",
  },
  {
    Code: "EMRALS-USD",
    Name: "Emrals",
  },
  {
    Code: "EMRX-USD",
    Name: "Emirex Token",
  },
  {
    Code: "EMT-USD",
    Name: "Emanate",
  },
  {
    Code: "eMTRG-USD",
    Name: "Meter Governance mapped by Meter.io",
  },
  {
    Code: "ENB-USD",
    Name: "Earnbase",
  },
  {
    Code: "ENCRYPGEN-USD",
    Name: "EncrypGen",
  },
  {
    Code: "ENG-USD",
    Name: "Enigma",
  },
  {
    Code: "ENJ-USD",
    Name: "Enjin Coin",
  },
  {
    Code: "ENQ-USD",
    Name: "Enecuum",
  },
  {
    Code: "ENRG-USD",
    Name: "Energycoin",
  },
  {
    Code: "ENT-USD",
    Name: "Eternity",
  },
  {
    Code: "ENTRC-USD",
    Name: "EnterCoin",
  },
  {
    Code: "ENTS-USD",
    Name: "EUNOMIA",
  },
  {
    Code: "EOS-BTC",
    Name: "EOS/BTC - EOS Bitcoin",
    Country: "Unknown",
    Exchange: "CC",
    Currency: "NA",
    Type: "Currency",
    Isin: null,
  },
  {
    Code: "EOS-USD",
    Name: "EOS",
  },
  {
    Code: "EOSBEAR-USD",
    Name: "3x Short EOS Token",
  },
  {
    Code: "EOSBULL-USD",
    Name: "3x Long EOS Token",
  },
  {
    Code: "EOSC-USD",
    Name: "EosForce",
  },
  {
    Code: "EOSDAC-USD",
    Name: "eosDAC",
  },
  {
    Code: "EOSDT-USD",
    Name: "EOSDT",
  },
  {
    Code: "EOST-USD",
    Name: "EOS TRUST",
  },
  {
    Code: "EOX-USD",
    Name: "EOX",
  },
  {
    Code: "EPAM-USD",
    Name: "EPAM Systems Inc.",
  },
  {
    Code: "EPAN-USD",
    Name: "Paypolitan Token",
  },
  {
    Code: "EPC-USD",
    Name: "Electronic PK Chain",
  },
  {
    Code: "EPIC-USD",
    Name: "Epic Cash",
  },
  {
    Code: "EPS-USD",
    Name: "Ellipsis",
  },
  {
    Code: "EQL-USD",
    Name: "Equal",
  },
  {
    Code: "EQMT-USD",
    Name: "Equus Mining Token",
  },
  {
    Code: "EQUAD-USD",
    Name: "QuadrantProtocol",
  },
  {
    Code: "ERC20-USD",
    Name: "ERC20",
  },
  {
    Code: "ERD-USD",
    Name: "Elrond",
  },
  {
    Code: "ERG-USD",
    Name: "Ergo",
  },
  {
    Code: "ERK-USD",
    Name: "Eureka Coin",
  },
  {
    Code: "ERN-USD",
    Name: "Ethernity Chain",
  },
  {
    Code: "erowan-USD",
    Name: "Sifchain",
  },
  {
    Code: "ERSDL-USD",
    Name: "UnFederalReserve",
  },
  {
    Code: "ES-USD",
    Name: "Era Swap",
  },
  {
    Code: "ESBC-USD",
    Name: "e-Sport Betting Coin",
  },
  {
    Code: "ESD-USD",
    Name: "Empty Set Dollar",
  },
  {
    Code: "ESH-USD",
    Name: "Switch",
  },
  {
    Code: "ESK-USD",
    Name: "Eska",
  },
  {
    Code: "ESN-USD",
    Name: "Escudo Navacense",
  },
  {
    Code: "ESRC-USD",
    Name: "EchoSoraCoin",
  },
  {
    Code: "ESS-USD",
    Name: "Essentia",
  },
  {
    Code: "ESTI-USD",
    Name: "Easticoin",
  },
  {
    Code: "ETC-BTC",
    Name: "ETC/BTC - Ethereum Classic Bitcoin",
    Country: "Unknown",
    Exchange: "CC",
    Currency: "NA",
    Type: "Currency",
    Isin: null,
  },
  {
    Code: "ETC-USD",
    Name: "Ethereum Classic",
  },
  {
    Code: "ETCBEAR-USD",
    Name: "3X Short Ethereum Classic Token",
  },
  {
    Code: "ETCBULL-USD",
    Name: "3X Long Ethereum Classic Token",
  },
  {
    Code: "ETF-USD",
    Name: "Entherfound",
  },
  {
    Code: "ETG-USD",
    Name: "Ethereum Gold",
  },
  {
    Code: "ETGF-USD",
    Name: "ETG Finance",
  },
  {
    Code: "ETGP-USD",
    Name: "Ethereum Gold Project",
  },
  {
    Code: "ETH-BTC",
    Name: "ETH/BTC - Ethereum Bitcoin",
    Country: "Unknown",
    Exchange: "CC",
    Currency: "NA",
    Type: "Currency",
    Isin: null,
  },
  {
    Code: "ETH-USD",
    Name: "Ethereum",
  },
  {
    Code: "ETH20SMACO-USD",
    Name: "ETH 20 Day MA Crossover Set",
  },
  {
    Code: "ETHBEAR-USD",
    Name: "3X Short Ethereum Token",
  },
  {
    Code: "ETHBTCRSI-USD",
    Name: "ETH/BTC RSI Ratio Trading Set",
  },
  {
    Code: "ETHBULL-USD",
    Name: "3X Long Ethereum Token",
  },
  {
    Code: "ETHEREUM-VAULT-USD",
    Name: "Ethereum Vault",
  },
  {
    Code: "ETHHEDGE-USD",
    Name: "1X Short Ethereum Token",
  },
  {
    Code: "ETHIX-USD",
    Name: "EthicHub",
  },
  {
    Code: "ETHM-USD",
    Name: "Ethereum Meta",
  },
  {
    Code: "ETHMACOAPY-USD",
    Name: "ETH 20 Day MA Crossover Yield Set",
  },
  {
    Code: "ETHO-USD",
    Name: "Ether-1",
  },
  {
    Code: "ETHOS-USD",
    Name: "Ethos",
  },
  {
    Code: "ETHP-USD",
    Name: "ETHPlus",
  },
  {
    Code: "ETHPA-USD",
    Name: "ETH Price Action Candlestick Set",
  },
  {
    Code: "ETHPLO-USD",
    Name: "ETHPLODE",
  },
  {
    Code: "ETHPY-USD",
    Name: "Etherpay",
  },
  {
    Code: "ETHRSI6040-USD",
    Name: "ETH RSI 60/40 Crossover Set",
  },
  {
    Code: "ETHRSIAPY-USD",
    Name: "ETH RSI 60/40 Yield Set",
  },
  {
    Code: "ETHUP-USD",
    Name: "ETHUP",
  },
  {
    Code: "ETHY-USD",
    Name: "Ethereum Yield",
  },
  {
    Code: "ETHYS-USD",
    Name: "Ethereum Stake",
  },
  {
    Code: "ETI-USD",
    Name: "EtherInc",
  },
  {
    Code: "ETLT-USD",
    Name: "Ethereum Lightning Token",
  },
  {
    Code: "ETM-USD",
    Name: "EtherMan",
  },
  {
    Code: "ETN-USD",
    Name: "Electroneum",
  },
  {
    Code: "ETNX-USD",
    Name: "Electronero",
  },
  {
    Code: "ETP-USD",
    Name: "Metaverse ETP",
  },
  {
    Code: "ETZ-USD",
    Name: "Ether Zero",
  },
  {
    Code: "EU50-USD",
    Name: "Euro Stoxx 50 Token",
  },
  {
    Code: "EUBC-USD",
    Name: "EUB Chain",
  },
  {
    Code: "EUC-USD",
    Name: "Eurocoin",
  },
  {
    Code: "EUM-USD",
    Name: "ELITIUM",
  },
  {
    Code: "EUNO-USD",
    Name: "EUNO",
  },
  {
    Code: "EUR-USD",
    Name: "Euro Token",
  },
  {
    Code: "EURS-USD",
    Name: "STASIS EURO",
  },
  {
    Code: "EURU-USD",
    Name: "Upper Euro",
  },
  {
    Code: "EVC-USD",
    Name: "EventChain",
  },
  {
    Code: "EVE-USD",
    Name: "Devery",
  },
  {
    Code: "EVED-USD",
    Name: "Evedo",
  },
  {
    Code: "EVIL-USD",
    Name: "Evil Coin",
  },
  {
    Code: "EVN-USD",
    Name: "EvenCoin",
  },
  {
    Code: "EVO-USD",
    Name: "Evotion",
  },
  {
    Code: "EVOX-USD",
    Name: "Evolution",
  },
  {
    Code: "EVR-USD",
    Name: "Everus",
  },
  {
    Code: "EVRAZ-USD",
    Name: "EVRAZ",
  },
  {
    Code: "EVT-USD",
    Name: "EveriToken",
  },
  {
    Code: "EVX-USD",
    Name: "Everex",
  },
  {
    Code: "EVZ-USD",
    Name: "Electric Vehicle Zone",
  },
  {
    Code: "EWT-USD",
    Name: "Energy Web Token",
  },
  {
    Code: "EXCC-USD",
    Name: "ExchangeCoin",
  },
  {
    Code: "EXCL-USD",
    Name: "ExclusiveCoin",
  },
  {
    Code: "EXE-USD",
    Name: "8X8 Protocol",
  },
  {
    Code: "EXF-USD",
    Name: "Extend Finance",
  },
  {
    Code: "EXM-USD",
    Name: "EXMO Coin",
  },
  {
    Code: "EXMR-USD",
    Name: "EXMR FDN",
  },
  {
    Code: "EXNT-USD",
    Name: "ExNetwork Token",
  },
  {
    Code: "EXO-USD",
    Name: "Exosis",
  },
  {
    Code: "EXOD-USD",
    Name: "Exodia",
  },
  {
    Code: "EXOR-USD",
    Name: "Exor",
  },
  {
    Code: "EXP-USD",
    Name: "Expanse",
  },
  {
    Code: "EXPO-USD",
    Name: "Expo Token",
  },
  {
    Code: "EXR-USD",
    Name: "EXSERION",
  },
  {
    Code: "eXRD-USD",
    Name: "E-RADIX",
  },
  {
    Code: "EXRN-USD",
    Name: "EXRNchain",
  },
  {
    Code: "EXTRADNA-USD",
    Name: "extraDNA",
  },
  {
    Code: "EXY-USD",
    Name: "Experty",
  },
  {
    Code: "EYE-USD",
    Name: "EYE",
  },
  {
    Code: "EYES-USD",
    Name: "EYES Protocol",
  },
  {
    Code: "EZ-USD",
    Name: "EasyFi",
  },
  {
    Code: "EZPAY-USD",
    Name: "EazyPayZa",
  },
  {
    Code: "EZY-USD",
    Name: "EzyStayz",
  },
  {
    Code: "F-USD",
    Name: "Ford Motor Co",
  },
  {
    Code: "F1C-USD",
    Name: "Future1coin",
  },
  {
    Code: "FACE-USD",
    Name: "Faceter",
  },
  {
    Code: "FACEBOOK-TOKENIZED-STOCK-BITTREX-USD",
    Name: "Facebook tokenized stock Bittrex",
  },
  {
    Code: "FACT-USD",
    Name: "Fee Active Collateral Token",
  },
  {
    Code: "FAIRGAME-USD",
    Name: "FairGame",
  },
  {
    Code: "FANATICOS-CASH-USD",
    Name: "Fanaticos Cash",
  },
  {
    Code: "FANTASY-SPORTS-USD",
    Name: "Fantasy Sports",
  },
  {
    Code: "FAR-USD",
    Name: "Farmland Protocol",
  },
  {
    Code: "FARM-USD",
    Name: "Harvest Finance",
  },
  {
    Code: "FAST-USD",
    Name: "Fast.Finance",
  },
  {
    Code: "FAT-USD",
    Name: "Fatcoin",
  },
  {
    Code: "FB-USD",
    Name: "Facebook",
  },
  {
    Code: "FBC-USD",
    Name: "FiberCoin",
  },
  {
    Code: "FBN-USD",
    Name: "Fivebalance",
  },
  {
    Code: "FBT-USD",
    Name: "FANBI TOKEN",
  },
  {
    Code: "FCC-USD",
    Name: "FileCash",
  },
  {
    Code: "FCD-USD",
    Name: "Future-Cash Digital",
  },
  {
    Code: "FCH-USD",
    Name: "Fan\u00c3\u00a1ticos Cash",
  },
  {
    Code: "FCK-USD",
    Name: "FCK Banks coin",
  },
  {
    Code: "FCT-BTC",
    Name: "FCT/BTC - Factom Bitcoin",
    Country: "Unknown",
    Exchange: "CC",
    Currency: "NA",
    Type: "Currency",
    Isin: null,
  },
  {
    Code: "FCT-USD",
    Name: "Factom",
  },
  {
    Code: "FDN-USD",
    Name: "EXMR",
  },
  {
    Code: "FDR-USD",
    Name: "French Digital Reserve",
  },
  {
    Code: "FDX-USD",
    Name: "Fedex",
  },
  {
    Code: "FDZ-USD",
    Name: "Friendz",
  },
  {
    Code: "FEI-USD",
    Name: "Fei Protocol",
  },
  {
    Code: "FERA-USD",
    Name: "Fera",
  },
  {
    Code: "FET-USD",
    Name: "Fetch.AI",
  },
  {
    Code: "FEX-USD",
    Name: "FIDEX Exchange",
  },
  {
    Code: "FFF-USD",
    Name: "Force For Fast",
  },
  {
    Code: "FFYI-USD",
    Name: "Fiscus Governance Coin",
  },
  {
    Code: "FIC-USD",
    Name: "Filecash",
  },
  {
    Code: "FIDA-USD",
    Name: "Bonfida",
  },
  {
    Code: "FIL-USD",
    Name: "Filecoin [Futures]",
  },
  {
    Code: "FILDA-USD",
    Name: "Filda",
  },
  {
    Code: "FIN-USD",
    Name: "FENNIECOIN",
  },
  {
    Code: "FINANCIAL-INVESTMENT-TOKEN-USD",
    Name: "FINANCIAL INVESTMENT TOKEN",
  },
  {
    Code: "FINEXBOXTOKEN-USD",
    Name: "FinexboxToken",
  },
  {
    Code: "FIO-USD",
    Name: "FIO Protocol",
  },
  {
    Code: "FIRE-PROTOCOL-USD",
    Name: "Fireball",
  },
  {
    Code: "FIRE-USD",
    Name: "Firecoin",
  },
  {
    Code: "FIRMACHAIN-USD",
    Name: "FirmaChain",
  },
  {
    Code: "FIRO-USD",
    Name: "Firo",
  },
  {
    Code: "FIS-USD",
    Name: "Stafi",
  },
  {
    Code: "FIT-USD",
    Name: "FINANCIAL INVESTMENT TOKEN",
  },
  {
    Code: "FJC-USD",
    Name: "FujiCoin",
  },
  {
    Code: "FKX-USD",
    Name: "FortKnoxster",
  },
  {
    Code: "FLAPX-USD",
    Name: "FlapX",
  },
  {
    Code: "FLETA-USD",
    Name: "FLETA",
  },
  {
    Code: "FLEX-USD",
    Name: "FLEX Coin",
  },
  {
    Code: "FLG-USD",
    Name: "Folgory Coin",
  },
  {
    Code: "FLIXX-USD",
    Name: "Flixxo",
  },
  {
    Code: "FLL-USD",
    Name: "Feellike",
  },
  {
    Code: "FLM1-USD",
    Name: "Flamingo",
  },
  {
    Code: "FLO-USD",
    Name: "FLO",
  },
  {
    Code: "FLOKI-USD",
    Name: "Floki Inu",
  },
  {
    Code: "FLOT-USD",
    Name: "Fire Lotto",
  },
  {
    Code: "FLOW-USD",
    Name: "Flow",
  },
  {
    Code: "FLP-USD",
    Name: "FLIP",
  },
  {
    Code: "FLS-USD",
    Name: "Flits",
  },
  {
    Code: "FLUX-USD",
    Name: "Datamine FLUX",
  },
  {
    Code: "FLX-USD",
    Name: "Reflexer Ungovernance Token",
  },
  {
    Code: "FLY-USD",
    Name: "Flycoin",
  },
  {
    Code: "FMA-USD",
    Name: "FLAMA",
  },
  {
    Code: "FME-USD",
    Name: "FME",
  },
  {
    Code: "FML-USD",
    Name: "FormulA",
  },
  {
    Code: "FMTA-USD",
    Name: "Fundamenta",
  },
  {
    Code: "FNK-USD",
    Name: "FunKeyPay",
  },
  {
    Code: "FNSP-USD",
    Name: "Finswap",
  },
  {
    Code: "FNT-USD",
    Name: "Falcon Project",
  },
  {
    Code: "FNX-USD",
    Name: "FinNexus",
  },
  {
    Code: "FOAM-USD",
    Name: "FOAM",
  },
  {
    Code: "FOIN-USD",
    Name: "FOIN",
  },
  {
    Code: "FOL-USD",
    Name: "Folder Protocol",
  },
  {
    Code: "FONT-USD",
    Name: "Font",
  },
  {
    Code: "FOR-USD",
    Name: "The Force Protocol",
  },
  {
    Code: "FORS-USD",
    Name: "Foresight",
  },
  {
    Code: "FORTH-USD",
    Name: "Ampleforth Governance Token",
  },
  {
    Code: "FOTA-USD",
    Name: "Fortuna",
  },
  {
    Code: "FOUR-USD",
    Name: "4thpillar technologies",
  },
  {
    Code: "FOX-USD",
    Name: "SmartFox",
  },
  {
    Code: "FOXD-USD",
    Name: "Foxdcoin",
  },
  {
    Code: "FOXT-USD",
    Name: "Fox Trading",
  },
  {
    Code: "FRAX-USD",
    Name: "Frax",
  },
  {
    Code: "FRC-USD",
    Name: "Freicoin",
  },
  {
    Code: "FRED-USD",
    Name: "FRED Energy",
  },
  {
    Code: "FREE-USD",
    Name: "FREE Coin",
  },
  {
    Code: "FREE1-USD",
    Name: "Anti-Lockdown",
  },
  {
    Code: "FRIES-USD",
    Name: "fry.world",
  },
  {
    Code: "FRK-USD",
    Name: "Franko",
  },
  {
    Code: "FRM-USD",
    Name: "Ferrum Network",
  },
  {
    Code: "FRMS-USD",
    Name: "The Forms",
  },
  {
    Code: "FRMX-USD",
    Name: "FRMx Token",
  },
  {
    Code: "FRN-USD",
    Name: "Francs",
  },
  {
    Code: "FRONT-USD",
    Name: "Frontier",
  },
  {
    Code: "FRST-USD",
    Name: "FirstCoin",
  },
  {
    Code: "FRWC-USD",
    Name: "FrankyWillCoin",
  },
  {
    Code: "FRY-USD",
    Name: "Foundry Logistics Token",
  },
  {
    Code: "FS-USD",
    Name: "FantomStarter",
  },
  {
    Code: "FSC-USD",
    Name: "Five Star Coin",
  },
  {
    Code: "FSCC-USD",
    Name: "Fisco",
  },
  {
    Code: "FSHN-USD",
    Name: "Fashion Coin",
  },
  {
    Code: "FSLR-USD",
    Name: "First Solar Inc",
  },
  {
    Code: "FSN-USD",
    Name: "Fusion",
  },
  {
    Code: "FST-USD",
    Name: "Fastcoin",
  },
  {
    Code: "FSW-USD",
    Name: "Falconswap",
  },
  {
    Code: "FTC-USD",
    Name: "Feathercoin",
  },
  {
    Code: "FTI-USD",
    Name: "FansTime",
  },
  {
    Code: "FTM-USD",
    Name: "Fantom",
  },
  {
    Code: "FTO-USD",
    Name: "FuturoCoin",
  },
  {
    Code: "FTT-USD",
    Name: "FTX Token",
  },
  {
    Code: "FTX-USD",
    Name: "FintruX Network",
  },
  {
    Code: "FTXT-USD",
    Name: "FUTURAX",
  },
  {
    Code: "FUEL-USD",
    Name: "Etherparty",
  },
  {
    Code: "FUN-USD",
    Name: "FunFair",
  },
  {
    Code: "FUND-USD",
    Name: "Unification",
  },
  {
    Code: "FUSE-USD",
    Name: "Fuse Network",
  },
  {
    Code: "FUZZ-USD",
    Name: "FuzzBalls",
  },
  {
    Code: "FVRR-USD",
    Name: "Fiverr International Ltd",
  },
  {
    Code: "FWT-USD",
    Name: "Freeway Token",
  },
  {
    Code: "FX-USD",
    Name: "Function X",
  },
  {
    Code: "FX1-USD",
    Name: "FANZY",
  },
  {
    Code: "FXF-USD",
    Name: "Finxflo",
  },
  {
    Code: "FXP-USD",
    Name: "FXPay",
  },
  {
    Code: "FXS-USD",
    Name: "Frax Share USD",
  },
  {
    Code: "FXT-USD",
    Name: "FuzeX",
  },
  {
    Code: "FxTC-USD",
    Name: "Fixed Trade Coin",
  },
  {
    Code: "FYD-USD",
    Name: "FYDcoin",
  },
  {
    Code: "FYP-USD",
    Name: "FlypMe",
  },
  {
    Code: "FYZ-USD",
    Name: "Fyooz",
  },
  {
    Code: "G3N-USD",
    Name: "G3N",
  },
  {
    Code: "G999-USD",
    Name: "G999",
  },
  {
    Code: "GADOSHI-USD",
    Name: "Gadoshi",
  },
  {
    Code: "GAIN-USD",
    Name: "UGAIN",
  },
  {
    Code: "GAL-USD",
    Name: "Galore",
  },
  {
    Code: "GALA-USD",
    Name: "Gala",
  },
  {
    Code: "GAM-USD",
    Name: "Gamma Token",
  },
  {
    Code: "GAMB-USD",
    Name: "GAMB",
  },
  {
    Code: "GAME-USD",
    Name: "GameCredits",
  },
  {
    Code: "GAP-USD",
    Name: "Gapcoin",
  },
  {
    Code: "GARD-USD",
    Name: "Hashgard",
  },
  {
    Code: "GAS-BTC",
    Name: "GAS/BTC - Gas Bitcoin",
    Country: "Unknown",
    Exchange: "CC",
    Currency: "NA",
    Type: "Currency",
    Isin: null,
  },
  {
    Code: "GAS-USD",
    Name: "Gas",
  },
  {
    Code: "GASP-USD",
    Name: "gAsp",
  },
  {
    Code: "GB-USD",
    Name: "GoldBlocks",
  },
  {
    Code: "GBP-USD",
    Name: "Pound Sterling Token",
  },
  {
    Code: "GBPU-USD",
    Name: "Upper Pound",
  },
  {
    Code: "GBRICK-USD",
    Name: "Gbrick",
  },
  {
    Code: "GBTC-USD",
    Name: "Gulf Bits Coin",
  },
  {
    Code: "GBX-USD",
    Name: "GoByte",
  },
  {
    Code: "GBYTE-USD",
    Name: "Obyte",
  },
  {
    Code: "GCC-USD",
    Name: "Global Cryptocurrency",
  },
  {
    Code: "GCN-USD",
    Name: "GCN Coin",
  },
  {
    Code: "GCR-USD",
    Name: "Global Currency Reserve",
  },
  {
    Code: "GCX-USD",
    Name: "GermanCoin",
  },
  {
    Code: "GDAO-USD",
    Name: "Governor DAO",
  },
  {
    Code: "GDC-USD",
    Name: "GrandCoin",
  },
  {
    Code: "GDR-USD",
    Name: "Golden Roots",
  },
  {
    Code: "GE-USD",
    Name: "General Electric Co",
  },
  {
    Code: "GEAR-USD",
    Name: "Bitgear",
  },
  {
    Code: "GEEQ-USD",
    Name: "GEEQ",
  },
  {
    Code: "GEM-USD",
    Name: "Gems",
  },
  {
    Code: "GEN-USD",
    Name: "DAOstack",
  },
  {
    Code: "GENE-USD",
    Name: "Gene Source Code Chain",
  },
  {
    Code: "GENE1-USD",
    Name: "Genopets",
  },
  {
    Code: "GENIX-USD",
    Name: "Genix",
  },
  {
    Code: "GENT-USD",
    Name: "Genesis Token",
  },
  {
    Code: "GEO-USD",
    Name: "GeoCoin",
  },
  {
    Code: "GEOCOIN-USD",
    Name: "GeoCoin",
  },
  {
    Code: "GER-USD",
    Name: "Ginza Eternity Reward",
  },
  {
    Code: "GERA-USD",
    Name: "Gera Coin",
  },
  {
    Code: "GET-USD",
    Name: "GET Protocol",
  },
  {
    Code: "GF-USD",
    Name: "GuildFi",
  },
  {
    Code: "GFARM2-USD",
    Name: "Gains Farm v2",
  },
  {
    Code: "GFUN-USD",
    Name: "GoldFund",
  },
  {
    Code: "GGC-USD",
    Name: "Global Game Coin",
  },
  {
    Code: "GGTK-USD",
    Name: "GG Token",
  },
  {
    Code: "GHC-USD",
    Name: "Galaxy Heroes Coin",
  },
  {
    Code: "GHD-USD",
    Name: "Giftedhands",
  },
  {
    Code: "GHOST-USD",
    Name: "Ghost",
  },
  {
    Code: "GHOSTPRISM-USD",
    Name: "GHOSTPRISM",
  },
  {
    Code: "GHST-USD",
    Name: "Aavegotchi",
  },
  {
    Code: "GIG-USD",
    Name: "Krios",
  },
  {
    Code: "GIL-USD",
    Name: "Materia",
  },
  {
    Code: "GILD-USD",
    Name: "Gilead Sciences",
  },
  {
    Code: "GIO-USD",
    Name: "Graviocoin",
  },
  {
    Code: "GIV-USD",
    Name: "GIVLY Coin",
  },
  {
    Code: "GLB-USD",
    Name: "Globe Token",
  },
  {
    Code: "GLC-USD",
    Name: "GoldCoin",
  },
  {
    Code: "GLCH-USD",
    Name: "Glitch Protocol",
  },
  {
    Code: "GLDY-USD",
    Name: "Buzzshow",
  },
  {
    Code: "GLEEC-USD",
    Name: "Gleec Coin",
  },
  {
    Code: "GLF-USD",
    Name: "GLUFCO",
  },
  {
    Code: "GLM-USD",
    Name: "Golem",
  },
  {
    Code: "GLMR-USD",
    Name: "Moonbeam",
  },
  {
    Code: "GLOB-USD",
    Name: "Global Reserve System",
  },
  {
    Code: "GLOBAL-X-CHANGE-TOKEN-USD",
    Name: "Global X Change Token",
  },
  {
    Code: "GLOX-USD",
    Name: "Glox Finance",
  },
  {
    Code: "GLS-USD",
    Name: "GlassCoin",
  },
  {
    Code: "GLT-USD",
    Name: "GlobalToken",
  },
  {
    Code: "GM-USD",
    Name: "GM",
  },
  {
    Code: "GMAT-USD",
    Name: "GoWithMi",
  },
  {
    Code: "GMB-USD",
    Name: "GMB",
  },
  {
    Code: "GMC-USD",
    Name: "Geimcoin",
  },
  {
    Code: "GMCI-USD",
    Name: "Game City",
  },
  {
    Code: "GME-USD",
    Name: "Gamestop",
  },
  {
    Code: "GML-USD",
    Name: "GameLeagueCoin",
  },
  {
    Code: "GMNG-USD",
    Name: "Global Gaming",
  },
  {
    Code: "GNC-USD",
    Name: "GALAXY NETWORK",
  },
  {
    Code: "GNO-USD",
    Name: "Gnosis",
  },
  {
    Code: "GNS-USD",
    Name: "Gains Network",
  },
  {
    Code: "GNTO-USD",
    Name: "GoldeNugget",
  },
  {
    Code: "GNX-USD",
    Name: "Genaro Network",
  },
  {
    Code: "GNY-USD",
    Name: "GNY",
  },
  {
    Code: "GO-USD",
    Name: "GoChain",
  },
  {
    Code: "GOAL-USD",
    Name: "GOAL",
  },
  {
    Code: "GOD-USD",
    Name: "Bitcoin God",
  },
  {
    Code: "GOF-USD",
    Name: "Golff",
  },
  {
    Code: "GOGO-USD",
    Name: "GOGO.finance",
  },
  {
    Code: "GOHELPFUND-USD",
    Name: "GoHelpFund",
  },
  {
    Code: "GOLD-COIN-RESERVE-USD",
    Name: "Gold Cash",
  },
  {
    Code: "GOLD-USD",
    Name: "Golden Token",
  },
  {
    Code: "GOLDEN-RATIO-TOKEN-USD",
    Name: "Golden Ratio Token",
  },
  {
    Code: "GOLDEN-TOKEN-USD",
    Name: "Golden Token",
  },
  {
    Code: "GOLDR-USD",
    Name: "Golden Ratio Coin",
  },
  {
    Code: "GOM-USD",
    Name: "Gomics",
  },
  {
    Code: "GOM2-USD",
    Name: "AnimalGo",
  },
  {
    Code: "GONETWORK-USD",
    Name: "GoNetwork",
  },
  {
    Code: "GOOGL-USD",
    Name: "Google tokenized stock FTX",
  },
  {
    Code: "GOOGLE-TOKENIZED-STOCK-BITTREX-USD",
    Name: "Google tokenized stock Bittrex",
  },
  {
    Code: "GOSS-USD",
    Name: "Gossip Coin",
  },
  {
    Code: "GOT-USD",
    Name: "GoNetwork",
  },
  {
    Code: "GOVI-USD",
    Name: "GOVI",
  },
  {
    Code: "GP-USD",
    Name: "GoldPieces",
  },
  {
    Code: "GPKR-USD",
    Name: "Gold Poker",
  },
  {
    Code: "GPRO-USD",
    Name: "GoPro Inc",
  },
  {
    Code: "GPS-USD",
    Name: "The Gap Inc.",
  },
  {
    Code: "GPT-USD",
    Name: "GoPower",
  },
  {
    Code: "GPYX-USD",
    Name: "GoldenPyrex",
  },
  {
    Code: "GRAP-USD",
    Name: "Grap Finance",
  },
  {
    Code: "GRC-USD",
    Name: "GridCoin",
  },
  {
    Code: "GRE-USD",
    Name: "Greencoin",
  },
  {
    Code: "GREM-USD",
    Name: "Gremlins Finance",
  },
  {
    Code: "GRFT-USD",
    Name: "Graft",
  },
  {
    Code: "GRG-USD",
    Name: "Rigo Token",
  },
  {
    Code: "GRIC-COIN-USD",
    Name: "Gric Coin",
  },
  {
    Code: "GRID-USD",
    Name: "Grid+",
  },
  {
    Code: "GRIM-EVO-USD",
    Name: "Grim EVO",
  },
  {
    Code: "GRIMM-USD",
    Name: "Grimm",
  },
  {
    Code: "GRIN-USD",
    Name: "Grin",
  },
  {
    Code: "GRLC-USD",
    Name: "Garlicoin",
  },
  {
    Code: "GRM-USD",
    Name: "GreenMoon",
  },
  {
    Code: "GRN-USD",
    Name: "GreenPower",
  },
  {
    Code: "GRO-USD",
    Name: "Growth DeFi",
  },
  {
    Code: "GRPL-USD",
    Name: "Golden Ratio Per Liquidity",
  },
  {
    Code: "GRS-USD",
    Name: "Groestlcoin",
  },
  {
    Code: "GRT1-USD",
    Name: "The Graph",
  },
  {
    Code: "GSC-USD",
    Name: "Global Social Chain",
  },
  {
    Code: "GSE-USD",
    Name: "GSENetwork",
  },
  {
    Code: "GSMT-USD",
    Name: "Grafsound",
  },
  {
    Code: "GSR-USD",
    Name: "GeyserCoin",
  },
  {
    Code: "GST-USD",
    Name: "Game Stars",
  },
  {
    Code: "GSWAP-USD",
    Name: "Gameswap",
  },
  {
    Code: "GSX-USD",
    Name: "Gold Secured Currency",
  },
  {
    Code: "GT-USD",
    Name: "Gatechain Token",
  },
  {
    Code: "GTC-USD",
    Name: "Game.com",
  },
  {
    Code: "GTC1-USD",
    Name: "Gitcoin",
  },
  {
    Code: "GTF-USD",
    Name: "GLOBAL TRUSTFUND TOKEN",
  },
  {
    Code: "GTH-USD",
    Name: "Gather",
  },
  {
    Code: "GTM-USD",
    Name: "Gentarium",
  },
  {
    Code: "GTN-USD",
    Name: "GlitzKoin",
  },
  {
    Code: "GTO-USD",
    Name: "Gifto",
  },
  {
    Code: "GTX-USD",
    Name: "GoalTime N",
  },
  {
    Code: "GUAP-USD",
    Name: "Guapcoin",
  },
  {
    Code: "GUCCIONECOIN-USD",
    Name: "GuccioneCoin",
  },
  {
    Code: "GUESS-USD",
    Name: "Peerguess",
  },
  {
    Code: "GUM-USD",
    Name: "Gourmet Galaxy",
  },
  {
    Code: "GUSD-USD",
    Name: "Gemini Dollar",
  },
  {
    Code: "GUSDT-USD",
    Name: "Global Utility Smart Digital Token",
  },
  {
    Code: "GVE-USD",
    Name: "Globalvillage Ecosystem",
  },
  {
    Code: "GVT-USD",
    Name: "Genesis Vision",
  },
  {
    Code: "GXC-USD",
    Name: "GXChain",
  },
  {
    Code: "GXI-USD",
    Name: "Genexi",
  },
  {
    Code: "GXT-USD",
    Name: "Gem Exchange And Trading",
  },
  {
    Code: "GXX-USD",
    Name: "GravityCoin",
  },
  {
    Code: "GYSR-USD",
    Name: "Geyser",
  },
  {
    Code: "GZE-USD",
    Name: "GazeCoin",
  },
  {
    Code: "GZIL-USD",
    Name: "governance ZIL",
  },
  {
    Code: "GZRO-USD",
    Name: "Gravity",
  },
  {
    Code: "H2O-USD",
    Name: "IFOSwap Token",
  },
  {
    Code: "HAI-USD",
    Name: "HackenAI",
  },
  {
    Code: "HAKKA-USD",
    Name: "Hakka Finance",
  },
  {
    Code: "HALLO-USD",
    Name: "Halloween Coin",
  },
  {
    Code: "HALV-USD",
    Name: "Halving Coin",
  },
  {
    Code: "HAM-USD",
    Name: "Hamster",
  },
  {
    Code: "HANA-USD",
    Name: "Hanacoin",
  },
  {
    Code: "HAND-USD",
    Name: "ShowHand",
  },
  {
    Code: "HANDY-USD",
    Name: "Handy",
  },
  {
    Code: "HAPY-USD",
    Name: "HAPY Coin",
  },
  {
    Code: "HARD-USD",
    Name: "HARD Protocol",
  },
  {
    Code: "HATCH-USD",
    Name: "Hatch",
  },
  {
    Code: "HAVY-USD",
    Name: "Havy",
  },
  {
    Code: "HAZ-USD",
    Name: "Hazza",
  },
  {
    Code: "HB-USD",
    Name: "HeartBout",
  },
  {
    Code: "HBAR-USD",
    Name: "Hedera Hashgraph",
  },
  {
    Code: "HBC-USD",
    Name: "HomeBlockCoin",
  },
  {
    Code: "HBD-USD",
    Name: "Hive Backed Dollar",
  },
  {
    Code: "HBDC-USD",
    Name: "happy birthday coin",
  },
  {
    Code: "HBN-USD",
    Name: "HoboNickels",
  },
  {
    Code: "HBO-USD",
    Name: "Hash Bridge Oracle",
  },
  {
    Code: "HBTC-TOKEN-USD",
    Name: "Huobi BTC",
  },
  {
    Code: "HBTC-USD",
    Name: "Huobi BTC",
  },
  {
    Code: "HBX-USD",
    Name: "HashBX",
  },
  {
    Code: "HC1-USD",
    Name: "HyperCash",
  },
  {
    Code: "HCC-USD",
    Name: "Happy Creator Coin",
  },
  {
    Code: "HDAC-USD",
    Name: "Hdac",
  },
  {
    Code: "HDAO-USD",
    Name: "HyperDAO",
  },
  {
    Code: "HDG-USD",
    Name: "Hedge",
  },
  {
    Code: "HEARTBOUT-PAY-USD",
    Name: "HeartBout Pay",
  },
  {
    Code: "HEAT-USD",
    Name: "HEAT",
  },
  {
    Code: "HEDG-USD",
    Name: "HedgeTrade",
  },
  {
    Code: "HEDGE-USD",
    Name: "1x Short Bitcoin Token",
  },
  {
    Code: "HEGIC-USD",
    Name: "HEGIC",
  },
  {
    Code: "HELMET-USD",
    Name: "Helmet Insure",
  },
  {
    Code: "HELP-USD",
    Name: "GoHelpFund",
  },
  {
    Code: "HERB-USD",
    Name: "Herbalist Token",
  },
  {
    Code: "HEX-USD",
    Name: "HEX",
  },
  {
    Code: "HEZ-USD",
    Name: "Hermez Network",
  },
  {
    Code: "HFI-USD",
    Name: "HecoFi",
  },
  {
    Code: "HGET-USD",
    Name: "Hedget",
  },
  {
    Code: "HGOLD-USD",
    Name: "HollyGold",
  },
  {
    Code: "HGT-USD",
    Name: "HelloGold",
  },
  {
    Code: "HH-USD",
    Name: "Holyheld",
  },
  {
    Code: "HIBS-USD",
    Name: "Hiblocks",
  },
  {
    Code: "HIGH-USD",
    Name: "Highstreet",
  },
  {
    Code: "HINT-USD",
    Name: "Hintchain",
  },
  {
    Code: "HIT-USD",
    Name: "HitChain",
  },
  {
    Code: "HITX-USD",
    Name: "Hithotx",
  },
  {
    Code: "HIVE-USD",
    Name: "HIVE",
  },
  {
    Code: "HIZ-USD",
    Name: "Hiz Finance",
  },
  {
    Code: "HKG-USD",
    Name: "Holdkey Global",
  },
  {
    Code: "HKN-USD",
    Name: "Hacken",
  },
  {
    Code: "HLIX-USD",
    Name: "Helix",
  },
  {
    Code: "HMC-USD",
    Name: "HarmonyCoin",
  },
  {
    Code: "HMN-USD",
    Name: "Hostmasternode",
  },
  {
    Code: "HMP-USD",
    Name: "HempCoin",
  },
  {
    Code: "HMQ-USD",
    Name: "Humaniq",
  },
  {
    Code: "HMR-USD",
    Name: "Homeros",
  },
  {
    Code: "HNB-USD",
    Name: "HashNet BitEco",
  },
  {
    Code: "HNC-USD",
    Name: "Helleniccoin",
  },
  {
    Code: "HNDC-USD",
    Name: "HondaisCoin",
  },
  {
    Code: "HNS-USD",
    Name: "Handshake",
  },
  {
    Code: "HNST-USD",
    Name: "Honest",
  },
  {
    Code: "HNT-USD",
    Name: "Helium",
  },
  {
    Code: "HNT1-USD",
    Name: "Hymnode",
  },
  {
    Code: "HNY-USD",
    Name: "Honey",
  },
  {
    Code: "HODL-USD",
    Name: "HOdlcoin",
  },
  {
    Code: "HODL1-USD",
    Name: "HODL",
  },
  {
    Code: "HOGE-USD",
    Name: "Hoge Finance",
  },
  {
    Code: "HOMI-USD",
    Name: "HOMIHELP",
  },
  {
    Code: "HOMT-USD",
    Name: "HOM Token",
  },
  {
    Code: "HOO-USD",
    Name: "Hoo Token",
  },
  {
    Code: "HOPR-USD",
    Name: "HOPR",
  },
  {
    Code: "HORSE-USD",
    Name: "Ethouse",
  },
  {
    Code: "HORUS-USD",
    Name: "HorusPay",
  },
  {
    Code: "HOT-USD",
    Name: "Hydro Protocol",
  },
  {
    Code: "HOT1-USD",
    Name: "Holo",
  },
  {
    Code: "HPAY-USD",
    Name: "HadePay",
  },
  {
    Code: "HPB-USD",
    Name: "High Performance Blockchain",
  },
  {
    Code: "HPC-USD",
    Name: "Happycoin",
  },
  {
    Code: "HPS-USD",
    Name: "HappinessToken",
  },
  {
    Code: "HPT-USD",
    Name: "Huobi Pool Token",
  },
  {
    Code: "HPTF-USD",
    Name: "HEPTAFRANC",
  },
  {
    Code: "HPY-USD",
    Name: "Hyper Pay",
  },
  {
    Code: "HQT-USD",
    Name: "HyperQuant",
  },
  {
    Code: "HQX-USD",
    Name: "HOQU",
  },
  {
    Code: "HSC-USD",
    Name: "HashCoin",
  },
  {
    Code: "HSN-USD",
    Name: "Helper Search Token",
  },
  {
    Code: "HT-USD",
    Name: "Huobi Token",
  },
  {
    Code: "HTA-USD",
    Name: "Historia",
  },
  {
    Code: "HTB-USD",
    Name: "Hotbit Token",
  },
  {
    Code: "HTBULL-USD",
    Name: "3X Long Huobi Token Token",
  },
  {
    Code: "HTC-USD",
    Name: "HitCoin",
  },
  {
    Code: "HTDF-USD",
    Name: "Orient Walt",
  },
  {
    Code: "HTH-USD",
    Name: "Help The Homeless Coin",
  },
  {
    Code: "HTML-USD",
    Name: "HTMLCOIN",
  },
  {
    Code: "HTN-USD",
    Name: "Heart Number",
  },
  {
    Code: "HTR-USD",
    Name: "Hathor Network",
  },
  {
    Code: "HUB-USD",
    Name: "Hub - Human Trust Protocol",
  },
  {
    Code: "HUM-USD",
    Name: "Humanscoin",
  },
  {
    Code: "HUNT-USD",
    Name: "HUNT",
  },
  {
    Code: "HUR-USD",
    Name: "Hurify",
  },
  {
    Code: "HUSD-USD",
    Name: "HUSD",
  },
  {
    Code: "HUSH-USD",
    Name: "Hush",
  },
  {
    Code: "HUSL-USD",
    Name: "Hustle Token",
  },
  {
    Code: "HVCO-USD",
    Name: "High Voltage",
  },
  {
    Code: "HVN-USD",
    Name: "Hiveterminal Token",
  },
  {
    Code: "HWI-USD",
    Name: "Hawaii",
  },
  {
    Code: "HXRO-USD",
    Name: "Hxro",
  },
  {
    Code: "HYC-USD",
    Name: "HYCON",
  },
  {
    Code: "HYDRA-USD",
    Name: "HYDRA",
  },
  {
    Code: "HYDRO-PROTOCOL-USD",
    Name: "Hydro",
  },
  {
    Code: "HYDRO-USD",
    Name: "Hydro",
  },
  {
    Code: "HYN-USD",
    Name: "Hyperion",
  },
  {
    Code: "HYP-USD",
    Name: "HyperStake",
  },
  {
    Code: "HYPER-USD",
    Name: "Hyper",
  },
  {
    Code: "HYVE-USD",
    Name: "Hyve",
  },
  {
    Code: "I0C-USD",
    Name: "I0Coin",
  },
  {
    Code: "I9C-USD",
    Name: "I9 Coin",
  },
  {
    Code: "IBANK-USD",
    Name: "iBank",
  },
  {
    Code: "ibETH-USD",
    Name: "Interest Bearing ETH",
  },
  {
    Code: "IBM-USD",
    Name: "International Business Machines Corp",
  },
  {
    Code: "IBP-USD",
    Name: "Innovation Blockchain Payment",
  },
  {
    Code: "IBS-USD",
    Name: "IBStoken",
  },
  {
    Code: "IBTC-USD",
    Name: "iBTC",
  },
  {
    Code: "IBVOL-USD",
    Name: "Inverse Bitcoin Volatility Token",
  },
  {
    Code: "IC-USD",
    Name: "Ignition",
  },
  {
    Code: "ICASH-USD",
    Name: "iCash",
  },
  {
    Code: "ICE-USD",
    Name: "Popsicle Finance",
  },
  {
    Code: "ICH-USD",
    Name: "IdeaChain",
  },
  {
    Code: "ICHI-USD",
    Name: "ICHI",
  },
  {
    Code: "ICNQ-USD",
    Name: "Iconiq Lab Token",
  },
  {
    Code: "ICOB-USD",
    Name: "ICOBID",
  },
  {
    Code: "ICOL-USD",
    Name: "Icolcoin",
  },
  {
    Code: "ICON-USD",
    Name: "Iconic",
  },
  {
    Code: "ICP-USD",
    Name: "Internet Computer",
  },
  {
    Code: "ICPT-USD",
    Name: "Intercept Pharmaceuticals Inc.",
  },
  {
    Code: "ICR-USD",
    Name: "InterCrone",
  },
  {
    Code: "ICX-USD",
    Name: "ICON",
  },
  {
    Code: "ID-USD",
    Name: "Infinite Divs",
  },
  {
    Code: "IDALL-USD",
    Name: "IDall",
  },
  {
    Code: "IDEA-USD",
    Name: "IDEA Token",
  },
  {
    Code: "IDEX-USD",
    Name: "IDEX",
  },
  {
    Code: "IDH-USD",
    Name: "indaHash",
  },
  {
    Code: "IDK-USD",
    Name: "IDK",
  },
  {
    Code: "IDLE-USD",
    Name: "IDLE",
  },
  {
    Code: "IDNA-USD",
    Name: "Idena",
  },
  {
    Code: "IDT-USD",
    Name: "InvestDigital",
  },
  {
    Code: "IDX-USD",
    Name: "Index Chain",
  },
  {
    Code: "IETHEREUM-USD",
    Name: "iEthereum",
  },
  {
    Code: "IEX-USD",
    Name: "Internal Exchange Coin",
  },
  {
    Code: "IFEX-USD",
    Name: "Interfinex Bills",
  },
  {
    Code: "IFLT-USD",
    Name: "InflationCoin",
  },
  {
    Code: "IFT-USD",
    Name: "InvestFeed",
  },
  {
    Code: "IFX24-USD",
    Name: "IFX24",
  },
  {
    Code: "IG-USD",
    Name: "IGToken",
  },
  {
    Code: "IGNIS-USD",
    Name: "Ignis",
  },
  {
    Code: "IHT-USD",
    Name: "IHT Real Estate Protocol",
  },
  {
    Code: "IIC-USD",
    Name: "Intelligent Investment Chain",
  },
  {
    Code: "ILC-USD",
    Name: "ILCoin",
  },
  {
    Code: "ILK-USD",
    Name: "INLOCK",
  },
  {
    Code: "ILV-USD",
    Name: "Illuvium",
  },
  {
    Code: "imBTC-USD",
    Name: "The Tokenized Bitcoin",
  },
  {
    Code: "IMG-USD",
    Name: "ImageCoin",
  },
  {
    Code: "IMGC-USD",
    Name: "ImageCash",
  },
  {
    Code: "IMP-USD",
    Name: "Ether Kingdoms Token",
  },
  {
    Code: "IMPL-USD",
    Name: "Impleum",
  },
  {
    Code: "IMS-USD",
    Name: "Independent Money System",
  },
  {
    Code: "IMSMART-USD",
    Name: "Imsmart",
  },
  {
    Code: "IMT-USD",
    Name: "Moneytoken",
  },
  {
    Code: "IMX-USD",
    Name: "Impermax USD",
  },
  {
    Code: "IMX1-USD",
    Name: "Immutable X",
  },
  {
    Code: "INB-USD",
    Name: "Insight Chain",
  },
  {
    Code: "INCX-USD",
    Name: "InternationalCryptoX",
  },
  {
    Code: "IND-USD",
    Name: "Indorse Token",
  },
  {
    Code: "INDEX-USD",
    Name: "Index Cooperative",
  },
  {
    Code: "INFI-USD",
    Name: "Insured Finance",
  },
  {
    Code: "INFINITY-ECONOMICS-USD",
    Name: "Infinity Protocol BSC",
  },
  {
    Code: "INFS-USD",
    Name: "Infinity Esaham",
  },
  {
    Code: "ING-USD",
    Name: "Iungo",
  },
  {
    Code: "INJ-USD",
    Name: "Injective Protocol",
  },
  {
    Code: "INK-USD",
    Name: "Ink",
  },
  {
    Code: "INN-USD",
    Name: "Innova",
  },
  {
    Code: "INNBC-USD",
    Name: "Innovative Bioresearch Coin",
  },
  {
    Code: "INPAY-USD",
    Name: "InPay",
  },
  {
    Code: "INRTOKEN-USD",
    Name: "INRTOKEN",
  },
  {
    Code: "INSTAR-USD",
    Name: "Insights Network",
  },
  {
    Code: "INSUR-USD",
    Name: "InsurAce",
  },
  {
    Code: "INT-USD",
    Name: "INT Chain",
  },
  {
    Code: "INTC-USD",
    Name: "Intel Corporation",
  },
  {
    Code: "INTRATIO-USD",
    Name: "Intelligent Ratio Set",
  },
  {
    Code: "INTX-USD",
    Name: "intexcoin",
  },
  {
    Code: "INVE-USD",
    Name: "InterValue",
  },
  {
    Code: "INXT-USD",
    Name: "Internxt",
  },
  {
    Code: "IOC-USD",
    Name: "I/O Coin",
  },
  {
    Code: "IOG-USD",
    Name: "Playgroundz",
  },
  {
    Code: "ION-USD",
    Name: "ION",
  },
  {
    Code: "IONC-USD",
    Name: "IONChain",
  },
  {
    Code: "IOST-USD",
    Name: "IOST",
  },
  {
    Code: "IOT-BTC",
    Name: "IOT/BTC - IOTA Bitcoin",
    Country: "Unknown",
    Exchange: "CC",
    Currency: "NA",
    Type: "Currency",
    Isin: null,
  },
  {
    Code: "IOTX-USD",
    Name: "IoTeX",
  },
  {
    Code: "IPL-USD",
    Name: "VouchForMe",
  },
  {
    Code: "IPM-USD",
    Name: "TIMERS",
  },
  {
    Code: "IPX-USD",
    Name: "Tachyon Protocol",
  },
  {
    Code: "IQ-USD",
    Name: "Everipedia",
  },
  {
    Code: "IQCASH-USD",
    Name: "IQ.cash",
  },
  {
    Code: "IQN-USD",
    Name: "IQeon",
  },
  {
    Code: "IRA-USD",
    Name: "Diligence",
  },
  {
    Code: "IRBT-USD",
    Name: "iRobot Corporation",
  },
  {
    Code: "IRD-USD",
    Name: "Iridium",
  },
  {
    Code: "IRIS-USD",
    Name: "IRISnet",
  },
  {
    Code: "ISAL-USD",
    Name: "Isalcoin",
  },
  {
    Code: "ISDT-USD",
    Name: "Istardust",
  },
  {
    Code: "ISIKC-USD",
    Name: "Isiklar Coin",
  },
  {
    Code: "ISL-USD",
    Name: "IslaCoin",
  },
  {
    Code: "ISLA-USD",
    Name: "Insula",
  },
  {
    Code: "ISR-USD",
    Name: "Insureum",
  },
  {
    Code: "IT-USD",
    Name: "IDCM Token",
  },
  {
    Code: "ITAM-USD",
    Name: "ITAM Games",
  },
  {
    Code: "ITC-USD",
    Name: "IoT Chain",
  },
  {
    Code: "ITEN-USD",
    Name: "ITEN",
  },
  {
    Code: "ITI-USD",
    Name: "iTicoin",
  },
  {
    Code: "ITL-USD",
    Name: "Italian Lira",
  },
  {
    Code: "ITS-USD",
    Name: "IterationSyndicate",
  },
  {
    Code: "IUT-USD",
    Name: "ITO Utility Token",
  },
  {
    Code: "IVC-USD",
    Name: "Invoice Coin",
  },
  {
    Code: "IVZ-USD",
    Name: "InvisibleCoin",
  },
  {
    Code: "IX-USD",
    Name: "X-Block",
  },
  {
    Code: "IXC-USD",
    Name: "Ixcoin",
  },
  {
    Code: "IXT-USD",
    Name: "IXT",
  },
  {
    Code: "IZE-USD",
    Name: "IZE",
  },
  {
    Code: "JADE-USD",
    Name: "Jade Currency",
  },
  {
    Code: "JAR-USD",
    Name: "Jarvis+",
  },
  {
    Code: "JASMY-USD",
    Name: "JasmyCoin",
  },
  {
    Code: "JBX-USD",
    Name: "JBOX",
  },
  {
    Code: "JCC-USD",
    Name: "junca Cash",
  },
  {
    Code: "JDC-USD",
    Name: "Jundcoin",
  },
  {
    Code: "JEM-USD",
    Name: "Jem",
  },
  {
    Code: "JET-USD",
    Name: "Jetcoin",
  },
  {
    Code: "JEWEL-USD",
    Name: "DeFi Kingdoms",
  },
  {
    Code: "JFC-USD",
    Name: "JFIN",
  },
  {
    Code: "JFI-USD",
    Name: "JackPool finance",
  },
  {
    Code: "JGN-USD",
    Name: "Juggernaut",
  },
  {
    Code: "JIC-USD",
    Name: "JoorsChain",
  },
  {
    Code: "JKCOIN-USD",
    Name: "Jacek Ko?odziejczak Token",
  },
  {
    Code: "JKS-USD",
    Name: "JinkoSolar Holding Co. Ltd.",
  },
  {
    Code: "JMC-USD",
    Name: "Junson Ming Chan Coin",
  },
  {
    Code: "JMT-USD",
    Name: "JMTIME",
  },
  {
    Code: "JNJ-USD",
    Name: "Johnson & Johnson",
  },
  {
    Code: "JNTR-USD",
    Name: "Jointer",
  },
  {
    Code: "JOBS-USD",
    Name: "JobsCoin",
  },
  {
    Code: "JOYS-USD",
    Name: "JOYS",
  },
  {
    Code: "JPM-USD",
    Name: "JPMorgan Chase",
  },
  {
    Code: "JRT-USD",
    Name: "Jarvis Reward Token",
  },
  {
    Code: "JS-USD",
    Name: "JavaScript Token",
  },
  {
    Code: "JSB-USD",
    Name: "JSB FOUNDATION",
  },
  {
    Code: "JST-USD",
    Name: "JUST",
  },
  {
    Code: "JT-USD",
    Name: "Jubi Token",
  },
  {
    Code: "JULD-USD",
    Name: "JulSwap",
  },
  {
    Code: "JUMP-USD",
    Name: "Jumpcoin",
  },
  {
    Code: "JUP-USD",
    Name: "Jupiter",
  },
  {
    Code: "JUS-USD",
    Name: "JUST NETWORK",
  },
  {
    Code: "JUV-USD",
    Name: "Juventus Fan Token",
  },
  {
    Code: "JWL-USD",
    Name: "Jewel",
  },
  {
    Code: "JWN-USD",
    Name: "Nordstrom",
  },
  {
    Code: "KAI-USD",
    Name: "kaicoin",
  },
  {
    Code: "KAM-USD",
    Name: "BitKAM",
  },
  {
    Code: "KAN-USD",
    Name: "BitKan",
  },
  {
    Code: "KANGAL-USD",
    Name: "Kangal",
  },
  {
    Code: "KAR-USD",
    Name: "Karura",
  },
  {
    Code: "KARMA-USD",
    Name: "KARMA",
  },
  {
    Code: "KASH-USD",
    Name: "Kids Cash",
  },
  {
    Code: "KASHH-USD",
    Name: "KashhCoin",
  },
  {
    Code: "KAT-USD",
    Name: "Kambria",
  },
  {
    Code: "KAU-USD",
    Name: "Kauri",
  },
  {
    Code: "KAVA-USD",
    Name: "Kava",
  },
  {
    Code: "KBC-USD",
    Name: "Karatgold Coin",
  },
  {
    Code: "KCAL-USD",
    Name: "Phantasma Energy",
  },
  {
    Code: "KCASH-USD",
    Name: "Kcash",
  },
  {
    Code: "KCS-USD",
    Name: "KuCoin Shares",
  },
  {
    Code: "KDA-USD",
    Name: "Kadena",
  },
  {
    Code: "KDAG-USD",
    Name: "King DAG",
  },
  {
    Code: "KDG-USD",
    Name: "Kingdom Game 4.0",
  },
  {
    Code: "KEBAB-USD",
    Name: "Kebab Token",
  },
  {
    Code: "KEC-USD",
    Name: "Keyco",
  },
  {
    Code: "KEEP-USD",
    Name: "Keep network",
  },
  {
    Code: "KEMA-USD",
    Name: "Kemacoin",
  },
  {
    Code: "KEN-USD",
    Name: "Keysians Network",
  },
  {
    Code: "KEX-USD",
    Name: "Kira Network",
  },
  {
    Code: "KEY-USD",
    Name: "KEY",
  },
  {
    Code: "KEYFI-USD",
    Name: "KeyFi",
  },
  {
    Code: "KEYT-USD",
    Name: "Rebit",
  },
  {
    Code: "KFC-USD",
    Name: "Chicken",
  },
  {
    Code: "KFX-USD",
    Name: "KnoxFS",
  },
  {
    Code: "KGC-USD",
    Name: "Krypton Galaxy Coin",
  },
  {
    Code: "KICK-USD",
    Name: "KickToken",
  },
  {
    Code: "KICKS-USD",
    Name: "Sessia",
  },
  {
    Code: "KIF-USD",
    Name: "KittenFinance",
  },
  {
    Code: "KIM-USD",
    Name: "KingMoney",
  },
  {
    Code: "KIMCHI-USD",
    Name: "KIMCHI.finance",
  },
  {
    Code: "KIMOCHI-USD",
    Name: "Kimochi Finance",
  },
  {
    Code: "KIN-USD",
    Name: "Kin",
  },
  {
    Code: "KIND-USD",
    Name: "Kind Ads Token",
  },
  {
    Code: "KING-USD",
    Name: "KingFund Finance",
  },
  {
    Code: "KIRO-USD",
    Name: "Kirobo",
  },
  {
    Code: "KISHU-USD",
    Name: "Kishu Inu",
  },
  {
    Code: "KIT-USD",
    Name: "DexKit",
  },
  {
    Code: "KIWI-USD",
    Name: "KIWI Token",
  },
  {
    Code: "KLAY-USD",
    Name: "Klaytn",
  },
  {
    Code: "KLIMA-USD",
    Name: "Klima DAO",
    Country: "Unknown",
    Exchange: "\u0421\u0421",
    Currency: "USD",
    Type: "Currency",
    Isin: null,
  },
  {
    Code: "KLKS-USD",
    Name: "Kalkulus",
  },
  {
    Code: "KLP-USD",
    Name: "Kulupu",
  },
  {
    Code: "KLV-USD",
    Name: "Klever",
  },
  {
    Code: "KMD-USD",
    Name: "Komodo",
  },
  {
    Code: "KMW-USD",
    Name: "Kepler Network",
  },
  {
    Code: "KNC-KYBER-USD",
    Name: "Kyber Network",
  },
  {
    Code: "KNC-USD",
    Name: "Kyber Network Crystal v2",
  },
  {
    Code: "KNDC-USD",
    Name: "KanadeCoin",
  },
  {
    Code: "KNT-USD",
    Name: "Knekted",
  },
  {
    Code: "KO-USD",
    Name: "Coca-Cola",
  },
  {
    Code: "Kobe-USD",
    Name: "Shabu Shabu",
  },
  {
    Code: "KOBO-USD",
    Name: "Kobocoin",
  },
  {
    Code: "KODX-USD",
    Name: "KING OF DEFI",
  },
  {
    Code: "KOIN-USD",
    Name: "Koinon",
  },
  {
    Code: "KOK-USD",
    Name: "KOK",
  },
  {
    Code: "KOMET-USD",
    Name: "Komet",
  },
  {
    Code: "KONJ-USD",
    Name: "KONJUNGATE",
  },
  {
    Code: "KOS-USD",
    Name: "?ukasz Kos Token",
  },
  {
    Code: "KP2R-USD",
    Name: "kp2r.network",
  },
  {
    Code: "KP3R-USD",
    Name: "Keep3rV1",
  },
  {
    Code: "KP3RB-USD",
    Name: "Keep3r BSC Network",
  },
  {
    Code: "KP4R-USD",
    Name: "Keep4r",
  },
  {
    Code: "KRB-USD",
    Name: "Karbo",
  },
  {
    Code: "KREX-USD",
    Name: "Kronn",
  },
  {
    Code: "KRL-USD",
    Name: "Kryll",
  },
  {
    Code: "KRN-USD",
    Name: "KRYZA Network",
  },
  {
    Code: "KRT-USD",
    Name: "TerraKRW",
  },
  {
    Code: "KSC-USD",
    Name: "KStarCoin",
  },
  {
    Code: "KSEED-USD",
    Name: "Kush Finance",
  },
  {
    Code: "KSM-USD",
    Name: "Kusama",
  },
  {
    Code: "KSP-USD",
    Name: "KlaySwap Protocol",
  },
  {
    Code: "KSS-USD",
    Name: "Krosscoin",
  },
  {
    Code: "KT-USD",
    Name: "Kuai Token",
  },
  {
    Code: "KTLYO-USD",
    Name: "Katalyo",
  },
  {
    Code: "KTON-USD",
    Name: "Darwinia Commitment Token",
  },
  {
    Code: "KTS-USD",
    Name: "Klimatas",
  },
  {
    Code: "KTT-USD",
    Name: "K-Tune",
  },
  {
    Code: "KTV-USD",
    Name: "Kmushicoin",
  },
  {
    Code: "KUJI-USD",
    Name: "Kujira",
  },
  {
    Code: "KUMA-USD",
    Name: "Kuma Inu",
  },
  {
    Code: "KURT-USD",
    Name: "Kurrent",
  },
  {
    Code: "KUSH-USD",
    Name: "KushCoin",
  },
  {
    Code: "KUV-USD",
    Name: "Kuverit",
  },
  {
    Code: "KVA-USD",
    Name: "Kevacoin",
  },
  {
    Code: "KWATT-USD",
    Name: "4NEW",
  },
  {
    Code: "KXC-USD",
    Name: "KingXChain",
  },
  {
    Code: "KYAN-USD",
    Name: "KYANITE",
  },
  {
    Code: "KYSC-USD",
    Name: "KYSC Token",
  },
  {
    Code: "KZC-USD",
    Name: "KZ Cash",
  },
  {
    Code: "L2-USD",
    Name: "Leverj Gluon",
  },
  {
    Code: "L2P-USD",
    Name: "Lung Protocol",
  },
  {
    Code: "LA-USD",
    Name: "LATOKEN",
  },
  {
    Code: "LAMB-USD",
    Name: "Lambda",
  },
  {
    Code: "LANA-USD",
    Name: "LanaCoin",
  },
  {
    Code: "LAR-USD",
    Name: "LinkArt",
  },
  {
    Code: "LAT-USD",
    Name: "PlatON Network",
  },
  {
    Code: "LATX-USD",
    Name: "LatiumX",
  },
  {
    Code: "LAVA-USD",
    Name: "Lava",
  },
  {
    Code: "LAYER-USD",
    Name: "UniLayer",
  },
  {
    Code: "LAZ-USD",
    Name: "Lazaruscoin",
  },
  {
    Code: "LAZIO-USD",
    Name: "Lazio Fan Token",
  },
  {
    Code: "LBA-USD",
    Name: "Cred",
  },
  {
    Code: "LBC-BTC",
    Name: "LBC/BTC - LBRY Credits Bitcoin",
    Country: "Unknown",
    Exchange: "CC",
    Currency: "NA",
    Type: "Currency",
    Isin: null,
  },
  {
    Code: "LBC-USD",
    Name: "LBRY Credits",
  },
  {
    Code: "LBET-USD",
    Name: "Lemon Bet",
  },
  {
    Code: "LBK-USD",
    Name: "Liberbank",
  },
  {
    Code: "LBRL-USD",
    Name: "LBRL",
  },
  {
    Code: "LBTC-USD",
    Name: "Lightning Bitcoin",
  },
  {
    Code: "LBXC-USD",
    Name: "LUX BIO EXCHANGE COIN",
  },
  {
    Code: "LBY-USD",
    Name: "Libocoin",
  },
  {
    Code: "LCC-USD",
    Name: "Litecoin Cash",
  },
  {
    Code: "LCG-USD",
    Name: "LCG",
  },
  {
    Code: "LCNT-USD",
    Name: "Lucent",
  },
  {
    Code: "LCP-USD",
    Name: "Litecoin Plus",
  },
  {
    Code: "LCS-USD",
    Name: "LocalCoinSwap",
  },
  {
    Code: "LCX-USD",
    Name: "LCX",
  },
  {
    Code: "LDN-USD",
    Name: "Ludena Protocol",
  },
  {
    Code: "LDO-USD",
    Name: "Leonardo SPA",
  },
  {
    Code: "LDOGE-USD",
    Name: "LiteDoge",
  },
  {
    Code: "LEA-USD",
    Name: "LeaCoin",
  },
  {
    Code: "LEAD-USD",
    Name: "Lead",
  },
  {
    Code: "LEAF-USD",
    Name: "Legal LEAF",
  },
  {
    Code: "LEDU-USD",
    Name: "Education Ecosystem",
  },
  {
    Code: "LEGALBLOCK-USD",
    Name: "LegalBlock",
  },
  {
    Code: "LEMO-USD",
    Name: "LemoChain",
  },
  {
    Code: "LEND-USD",
    Name: "ETHLend",
  },
  {
    Code: "LEO-USD",
    Name: "LEO Token",
  },
  {
    Code: "LEPEN-USD",
    Name: "LePen",
  },
  {
    Code: "LET-USD",
    Name: "LinkEye",
  },
  {
    Code: "LEVELG-USD",
    Name: "LEVELG",
  },
  {
    Code: "LFC-USD",
    Name: "Linfinity",
  },
  {
    Code: "LGCY-USD",
    Name: "LGCY Network",
  },
  {
    Code: "LHB-USD",
    Name: "Lendhub",
  },
  {
    Code: "LHT-USD",
    Name: "LHT",
  },
  {
    Code: "LIB-USD",
    Name: "Libera",
  },
  {
    Code: "LIBARTYSHARETOKEN-USD",
    Name: "Libartysharetoken",
  },
  {
    Code: "LIBFX-USD",
    Name: "Libfx",
  },
  {
    Code: "LIBREF-USD",
    Name: "LibreFreelencer",
  },
  {
    Code: "LIDER-USD",
    Name: "Lider Token",
  },
  {
    Code: "LIEN-USD",
    Name: "Lien",
  },
  {
    Code: "LIKE-USD",
    Name: "LikeCoin",
  },
  {
    Code: "LIMEX-USD",
    Name: "Limestone Network",
  },
  {
    Code: "LIMIT-USD",
    Name: "LimitSwap",
  },
  {
    Code: "LINA-USD",
    Name: "LINA",
  },
  {
    Code: "LINA1-USD",
    Name: "Linear",
  },
  {
    Code: "LINEAR-USD",
    Name: "Linear",
  },
  {
    Code: "LINK-USD",
    Name: "Chainlink",
  },
  {
    Code: "LINKA-USD",
    Name: "LINKA",
  },
  {
    Code: "LINKBEAR-USD",
    Name: "3X Short Chainlink Token",
  },
  {
    Code: "LINKBULL-USD",
    Name: "3X Long Chainlink Token",
  },
  {
    Code: "LINKDOWN-USD",
    Name: "LINKDOWN",
  },
  {
    Code: "LINKETHPA-USD",
    Name: "ETH/LINK Price Action Candlestick Set",
  },
  {
    Code: "LINKETHRSI-USD",
    Name: "LINK/ETH RSI Ratio Trading Set",
  },
  {
    Code: "LINKPT-USD",
    Name: "LINK Profit Taker Set",
  },
  {
    Code: "LINKTOKEN-USD",
    Name: "LinkToken",
  },
  {
    Code: "LINKUP-USD",
    Name: "LINKUP",
  },
  {
    Code: "LION-USD",
    Name: "Coin Lion",
  },
  {
    Code: "LIQUID-USD",
    Name: "Netkoin Liquid",
  },
  {
    Code: "LIR-USD",
    Name: "LetItRide",
  },
  {
    Code: "LIT-USD",
    Name: "Lition",
  },
  {
    Code: "LIT1-USD",
    Name: "Litentry",
  },
  {
    Code: "LITION-USD",
    Name: "Lition",
  },
  {
    Code: "LIVE-USD",
    Name: "Live Stars",
  },
  {
    Code: "LKC-USD",
    Name: "LinkedCoin",
  },
  {
    Code: "LKK-USD",
    Name: "Lykke",
  },
  {
    Code: "LKN-USD",
    Name: "LinkCoin Token",
  },
  {
    Code: "LKR-USD",
    Name: "LKRcoin",
  },
  {
    Code: "LMCH-USD",
    Name: "Latamcash",
  },
  {
    Code: "LML-USD",
    Name: "Lisk Machine Learning",
  },
  {
    Code: "LMY-USD",
    Name: "Lunch Money",
  },
  {
    Code: "LN-USD",
    Name: "LINK",
  },
  {
    Code: "LNC-USD",
    Name: "Linker Coin",
  },
  {
    Code: "LND-USD",
    Name: "Lendingblock",
  },
  {
    Code: "LNO-USD",
    Name: "Livenodes",
  },
  {
    Code: "LNOT-USD",
    Name: "Livenodes Token",
  },
  {
    Code: "LNT-USD",
    Name: "Lottonation",
  },
  {
    Code: "LOA-USD",
    Name: "LOA Protocol",
  },
  {
    Code: "LOBS-USD",
    Name: "Lobstex",
  },
  {
    Code: "LOC-USD",
    Name: "LockTrip",
  },
  {
    Code: "LOCK-USD",
    Name: "Contracto",
  },
  {
    Code: "LOG-USD",
    Name: "Woodcoin",
  },
  {
    Code: "LOKI-USD",
    Name: "Loki",
  },
  {
    Code: "LOL-USD",
    Name: "EMOGI Network",
  },
  {
    Code: "LON-USD",
    Name: "Tokenlon",
  },
  {
    Code: "LONG-USD",
    Name: "Long",
  },
  {
    Code: "LOOKS-USD",
    Name: "LooksRare",
  },
  {
    Code: "LOOM-USD",
    Name: "Loom Network",
  },
  {
    Code: "LOON-USD",
    Name: "Loon Network",
  },
  {
    Code: "LOOT-USD",
    Name: "NFTLootBox",
  },
  {
    Code: "LOP-USD",
    Name: "Kilopi",
  },
  {
    Code: "LOTO-USD",
    Name: "Lotoblock",
  },
  {
    Code: "LOTTO-USD",
    Name: "Lotto",
  },
  {
    Code: "LOV-USD",
    Name: "The LoveChain",
  },
  {
    Code: "LOVE-USD",
    Name: "LOVE Coin",
  },
  {
    Code: "LPOOL-USD",
    Name: "Launchpool",
  },
  {
    Code: "LPT-USD",
    Name: "Livepeer",
  },
  {
    Code: "LQD-USD",
    Name: "Liquidity Network",
  },
  {
    Code: "LQDR-USD",
    Name: "Liquid Driver",
  },
  {
    Code: "LQX-USD",
    Name: "LQX COIN",
  },
  {
    Code: "LRC-USD",
    Name: "Loopring",
  },
  {
    Code: "LRG-USD",
    Name: "Largo Coin",
  },
  {
    Code: "LRN-USD",
    Name: "Loopring [NEO]",
  },
  {
    Code: "LSK-BTC",
    Name: "LSK/BTC - Lisk Bitcoin",
    Country: "Unknown",
    Exchange: "CC",
    Currency: "NA",
    Type: "Currency",
    Isin: null,
  },
  {
    Code: "LSK-USD",
    Name: "Lisk",
  },
  {
    Code: "LSV-USD",
    Name: "Litecoin SV",
  },
  {
    Code: "LTB-USD",
    Name: "LiteBar",
  },
  {
    Code: "LTC-BTC",
    Name: "LTC/BTC - Litecoin Bitcoin",
    Country: "Unknown",
    Exchange: "CC",
    Currency: "NA",
    Type: "Currency",
    Isin: null,
  },
  {
    Code: "LTC-USD",
    Name: "Litecoin",
  },
  {
    Code: "LTCBEAR-USD",
    Name: "3x Short Litecoin Token",
  },
  {
    Code: "LTCBULL-USD",
    Name: "3x Long Litecoin Token",
  },
  {
    Code: "LTCDOWN-USD",
    Name: "LTCDOWN",
  },
  {
    Code: "LTCR-USD",
    Name: "Litecred",
  },
  {
    Code: "LTCU-USD",
    Name: "LiteCoin Ultra",
  },
  {
    Code: "LTCUP-USD",
    Name: "LTCUP",
  },
  {
    Code: "LTH-USD",
    Name: "LAthaan",
  },
  {
    Code: "LTHN-USD",
    Name: "Lethean",
  },
  {
    Code: "LTK-USD",
    Name: "Litecoin Token",
  },
  {
    Code: "LTO-USD",
    Name: "LTO Network",
  },
  {
    Code: "LTP-USD",
    Name: "LifetionCoin",
  },
  {
    Code: "LTX-USD",
    Name: "Lattice Token",
  },
  {
    Code: "LTZ-USD",
    Name: "LitecoinZ",
  },
  {
    Code: "LUA-USD",
    Name: "LuaSwap",
  },
  {
    Code: "LUCY-USD",
    Name: "Lucy Inu",
  },
  {
    Code: "LUD-USD",
    Name: "Ludos Protocol",
  },
  {
    Code: "LUN-USD",
    Name: "Lunyr",
  },
  {
    Code: "LUNA-COIN-USD",
    Name: "Luna Coin",
  },
  {
    Code: "LUNA-USD",
    Name: "Terra",
  },
  {
    Code: "LUNA1-USD",
    Name: "Terra",
  },
  {
    Code: "LUNES-USD",
    Name: "Lunes",
  },
  {
    Code: "LUX-USD",
    Name: "LUXCoin",
  },
  {
    Code: "LVH-USD",
    Name: "LoveHearts",
  },
  {
    Code: "LVL-USD",
    Name: "LevelApp Token",
  },
  {
    Code: "LX-USD",
    Name: "LexinFintech Holdings Ltd.",
  },
  {
    Code: "LXT-USD",
    Name: "Litex",
  },
  {
    Code: "LYFE-USD",
    Name: "Lyfe",
  },
  {
    Code: "LYFT-USD",
    Name: "LYFT",
  },
  {
    Code: "LYM-USD",
    Name: "Lympo",
  },
  {
    Code: "LYNC-USD",
    Name: "LYNC Network",
  },
  {
    Code: "LYNX-USD",
    Name: "Lynx",
  },
  {
    Code: "LYR-USD",
    Name: "Lyra",
  },
  {
    Code: "LYRA-USD",
    Name: "Scrypta",
  },
  {
    Code: "LYXe-USD",
    Name: "LUKSO Token",
  },
  {
    Code: "M-USD",
    Name: "Macys",
  },
  {
    Code: "MA-USD",
    Name: "Mastercard Inc",
  },
  {
    Code: "mAAPL-USD",
    Name: "Mirrored Apple",
  },
  {
    Code: "MAC-USD",
    Name: "Matrexcoin",
  },
  {
    Code: "MACD-USD",
    Name: "MACD Finance",
  },
  {
    Code: "MACH-USD",
    Name: "MACH Project",
  },
  {
    Code: "MAD-USD",
    Name: "SatoshiMadness",
  },
  {
    Code: "MAGIC-USD",
    Name: "Cosmic Universe Magic Token",
  },
  {
    Code: "MAHA-USD",
    Name: "MahaDAO",
  },
  {
    Code: "MAID-USD",
    Name: "MaidSafeCoin",
  },
  {
    Code: "mAMZN-USD",
    Name: "Mirrored Amazon",
  },
  {
    Code: "MAN-USD",
    Name: "Matrix AI Network",
  },
  {
    Code: "MANA-USD",
    Name: "Decentraland",
  },
  {
    Code: "MANDALA-EXCHANGE-TOKEN-USD",
    Name: "Mandala Exchange Token",
  },
  {
    Code: "MANDI-USD",
    Name: "Mandi Token",
  },
  {
    Code: "MANNA-USD",
    Name: "Manna",
  },
  {
    Code: "MAO-USD",
    Name: "Mao Zedong",
  },
  {
    Code: "MAP-USD",
    Name: "MAP Protocol",
  },
  {
    Code: "MAPR-USD",
    Name: "Maya Preferred 223",
  },
  {
    Code: "MAPS-USD",
    Name: "MAPS",
  },
  {
    Code: "MAR-USD",
    Name: "Mchain",
  },
  {
    Code: "MARK-USD",
    Name: "Benchmark Protocol",
  },
  {
    Code: "MARO-USD",
    Name: "Maro",
  },
  {
    Code: "MARSCOIN-USD",
    Name: "Marscoin",
  },
  {
    Code: "MARTK-USD",
    Name: "Martkist",
  },
  {
    Code: "MARX-USD",
    Name: "MarxCoin",
  },
  {
    Code: "MAS-USD",
    Name: "MidasProtocol",
  },
  {
    Code: "MASK-USD",
    Name: "Mask Network",
  },
  {
    Code: "MASQ-USD",
    Name: "MASQ",
  },
  {
    Code: "MASS-USD",
    Name: "MASS",
  },
  {
    Code: "MATH-USD",
    Name: "MATH",
  },
  {
    Code: "MATIC-USD",
    Name: "Matic Network",
  },
  {
    Code: "MATICBULL-USD",
    Name: "3X Long Matic Token",
  },
  {
    Code: "MATTER-USD",
    Name: "AntiMatter",
  },
  {
    Code: "MAVRO-USD",
    Name: "Mavro",
  },
  {
    Code: "MAX-EXCHANGE-TOKEN-USD",
    Name: "Maxcoin",
  },
  {
    Code: "MAX-USD",
    Name: "Maxcoin",
  },
  {
    Code: "MAY-USD",
    Name: "Theresa May Coin",
  },
  {
    Code: "MAZ-USD",
    Name: "Mazzuma",
  },
  {
    Code: "MAZA-USD",
    Name: "MAZA",
  },
  {
    Code: "MAZE-USD",
    Name: "NFT MAZE",
  },
  {
    Code: "MB-USD",
    Name: "MineBee",
  },
  {
    Code: "mBABA-USD",
    Name: "Mirrored Alibaba",
  },
  {
    Code: "MBC-USD",
    Name: "MicroBitcoin",
  },
  {
    Code: "MBL-USD",
    Name: "MovieBloc",
  },
  {
    Code: "MBN-USD",
    Name: "Membrana",
  },
  {
    Code: "MBOX-USD",
    Name: "Mobox",
  },
  {
    Code: "MBX-USD",
    Name: "MobiePay",
  },
  {
    Code: "MC-USD",
    Name: "Merit Circle",
  },
  {
    Code: "MCAN-USD",
    Name: "MedicanCoin",
  },
  {
    Code: "MCASH-USD",
    Name: "Mcashchain",
  },
  {
    Code: "MCB-USD",
    Name: "MCDEX",
  },
  {
    Code: "MCH-USD",
    Name: "mktcash",
  },
  {
    Code: "MCHP-USD",
    Name: "Microchip Technology Incorporated",
  },
  {
    Code: "MCI-USD",
    Name: "Musiconomi",
  },
  {
    Code: "MCL-USD",
    Name: "Marmara Credit Loops",
  },
  {
    Code: "MCLB-USD",
    Name: "MillenniumClub Coin",
  },
  {
    Code: "MCM-USD",
    Name: "Mochimo",
  },
  {
    Code: "MCOBIT-USD",
    Name: "MCOBIT",
  },
  {
    Code: "MCPC-USD",
    Name: "Mobile Crypto Pay Coin",
  },
  {
    Code: "MCRN-USD",
    Name: "MACRON",
  },
  {
    Code: "MCT-USD",
    Name: "Master Contract Token",
  },
  {
    Code: "MDA-USD",
    Name: "Moeda Loyalty Points",
  },
  {
    Code: "MDL-USD",
    Name: "MDL Talent Hub",
  },
  {
    Code: "MDM-USD",
    Name: "MEDIUM",
  },
  {
    Code: "MDO-USD",
    Name: "Midas Dollar",
  },
  {
    Code: "MDS-USD",
    Name: "MediShares",
  },
  {
    Code: "MDT-USD",
    Name: "Measurable Data Token",
  },
  {
    Code: "MDU-USD",
    Name: "MDUKEY",
  },
  {
    Code: "MDX-USD",
    Name: "Mdex",
  },
  {
    Code: "MDX1-USD",
    Name: "Mandala Exchange Token",
  },
  {
    Code: "MDZA-USD",
    Name: "MEDOOZA Ecosystem",
  },
  {
    Code: "ME-USD",
    Name: "All.me",
  },
  {
    Code: "MEC-USD",
    Name: "Megacoin",
  },
  {
    Code: "MED-USD",
    Name: "MediBloc",
  },
  {
    Code: "MEDI-USD",
    Name: "MediConnect",
  },
  {
    Code: "MEDIBIT-USD",
    Name: "MediBit",
  },
  {
    Code: "MEDIC-USD",
    Name: "MedicCoin",
  },
  {
    Code: "MEET-USD",
    Name: "CoinMeet",
  },
  {
    Code: "MEETONE-USD",
    Name: "MEET.ONE",
  },
  {
    Code: "MEGA-USD",
    Name: "MegaCryptoPolis",
  },
  {
    Code: "MEK-USD",
    Name: "Meraki",
  },
  {
    Code: "MEM-USD",
    Name: "Memecoin",
  },
  {
    Code: "MEMBRANA-USD",
    Name: "Membrana",
  },
  {
    Code: "MEME-USD",
    Name: "Memetic / PepeCoin",
  },
  {
    Code: "MEMETIC-USD",
    Name: "Memetic / PepeCoin",
  },
  {
    Code: "MEOW-USD",
    Name: "MoonKitties",
  },
  {
    Code: "MER-USD",
    Name: "Mercury",
  },
  {
    Code: "MERGE-USD",
    Name: "Merge",
  },
  {
    Code: "MERI-USD",
    Name: "Merebel",
  },
  {
    Code: "MES-USD",
    Name: "MesChain",
  },
  {
    Code: "MESH-USD",
    Name: "MeshBox",
  },
  {
    Code: "MET-USD",
    Name: "Metronome",
  },
  {
    Code: "META-USD",
    Name: "Metadium",
  },
  {
    Code: "METAL-USD",
    Name: "MetalCoin",
  },
  {
    Code: "METIS-USD",
    Name: "MetisDAO",
  },
  {
    Code: "METM-USD",
    Name: "MetaMorph",
  },
  {
    Code: "MEX-USD",
    Name: "MEX",
  },
  {
    Code: "MEXC-USD",
    Name: "MEXC Token",
  },
  {
    Code: "MFG-USD",
    Name: "SyncFab",
  },
  {
    Code: "MFT-USD",
    Name: "Mainframe",
  },
  {
    Code: "MGC-USD",
    Name: "MGC Token",
  },
  {
    Code: "MGO-USD",
    Name: "MobileGo",
  },
  {
    Code: "mGOOGL-USD",
    Name: "Mirrored Google",
  },
  {
    Code: "MHC-USD",
    Name: "#MetaHash",
  },
  {
    Code: "MHSP-USD",
    Name: "MelonHeadsProtocol",
  },
  {
    Code: "MIAMI-USD",
    Name: "MIAMI",
  },
  {
    Code: "mIAU-USD",
    Name: "Mirrored iShares Gold Trust",
  },
  {
    Code: "MIB-USD",
    Name: "MIB Coin",
  },
  {
    Code: "MIC-USD",
    Name: "Mindexcoin",
  },
  {
    Code: "MICRO-USD",
    Name: "Micromines",
  },
  {
    Code: "MIDAS-USD",
    Name: "Midas",
  },
  {
    Code: "MIDBULL-USD",
    Name: "3X Long Midcap Index Token",
  },
  {
    Code: "MIKS-USD",
    Name: "MIKS COIN",
  },
  {
    Code: "MIL-USD",
    Name: "Military Finance",
  },
  {
    Code: "MILEVERSE-USD",
    Name: "MileVerse",
  },
  {
    Code: "MILK2-USD",
    Name: "Milkyway Coin",
  },
  {
    Code: "MILO-USD",
    Name: "MiloCoin",
  },
  {
    Code: "MIM-USD",
    Name: "Magic Internet Money",
  },
  {
    Code: "MIN-USD",
    Name: "MINDOL",
  },
  {
    Code: "MINA-USD",
    Name: "Mina Protocol",
  },
  {
    Code: "MINE-USD",
    Name: "Pylon Protocol",
  },
  {
    Code: "MINI-USD",
    Name: "Mini",
  },
  {
    Code: "MINT-USD",
    Name: "MintCoin",
  },
  {
    Code: "MINTCOIN-USD",
    Name: "MintCoin",
  },
  {
    Code: "MINTME-USD",
    Name: "MintMe.com Coin",
  },
  {
    Code: "MIOTA-USD",
    Name: "IOTA",
  },
  {
    Code: "MIR-COIN-USD",
    Name: "MIR COIN",
  },
  {
    Code: "MIR-USD",
    Name: "MIR COIN",
  },
  {
    Code: "MIRROR-USD",
    Name: "Mirror Protocol",
  },
  {
    Code: "MIS-USD",
    Name: "Mithril Share",
  },
  {
    Code: "MITH-USD",
    Name: "Mithril",
  },
  {
    Code: "MITX-USD",
    Name: "Morpheus Labs",
  },
  {
    Code: "MIX-USD",
    Name: "MixMarvel",
  },
  {
    Code: "MIXTRUST-USD",
    Name: "MixTrust",
  },
  {
    Code: "MJ-USD",
    Name: "ETFMG Alternative Harvest ETF",
  },
  {
    Code: "MKCY-USD",
    Name: "Markaccy",
  },
  {
    Code: "MKR-USD",
    Name: "Maker",
  },
  {
    Code: "MLGC-USD",
    Name: "Marshal Lion Group Coin",
  },
  {
    Code: "MLK-USD",
    Name: "MiL.k Alliance",
  },
  {
    Code: "MLM-USD",
    Name: "MktCoin",
  },
  {
    Code: "MLN-USD",
    Name: "Melon",
  },
  {
    Code: "MLR-USD",
    Name: "Mega Lottery Services Global",
  },
  {
    Code: "MM-TOKEN-USD",
    Name: "MMToken",
  },
  {
    Code: "MM-USD",
    Name: "MMToken",
  },
  {
    Code: "MMO-USD",
    Name: "MMOCoin",
  },
  {
    Code: "mMSFT-USD",
    Name: "Mirrored Microsoft",
  },
  {
    Code: "MMT-USD",
    Name: "Mamo Coin",
  },
  {
    Code: "MMXVI-USD",
    Name: "MMXVI",
  },
  {
    Code: "MNC-USD",
    Name: "Maincoin",
  },
  {
    Code: "MND-USD",
    Name: "MindCoin",
  },
  {
    Code: "MNE-USD",
    Name: "Minereum",
  },
  {
    Code: "mNFLX-USD",
    Name: "Mirrored Netflix",
  },
  {
    Code: "MNG-USD",
    Name: "Mangocoin",
  },
  {
    Code: "MNM-USD",
    Name: "Mineum",
  },
  {
    Code: "MNP-USD",
    Name: "MNPCoin",
  },
  {
    Code: "MNR-USD",
    Name: "Mineral",
  },
  {
    Code: "MNS-USD",
    Name: "Monnos",
  },
  {
    Code: "MNTIS-USD",
    Name: "Mantis Network",
  },
  {
    Code: "MNTP-USD",
    Name: "GoldMint",
  },
  {
    Code: "MOB-USD",
    Name: "MobileCoin",
  },
  {
    Code: "MOBI-USD",
    Name: "Mobius",
  },
  {
    Code: "MOC-USD",
    Name: "Moss Coin",
  },
  {
    Code: "MODEX-USD",
    Name: "Modex",
  },
  {
    Code: "MODIC-USD",
    Name: "Modern Investment Coin",
  },
  {
    Code: "MODX-USD",
    Name: "MODEL-X-coin",
  },
  {
    Code: "MOF-USD",
    Name: "Molecular Future",
  },
  {
    Code: "MOGX-USD",
    Name: "Mogu",
  },
  {
    Code: "MOJO-USD",
    Name: "MojoCoin",
  },
  {
    Code: "MOLK-USD",
    Name: "MobilinkToken",
  },
  {
    Code: "MOMO-USD",
    Name: "Momo Inc.",
  },
  {
    Code: "MON-USD",
    Name: "MoneyByte",
  },
  {
    Code: "MONA-USD",
    Name: "MonaCoin",
  },
  {
    Code: "MONAVALE-USD",
    Name: "Monavale",
  },
  {
    Code: "MONETA-USD",
    Name: "Moneta",
  },
  {
    Code: "MONEYNET-USD",
    Name: "Moneynet",
  },
  {
    Code: "MONK-USD",
    Name: "Monkey Project",
  },
  {
    Code: "MOONDAY-USD",
    Name: "Moonday Finance",
  },
  {
    Code: "MOONS-USD",
    Name: "MoonTools",
  },
  {
    Code: "MORE-USD",
    Name: "More Coin",
  },
  {
    Code: "MORPHER-USD",
    Name: "Morpher",
  },
  {
    Code: "MOTA-USD",
    Name: "MotaCoin",
  },
  {
    Code: "MOTO-USD",
    Name: "Motocoin",
  },
  {
    Code: "MOUSE-USD",
    Name: "MouseMN",
  },
  {
    Code: "MOV-USD",
    Name: "MOTIV Protocol",
  },
  {
    Code: "MOVR-USD",
    Name: "Moonriver",
  },
  {
    Code: "MP3-USD",
    Name: "MP3",
  },
  {
    Code: "MP4-USD",
    Name: "MP4",
  },
  {
    Code: "MPG-USD",
    Name: "Max Property Group",
  },
  {
    Code: "MPH-USD",
    Name: "Chasyr Token",
  },
  {
    Code: "MPWR-USD",
    Name: "Empower Network",
  },
  {
    Code: "MQL-USD",
    Name: "MiraQle",
  },
  {
    Code: "mQQQ-USD",
    Name: "Mirrored Invesco QQQ Trust",
  },
  {
    Code: "MRK-USD",
    Name: "Merck & Co Inc",
  },
  {
    Code: "MRNA-USD",
    Name: "Moderna",
  },
  {
    Code: "MRPH-USD",
    Name: "Morpheus Network",
  },
  {
    Code: "MRVL-USD",
    Name: "Marvell Technology Group Ltd.",
  },
  {
    Code: "MRX-USD",
    Name: "Metrix",
  },
  {
    Code: "MSB-USD",
    Name: "Misbloc",
  },
  {
    Code: "MSFT-USD",
    Name: "Microsoft",
  },
  {
    Code: "mSLV-USD",
    Name: "Mirrored iShares Silver Trust",
  },
  {
    Code: "MSP-USD",
    Name: "Mothership",
  },
  {
    Code: "MSR-USD",
    Name: "Masari",
  },
  {
    Code: "MSS-USD",
    Name: "Monster Slayer Share",
  },
  {
    Code: "MST-USD",
    Name: "MustangCoin",
  },
  {
    Code: "MSTR-USD",
    Name: "MicroStrategy tokenized stock FTX",
  },
  {
    Code: "MSWAP-USD",
    Name: "MoneySwap",
  },
  {
    Code: "MT-USD",
    Name: "MyToken",
  },
  {
    Code: "MTA-USD",
    Name: "Meta",
  },
  {
    Code: "MTC-USD",
    Name: "doc.com Token",
  },
  {
    Code: "MTCH-USD",
    Name: "Match Group Inc.",
  },
  {
    Code: "MTH-USD",
    Name: "Monetha",
  },
  {
    Code: "MTI-USD",
    Name: "MTI Finance",
  },
  {
    Code: "MTL-USD",
    Name: "Metal",
  },
  {
    Code: "MTLMC3-USD",
    Name: "Metal Music Coin",
  },
  {
    Code: "MTLX-USD",
    Name: "Mettalex",
  },
  {
    Code: "MTN-USD",
    Name: "Medicalchain",
  },
  {
    Code: "MTR-USD",
    Name: "MoonstaRevenge Token",
  },
  {
    Code: "MTRG-USD",
    Name: "Meter Governance",
  },
  {
    Code: "MTS-USD",
    Name: "Metis",
  },
  {
    Code: "mTSLA-USD",
    Name: "Mirrored Tesla",
  },
  {
    Code: "MTV-USD",
    Name: "MultiVAC",
  },
  {
    Code: "mTWTR-USD",
    Name: "Mirrored Twitter",
  },
  {
    Code: "MTX-USD",
    Name: "Matryx",
  },
  {
    Code: "MU-USD",
    Name: "Micron Technology Inc.",
  },
  {
    Code: "MUE-USD",
    Name: "MonetaryUnit",
  },
  {
    Code: "MULTI-USD",
    Name: "Multichain",
  },
  {
    Code: "MUSD-USD",
    Name: "MASTER USD",
  },
  {
    Code: "MUSE-USD",
    Name: "Muse",
  },
  {
    Code: "MUSK-USD",
    Name: "Musk",
  },
  {
    Code: "mUSO-USD",
    Name: "MUSO Finance",
  },
  {
    Code: "MUST-USD",
    Name: "Must",
  },
  {
    Code: "MVEDA-USD",
    Name: "MedicalVeda",
  },
  {
    Code: "mVIXY-USD",
    Name: "Mirrored ProShares VIX",
  },
  {
    Code: "MVL-USD",
    Name: "MVL",
  },
  {
    Code: "MVP-USD",
    Name: "Merculet",
  },
  {
    Code: "MW-USD",
    Name: "Masterwin",
  },
  {
    Code: "MWAT-USD",
    Name: "Restart Energy MWAT",
  },
  {
    Code: "MWC-USD",
    Name: "Mimble Wimble Coin",
  },
  {
    Code: "MX-USD",
    Name: "MX Token",
  },
  {
    Code: "MXC-USD",
    Name: "Machine Xchange Coin",
  },
  {
    Code: "MXT-USD",
    Name: "MarteXcoin",
  },
  {
    Code: "MXW-USD",
    Name: "Maxonrow",
  },
  {
    Code: "MXX-USD",
    Name: "Multiplier",
  },
  {
    Code: "MYST-USD",
    Name: "Mysterium",
  },
  {
    Code: "MYX-USD",
    Name: "MYX Network",
  },
  {
    Code: "MZK-USD",
    Name: "Muzika",
  },
  {
    Code: "N0001-USD",
    Name: "nHBTC",
  },
  {
    Code: "N3RDz-USD",
    Name: "N3RD Finance",
  },
  {
    Code: "N808-USD",
    Name: "New808coin",
  },
  {
    Code: "NAH-USD",
    Name: "Strayacoin",
  },
  {
    Code: "NAME-CHANGING-TOKEN-USD",
    Name: "Name Changing Token",
  },
  {
    Code: "NAMI-USD",
    Name: "Nami Inu",
  },
  {
    Code: "NAN-USD",
    Name: "NanTrade",
  },
  {
    Code: "NANJ-USD",
    Name: "NANJCOIN",
  },
  {
    Code: "NANO-USD",
    Name: "Nano",
  },
  {
    Code: "NANOX-USD",
    Name: "Project-X",
  },
  {
    Code: "NAS-USD",
    Name: "Nebulas",
  },
  {
    Code: "NASH-USD",
    Name: "NeoWorld Cash",
  },
  {
    Code: "NAUT-USD",
    Name: "Astronaut",
  },
  {
    Code: "NAV-USD",
    Name: "NavCoin",
  },
  {
    Code: "NAVI-USD",
    Name: "Naviaddress",
  },
  {
    Code: "NAX-USD",
    Name: "NextDAO",
  },
  {
    Code: "NBC-USD",
    Name: "Niobium Coin",
  },
  {
    Code: "NBIT-USD",
    Name: "netBit",
  },
  {
    Code: "NBOT-USD",
    Name: "Naka Bodhi Token",
  },
  {
    Code: "NBR-USD",
    Name: "Niobio Cash",
  },
  {
    Code: "NBS-USD",
    Name: "New BitShares",
  },
  {
    Code: "NBT-USD",
    Name: "NIX Bridge Token",
  },
  {
    Code: "NBX-USD",
    Name: "Netbox Coin",
  },
  {
    Code: "NBXC-USD",
    Name: "Nibble",
  },
  {
    Code: "NCASH-USD",
    Name: "Nucleus Vision",
  },
  {
    Code: "NCC-USD",
    Name: "NeuroChain",
  },
  {
    Code: "NCDT-USD",
    Name: "Nuco.cloud",
  },
  {
    Code: "NCLH-USD",
    Name: "Norwegian Cruise Line Holdings Ltd.",
  },
  {
    Code: "NCP-USD",
    Name: "Newton Coin Project",
  },
  {
    Code: "NCT-USD",
    Name: "PolySwarm",
  },
  {
    Code: "NDAU-USD",
    Name: "Ndau",
  },
  {
    Code: "NDN-USD",
    Name: "NDN Link",
  },
  {
    Code: "NDR-USD",
    Name: "Node Runners",
  },
  {
    Code: "NDX-USD",
    Name: "nDEX",
  },
  {
    Code: "NEAR-USD",
    Name: "Near Protocol",
  },
  {
    Code: "NEBL-USD",
    Name: "Neblio",
  },
  {
    Code: "NEBO-USD",
    Name: "CSP DAO",
  },
  {
    Code: "NEC-USD",
    Name: "Nectar",
  },
  {
    Code: "NEE-USD",
    Name: "Nextera Energy",
  },
  {
    Code: "NEM-USD",
    Name: "Newmont Mining",
  },
  {
    Code: "NEO-BTC",
    Name: "NEO/BTC - Neo Bitcoin",
    Country: "Unknown",
    Exchange: "CC",
    Currency: "NA",
    Type: "Currency",
    Isin: null,
  },
  {
    Code: "NEO-USD",
    Name: "NEO",
  },
  {
    Code: "NEST-USD",
    Name: "Nest Protocol",
  },
  {
    Code: "NESTEGG-COIN-USD",
    Name: "NestEGG Coin",
  },
  {
    Code: "NESTREE-USD",
    Name: "Nestree",
  },
  {
    Code: "NETFLIX-TOKENIZED-STOCK-BITTREX-USD",
    Name: "Netflix tokenized stock Bittrex",
  },
  {
    Code: "NETKO-USD",
    Name: "Netko",
  },
  {
    Code: "NETKOIN-USD",
    Name: "Netkoin",
  },
  {
    Code: "NEU-USD",
    Name: "Neumark",
  },
  {
    Code: "NEVA-USD",
    Name: "NevaCoin",
  },
  {
    Code: "NEW-USD",
    Name: "Newton",
  },
  {
    Code: "NEX-USD",
    Name: "Nash Exchange",
  },
  {
    Code: "NEXO-USD",
    Name: "Nexo",
  },
  {
    Code: "NFD-USD",
    Name: "Feisty Doge NFT",
  },
  {
    Code: "NFLX-USD",
    Name: "Netflix",
  },
  {
    Code: "NFT-USD",
    Name: "NFT Smart Coin",
  },
  {
    Code: "NFTX-HASHMASKS-INDEX-USD",
    Name: "NFTX",
  },
  {
    Code: "NFTX-USD",
    Name: "NFTX",
  },
  {
    Code: "NFUP-USD",
    Name: "Natural Farm Union Protocol",
  },
  {
    Code: "NFXC-USD",
    Name: "NFX Coin",
  },
  {
    Code: "NFY-USD",
    Name: "Non-Fungible Yearn",
  },
  {
    Code: "NGC-USD",
    Name: "NAGA",
  },
  {
    Code: "NGM-USD",
    Name: "e-Money",
  },
  {
    Code: "NIA-USD",
    Name: "Nydronia",
  },
  {
    Code: "NIF-USD",
    Name: "Unifty",
  },
  {
    Code: "NII-USD",
    Name: "NIi",
  },
  {
    Code: "NILU-USD",
    Name: "Nilu",
  },
  {
    Code: "NIM-USD",
    Name: "Nimiq",
  },
  {
    Code: "NINJA-USD",
    Name: "Ninjacoin",
  },
  {
    Code: "NIO-USD",
    Name: "NIO Limited",
  },
  {
    Code: "NKA-USD",
    Name: "IncaKoin",
  },
  {
    Code: "NKE-USD",
    Name: "NIKE Inc",
  },
  {
    Code: "NKN-USD",
    Name: "NKN",
  },
  {
    Code: "NKTR-USD",
    Name: "Nektar Therapeutics",
  },
  {
    Code: "NLC2-USD",
    Name: "NoLimitCoin",
  },
  {
    Code: "NLG-USD",
    Name: "Gulden",
  },
  {
    Code: "NLX-USD",
    Name: "Nullex",
  },
  {
    Code: "NMC-USD",
    Name: "Namecoin",
  },
  {
    Code: "NMR-USD",
    Name: "Numeraire",
  },
  {
    Code: "NOBT-USD",
    Name: "Nobt",
  },
  {
    Code: "NODE-USD",
    Name: "Whole Network",
  },
  {
    Code: "NOIA-USD",
    Name: "NOIA Network",
  },
  {
    Code: "NOIA1-USD",
    Name: "Syntropy",
  },
  {
    Code: "NOKN-USD",
    Name: "Nokencoin",
  },
  {
    Code: "NOR-USD",
    Name: "Noir",
  },
  {
    Code: "NORD-USD",
    Name: "Nord Finance",
  },
  {
    Code: "NOS-USD",
    Name: "nOS",
  },
  {
    Code: "NOTE-USD",
    Name: "DNotes",
  },
  {
    Code: "NOVA-USD",
    Name: "NOVA",
  },
  {
    Code: "NOW-USD",
    Name: "NOW Token",
  },
  {
    Code: "NPC-USD",
    Name: "NPCoin",
  },
  {
    Code: "NPLC-USD",
    Name: "Plus-Coin",
  },
  {
    Code: "NPXS-USD",
    Name: "Pundi X",
  },
  {
    Code: "NPXSXEM-USD",
    Name: "Pundi X NEM",
  },
  {
    Code: "NRG-USD",
    Name: "Energi",
  },
  {
    Code: "NRP-USD",
    Name: "Neural Protocol",
  },
  {
    Code: "NSBT-USD",
    Name: "Neutrino System Base Token",
  },
  {
    Code: "NSD-USD",
    Name: "Nasdacoin",
  },
  {
    Code: "NSR-USD",
    Name: "NuShares",
  },
  {
    Code: "NST-USD",
    Name: "Newsolution",
  },
  {
    Code: "NSURE-USD",
    Name: "Nsure.Network",
  },
  {
    Code: "NTB-USD",
    Name: "TokenAsset",
  },
  {
    Code: "NTES-USD",
    Name: "NetEase Inc.",
  },
  {
    Code: "NTK-USD",
    Name: "NetKoin",
  },
  {
    Code: "NTM-USD",
    Name: "NetM",
  },
  {
    Code: "NTR-USD",
    Name: "Netrum",
  },
  {
    Code: "NTRN-USD",
    Name: "Neutron",
  },
  {
    Code: "NTX-USD",
    Name: "NuNet",
  },
  {
    Code: "NU-USD",
    Name: "NuCypher",
  },
  {
    Code: "NUG-USD",
    Name: "Nuggets",
  },
  {
    Code: "NUKO-USD",
    Name: "Nekonium",
  },
  {
    Code: "NULS-USD",
    Name: "NULS",
  },
  {
    Code: "NUT-USD",
    Name: "NUT",
  },
  {
    Code: "NUTS-USD",
    Name: "Squirrel Finance",
  },
  {
    Code: "NUX-USD",
    Name: "Peanut",
  },
  {
    Code: "NVA-USD",
    Name: "Neeva Defi",
  },
  {
    Code: "NVC-USD",
    Name: "Novacoin",
  },
  {
    Code: "NVDA-USD",
    Name: "NVIDIA",
  },
  {
    Code: "NVT-USD",
    Name: "NerveNetwork",
  },
  {
    Code: "NWC-USD",
    Name: "Newscrypto.io",
  },
  {
    Code: "NXM-USD",
    Name: "NXM",
  },
  {
    Code: "NXS-USD",
    Name: "Nexus",
  },
  {
    Code: "NXT-BTC",
    Name: "NXT/BTC - Nxt Bitcoin",
    Country: "Unknown",
    Exchange: "CC",
    Currency: "NA",
    Type: "Currency",
    Isin: null,
  },
  {
    Code: "NXT-USD",
    Name: "Nxt",
  },
  {
    Code: "NYAN-2-USD",
    Name: "Nyancoin",
  },
  {
    Code: "NYC-USD",
    Name: "NewYorkCoin",
  },
  {
    Code: "NYE-USD",
    Name: "NewYork Exchange",
  },
  {
    Code: "NYEX-USD",
    Name: "Nyerium",
  },
  {
    Code: "NYZO-USD",
    Name: "Nyzo",
  },
  {
    Code: "NZD-USD",
    Name: "New Zealand Dollar Token",
  },
  {
    Code: "NZL-USD",
    Name: "Zealium",
  },
  {
    Code: "OBIC-USD",
    Name: "OBIC",
  },
  {
    Code: "OBSR-USD",
    Name: "Observer",
  },
  {
    Code: "OBTC-USD",
    Name: "Obitan Chain",
  },
  {
    Code: "OCB-USD",
    Name: "BLOCKMAX",
  },
  {
    Code: "OCC-USD",
    Name: "Octoin Coin",
  },
  {
    Code: "OCE-USD",
    Name: "OceanEx Token",
  },
  {
    Code: "OCEAN-USD",
    Name: "Ocean Protocol",
  },
  {
    Code: "OCFT-USD",
    Name: "OneConnect",
  },
  {
    Code: "OCN-USD",
    Name: "Odyssey",
  },
  {
    Code: "OCOW-USD",
    Name: "OCOW",
  },
  {
    Code: "OCP-USD",
    Name: "OC Protocol",
  },
  {
    Code: "OCT-USD",
    Name: "OracleChain",
  },
  {
    Code: "OCTO-USD",
    Name: "OctoFi",
  },
  {
    Code: "ODEM-USD",
    Name: "ODEM",
  },
  {
    Code: "ODEX-USD",
    Name: "One DEX",
  },
  {
    Code: "OG-USD",
    Name: "OG Fan Token",
  },
  {
    Code: "OGN-USD",
    Name: "Origin Protocol",
  },
  {
    Code: "OGO-USD",
    Name: "Origo",
  },
  {
    Code: "OGZD-USD",
    Name: "Gazprom PJSC ADR",
  },
  {
    Code: "OIKOS-USD",
    Name: "Oikos",
  },
  {
    Code: "OIN-USD",
    Name: "OIN Finance",
  },
  {
    Code: "OK-USD",
    Name: "OKCash",
  },
  {
    Code: "OKB-USD",
    Name: "OKB",
  },
  {
    Code: "OKBBULL-USD",
    Name: "3X Long OKB Token",
  },
  {
    Code: "OKT-USD",
    Name: "OKExChain",
  },
  {
    Code: "OLT-USD",
    Name: "OneLedger",
  },
  {
    Code: "OLY-USD",
    Name: "Olyseum",
  },
  {
    Code: "OM-USD",
    Name: "MANTRA DAO",
  },
  {
    Code: "OMC-USD",
    Name: "Omicron",
  },
  {
    Code: "OMEGA-USD",
    Name: "OMEGA",
  },
  {
    Code: "OMG-BTC",
    Name: "OMG/BTC - OMG Network Bitcoin",
    Country: "Unknown",
    Exchange: "CC",
    Currency: "NA",
    Type: "Currency",
    Isin: null,
  },
  {
    Code: "OMG-USD",
    Name: "OmiseGO",
  },
  {
    Code: "OMI-USD",
    Name: "Ecomi",
  },
  {
    Code: "OMNI-USD",
    Name: "Omni",
  },
  {
    Code: "ON-USD",
    Name: "OFIN Token",
  },
  {
    Code: "ONC-USD",
    Name: "One Cash",
  },
  {
    Code: "ONE-USD",
    Name: "Harmony",
  },
  {
    Code: "ONES-USD",
    Name: "OneSwap DAO Token",
  },
  {
    Code: "ONG-USD",
    Name: "Ontology Gas",
  },
  {
    Code: "ONG1-USD",
    Name: "SoMee.Social",
  },
  {
    Code: "ONION-USD",
    Name: "DeepOnion",
  },
  {
    Code: "onLEXpa-USD",
    Name: "onLEXpa Token",
  },
  {
    Code: "ONS-USD",
    Name: "One Share",
  },
  {
    Code: "ONT-USD",
    Name: "Ontology",
  },
  {
    Code: "ONTOLOGY-GAS-USD",
    Name: "Ontology Gas",
  },
  {
    Code: "ONX-FINANCE-USD",
    Name: "Onix",
  },
  {
    Code: "ONX-USD",
    Name: "Onix",
  },
  {
    Code: "OOKI-USD",
    Name: "Ooki Protocol",
  },
  {
    Code: "OP-USD",
    Name: "Operand",
  },
  {
    Code: "OPAL-USD",
    Name: "Opal",
  },
  {
    Code: "OPCT-USD",
    Name: "Opacity",
  },
  {
    Code: "OPEN-PLATFORM-USD",
    Name: "OPEN Governance Token",
  },
  {
    Code: "OPEN-USD",
    Name: "OPEN Governance Token",
  },
  {
    Code: "OPENC-USD",
    Name: "Open Platform",
  },
  {
    Code: "OPES-USD",
    Name: "Opescoin",
  },
  {
    Code: "OPIUM-USD",
    Name: "Opium",
  },
  {
    Code: "OPM-USD",
    Name: "Omega Protocol Money",
  },
  {
    Code: "OPNN-USD",
    Name: "Opennity",
  },
  {
    Code: "OPT-USD",
    Name: "Opus",
  },
  {
    Code: "OPUS-USD",
    Name: "Opus",
  },
  {
    Code: "ORACLE-SYSTEM-USD",
    Name: "Oracle System",
  },
  {
    Code: "ORACOLXOR-USD",
    Name: "Oracolxor",
  },
  {
    Code: "ORAI-USD",
    Name: "Oraichain Token",
  },
  {
    Code: "ORB-USD",
    Name: "Orbitcoin",
  },
  {
    Code: "ORBS-USD",
    Name: "Orbs",
  },
  {
    Code: "ORBYT-USD",
    Name: "ORBYT Token",
  },
  {
    Code: "ORC-USD",
    Name: "Oracle System",
  },
  {
    Code: "ORCL-USD",
    Name: "Oracle",
  },
  {
    Code: "ORE-USD",
    Name: "Galactrum",
  },
  {
    Code: "ORION-USD",
    Name: "Orion Finance",
  },
  {
    Code: "ORLY-USD",
    Name: "Orlycoin",
  },
  {
    Code: "ORN-USD",
    Name: "Orion Protocol",
  },
  {
    Code: "ORO-USD",
    Name: "ORO",
  },
  {
    Code: "OS76-USD",
    Name: "OsmiumCoin",
  },
  {
    Code: "OSB-USD",
    Name: "OASISBloc",
  },
  {
    Code: "OSC-USD",
    Name: "OasisCity",
  },
  {
    Code: "OSMO-USD",
    Name: "Osmosis",
  },
  {
    Code: "OST-USD",
    Name: "OST",
  },
  {
    Code: "OSTK-USD",
    Name: "Overstock.com Inc.",
  },
  {
    Code: "OTB-USD",
    Name: "OTCBTC Token",
  },
  {
    Code: "OTN-USD",
    Name: "Open Trading Network",
  },
  {
    Code: "OTO-USD",
    Name: "OTOCASH",
  },
  {
    Code: "OUSD-USD",
    Name: "Origin Dollar",
  },
  {
    Code: "OVR-USD",
    Name: "Ovr",
  },
  {
    Code: "OWC-USD",
    Name: "ODUWA",
  },
  {
    Code: "OWL-TOKEN-STEALTHSWAP-USD",
    Name: "OWL",
  },
  {
    Code: "OWL-USD",
    Name: "OWL",
  },
  {
    Code: "OWN-USD",
    Name: "OWNDATA",
  },
  {
    Code: "OWO-USD",
    Name: "Oneworld",
  },
  {
    Code: "OXT-USD",
    Name: "Orchid Protocol",
  },
  {
    Code: "P7C-USD",
    Name: "P7Coin",
  },
  {
    Code: "PAC-USD",
    Name: "PAC Global",
  },
  {
    Code: "PAI-USD",
    Name: "Project Pai",
  },
  {
    Code: "PAID-USD",
    Name: "PAID Network",
  },
  {
    Code: "PAISA-USD",
    Name: "PAISACOIN",
  },
  {
    Code: "PAK-USD",
    Name: "Pakcoin",
  },
  {
    Code: "PAMP-USD",
    Name: "PAMP Network",
  },
  {
    Code: "PAN-USD",
    Name: "PANTOS",
  },
  {
    Code: "PAND-USD",
    Name: "Panda.finance",
  },
  {
    Code: "PAR-USD",
    Name: "Parachute",
  },
  {
    Code: "PART-USD",
    Name: "Particl",
  },
  {
    Code: "PARTY-USD",
    Name: "MONEY PARTY",
  },
  {
    Code: "PASC-USD",
    Name: "Pascal",
  },
  {
    Code: "PASS-USD",
    Name: "Blockpass",
  },
  {
    Code: "PAT-USD",
    Name: "Patron",
  },
  {
    Code: "PAX-USD",
    Name: "Paxos Standard Token",
  },
  {
    Code: "PAXEX-USD",
    Name: "PAXEX",
  },
  {
    Code: "PAXG-USD",
    Name: "PAX Gold",
  },
  {
    Code: "PAY-USD",
    Name: "TenX",
  },
  {
    Code: "PAYP-USD",
    Name: "PayPeer",
  },
  {
    Code: "PAYT-USD",
    Name: "PayAccept",
  },
  {
    Code: "PBF-USD",
    Name: "Pbf Energy Cl A",
  },
  {
    Code: "PBR-USD",
    Name: "Petroleo Brasileiro SA",
  },
  {
    Code: "PBT-USD",
    Name: "Primalbase Token",
  },
  {
    Code: "PBTC-USD",
    Name: "pTokens BTC",
  },
  {
    Code: "pBTC35A-USD",
    Name: "pBTC35A",
  },
  {
    Code: "PBTT-USD",
    Name: "Purple Butterfly Trading",
  },
  {
    Code: "PC-USD",
    Name: "Promotion Coin",
  },
  {
    Code: "PCI-USD",
    Name: "PayProtocol Paycoin",
  },
  {
    Code: "PCL-USD",
    Name: "Peculium",
  },
  {
    Code: "PCN-USD",
    Name: "PeepCoin",
  },
  {
    Code: "PCX-USD",
    Name: "ChainX",
  },
  {
    Code: "PEAK-USD",
    Name: "MarketPeak",
  },
  {
    Code: "PEARL-USD",
    Name: "Pearl Finance",
  },
  {
    Code: "PEC-USD",
    Name: "Poverty Eradication Coin",
  },
  {
    Code: "PEG-USD",
    Name: "PegNet",
  },
  {
    Code: "PENTA-USD",
    Name: "Penta",
  },
  {
    Code: "PEPS-USD",
    Name: "PEPS Coin",
  },
  {
    Code: "PERL-USD",
    Name: "Perlin",
  },
  {
    Code: "PERP-USD",
    Name: "Perpetual Protocol",
  },
  {
    Code: "PERX-USD",
    Name: "PeerEx",
  },
  {
    Code: "PEX-USD",
    Name: "PosEx",
  },
  {
    Code: "PFE-USD",
    Name: "Pfizer Inc",
  },
  {
    Code: "PFI-USD",
    Name: "Protocol Finance",
  },
  {
    Code: "PFID-USD",
    Name: "Pofid Dao",
  },
  {
    Code: "PFIZER-TOKENIZED-STOCK-FTX-USD",
    Name: "Pfizer tokenized stock FTX",
  },
  {
    Code: "PFR-USD",
    Name: "Payfair",
  },
  {
    Code: "PGN-USD",
    Name: "Pigeoncoin",
  },
  {
    Code: "PGO-USD",
    Name: "PengolinCoin",
  },
  {
    Code: "PGT-USD",
    Name: "Polyient Games Governance Token",
  },
  {
    Code: "PHA-USD",
    Name: "Phala Network",
  },
  {
    Code: "PHB-USD",
    Name: "Red Pulse Phoenix",
  },
  {
    Code: "PHC-USD",
    Name: "Phuket Holiday Coin",
  },
  {
    Code: "PHILIPS-PAY-COIN-USD",
    Name: "PHILLIPS PAY COIN",
  },
  {
    Code: "PHL-USD",
    Name: "placeh",
  },
  {
    Code: "PHNX-USD",
    Name: "PhoenixDAO",
  },
  {
    Code: "PHONEUM-USD",
    Name: "Phoneum",
  },
  {
    Code: "PHOSWAP-USD",
    Name: "Phoswap",
  },
  {
    Code: "PHR-USD",
    Name: "Phore",
  },
  {
    Code: "PHS-USD",
    Name: "Philosopher Stones",
  },
  {
    Code: "PHT-USD",
    Name: "Phoneum",
  },
  {
    Code: "PI-USD",
    Name: "PCHAIN",
  },
  {
    Code: "PIB-USD",
    Name: "PIBBLE",
  },
  {
    Code: "PICA-USD",
    Name: "PicaArtMoney",
  },
  {
    Code: "PICKLE-USD",
    Name: "Pickle Finance",
  },
  {
    Code: "PIE-USD",
    Name: "PIECoin",
  },
  {
    Code: "PIG-USD",
    Name: "Pig Finance",
  },
  {
    Code: "PINE-USD",
    Name: "Pinecoin",
  },
  {
    Code: "PING-USD",
    Name: "CryptoPing",
  },
  {
    Code: "PINK-USD",
    Name: "Pinkcoin",
  },
  {
    Code: "PINT-USD",
    Name: "Pub Finance",
  },
  {
    Code: "PIPL-USD",
    Name: "PiplCoin",
  },
  {
    Code: "PIPT-USD",
    Name: "Power Index Pool Token",
  },
  {
    Code: "PIRATE-USD",
    Name: "PirateCash",
  },
  {
    Code: "PIS-USD",
    Name: "Polkainsure Finance",
  },
  {
    Code: "PIVX-USD",
    Name: "PIVX",
  },
  {
    Code: "PIZZA-USD",
    Name: "PizzaCoin",
  },
  {
    Code: "PIZZASWAP-USD",
    Name: "PizzaSwap",
  },
  {
    Code: "PKB-USD",
    Name: "ParkByte",
  },
  {
    Code: "PKG-USD",
    Name: "PKG Token",
  },
  {
    Code: "PKT-USD",
    Name: "Playkey",
  },
  {
    Code: "PLANET-USD",
    Name: "PLANET",
  },
  {
    Code: "PLAT-USD",
    Name: "BitGuild PLAT",
  },
  {
    Code: "PLAY-USD",
    Name: "HEROcoin",
  },
  {
    Code: "PLAYCHIP-USD",
    Name: "PlayChip",
  },
  {
    Code: "PLAYDAPP-USD",
    Name: "PlayDapp",
  },
  {
    Code: "PLBT-USD",
    Name: "Polybius",
  },
  {
    Code: "PLC-USD",
    Name: "PLATINCOIN",
  },
  {
    Code: "PLEX-USD",
    Name: "PLEX",
  },
  {
    Code: "PLF-USD",
    Name: "PlayFuel",
  },
  {
    Code: "PLG-USD",
    Name: "Pledge Coin",
  },
  {
    Code: "PLNC-USD",
    Name: "PLNcoin",
  },
  {
    Code: "PLOT-USD",
    Name: "PlotX",
  },
  {
    Code: "PLR-USD",
    Name: "Pillar",
  },
  {
    Code: "PLS-USD",
    Name: "Ipulse",
  },
  {
    Code: "PLTC-USD",
    Name: "PlatonCoin",
  },
  {
    Code: "PLU-USD",
    Name: "Pluton",
  },
  {
    Code: "PLURA-USD",
    Name: "PluraCoin",
  },
  {
    Code: "PLUS1-USD",
    Name: "PlusOneCoin",
  },
  {
    Code: "PMA-USD",
    Name: "PumaPay",
  },
  {
    Code: "PMGT-USD",
    Name: "Perth Mint Gold Token",
  },
  {
    Code: "PMNT-USD",
    Name: "Paymon",
  },
  {
    Code: "PND-USD",
    Name: "Pandacoin",
  },
  {
    Code: "PNK-USD",
    Name: "Kleros",
  },
  {
    Code: "PNT-USD",
    Name: "pNetwork",
  },
  {
    Code: "PNX-USD",
    Name: "Phantomx",
  },
  {
    Code: "PNY-USD",
    Name: "Peony",
  },
  {
    Code: "POA-USD",
    Name: "POA Network",
  },
  {
    Code: "POC-USD",
    Name: "POC Blockchain",
  },
  {
    Code: "POCKETNODE-USD",
    Name: "PocketNode",
  },
  {
    Code: "POD-USD",
    Name: "Payment Coin",
  },
  {
    Code: "POE-USD",
    Name: "Po.et",
  },
  {
    Code: "POKE-USD",
    Name: "PokeCoin",
  },
  {
    Code: "POL-USD",
    Name: "Proof Of Liquidity",
  },
  {
    Code: "POLA-USD",
    Name: "Polaris Share",
  },
  {
    Code: "POLC-USD",
    Name: "Polkacity",
  },
  {
    Code: "POLIS-USD",
    Name: "Polis",
  },
  {
    Code: "POLK-USD",
    Name: "Polkamarkets",
  },
  {
    Code: "POLL-USD",
    Name: "ClearPoll",
  },
  {
    Code: "POLS-USD",
    Name: "Polkastarter",
  },
  {
    Code: "POLY-USD",
    Name: "Polymath",
  },
  {
    Code: "POND-USD",
    Name: "Marlin",
  },
  {
    Code: "PONZI-USD",
    Name: "PonziCoin",
  },
  {
    Code: "POOL-USD",
    Name: "POOLCOIN",
  },
  {
    Code: "POOLZ-USD",
    Name: "Poolz Finance",
  },
  {
    Code: "POP-NETWORK-TOKEN-USD",
    Name: "Pop Chest Token",
  },
  {
    Code: "PORTAL-USD",
    Name: "Portal",
  },
  {
    Code: "PoSH-USD",
    Name: "Shill & Win",
  },
  {
    Code: "POST-USD",
    Name: "PostCoin",
  },
  {
    Code: "POSW-USD",
    Name: "PoSW Coin",
  },
  {
    Code: "POT-USD",
    Name: "PotCoin",
  },
  {
    Code: "POWER-USD",
    Name: "UniPower",
  },
  {
    Code: "POWR-USD",
    Name: "Power Ledger",
  },
  {
    Code: "POX-USD",
    Name: "Pollux Coin",
  },
  {
    Code: "PPAY-USD",
    Name: "Plasma Finance",
  },
  {
    Code: "PPBLZ-USD",
    Name: "Pepemon Pepeballs",
  },
  {
    Code: "PPC-USD",
    Name: "Peercoin",
  },
  {
    Code: "PPP-USD",
    Name: "PayPie",
  },
  {
    Code: "PPT-USD",
    Name: "Populous",
  },
  {
    Code: "PRCY-USD",
    Name: "Privacy coin",
  },
  {
    Code: "PRDX-USD",
    Name: "ParamountDax Token",
  },
  {
    Code: "PRDZ-USD",
    Name: "Predictz",
  },
  {
    Code: "PRE-USD",
    Name: "Presearch",
  },
  {
    Code: "PREMIA-USD",
    Name: "Premia",
  },
  {
    Code: "PRG-USD",
    Name: "Paragon",
  },
  {
    Code: "PRIA-USD",
    Name: "PRIA",
  },
  {
    Code: "PRIX-USD",
    Name: "Privatix",
  },
  {
    Code: "PRM-USD",
    Name: "PrismChain",
  },
  {
    Code: "PRO-USD",
    Name: "Propy",
  },
  {
    Code: "PROB-USD",
    Name: "ProBit Token",
  },
  {
    Code: "PROFILE-UTILITY-TOKEN-USD",
    Name: "Profile Utility Token",
  },
  {
    Code: "PROM-USD",
    Name: "Prometeus",
  },
  {
    Code: "PROPS-USD",
    Name: "PROPS",
  },
  {
    Code: "PROS-USD",
    Name: "ProSwap",
  },
  {
    Code: "PROTO-USD",
    Name: "Protofi",
  },
  {
    Code: "PROUD-USD",
    Name: "PROUD Money",
  },
  {
    Code: "PROXI-USD",
    Name: "PROXI",
  },
  {
    Code: "PRQ-USD",
    Name: "PARSIQ",
  },
  {
    Code: "PRT-USD",
    Name: "Portion",
  },
  {
    Code: "PRVS-USD",
    Name: "Previse",
  },
  {
    Code: "PRX-USD",
    Name: "ProxyNode",
  },
  {
    Code: "PRY-USD",
    Name: "Prophecy",
  },
  {
    Code: "PSB-USD",
    Name: "Pesobit",
  },
  {
    Code: "PSG-USD",
    Name: "Paris Saint-Germain Fan Token",
  },
  {
    Code: "PSI-USD",
    Name: "Passive Income",
  },
  {
    Code: "PSIX-USD",
    Name: "ProperSix",
  },
  {
    Code: "PST-USD",
    Name: "Primas",
  },
  {
    Code: "PTA-USD",
    Name: "Petrachor",
  },
  {
    Code: "PTEN-USD",
    Name: "Patterson-UTI Energy Inc.",
  },
  {
    Code: "PTERIA-USD",
    Name: "Pteria",
  },
  {
    Code: "PTF-USD",
    Name: "PowerTrade Fuel",
  },
  {
    Code: "PTI-USD",
    Name: "Paytomat",
  },
  {
    Code: "PTM-USD",
    Name: "Potentiam",
  },
  {
    Code: "PTN-USD",
    Name: "PalletOne",
  },
  {
    Code: "PTOY-USD",
    Name: "Patientory",
  },
  {
    Code: "PTT-USD",
    Name: "Proton Token",
  },
  {
    Code: "PULSE-USD",
    Name: "Pulse",
  },
  {
    Code: "PUML-USD",
    Name: "PUML Better Health",
  },
  {
    Code: "PURE-USD",
    Name: "Pure",
  },
  {
    Code: "PUT-USD",
    Name: "PutinCoin",
  },
  {
    Code: "PVT-USD",
    Name: "Pivot Token",
  },
  {
    Code: "PWRB-USD",
    Name: "PowerBalt",
  },
  {
    Code: "PXC-USD",
    Name: "Phoenixcoin",
  },
  {
    Code: "PXI-USD",
    Name: "Prime-XI",
  },
  {
    Code: "PXL-USD",
    Name: "PIXEL",
  },
  {
    Code: "PYN-USD",
    Name: "PAYCENT",
  },
  {
    Code: "PYPL-USD",
    Name: "PayPal Holdings",
  },
  {
    Code: "PYR-USD",
    Name: "Vulcan Forged PYR",
  },
  {
    Code: "PYRK-USD",
    Name: "Pyrk",
  },
  {
    Code: "PYRO-USD",
    Name: "PYRO Network",
  },
  {
    Code: "PZM-USD",
    Name: "PRIZM",
  },
  {
    Code: "QAC-USD",
    Name: "Quasarcoin",
  },
  {
    Code: "QARK-USD",
    Name: "QANplatform",
  },
  {
    Code: "QASH-USD",
    Name: "QASH",
  },
  {
    Code: "QBC-USD",
    Name: "Quebecoin",
  },
  {
    Code: "QBT-USD",
    Name: "Qbao",
  },
  {
    Code: "QBZ-USD",
    Name: "QUEENBEE",
  },
  {
    Code: "QC-USD",
    Name: "Qcash",
  },
  {
    Code: "QCH-USD",
    Name: "QChi",
  },
  {
    Code: "QCOM-USD",
    Name: "QUALCOMM Inc",
  },
  {
    Code: "QCX-USD",
    Name: "QuickX Protocol",
  },
  {
    Code: "QDAO-USD",
    Name: "QDAO",
  },
  {
    Code: "QHC-USD",
    Name: "QChi Chain",
  },
  {
    Code: "QI-USD",
    Name: "QiSwap",
  },
  {
    Code: "QIAN-KUN-USD",
    Name: "KUN",
  },
  {
    Code: "QKC-USD",
    Name: "QuarkChain",
  },
  {
    Code: "QLC-USD",
    Name: "QLC Chain",
  },
  {
    Code: "QNT-USD",
    Name: "Quant",
  },
  {
    Code: "QQQ-USD",
    Name: "Poseidon Network",
  },
  {
    Code: "QRDO-USD",
    Name: "Qredo",
  },
  {
    Code: "QRK-USD",
    Name: "Quark",
  },
  {
    Code: "QRL-USD",
    Name: "Quantum Resistant Ledger",
  },
  {
    Code: "QRN-USD",
    Name: "Qureno",
  },
  {
    Code: "QRX-USD",
    Name: "QuiverX",
  },
  {
    Code: "QSP-USD",
    Name: "Quantstamp",
  },
  {
    Code: "QTBK-USD",
    Name: "Quantbook",
  },
  {
    Code: "QTCON-USD",
    Name: "Quiztok",
  },
  {
    Code: "QTF-USD",
    Name: "Quantfury Token",
  },
  {
    Code: "QTUM-BTC",
    Name: "QTUM/BTC - Qtum Bitcoin",
    Country: "Unknown",
    Exchange: "CC",
    Currency: "NA",
    Type: "Currency",
    Isin: null,
  },
  {
    Code: "QTUM-USD",
    Name: "Qtum",
  },
  {
    Code: "QUAN-USD",
    Name: "Quantis Network",
  },
  {
    Code: "QUICK-USD",
    Name: "Quickswap",
  },
  {
    Code: "QUID-USD",
    Name: "Quid Ika",
  },
  {
    Code: "QUIN-USD",
    Name: "QUINADS",
  },
  {
    Code: "QWC-USD",
    Name: "Qwertycoin",
  },
  {
    Code: "R2R-USD",
    Name: "R2Rcoin",
  },
  {
    Code: "R34P-USD",
    Name: "R34P",
  },
  {
    Code: "RAD-USD",
    Name: "Rite Aid",
  },
  {
    Code: "RAE-USD",
    Name: "Receive Access Ecosystem",
  },
  {
    Code: "RAGNA-USD",
    Name: "Ragnarok",
  },
  {
    Code: "RAK-USD",
    Name: "Rake Finance",
  },
  {
    Code: "RAKU-USD",
    Name: "RAKUN",
  },
  {
    Code: "RAMEN-USD",
    Name: "RamenSwap",
  },
  {
    Code: "RAMP-USD",
    Name: "RAMP",
  },
  {
    Code: "RANK-USD",
    Name: "Rank Token",
  },
  {
    Code: "RAP-USD",
    Name: "RAPTURE",
  },
  {
    Code: "RARE-USD",
    Name: "Unique One",
  },
  {
    Code: "RARE1-USD",
    Name: "SuperRare",
  },
  {
    Code: "RARI-USD",
    Name: "Rarible",
  },
  {
    Code: "RAT-USD",
    Name: "RATCOIN",
  },
  {
    Code: "RATECOIN-USD",
    Name: "Ratecoin",
  },
  {
    Code: "RATING-USD",
    Name: "DPRating",
  },
  {
    Code: "RAVEN-USD",
    Name: "Raven Protocol",
  },
  {
    Code: "RAY-USD",
    Name: "Raydium",
  },
  {
    Code: "RAZOR-USD",
    Name: "Razor Network",
  },
  {
    Code: "RBBT-USD",
    Name: "RabbitCoin",
  },
  {
    Code: "RBC-USD",
    Name: "Rubic",
  },
  {
    Code: "RBIES-USD",
    Name: "Rubies",
  },
  {
    Code: "RBLX-USD",
    Name: "Rublix",
  },
  {
    Code: "RBN-USD",
    Name: "Ribbon Finance",
  },
  {
    Code: "RBT-USD",
    Name: "Rimbit",
  },
  {
    Code: "RBTC-USD",
    Name: "RSK Smart Bitcoin",
  },
  {
    Code: "RBY-USD",
    Name: "Rubycoin",
  },
  {
    Code: "RC-USD",
    Name: "RetroCade",
  },
  {
    Code: "RC20-USD",
    Name: "RoboCalls",
  },
  {
    Code: "RCCC-USD",
    Name: "RCCC",
  },
  {
    Code: "RCHAIN-USD",
    Name: "RChain",
  },
  {
    Code: "RCN-USD",
    Name: "Ripio Credit Network",
  },
  {
    Code: "RDCT-USD",
    Name: "RDCToken",
  },
  {
    Code: "RDD-USD",
    Name: "ReddCoin",
  },
  {
    Code: "RDN-USD",
    Name: "Raiden Network Token",
  },
  {
    Code: "REAP-USD",
    Name: "REAPit",
  },
  {
    Code: "REC-USD",
    Name: "Regalcoin",
  },
  {
    Code: "RED-USD",
    Name: "RED",
  },
  {
    Code: "REEC-USD",
    Name: "Renewable Electronic Energy Coin",
  },
  {
    Code: "REEF-USD",
    Name: "Reef",
  },
  {
    Code: "REEX-USD",
    Name: "Reecore",
  },
  {
    Code: "REL-USD",
    Name: "Relevant",
  },
  {
    Code: "RELEVANT-USD",
    Name: "Relevant",
  },
  {
    Code: "REM-USD",
    Name: "Remme",
  },
  {
    Code: "REN-USD",
    Name: "Ren",
  },
  {
    Code: "RENBTC-USD",
    Name: "renBTC",
  },
  {
    Code: "RENDOGE-USD",
    Name: "renDOGE",
  },
  {
    Code: "RENFIL-USD",
    Name: "renFIL",
  },
  {
    Code: "RENTBERRY-USD",
    Name: "Rentberry",
  },
  {
    Code: "REP-USD",
    Name: "Augur",
  },
  {
    Code: "REQ-USD",
    Name: "Request",
  },
  {
    Code: "RES-USD",
    Name: "Resfinex Token",
  },
  {
    Code: "REV-USD",
    Name: "RChain",
  },
  {
    Code: "REVV-USD",
    Name: "REVV",
  },
  {
    Code: "REW-USD",
    Name: "Rewardiqa",
  },
  {
    Code: "REX-USD",
    Name: "imbrex",
  },
  {
    Code: "RFI-USD",
    Name: "reflect.finance",
  },
  {
    Code: "RFOX-USD",
    Name: "RedFOX Labs",
  },
  {
    Code: "RFR-USD",
    Name: "Refereum",
  },
  {
    Code: "RFUEL-USD",
    Name: "RioDeFi",
  },
  {
    Code: "RFX-USD",
    Name: "Reflex",
  },
  {
    Code: "RGT-USD",
    Name: "Rari Governance Token",
  },
  {
    Code: "RIC-USD",
    Name: "Rielcoin",
  },
  {
    Code: "RICHX-USD",
    Name: "RichCoin",
  },
  {
    Code: "RICK-USD",
    Name: "Infinite Ricks",
  },
  {
    Code: "RIDE-USD",
    Name: "Ride My Car",
  },
  {
    Code: "RIF-USD",
    Name: "RIF Token",
  },
  {
    Code: "RIGEL-USD",
    Name: "Rigel Finance",
  },
  {
    Code: "RIN-USD",
    Name: "Aldrin",
  },
  {
    Code: "RING-USD",
    Name: "Darwinia Network Native Token",
  },
  {
    Code: "RING1-USD",
    Name: "OneRing",
  },
  {
    Code: "RING3-USD",
    Name: "The One Ring USD",
  },
  {
    Code: "RINGX-USD",
    Name: "RING X PLATFORM",
  },
  {
    Code: "RIO-USD",
    Name: "Realio Network",
  },
  {
    Code: "RIOT-USD",
    Name: "Riot Racers",
  },
  {
    Code: "RISE-USD",
    Name: "Rise",
  },
  {
    Code: "RIT20-USD",
    Name: "Uberstate RIT 2.0",
  },
  {
    Code: "RITO-USD",
    Name: "RITO",
  },
  {
    Code: "RKN-USD",
    Name: "RAKON",
  },
  {
    Code: "RLC-USD",
    Name: "iExec RLC",
  },
  {
    Code: "RLE-USD",
    Name: "Rich Lab Token",
  },
  {
    Code: "RLY-USD",
    Name: "Rally",
  },
  {
    Code: "RM-USD",
    Name: "Rivermount",
  },
  {
    Code: "RMPL-USD",
    Name: "RMPL",
  },
  {
    Code: "RNDR-USD",
    Name: "Render Token",
  },
  {
    Code: "RNO-USD",
    Name: "Renault Par",
  },
  {
    Code: "RNT-USD",
    Name: "OneRoot Network",
  },
  {
    Code: "RNTB-USD",
    Name: "BitRent",
  },
  {
    Code: "RNX-USD",
    Name: "ROONEX",
  },
  {
    Code: "ROAD-USD",
    Name: "Yellow Road",
  },
  {
    Code: "ROBET-USD",
    Name: "RoBET",
  },
  {
    Code: "ROCK2-USD",
    Name: "ICE ROCK MINING",
  },
  {
    Code: "ROCKI-USD",
    Name: "ROCKI",
  },
  {
    Code: "ROCKS-USD",
    Name: "Rocks Idle Game",
  },
  {
    Code: "ROCO-USD",
    Name: "ROIyal Coin",
  },
  {
    Code: "ROOBEE-USD",
    Name: "ROOBEE",
  },
  {
    Code: "ROOK-USD",
    Name: "KeeperDAO",
  },
  {
    Code: "ROOM-USD",
    Name: "OptionRoom",
  },
  {
    Code: "ROOT-USD",
    Name: "Rootkit Finance",
  },
  {
    Code: "ROSE-USD",
    Name: "Oasis Network",
  },
  {
    Code: "ROT-USD",
    Name: "Rotten Token",
  },
  {
    Code: "ROUTE-USD",
    Name: "Router Protocol",
  },
  {
    Code: "ROX-USD",
    Name: "Robotina",
  },
  {
    Code: "ROYA-USD",
    Name: "Royale",
  },
  {
    Code: "RPC-USD",
    Name: "RonPaulCoin",
  },
  {
    Code: "RPD-USD",
    Name: "Rapids",
  },
  {
    Code: "RPL-USD",
    Name: "Rocket Pool",
  },
  {
    Code: "RPT-USD",
    Name: "Rug Proof",
  },
  {
    Code: "RPZX-USD",
    Name: "Rapidz",
  },
  {
    Code: "RSGP-USD",
    Name: "RSGPcoin",
  },
  {
    Code: "RSR-USD",
    Name: "Reserve Rights",
  },
  {
    Code: "RSV-USD",
    Name: "Reserve",
  },
  {
    Code: "RTE-USD",
    Name: "Rate3",
  },
  {
    Code: "RTH-USD",
    Name: "Rotharium",
  },
  {
    Code: "RTO-USD",
    Name: "Arto",
  },
  {
    Code: "RUBIT-USD",
    Name: "RubleBit",
  },
  {
    Code: "RUC-USD",
    Name: "Rush",
  },
  {
    Code: "RUFF-USD",
    Name: "Ruff",
  },
  {
    Code: "RUNE-USD",
    Name: "THORChain",
  },
  {
    Code: "RUP-USD",
    Name: "Rupee",
  },
  {
    Code: "RUPX-USD",
    Name: "Rupaya",
  },
  {
    Code: "RVC-USD",
    Name: "Ravencoin Classic",
  },
  {
    Code: "RVN-USD",
    Name: "Ravencoin",
  },
  {
    Code: "RVT-USD",
    Name: "Rivetz",
  },
  {
    Code: "RVX-USD",
    Name: "Rivex",
  },
  {
    Code: "RWN-USD",
    Name: "Rowan Coin",
  },
  {
    Code: "RYO-USD",
    Name: "Ryo Currency",
  },
  {
    Code: "S4F-USD",
    Name: "S4FE",
  },
  {
    Code: "SAFE-USD",
    Name: "Safe",
  },
  {
    Code: "SAFECOIN-USD",
    Name: "SafeCoin",
  },
  {
    Code: "SAFEMOON-USD",
    Name: "SafeMoon",
  },
  {
    Code: "SAGA-USD",
    Name: "SagaCoin",
  },
  {
    Code: "SAGE-USD",
    Name: "Sage Therapeutics Inc.",
  },
  {
    Code: "SAI-USD",
    Name: "Single Collateral DAI",
  },
  {
    Code: "SAITAMA-USD",
    Name: "Saitama",
  },
  {
    Code: "SAK-USD",
    Name: "Sharkcoin",
  },
  {
    Code: "SALE-USD",
    Name: "Dxsale.network",
  },
  {
    Code: "SALT-USD",
    Name: "SALT",
  },
  {
    Code: "SAM-USD",
    Name: "Samurai",
  },
  {
    Code: "SAN-USD",
    Name: "Santiment Network Token",
  },
  {
    Code: "SAND-USD",
    Name: "The Sandbox",
  },
  {
    Code: "SANDG-USD",
    Name: "Save and Gain",
  },
  {
    Code: "SAPP-USD",
    Name: "Sapphire",
  },
  {
    Code: "SASHIMI-USD",
    Name: "Sashimi",
  },
  {
    Code: "SAT-USD",
    Name: "Social Activity Token",
  },
  {
    Code: "SAT3-USD",
    Name: "SAT3",
  },
  {
    Code: "SATT-USD",
    Name: "SaTT",
  },
  {
    Code: "SATX-USD",
    Name: "SatoExchange Token",
  },
  {
    Code: "SAV3-USD",
    Name: "Sav3Token",
  },
  {
    Code: "SAVE-USD",
    Name: "SaveToken",
  },
  {
    Code: "SAVG-USD",
    Name: "Savage",
  },
  {
    Code: "SBD-USD",
    Name: "Steem Dollars",
  },
  {
    Code: "SBDO-USD",
    Name: "bDollar Share",
  },
  {
    Code: "SBE-USD",
    Name: "Sombe",
  },
  {
    Code: "SBER-USD",
    Name: "Sberbank of Russia GDR",
  },
  {
    Code: "SBTC-USD",
    Name: "Super Bitcoin",
  },
  {
    Code: "SBUX-USD",
    Name: "Starbucks Corp",
  },
  {
    Code: "SC-BTC",
    Name: "SC/BTC - Siacoin Bitcoin",
    Country: "Unknown",
    Exchange: "CC",
    Currency: "NA",
    Type: "Currency",
    Isin: null,
  },
  {
    Code: "SC-USD",
    Name: "Siacoin",
  },
  {
    Code: "SCAP-USD",
    Name: "SafeCapital",
  },
  {
    Code: "SCC-USD",
    Name: "StakeCubeCoin",
  },
  {
    Code: "SCH-USD",
    Name: "Schillingcoin",
  },
  {
    Code: "SCIFI-FINANCE-USD",
    Name: "Scifi.Finance",
  },
  {
    Code: "SCL-USD",
    Name: "Sociall",
  },
  {
    Code: "SCOL-USD",
    Name: "Scolcoin",
  },
  {
    Code: "SCP-USD",
    Name: "SiaPrime Coin",
  },
  {
    Code: "SCR-USD",
    Name: "Scorum Coins",
  },
  {
    Code: "SCRIBE-USD",
    Name: "Scribe",
  },
  {
    Code: "SCRIV-USD",
    Name: "SCRIV NETWORK",
  },
  {
    Code: "SCRT-USD",
    Name: "Secret",
  },
  {
    Code: "SCS-USD",
    Name: "SpeedCash",
  },
  {
    Code: "SCSX-USD",
    Name: "Secure Cash",
  },
  {
    Code: "SCV-USD",
    Name: "SCVToken",
  },
  {
    Code: "SD-USD",
    Name: "StarDust",
  },
  {
    Code: "SDC-USD",
    Name: "ShadowCash",
  },
  {
    Code: "SDP-USD",
    Name: "SydPak",
  },
  {
    Code: "SDT-USD",
    Name: "Stake DAO",
  },
  {
    Code: "SECO-USD",
    Name: "Serum Ecosystem Token",
  },
  {
    Code: "SEDO-USD",
    Name: "SEDO POW TOKEN",
  },
  {
    Code: "SEED-USD",
    Name: "SeedToken",
  },
  {
    Code: "SEELE-USD",
    Name: "Seele",
  },
  {
    Code: "SEEN-USD",
    Name: "SEEN",
  },
  {
    Code: "SEFA-USD",
    Name: "MESEFA",
  },
  {
    Code: "SELFKEY-USD",
    Name: "Selfkey",
  },
  {
    Code: "SEM-USD",
    Name: "Semux",
  },
  {
    Code: "SEMI-USD",
    Name: "Semitoken",
  },
  {
    Code: "SENC-USD",
    Name: "Sentinel Chain",
  },
  {
    Code: "SEND-USD",
    Name: "Social Send",
  },
  {
    Code: "SENSO-USD",
    Name: "SENSO",
  },
  {
    Code: "SENT-USD",
    Name: "Sentinel",
  },
  {
    Code: "SERGS-USD",
    Name: "SERGS",
  },
  {
    Code: "SERO-USD",
    Name: "Super Zero",
  },
  {
    Code: "SET-USD",
    Name: "Swytch Energy Token",
  },
  {
    Code: "SETH-USD",
    Name: "Sether",
  },
  {
    Code: "SEX-USD",
    Name: "Solidex",
  },
  {
    Code: "SFCP-USD",
    Name: "SF Capital",
  },
  {
    Code: "SFD-USD",
    Name: "SafeDeal",
  },
  {
    Code: "SFG-USD",
    Name: "S.Finance",
  },
  {
    Code: "SFI-USD",
    Name: "saffron.finance",
  },
  {
    Code: "SFM-USD",
    Name: "SafeMoon",
  },
  {
    Code: "SFP-USD",
    Name: "SafePal",
  },
  {
    Code: "SFT-USD",
    Name: "Safex Token",
  },
  {
    Code: "SFUEL-USD",
    Name: "SparkPoint Fuel",
  },
  {
    Code: "SFX-USD",
    Name: "Safex Cash",
  },
  {
    Code: "SG-USD",
    Name: "SocialGood",
  },
  {
    Code: "SGC-USD",
    Name: "Stargram Coin",
  },
  {
    Code: "SGT-USD",
    Name: "SPACEGOAT TOKEN",
  },
  {
    Code: "SH-USD",
    Name: "Shilling",
  },
  {
    Code: "SHA-USD",
    Name: "Safe Haven",
  },
  {
    Code: "SHAKE-USD",
    Name: "MilkShake Coin",
  },
  {
    Code: "SHARD-USD",
    Name: "Shard",
  },
  {
    Code: "SHARDUS-USD",
    Name: "Shardus",
  },
  {
    Code: "SHARE-USD",
    Name: "Seigniorage Shares",
  },
  {
    Code: "SHB-USD",
    Name: "SkyHub Coin",
  },
  {
    Code: "SHDW-USD",
    Name: "Shadow Token",
  },
  {
    Code: "SHE-USD",
    Name: "ShineChain",
  },
  {
    Code: "SHELL-USD",
    Name: "ShellCoin",
  },
  {
    Code: "SHENG-USD",
    Name: "SHENG",
  },
  {
    Code: "SHIB-USD",
    Name: "Shiba Inu",
  },
  {
    Code: "SHIELD-USD",
    Name: "Shield Protocol",
  },
  {
    Code: "SHIP-USD",
    Name: "ShipChain",
  },
  {
    Code: "SHMN-USD",
    Name: "StrongHands Masternode",
  },
  {
    Code: "SHND-USD",
    Name: "StrongHands",
  },
  {
    Code: "SHOP-USD",
    Name: "Shopify Cl A Sub Vtg",
  },
  {
    Code: "SHOPX-USD",
    Name: "Splyt",
  },
  {
    Code: "SHORTY-USD",
    Name: "Shorty",
  },
  {
    Code: "SHR-USD",
    Name: "ShareToken",
  },
  {
    Code: "SHROOM-USD",
    Name: "Niftyx Protocol",
  },
  {
    Code: "SHVR-USD",
    Name: "Shivers",
  },
  {
    Code: "SIACASHCOIN-USD",
    Name: "SiaCashCoin",
  },
  {
    Code: "SIB-USD",
    Name: "SIBCoin",
  },
  {
    Code: "SIC-USD",
    Name: "SICash",
  },
  {
    Code: "SIG-USD",
    Name: "Spectiv",
  },
  {
    Code: "SIGN-USD",
    Name: "SignatureChain",
  },
  {
    Code: "SIGT-USD",
    Name: "Signatum",
  },
  {
    Code: "SILK-USD",
    Name: "SilkChain",
  },
  {
    Code: "SIMPLE-USD",
    Name: "SimpleChain",
  },
  {
    Code: "SIN-USD",
    Name: "SINOVATE",
  },
  {
    Code: "SINS-USD",
    Name: "SafeInsure",
  },
  {
    Code: "SIX-USD",
    Name: "SIX",
  },
  {
    Code: "SKB-USD",
    Name: "Sakura Bloom",
  },
  {
    Code: "SKC-USD",
    Name: "Skeincoin",
  },
  {
    Code: "SKEY-USD",
    Name: "SmartKey",
  },
  {
    Code: "SKI-USD",
    Name: "Skicoin",
  },
  {
    Code: "SKIN-USD",
    Name: "SkinCoin",
  },
  {
    Code: "SKL-USD",
    Name: "SKALE",
  },
  {
    Code: "SKLAY-USD",
    Name: "sKLAY",
  },
  {
    Code: "SKM-USD",
    Name: "Skrumble Network",
  },
  {
    Code: "SKN-USD",
    Name: "SharkCoin",
  },
  {
    Code: "SKRP-USD",
    Name: "Skraps",
  },
  {
    Code: "SKULL-USD",
    Name: "Pirate Blocks",
  },
  {
    Code: "SKY-USD",
    Name: "Skycoin",
  },
  {
    Code: "SLC-USD",
    Name: "Slice",
  },
  {
    Code: "SLCA-USD",
    Name: "Us Silica Holdings",
  },
  {
    Code: "SLFI-USD",
    Name: "Selfiecoin",
  },
  {
    Code: "SLM-USD",
    Name: "Slimcoin",
  },
  {
    Code: "SLNV2-USD",
    Name: "SLNV2",
  },
  {
    Code: "SLOTH-USD",
    Name: "Slothcoin",
  },
  {
    Code: "SLP-USD",
    Name: "Smooth Love Potion",
  },
  {
    Code: "SLS-USD",
    Name: "SaluS",
  },
  {
    Code: "SLT-USD",
    Name: "Smartlands",
  },
  {
    Code: "SLV-USD",
    Name: "Silverway",
  },
  {
    Code: "SMART-USD",
    Name: "SmartBillions",
  },
  {
    Code: "SMARTCREDIT-USD",
    Name: "SmartCredit Token",
  },
  {
    Code: "SMBR-USD",
    Name: "Sombra",
  },
  {
    Code: "SMBSWAP-USD",
    Name: "SimbCoin Swap",
  },
  {
    Code: "SMC-USD",
    Name: "SmartCoin",
  },
  {
    Code: "SMLY-USD",
    Name: "SmileyCoin",
  },
  {
    Code: "SMOKE-USD",
    Name: "Smoke",
  },
  {
    Code: "SMT-USD",
    Name: "SmartMesh",
  },
  {
    Code: "SNAP-USD",
    Name: "Snap",
  },
  {
    Code: "SNB-USD",
    Name: "Safe Nebula",
  },
  {
    Code: "SNC-USD",
    Name: "SunContract",
  },
  {
    Code: "SND-USD",
    Name: "SnodeCoin",
  },
  {
    Code: "SNE-USD",
    Name: "Sony Corporation",
  },
  {
    Code: "SNET-USD",
    Name: "Snetwork",
  },
  {
    Code: "SNGLSDAO-USD",
    Name: "snglsDAO",
  },
  {
    Code: "SNL-USD",
    Name: "Sport and Leisure",
  },
  {
    Code: "SNM-USD",
    Name: "SONM",
  },
  {
    Code: "SNN-USD",
    Name: "SeChain",
  },
  {
    Code: "SNO-USD",
    Name: "SaveNode",
  },
  {
    Code: "SNOW-USD",
    Name: "SnowBlossom",
  },
  {
    Code: "SNR-USD",
    Name: "SONDER",
  },
  {
    Code: "SNRG-USD",
    Name: "Synergy",
  },
  {
    Code: "SNT-BTC",
    Name: "SNT/BTC - Status Bitcoin",
    Country: "Unknown",
    Exchange: "CC",
    Currency: "NA",
    Type: "Currency",
    Isin: null,
  },
  {
    Code: "SNT-USD",
    Name: "Status",
  },
  {
    Code: "SNTR-USD",
    Name: "Silent Notary",
  },
  {
    Code: "SNTVT-USD",
    Name: "Sentivate",
  },
  {
    Code: "SNX-USD",
    Name: "Synthetix Network Token",
  },
  {
    Code: "SOAR-USD",
    Name: "Soarcoin",
  },
  {
    Code: "SOC-USD",
    Name: "All Sports",
  },
  {
    Code: "SOCC-USD",
    Name: "SocialCoin",
  },
  {
    Code: "SOCKS-USD",
    Name: "Unisocks",
  },
  {
    Code: "SODA-COIN-USD",
    Name: "Soda Token",
  },
  {
    Code: "SOFTBTC-USD",
    Name: "sBTC",
  },
  {
    Code: "SOL-USD",
    Name: "Solana",
  },
  {
    Code: "SOLAPE-USD",
    Name: "SolAPE Token",
  },
  {
    Code: "SOLID1-USD",
    Name: "Solidly",
  },
  {
    Code: "SOLO-USD",
    Name: "Sologenic",
  },
  {
    Code: "SOLVE-USD",
    Name: "SOLVE",
  },
  {
    Code: "SONG-USD",
    Name: "SongCoin",
  },
  {
    Code: "SONO-USD",
    Name: "SONO",
  },
  {
    Code: "SOP-USD",
    Name: "SoPay",
  },
  {
    Code: "SORA-USD",
    Name: "SorachanCoin",
  },
  {
    Code: "SORA-VALIDATOR-TOKEN-USD",
    Name: "SorachanCoin",
  },
  {
    Code: "SOS-USD",
    Name: "OpenDAO",
  },
  {
    Code: "SOTA-USD",
    Name: "SOTA Finance",
  },
  {
    Code: "SOUL-USD",
    Name: "Phantasma",
  },
  {
    Code: "SOV-USD",
    Name: "Sovereign coin",
  },
  {
    Code: "SPA-USD",
    Name: "Sperax",
  },
  {
    Code: "SPACE-USD",
    Name: "SpaceCoin",
  },
  {
    Code: "SPARK-USD",
    Name: "SparkLab",
  },
  {
    Code: "SPARTA-USD",
    Name: "Spartan Protocol Token",
  },
  {
    Code: "SPAZ-USD",
    Name: "SWAPCOINZ",
  },
  {
    Code: "SPC-USD",
    Name: "SpaceChain",
  },
  {
    Code: "SPD-USD",
    Name: "SPINDLE",
  },
  {
    Code: "SPDR-USD",
    Name: "SpiderVPS",
  },
  {
    Code: "SPEC-USD",
    Name: "SpectrumNetwork",
  },
  {
    Code: "SPEED-USD",
    Name: "Speed Coin",
  },
  {
    Code: "SPELL-USD",
    Name: "Spell Token",
  },
  {
    Code: "SPEX-USD",
    Name: "SproutsExtreme",
  },
  {
    Code: "SPHR-USD",
    Name: "Sphere",
  },
  {
    Code: "SPHTX-USD",
    Name: "SophiaTX",
  },
  {
    Code: "SPI-USD",
    Name: "Shopping.io",
  },
  {
    Code: "SPICE-USD",
    Name: "Spice",
  },
  {
    Code: "SPIRIT-USD",
    Name: "SpiritSwap",
  },
  {
    Code: "SPIZ-USD",
    Name: "SPACE-iZ",
  },
  {
    Code: "SPK-USD",
    Name: "SparksPay",
  },
  {
    Code: "SPL-USD",
    Name: "Simplicity",
  },
  {
    Code: "SPN-USD",
    Name: "Sapien",
  },
  {
    Code: "SPND-USD",
    Name: "Spendcoin",
  },
  {
    Code: "SPORE-ENGINEERING-USD",
    Name: "Spore",
  },
  {
    Code: "SPORE-USD",
    Name: "Spore",
  },
  {
    Code: "SPORT-USD",
    Name: "SportsCoin",
  },
  {
    Code: "SPORTS-USD",
    Name: "ZenSports",
  },
  {
    Code: "SPR-USD",
    Name: "SpreadCoin",
  },
  {
    Code: "SPRTZ-USD",
    Name: "SpritzCoin",
  },
  {
    Code: "SPRX-USD",
    Name: "Sprint",
  },
  {
    Code: "SPT-USD",
    Name: "Spectrum",
  },
  {
    Code: "SPX-USD",
    Name: "S&P 500 Token",
  },
  {
    Code: "SPY-USD",
    Name: "Satopay Yield Token",
  },
  {
    Code: "SQ-USD",
    Name: "Square Cl A",
  },
  {
    Code: "SQUID-USD",
    Name: "SQUIDGames Token",
  },
  {
    Code: "SRIRACHA-USD",
    Name: "Sriracha Inu",
  },
  {
    Code: "SRK-USD",
    Name: "Sparkpoint",
  },
  {
    Code: "SRM-USD",
    Name: "Serum",
  },
  {
    Code: "SRN-USD",
    Name: "SIRIN LABS Token",
  },
  {
    Code: "SS-USD",
    Name: "Sharder",
  },
  {
    Code: "SSN-USD",
    Name: "Supersonic Finance",
  },
  {
    Code: "SSP-USD",
    Name: "Smartshare",
  },
  {
    Code: "SSV-USD",
    Name: "SSV Network",
  },
  {
    Code: "SSX-USD",
    Name: "Stake Share",
  },
  {
    Code: "STA-USD",
    Name: "STATERA",
  },
  {
    Code: "STABL-USD",
    Name: "Stable Coin",
  },
  {
    Code: "STABLE-ASSET-USD",
    Name: "STABLE ASSET",
  },
  {
    Code: "STACY-USD",
    Name: "Stacy",
  },
  {
    Code: "STAK-USD",
    Name: "STRAKS",
  },
  {
    Code: "STAKE-USD",
    Name: "xDAI Stake",
  },
  {
    Code: "STAKEC-USD",
    Name: "StakeCenterCash",
  },
  {
    Code: "STAKECUBECOIN-USD",
    Name: "StakeCubeCoin",
  },
  {
    Code: "STAR-USD",
    Name: "Starbase",
  },
  {
    Code: "START-USD",
    Name: "Startcoin",
  },
  {
    Code: "STAX-USD",
    Name: "StableXSwap",
  },
  {
    Code: "STBU-USD",
    Name: "Stobox Token",
  },
  {
    Code: "STBZ-USD",
    Name: "Stabilize",
  },
  {
    Code: "STC-USD",
    Name: "Student Coin",
  },
  {
    Code: "STEEM-BTC",
    Name: "STEEM/BTC - Steem Bitcoin",
    Country: "Unknown",
    Exchange: "CC",
    Currency: "NA",
    Type: "Currency",
    Isin: null,
  },
  {
    Code: "STEEM-USD",
    Name: "Steem",
  },
  {
    Code: "STETH-USD",
    Name: "StakeHound Staked Ether",
  },
  {
    Code: "STH-USD",
    Name: "Smartholdem",
  },
  {
    Code: "STIPEND-USD",
    Name: "Stipend",
  },
  {
    Code: "STLD-USD",
    Name: "Steel Dynamics Inc.",
  },
  {
    Code: "STM-USD",
    Name: "Stmicroelectronics Adr",
  },
  {
    Code: "STMX-USD",
    Name: "StormX",
  },
  {
    Code: "STN-USD",
    Name: "Steneum Coin",
  },
  {
    Code: "STO-USD",
    Name: "The Stone Coin",
  },
  {
    Code: "STONK-USD",
    Name: "StonkSwap Token",
  },
  {
    Code: "STOP-USD",
    Name: "SatoPay",
  },
  {
    Code: "STORJ-USD",
    Name: "Storj",
  },
  {
    Code: "STORM-USD",
    Name: "Storm",
  },
  {
    Code: "STOX-USD",
    Name: "Stox",
  },
  {
    Code: "STP-USD",
    Name: "STPAY",
  },
  {
    Code: "STPL-USD",
    Name: "Stream Protocol",
  },
  {
    Code: "STPT-USD",
    Name: "STPT",
  },
  {
    Code: "STR-USD",
    Name: "Staker",
  },
  {
    Code: "STRAX-USD",
    Name: "Stratis",
  },
  {
    Code: "STRK-USD",
    Name: "Strike",
  },
  {
    Code: "STRONG-USD",
    Name: "Strong",
  },
  {
    Code: "STS-USD",
    Name: "Stress",
  },
  {
    Code: "STT-USD",
    Name: "Scatter.cx",
  },
  {
    Code: "STU-USD",
    Name: "bitJob",
  },
  {
    Code: "STV-USD",
    Name: "Sativacoin",
  },
  {
    Code: "STX-USD",
    Name: "Stacks",
  },
  {
    Code: "SUB-USD",
    Name: "Substratum",
  },
  {
    Code: "SUGAR-USD",
    Name: "Sugarchain",
  },
  {
    Code: "SUKU-USD",
    Name: "SUKU",
  },
  {
    Code: "SUMO-USD",
    Name: "Sumokoin",
  },
  {
    Code: "SUN-USD",
    Name: "SUN",
  },
  {
    Code: "SUP-USD",
    Name: "Superior Coin",
  },
  {
    Code: "SUP8EME-USD",
    Name: "SUP8EME",
  },
  {
    Code: "SUPER-BITCOIN-USD",
    Name: "SuperCoin",
  },
  {
    Code: "SUPER-USD",
    Name: "SuperCoin",
  },
  {
    Code: "SUPERCOIN-USD",
    Name: "SuperCoin",
  },
  {
    Code: "SUPERFARM-USD",
    Name: "Superfarm",
  },
  {
    Code: "SUR-USD",
    Name: "Suretly",
  },
  {
    Code: "SURE-USD",
    Name: "inSure",
  },
  {
    Code: "SUSD-USD",
    Name: "sUSD",
  },
  {
    Code: "SUSHI-USD",
    Name: "Sushi",
  },
  {
    Code: "SUSHIBEAR-USD",
    Name: "3X Short Sushi Token",
  },
  {
    Code: "SUSHIBULL-USD",
    Name: "3X Long Sushi Token",
  },
  {
    Code: "SUTER-USD",
    Name: "Suterusu",
  },
  {
    Code: "SVC-USD",
    Name: "Silvercash",
  },
  {
    Code: "SVI-USD",
    Name: "SavingCoin",
  },
  {
    Code: "SVR-USD",
    Name: "SovranoCoin",
  },
  {
    Code: "SWACE-USD",
    Name: "Swace",
  },
  {
    Code: "SWAG-USD",
    Name: "SWAG Finance",
  },
  {
    Code: "SWAMP-USD",
    Name: "Swamp Coin",
  },
  {
    Code: "SWAP-USD",
    Name: "TrustSwap",
  },
  {
    Code: "SWC-USD",
    Name: "Scanetchain",
  },
  {
    Code: "SWFL-USD",
    Name: "Swapfolio",
  },
  {
    Code: "SWFTC-USD",
    Name: "SwftCoin",
  },
  {
    Code: "SWG-USD",
    Name: "Swirge",
  },
  {
    Code: "SWIFT-USD",
    Name: "SwiftCash",
  },
  {
    Code: "SWING-USD",
    Name: "Swing",
  },
  {
    Code: "SWINGBY-USD",
    Name: "Swingby",
  },
  {
    Code: "SWISS-USD",
    Name: "swiss.finance",
  },
  {
    Code: "SWL-USD",
    Name: "Swiftlance Token",
  },
  {
    Code: "SWM-USD",
    Name: "Swarm",
  },
  {
    Code: "SWN-USD",
    Name: "Southwestern Energy",
  },
  {
    Code: "SWPRL-USD",
    Name: "Swaprol",
  },
  {
    Code: "SWRV-USD",
    Name: "Swerve",
  },
  {
    Code: "SWSH-USD",
    Name: "SwapShip",
  },
  {
    Code: "SWT-USD",
    Name: "Swarm City",
  },
  {
    Code: "SWTH-USD",
    Name: "Switcheo",
  },
  {
    Code: "SWYFTT-USD",
    Name: "Swyft Network",
  },
  {
    Code: "SX-USD",
    Name: "SportX",
  },
  {
    Code: "SXC-USD",
    Name: "Sexcoin",
  },
  {
    Code: "SXDT-USD",
    Name: "Spectre.ai Dividend Token",
  },
  {
    Code: "SXP-USD",
    Name: "Swipe",
  },
  {
    Code: "SXUT-USD",
    Name: "Spectre.ai Utility Token",
  },
  {
    Code: "SYLO-USD",
    Name: "Sylo",
  },
  {
    Code: "SYNC-USD",
    Name: "SYNC Network",
  },
  {
    Code: "SYNX-USD",
    Name: "Syndicate",
  },
  {
    Code: "SYS-BTC",
    Name: "SYS/BTC - Syscoin Bitcoin",
    Country: "Unknown",
    Exchange: "CC",
    Currency: "NA",
    Type: "Currency",
    Isin: null,
  },
  {
    Code: "SYS-USD",
    Name: "Syscoin",
  },
  {
    Code: "SZC-USD",
    Name: "ShopZcoin",
  },
  {
    Code: "TAD-USD",
    Name: "Tadpole Finance",
  },
  {
    Code: "TAG-USD",
    Name: "TagCoin",
  },
  {
    Code: "TAGR-USD",
    Name: "TAGRcoin",
  },
  {
    Code: "TAI-USD",
    Name: "tBridge Token",
  },
  {
    Code: "TAJ-USD",
    Name: "TajCoin",
  },
  {
    Code: "TALK-USD",
    Name: "BTCtalkcoin",
  },
  {
    Code: "TAO-USD",
    Name: "Tao",
  },
  {
    Code: "TAP-USD",
    Name: "TAPME Token",
  },
  {
    Code: "TAT-USD",
    Name: "Tatcoin",
  },
  {
    Code: "TAU-USD",
    Name: "Lamden",
  },
  {
    Code: "TAVITT-USD",
    Name: "Tavittcoin",
  },
  {
    Code: "TBT-USD",
    Name: "Tennisball",
  },
  {
    Code: "TBTC-USD",
    Name: "Tidbit Coin",
  },
  {
    Code: "TBX-USD",
    Name: "Tokenbox",
  },
  {
    Code: "TCASH-USD",
    Name: "TCASH",
  },
  {
    Code: "TCC-USD",
    Name: "The ChampCoin",
  },
  {
    Code: "TCH-USD",
    Name: "Thore Cash",
  },
  {
    Code: "TCO-USD",
    Name: "Tcoin",
  },
  {
    Code: "TCORE-USD",
    Name: "Tornado Core",
  },
  {
    Code: "TCP-USD",
    Name: "Token CashPay",
  },
  {
    Code: "TCT-USD",
    Name: "TokenClub",
  },
  {
    Code: "TDP-USD",
    Name: "TrueDeck",
  },
  {
    Code: "TDS-USD",
    Name: "TokenDesk",
  },
  {
    Code: "TEAT-USD",
    Name: "TEAL",
  },
  {
    Code: "TECH-USD",
    Name: "Cryptomeda",
  },
  {
    Code: "TEK-USD",
    Name: "TEKcoin",
  },
  {
    Code: "TEL-USD",
    Name: "Telcoin",
  },
  {
    Code: "TELL-USD",
    Name: "Tellurion",
  },
  {
    Code: "TELOS-USD",
    Name: "Teloscoin",
  },
  {
    Code: "TEM-USD",
    Name: "Totem",
  },
  {
    Code: "TEMCO-USD",
    Name: "TEMCO",
  },
  {
    Code: "TEN-USD",
    Name: "Tokenomy",
  },
  {
    Code: "TEND-USD",
    Name: "Tendon",
  },
  {
    Code: "TENET-USD",
    Name: "Tenet",
  },
  {
    Code: "TENT-USD",
    Name: "TENT",
  },
  {
    Code: "TEP-USD",
    Name: "Tepleton",
  },
  {
    Code: "TERA-USD",
    Name: "TERA",
  },
  {
    Code: "TERC-USD",
    Name: "TronEuropeRewardCoin",
  },
  {
    Code: "TERN-USD",
    Name: "Ternio",
  },
  {
    Code: "TERRA-SDT-USD",
    Name: "Avaterra",
  },
  {
    Code: "TES-USD",
    Name: "TeslaCoin",
  },
  {
    Code: "TESTA-USD",
    Name: "Testa",
  },
  {
    Code: "TEVA-USD",
    Name: "Teva Pharma Ind Adr Rep 1",
  },
  {
    Code: "TEX-USD",
    Name: "TychExchange",
  },
  {
    Code: "TFL-USD",
    Name: "TrueFlip",
  },
  {
    Code: "TFT-USD",
    Name: "Tron Flight Ticket",
  },
  {
    Code: "TFUEL-USD",
    Name: "Theta Fuel",
  },
  {
    Code: "TGAME-USD",
    Name: "Truegame",
  },
  {
    Code: "TGT-USD",
    Name: "Target Corp",
  },
  {
    Code: "TH-USD",
    Name: "Team Heretics Fan Token",
  },
  {
    Code: "THC-USD",
    Name: "HempCoin",
  },
  {
    Code: "THE-BANK-COIN-USD",
    Name: "Bankcoin",
  },
  {
    Code: "THE-USD",
    Name: "THENODE",
  },
  {
    Code: "THEMIS-ORACLE-USD",
    Name: "Themis",
  },
  {
    Code: "THEMIS-USD",
    Name: "Themis",
  },
  {
    Code: "THETA-USD",
    Name: "THETA",
  },
  {
    Code: "THOR-USD",
    Name: "Asgard Finance",
  },
  {
    Code: "THORCHAIN-ERC20-USD",
    Name: "THORChain (ERC20)",
  },
  {
    Code: "THR-USD",
    Name: "ThoreCoin",
  },
  {
    Code: "THX-USD",
    Name: "ThoreNext",
  },
  {
    Code: "TIC-USD",
    Name: "Thingschain",
  },
  {
    Code: "TIE-USD",
    Name: "Ties.DB",
  },
  {
    Code: "TIGER-USD",
    Name: "Tigerfinance",
  },
  {
    Code: "TIME-USD",
    Name: "Chrono.tech",
  },
  {
    Code: "TIPS-USD",
    Name: "FedoraCoin",
  },
  {
    Code: "TIT-USD",
    Name: "Titcoin",
  },
  {
    Code: "TITAN-USD",
    Name: "TitanSwap",
  },
  {
    Code: "TIX-USD",
    Name: "Blocktix",
  },
  {
    Code: "TKN-USD",
    Name: "Monolith",
  },
  {
    Code: "TKO-USD",
    Name: "Tokocrypto",
  },
  {
    Code: "TKP-USD",
    Name: "TOKPIE",
  },
  {
    Code: "TKS-USD",
    Name: "Tokes",
  },
  {
    Code: "TKX-USD",
    Name: "Tokenize Xchange",
  },
  {
    Code: "TKY-USD",
    Name: "THEKEY",
  },
  {
    Code: "TLB-USD",
    Name: "The Luxury Coin",
  },
  {
    Code: "TLOS-USD",
    Name: "Telos",
  },
  {
    Code: "TLR-USD",
    Name: "Taler",
  },
  {
    Code: "TLRY-USD",
    Name: "Tilray Inc.",
  },
  {
    Code: "TLW-USD",
    Name: "Tullow",
  },
  {
    Code: "TM2-USD",
    Name: "TRAXIA",
  },
  {
    Code: "TMC-USD",
    Name: "TimesCoin",
  },
  {
    Code: "TME-USD",
    Name: "TAMA EGG NiftyGotchi",
  },
  {
    Code: "TMED-USD",
    Name: "MDsquare",
  },
  {
    Code: "TMN-USD",
    Name: "TranslateMe Network Token",
  },
  {
    Code: "TMTG-USD",
    Name: "The Midas Touch Gold",
  },
  {
    Code: "TN-USD",
    Name: "Turtle Network",
  },
  {
    Code: "TNB-USD",
    Name: "Time New Bank",
  },
  {
    Code: "TNC-USD",
    Name: "Trinity Network Credit",
  },
  {
    Code: "TNS-USD",
    Name: "Transcodium",
  },
  {
    Code: "TNT-USD",
    Name: "Tierion",
  },
  {
    Code: "TOC-USD",
    Name: "TouchCon",
  },
  {
    Code: "TODAY-USD",
    Name: "TodayCoin",
  },
  {
    Code: "TOK-USD",
    Name: "TOKOK",
  },
  {
    Code: "TOKC-USD",
    Name: "TOKYO",
  },
  {
    Code: "TOKO-USD",
    Name: "Tokoin",
  },
  {
    Code: "TOL-USD",
    Name: "Tolar",
  },
  {
    Code: "TOM-USD",
    Name: "TOM Finance",
  },
  {
    Code: "TOMO-USD",
    Name: "TomoChain",
  },
  {
    Code: "TOMOBULL-USD",
    Name: "3X Long TomoChain Token",
  },
  {
    Code: "TON-CRYSTAL-USD",
    Name: "TON Crystal",
  },
  {
    Code: "TONCOIN-USD",
    Name: "Toncoin",
  },
  {
    Code: "TONE-USD",
    Name: "TE-FOOD",
  },
  {
    Code: "TONS-USD",
    Name: "Thisoption",
  },
  {
    Code: "TONTOKEN-USD",
    Name: "TON Token",
  },
  {
    Code: "TOP-USD",
    Name: "TOP",
  },
  {
    Code: "TOPC-USD",
    Name: "TopChain",
  },
  {
    Code: "TOR-USD",
    Name: "Torcoin",
  },
  {
    Code: "TORN-USD",
    Name: "Tornado Cash",
  },
  {
    Code: "TOS-USD",
    Name: "ThingsOperatingSystem",
  },
  {
    Code: "TOSC-USD",
    Name: "T.OS",
  },
  {
    Code: "TOTO-USD",
    Name: "Tourist Token",
  },
  {
    Code: "TPAY-USD",
    Name: "TokenPay",
  },
  {
    Code: "TPT-USD",
    Name: "Token Pocket",
  },
  {
    Code: "TRA-USD",
    Name: "Trabzonspor Fan Token",
  },
  {
    Code: "TRAC-USD",
    Name: "OriginTrail",
  },
  {
    Code: "TRAD-USD",
    Name: "Tradcoin",
  },
  {
    Code: "TRADE-USD",
    Name: "Unitrade",
  },
  {
    Code: "TRAT-USD",
    Name: "Tratok",
  },
  {
    Code: "TRB-USD",
    Name: "Tributes",
  },
  {
    Code: "TRBT-USD",
    Name: "Tribute",
  },
  {
    Code: "TRC-USD",
    Name: "Terracoin",
  },
  {
    Code: "TRCL-USD",
    Name: "Treecle",
  },
  {
    Code: "TRD-USD",
    Name: "TRADECOIN",
  },
  {
    Code: "TREX-USD",
    Name: "Trexcoin",
  },
  {
    Code: "TRI-USD",
    Name: "Triangles",
  },
  {
    Code: "TRIBE-USD",
    Name: "Tribe",
  },
  {
    Code: "TRINITY-NETWORK-CREDIT-USD",
    Name: "Trinity Network Credit",
  },
  {
    Code: "TRIO-USD",
    Name: "Tripio",
  },
  {
    Code: "TRISM-USD",
    Name: "Trism",
  },
  {
    Code: "TRIX-USD",
    Name: "TriumphX",
  },
  {
    Code: "TRK-USD",
    Name: "Truckcoin",
  },
  {
    Code: "TRND-USD",
    Name: "Trendering",
  },
  {
    Code: "TROLL-USD",
    Name: "Trollcoin",
  },
  {
    Code: "TRONBETDICE-USD",
    Name: "TRONbetDice",
  },
  {
    Code: "TRONX-USD",
    Name: "Tronx Coin",
  },
  {
    Code: "TROP-USD",
    Name: "Interop",
  },
  {
    Code: "TROY1-USD",
    Name: "Troy",
  },
  {
    Code: "TRP-USD",
    Name: "Tronipay",
  },
  {
    Code: "TRST-USD",
    Name: "WeTrust",
  },
  {
    Code: "TRTL-USD",
    Name: "TurtleCoin",
  },
  {
    Code: "TRTT-USD",
    Name: "Trittium",
  },
  {
    Code: "TRU-USD",
    Name: "Truebit Protocol",
  },
  {
    Code: "TRUE-USD",
    Name: "TrueChain",
  },
  {
    Code: "TRUSD-USD",
    Name: "TrustUSD",
  },
  {
    Code: "TRUST-USD",
    Name: "TrustPlus",
  },
  {
    Code: "TRV-USD",
    Name: "TrustVerse",
  },
  {
    Code: "TRX-USD",
    Name: "TRON",
  },
  {
    Code: "TRXBEAR-USD",
    Name: "3X Short TRX Token",
  },
  {
    Code: "TRXBULL-USD",
    Name: "3X Long TRX Token",
  },
  {
    Code: "TRXC-USD",
    Name: "TRONCLASSIC",
  },
  {
    Code: "TRXDOWN-USD",
    Name: "TRXDOWN",
  },
  {
    Code: "TRXUP-USD",
    Name: "TRXUP",
  },
  {
    Code: "TRYB-USD",
    Name: "BiLira",
  },
  {
    Code: "TSHP-USD",
    Name: "12Ships",
  },
  {
    Code: "TSL-USD",
    Name: "Energo",
  },
  {
    Code: "TSLA-USD",
    Name: "Tesla",
  },
  {
    Code: "TSM-USD",
    Name: "Taiwan Semiconductor",
  },
  {
    Code: "TST-USD",
    Name: "Touch Social",
  },
  {
    Code: "TT-USD",
    Name: "Thunder Token",
  },
  {
    Code: "TTN-USD",
    Name: "Titan Coin",
  },
  {
    Code: "TTT-USD",
    Name: "The Transfer Token",
  },
  {
    Code: "TTWO-USD",
    Name: "Take-Two Interactive Software Inc.",
  },
  {
    Code: "TTY-USD",
    Name: "Trinity",
  },
  {
    Code: "TUBE-USD",
    Name: "BitTube",
  },
  {
    Code: "TUDA-USD",
    Name: "Tutor's Diary",
  },
  {
    Code: "TUNE-USD",
    Name: "TUNE TOKEN",
  },
  {
    Code: "TUP-USD",
    Name: "Tenup",
  },
  {
    Code: "TUSC-USD",
    Name: "The Universal Settlement Coin",
  },
  {
    Code: "TUSD-USD",
    Name: "TrueUSD",
  },
  {
    Code: "TVK-USD",
    Name: "Terra Virtua Kolect",
  },
  {
    Code: "TVNT-USD",
    Name: "TravelNote",
  },
  {
    Code: "TWI-USD",
    Name: "Trade.win",
  },
  {
    Code: "TWJ-USD",
    Name: "Tron Weekly Journal",
  },
  {
    Code: "TWT-USD",
    Name: "Trust Wallet Token",
  },
  {
    Code: "TWTR-USD",
    Name: "Twitter",
  },
  {
    Code: "TX-USD",
    Name: "TransferCoin",
  },
  {
    Code: "TXL-USD",
    Name: "Tixl",
  },
  {
    Code: "TYC-USD",
    Name: "TycheCoin",
  },
  {
    Code: "TZC-USD",
    Name: "TrezarCoin",
  },
  {
    Code: "UAA-USD",
    Name: "Under Armour Cl A",
  },
  {
    Code: "UAT-USD",
    Name: "UltrAlpha",
  },
  {
    Code: "UBER-USD",
    Name: "Uber Technologies Inc",
  },
  {
    Code: "UBEX-USD",
    Name: "Ubex",
  },
  {
    Code: "UBIN-USD",
    Name: "Ubiner",
  },
  {
    Code: "UBN-USD",
    Name: "Ubricoin",
  },
  {
    Code: "UBQ-USD",
    Name: "Ubiq",
  },
  {
    Code: "UBT-USD",
    Name: "Unibright",
  },
  {
    Code: "UBTC-USD",
    Name: "United Bitcoin",
  },
  {
    Code: "UBU-USD",
    Name: "UBU",
  },
  {
    Code: "UBX-USD",
    Name: "UBIX Network",
  },
  {
    Code: "UBXT-USD",
    Name: "UpBots",
  },
  {
    Code: "UC-USD",
    Name: "YouLive Coin",
  },
  {
    Code: "UCA-USD",
    Name: "UCA Coin",
  },
  {
    Code: "UCAP-USD",
    Name: "Unicap.finance",
  },
  {
    Code: "UCASH-USD",
    Name: "UNIVERSAL CASH",
  },
  {
    Code: "UCM-USD",
    Name: "Unicly Chris McCann Collection",
  },
  {
    Code: "UCN-USD",
    Name: "UChain",
  },
  {
    Code: "UCO-USD",
    Name: "Uniris",
  },
  {
    Code: "UCR-USD",
    Name: "Ultra Clear",
  },
  {
    Code: "UCT-USD",
    Name: "Ubique Chain Of Things",
  },
  {
    Code: "UENC-USD",
    Name: "UniversalEnergyChain",
  },
  {
    Code: "UFC-USD",
    Name: "Union Fair Coin",
  },
  {
    Code: "uFFYI-USD",
    Name: "unlimited FiscusFYI",
  },
  {
    Code: "UFO-USD",
    Name: "Uniform Fiscal Object",
  },
  {
    Code: "UFR-USD",
    Name: "Upfiring",
  },
  {
    Code: "UFT-USD",
    Name: "UniLend Finance",
  },
  {
    Code: "UGAS-USD",
    Name: "UGAS",
  },
  {
    Code: "UHP-USD",
    Name: "Ulgen Hash Power",
  },
  {
    Code: "UIP-USD",
    Name: "UnlimitedIP",
  },
  {
    Code: "UIS-USD",
    Name: "Unitus",
  },
  {
    Code: "ULG-USD",
    Name: "Ultragate",
  },
  {
    Code: "ULT-USD",
    Name: "Ultiledger",
  },
  {
    Code: "UMA-USD",
    Name: "UMA",
  },
  {
    Code: "UMB-USD",
    Name: "UmbraCoin",
  },
  {
    Code: "UMI-USD",
    Name: "Universal Money Instrument",
  },
  {
    Code: "UMX-USD",
    Name: "UniMex Network",
  },
  {
    Code: "UNCL-USD",
    Name: "UNCL",
  },
  {
    Code: "UNCX-USD",
    Name: "UniCrypt",
  },
  {
    Code: "UNDG-USD",
    Name: "UniDexGas",
  },
  {
    Code: "UNFI-USD",
    Name: "Unifi Protocol DAO",
  },
  {
    Code: "UNI1-USD",
    Name: "Uniswap",
  },
  {
    Code: "UNICORN-TOKEN-USD",
    Name: "UNICORN Token",
  },
  {
    Code: "UNIDX-USD",
    Name: "UniDex",
  },
  {
    Code: "UNIFI-PROTOCOL-USD",
    Name: "UNIFI DeFi",
  },
  {
    Code: "UNIFI-USD",
    Name: "UNIFI",
  },
  {
    Code: "UNIFY-USD",
    Name: "Unify",
  },
  {
    Code: "UNISTAKE-USD",
    Name: "Unistake",
  },
  {
    Code: "UNISWAP-USD",
    Name: "Uniswap",
  },
  {
    Code: "UNIT-PROTOCOL-DUCK-USD",
    Name: "Universal Currency",
  },
  {
    Code: "UNIT-USD",
    Name: "Universal Currency",
  },
  {
    Code: "UNITS-USD",
    Name: "GameUnits",
  },
  {
    Code: "UNIUSD-USD",
    Name: "UniDollar",
  },
  {
    Code: "UNKNOWN-FAIR-OBJECT-USD",
    Name: "Unknown Fair Object",
  },
  {
    Code: "UNL-USD",
    Name: "unilock.network",
  },
  {
    Code: "UNN-USD",
    Name: "UNION Protocol Governance Token",
  },
  {
    Code: "UNO-USD",
    Name: "Unobtanium",
  },
  {
    Code: "UNW-USD",
    Name: "UniWorld",
  },
  {
    Code: "UOP-USD",
    Name: "Utopia Genesis Foundation",
  },
  {
    Code: "UOS-USD",
    Name: "Ultra",
  },
  {
    Code: "UPI-USD",
    Name: "Pawtocol",
  },
  {
    Code: "UPP-USD",
    Name: "Sentinel Protocol",
  },
  {
    Code: "UPX-USD",
    Name: "uPlexa",
  },
  {
    Code: "URAC-USD",
    Name: "Uranus",
  },
  {
    Code: "URC-USD",
    Name: "Unrealcoin",
  },
  {
    Code: "URO-USD",
    Name: "Uro",
  },
  {
    Code: "USC-USD",
    Name: "Ultimate Secure Cash",
  },
  {
    Code: "USD1-USD",
    Name: "Psyche",
  },
  {
    Code: "USDA-USD",
    Name: "USDA",
  },
  {
    Code: "USDC-USD",
    Name: "USD Coin",
  },
  {
    Code: "USDF-USD",
    Name: "FolgoryUSD",
  },
  {
    Code: "USDJ-USD",
    Name: "USDJ",
  },
  {
    Code: "USDK-USD",
    Name: "USDK",
  },
  {
    Code: "USDN-USD",
    Name: "Neutrino USD",
  },
  {
    Code: "USDP-USD",
    Name: "USDP Stablecoin",
  },
  {
    Code: "USDQ-USD",
    Name: "USDQ",
  },
  {
    Code: "USDS-USD",
    Name: "StableUSD",
  },
  {
    Code: "USDT-USD",
    Name: "Tether",
  },
  {
    Code: "USDU-USD",
    Name: "Upper Dollar",
  },
  {
    Code: "USDX-USD",
    Name: "USDX",
  },
  {
    Code: "USE-USD",
    Name: "Usechain Token",
  },
  {
    Code: "USNBT-USD",
    Name: "NuBits",
  },
  {
    Code: "UST-USD",
    Name: "TerraUSD",
  },
  {
    Code: "UTED-USD",
    Name: "United",
  },
  {
    Code: "uTip-USD",
    Name: "uTip",
  },
  {
    Code: "UTK-USD",
    Name: "Utrust",
  },
  {
    Code: "UTT-USD",
    Name: "United Traders Token",
  },
  {
    Code: "UTU-USD",
    Name: "UTU Coin",
  },
  {
    Code: "UUU-USD",
    Name: "U Network",
  },
  {
    Code: "UVU-USD",
    Name: "CCUniverse",
  },
  {
    Code: "UWL-USD",
    Name: "UniWhales",
  },
  {
    Code: "V-USD",
    Name: "Version",
  },
  {
    Code: "VAI-USD",
    Name: "Vai",
  },
  {
    Code: "VAIP-USD",
    Name: "VEHICLE DATA ARTIFICIAL INTELLIGENCE PLATFORM",
  },
  {
    Code: "VAL-USD",
    Name: "Valorbit",
  },
  {
    Code: "VALOR-USD",
    Name: "Valor Token",
  },
  {
    Code: "VALUE-USD",
    Name: "Value DeFi",
  },
  {
    Code: "VANY-USD",
    Name: "Vanywhere",
  },
  {
    Code: "VARC-USD",
    Name: "VARC",
  },
  {
    Code: "VARIUS-USD",
    Name: "VARIUS",
  },
  {
    Code: "vBCH-USD",
    Name: "Venus BCH",
  },
  {
    Code: "VBETH-USD",
    Name: "Venus BETH",
  },
  {
    Code: "VBIT-USD",
    Name: "VALOBIT",
  },
  {
    Code: "VBK-USD",
    Name: "VeriBlock",
  },
  {
    Code: "vBNB-USD",
    Name: "Venus BNB",
  },
  {
    Code: "vBUSD-USD",
    Name: "Venus BUSD",
  },
  {
    Code: "vDAI-USD",
    Name: "Venus DAI",
  },
  {
    Code: "VDG-USD",
    Name: "VeriDocGlobal",
  },
  {
    Code: "VDL-USD",
    Name: "Vidulum",
  },
  {
    Code: "vDOT-USD",
    Name: "Venus DOT",
  },
  {
    Code: "VEC2-USD",
    Name: "VectorAI",
  },
  {
    Code: "VEE-USD",
    Name: "BLOCKv",
  },
  {
    Code: "VEIL-USD",
    Name: "VEIL",
  },
  {
    Code: "VELO-USD",
    Name: "Velo",
  },
  {
    Code: "VEO-USD",
    Name: "Amoveo",
  },
  {
    Code: "VERI-USD",
    Name: "Veritaseum",
  },
  {
    Code: "VEST-USD",
    Name: "VestChain",
  },
  {
    Code: "VET-USD",
    Name: "VeChain",
  },
  {
    Code: "vETH-USD",
    Name: "Vether",
  },
  {
    Code: "VEX-USD",
    Name: "Vexanium",
  },
  {
    Code: "vFIL-USD",
    Name: "Venus Filecoin",
  },
  {
    Code: "VGC-USD",
    Name: "5G-CASH",
  },
  {
    Code: "VGT-USD",
    Name: "Vanguard Information Technology ETF",
  },
  {
    Code: "VGW-USD",
    Name: "VegaWallet Token",
  },
  {
    Code: "VGX-USD",
    Name: "Voyager Token",
  },
  {
    Code: "VIA-USD",
    Name: "Viacoin",
  },
  {
    Code: "VIB-USD",
    Name: "Viberate",
  },
  {
    Code: "VIBE-USD",
    Name: "VIBE",
  },
  {
    Code: "VID-USD",
    Name: "VideoCoin",
  },
  {
    Code: "VIDT-USD",
    Name: "V-ID",
  },
  {
    Code: "VIDT1-USD",
    Name: "VIDT Datalink",
  },
  {
    Code: "VIDY-USD",
    Name: "VIDY",
  },
  {
    Code: "VIDYA-USD",
    Name: "Vidya",
  },
  {
    Code: "VIDYX-USD",
    Name: "VidyX",
  },
  {
    Code: "VIDZ-USD",
    Name: "PureVidz",
  },
  {
    Code: "VIG-USD",
    Name: "VIG",
  },
  {
    Code: "VIKING-USD",
    Name: "Viking Finance",
  },
  {
    Code: "VIKKY-USD",
    Name: "VikkyToken",
  },
  {
    Code: "VIN-USD",
    Name: "VINchain",
  },
  {
    Code: "VINCI-USD",
    Name: "Vinci",
  },
  {
    Code: "VIP-USD",
    Name: "Vip Coin",
  },
  {
    Code: "VIPS-USD",
    Name: "Vipstar Coin",
  },
  {
    Code: "VISIO-USD",
    Name: "Visio",
  },
  {
    Code: "VISION-USD",
    Name: "APY.vision",
  },
  {
    Code: "VIT-USD",
    Name: "Vision Industry Token",
  },
  {
    Code: "VITAE-USD",
    Name: "Vitae",
  },
  {
    Code: "VITE-USD",
    Name: "VITE",
  },
  {
    Code: "VIVID-USD",
    Name: "Vivid Coin",
  },
  {
    Code: "VJC-USD",
    Name: "VENJOCOIN",
  },
  {
    Code: "VKNF-USD",
    Name: "VKENAF",
  },
  {
    Code: "VKR-USD",
    Name: "Valkyrie Protocol",
    Country: "Unknown",
    Exchange: "\u0421\u0421",
    Currency: "USD",
    Type: "Currency",
    Isin: null,
  },
  {
    Code: "VKT-USD",
    Name: "Vankia Chain",
  },
  {
    Code: "VLD-USD",
    Name: "Vetri",
  },
  {
    Code: "vLINK-USD",
    Name: "Venus LINK",
  },
  {
    Code: "VLS-USD",
    Name: "Veles",
  },
  {
    Code: "VLT-USD",
    Name: "Veltor",
  },
  {
    Code: "vLTC-USD",
    Name: "Vault Coin",
  },
  {
    Code: "VLTY-USD",
    Name: "Vaulty Token",
  },
  {
    Code: "VLU-USD",
    Name: "Valuto",
  },
  {
    Code: "VLX-USD",
    Name: "Velas",
  },
  {
    Code: "VN-USD",
    Name: "VN Token",
  },
  {
    Code: "VNDC-USD",
    Name: "VNDC",
  },
  {
    Code: "VNET-USD",
    Name: "21Vianet Group Inc.",
  },
  {
    Code: "VNLA-USD",
    Name: "Vanilla Network",
  },
  {
    Code: "VNT-USD",
    Name: "VNTchain",
  },
  {
    Code: "VNXLU-USD",
    Name: "VNX Exchange",
  },
  {
    Code: "VOCO-USD",
    Name: "Provoco Token",
  },
  {
    Code: "VOLLAR-USD",
    Name: "V-Dimension",
  },
  {
    Code: "VOLT-USD",
    Name: "Bitvolt",
  },
  {
    Code: "VOLTZ-USD",
    Name: "Voltz",
  },
  {
    Code: "VOO-USD",
    Name: "Vanguard S&P 500 ETF",
  },
  {
    Code: "VOT-USD",
    Name: "VoteCoin",
  },
  {
    Code: "VOTE-USD",
    Name: "Agora",
  },
  {
    Code: "VOX-USD",
    Name: "Volix",
  },
  {
    Code: "VOYA-USD",
    Name: "Voyacoin",
  },
  {
    Code: "VOYTEK-BEAR-COIN-USD",
    Name: "BEAR Coin",
  },
  {
    Code: "VPRC-USD",
    Name: "VapersCoin",
  },
  {
    Code: "VRA-USD",
    Name: "Verasity",
  },
  {
    Code: "VRC-USD",
    Name: "VeriCoin",
  },
  {
    Code: "VRO-USD",
    Name: "VeraOne",
  },
  {
    Code: "VRSC-USD",
    Name: "Verus Coin",
  },
  {
    Code: "VRX-USD",
    Name: "Verox",
  },
  {
    Code: "VSN-USD",
    Name: "Vision",
  },
  {
    Code: "VSP-USD",
    Name: "Vesper Finance",
  },
  {
    Code: "vSXP-USD",
    Name: "Venus SXP",
  },
  {
    Code: "VSYS-USD",
    Name: "V Systems",
  },
  {
    Code: "VTC-USD",
    Name: "Vertcoin",
  },
  {
    Code: "VTHO-USD",
    Name: "VeThor Token",
  },
  {
    Code: "VTX-USD",
    Name: "Volentix",
  },
  {
    Code: "vUSDC-USD",
    Name: "Venus USDC",
  },
  {
    Code: "vUSDT-USD",
    Name: "Venus USDT",
  },
  {
    Code: "VVS-USD",
    Name: "VVS Finance",
  },
  {
    Code: "VX-USD",
    Name: "ViteX coin",
  },
  {
    Code: "vXRP-USD",
    Name: "Venus XRP",
  },
  {
    Code: "VXV-USD",
    Name: "Vectorspace AI",
  },
  {
    Code: "vXVS-USD",
    Name: "Venus XVS",
  },
  {
    Code: "W-USD",
    Name: "Wayfair Cl A",
  },
  {
    Code: "WAB-USD",
    Name: "WABnetwork",
  },
  {
    Code: "WABI-USD",
    Name: "Tael",
  },
  {
    Code: "WAGE-USD",
    Name: "Digiwage",
  },
  {
    Code: "WAN-USD",
    Name: "Wanchain",
  },
  {
    Code: "WARP-USD",
    Name: "WARP",
  },
  {
    Code: "WATER-USD",
    Name: "Water Finance",
  },
  {
    Code: "WATT-USD",
    Name: "Energous Corporation",
  },
  {
    Code: "WAVES-BTC",
    Name: "WAVES/BTC - Waves Bitcoin",
    Country: "Unknown",
    Exchange: "CC",
    Currency: "NA",
    Type: "Currency",
    Isin: null,
  },
  {
    Code: "WAVES-USD",
    Name: "Waves",
  },
  {
    Code: "WAXE-USD",
    Name: "WAXE",
  },
  {
    Code: "WAXP-USD",
    Name: "WAX",
  },
  {
    Code: "WAY-USD",
    Name: "WayGuide",
  },
  {
    Code: "WBA-USD",
    Name: "Walgreen Boots Alliance",
  },
  {
    Code: "WBB-USD",
    Name: "Wild Beast Block",
  },
  {
    Code: "WBBC-USD",
    Name: "Wibcoin",
  },
  {
    Code: "WBIND-USD",
    Name: "Wrapped BIND",
  },
  {
    Code: "WBNB-USD",
    Name: "Wrapped BNB",
  },
  {
    Code: "WBTC-USD",
    Name: "Wrapped Bitcoin",
  },
  {
    Code: "WBX-USD",
    Name: "WiBX",
  },
  {
    Code: "WCC-USD",
    Name: "WinCash",
  },
  {
    Code: "WCCX-USD",
    Name: "Wrapped Conceal",
  },
  {
    Code: "WCELO-USD",
    Name: "Wrapped CELO",
  },
  {
    Code: "WCK-USD",
    Name: "Wrapped CryptoKitties",
  },
  {
    Code: "WCO-USD",
    Name: "Winco",
  },
  {
    Code: "WCT-USD",
    Name: "Waves Community Token",
  },
  {
    Code: "WDC-USD",
    Name: "WorldCoin",
  },
  {
    Code: "WEB-COIN-PAY-USD",
    Name: "Webcoin",
  },
  {
    Code: "WEB-USD",
    Name: "Webcoin",
  },
  {
    Code: "WEBN-USD",
    Name: "WEBN token",
  },
  {
    Code: "WELD-USD",
    Name: "WELD",
  },
  {
    Code: "WELL-USD",
    Name: "WELL",
  },
  {
    Code: "WEMIX-USD",
    Name: "WEMIX Token",
  },
  {
    Code: "WEST-USD",
    Name: "Waves Enterprise",
  },
  {
    Code: "WETH-USD",
    Name: "WETH",
  },
  {
    Code: "WEX-USD",
    Name: "WaultSwap",
  },
  {
    Code: "WFC-USD",
    Name: "Wells Fargo & Co",
  },
  {
    Code: "WFX-USD",
    Name: "Webflix Token",
  },
  {
    Code: "WG0-USD",
    Name: "Wrapped Gen-0 CryptoKitties",
  },
  {
    Code: "WGC-USD",
    Name: "Green Climate World",
  },
  {
    Code: "WGP-USD",
    Name: "W Green Pay",
  },
  {
    Code: "WGR-USD",
    Name: "Wagerr",
  },
  {
    Code: "WGRT-USD",
    Name: "WaykiChain Governance Coin",
  },
  {
    Code: "WHALE-USD",
    Name: "WHALE",
  },
  {
    Code: "WHALE1-USD",
    Name: "White Whale",
  },
  {
    Code: "WHEN-USD",
    Name: "WHEN Token",
  },
  {
    Code: "WHITE-USD",
    Name: "Whiteheart",
  },
  {
    Code: "WHL-USD",
    Name: "WhaleCoin",
  },
  {
    Code: "WHT-USD",
    Name: "Wrapped Huobi Token",
  },
  {
    Code: "WICC-USD",
    Name: "WaykiChain",
  },
  {
    Code: "WIFI-USD",
    Name: "Wifi Coin",
  },
  {
    Code: "WIKEN-USD",
    Name: "Project WITH",
  },
  {
    Code: "WIN-USD",
    Name: "WINk",
  },
  {
    Code: "WING-USD",
    Name: "Wing Finance",
  },
  {
    Code: "WINGS-USD",
    Name: "Wings",
  },
  {
    Code: "WINGSHOP-USD",
    Name: "WingShop",
  },
  {
    Code: "WINK-USD",
    Name: "Wink",
  },
  {
    Code: "WIS-USD",
    Name: "Experty Wisdom Token",
  },
  {
    Code: "WISE-USD",
    Name: "WISE",
  },
  {
    Code: "WISH-USD",
    Name: "MyWish",
  },
  {
    Code: "WIT-USD",
    Name: "WITChain",
  },
  {
    Code: "WIX-USD",
    Name: "Wixlar",
  },
  {
    Code: "WLEO-USD",
    Name: "LeoFinance Token",
  },
  {
    Code: "WLLO-USD",
    Name: "WillowCoin",
  },
  {
    Code: "WMT-USD",
    Name: "Wal-Mart Stores Inc",
  },
  {
    Code: "WNL-USD",
    Name: "WinStars.live",
  },
  {
    Code: "WNXM-USD",
    Name: "Wrapped NXM",
  },
  {
    Code: "WOM-USD",
    Name: "WOM Protocol",
  },
  {
    Code: "WOMEN-USD",
    Name: "WomenCoin",
  },
  {
    Code: "WON-USD",
    Name: "WON Coin",
  },
  {
    Code: "WOO-USD",
    Name: "Wootrade",
  },
  {
    Code: "WORK1-USD",
    Name: "The Employment Commons Work Token",
  },
  {
    Code: "WORLD-USD",
    Name: "World Token",
  },
  {
    Code: "WOW-USD",
    Name: "Wownero",
  },
  {
    Code: "WOWS-USD",
    Name: "Wolves of Wall Street",
  },
  {
    Code: "WOWSWAP-USD",
    Name: "WOWswap",
  },
  {
    Code: "WOZX-USD",
    Name: "Efforce",
  },
  {
    Code: "WPP-USD",
    Name: "WPP TOKEN",
  },
  {
    Code: "WPR-USD",
    Name: "WePower",
  },
  {
    Code: "WPX-USD",
    Name: "Wallet Plus X",
  },
  {
    Code: "WRC-USD",
    Name: "Worldcore",
  },
  {
    Code: "WRLD-USD",
    Name: "NFT Worlds",
  },
  {
    Code: "WRX-USD",
    Name: "WazirX",
  },
  {
    Code: "WSCRT-USD",
    Name: "Secret (ERC20)",
  },
  {
    Code: "WSOTE-USD",
    Name: "Soteria",
  },
  {
    Code: "WTC-USD",
    Name: "Waltonchain",
  },
  {
    Code: "WTF-USD",
    Name: "Walnut.finance",
  },
  {
    Code: "WTL-USD",
    Name: "Welltrado",
  },
  {
    Code: "WTN-USD",
    Name: "Waletoken",
  },
  {
    Code: "WTP-USD",
    Name: "Web Token Pay",
  },
  {
    Code: "WVG0-USD",
    Name: "Wrapped Virgin Gen-0 CryptoKitties",
  },
  {
    Code: "WW-USD",
    Name: "Waya Wolf Coin",
  },
  {
    Code: "WXC-USD",
    Name: "WXCOINS",
  },
  {
    Code: "WXMR-USD",
    Name: "Wrapped Monero",
  },
  {
    Code: "WXT-USD",
    Name: "Wirex Token",
  },
  {
    Code: "X-USD",
    Name: "US Steel Corp",
  },
  {
    Code: "x0z-USD",
    Name: "Zerozed",
  },
  {
    Code: "X2-USD",
    Name: "X2",
  },
  {
    Code: "X42-USD",
    Name: "x42",
  },
  {
    Code: "XAC-USD",
    Name: "General Attention Currency",
  },
  {
    Code: "XAG-USD",
    Name: "Silver Spot Token",
  },
  {
    Code: "XAI-USD",
    Name: "SideShift Token",
  },
  {
    Code: "XAMP-USD",
    Name: "Antiample",
  },
  {
    Code: "XANK-USD",
    Name: "Xank",
  },
  {
    Code: "XAP-USD",
    Name: "Apollon",
  },
  {
    Code: "XAS-USD",
    Name: "Asch",
  },
  {
    Code: "XAT-USD",
    Name: "ShareAt",
  },
  {
    Code: "XAU-USD",
    Name: "Gold Spot Token",
  },
  {
    Code: "XAUC-USD",
    Name: "Xaucoin",
  },
  {
    Code: "XAUR-USD",
    Name: "Xaurum",
  },
  {
    Code: "XAUT-USD",
    Name: "Tether Gold",
  },
  {
    Code: "XAUTBEAR-USD",
    Name: "3X Short Tether Gold Token",
  },
  {
    Code: "XAUTBULL-USD",
    Name: "3X Long Tether Gold Token",
  },
  {
    Code: "XBASE-USD",
    Name: "Eterbase Coin",
  },
  {
    Code: "XBC-USD",
    Name: "Bitcoin Plus",
  },
  {
    Code: "XBI-USD",
    Name: "Bitcoin Incognito",
  },
  {
    Code: "XBP-USD",
    Name: "BlitzPredict",
  },
  {
    Code: "XBR-USD",
    Name: "Brent Crude Oil Spot",
  },
  {
    Code: "XBTC21-USD",
    Name: "Bitcoin 21",
  },
  {
    Code: "XBTS-USD",
    Name: "Beatcoin",
  },
  {
    Code: "XBX-USD",
    Name: "Bitex",
  },
  {
    Code: "XBY-USD",
    Name: "XTRABYTES",
  },
  {
    Code: "XCAD-USD",
    Name: "XCAD Network",
  },
  {
    Code: "XCASH-USD",
    Name: "X-CASH",
  },
  {
    Code: "XCF-USD",
    Name: "Cenfura Token",
  },
  {
    Code: "XCH-USD",
    Name: "Chia",
  },
  {
    Code: "XCM-USD",
    Name: "CoinMetro Token",
  },
  {
    Code: "XCO-USD",
    Name: "X-Coin",
  },
  {
    Code: "XCON-USD",
    Name: "Connect Coin",
  },
  {
    Code: "XCP-USD",
    Name: "Counterparty",
  },
  {
    Code: "XCRE-USD",
    Name: "Creatio",
  },
  {
    Code: "XCUR-USD",
    Name: "Curate",
  },
  {
    Code: "XDAG-USD",
    Name: "Dagger",
  },
  {
    Code: "XDB-USD",
    Name: "DigitalBits",
  },
  {
    Code: "XDC-USD",
    Name: "XDC",
  },
  {
    Code: "XDE2-USD",
    Name: "XDE II",
  },
  {
    Code: "XDEF2-USD",
    Name: "Xdef Finance",
  },
  {
    Code: "XDN-USD",
    Name: "DigitalNote",
  },
  {
    Code: "XDNA-USD",
    Name: "XDNA",
  },
  {
    Code: "XED-USD",
    Name: "Exeedme",
  },
  {
    Code: "XEM-BTC",
    Name: "XEM/BTC - NEM Bitcoin",
    Country: "Unknown",
    Exchange: "CC",
    Currency: "NA",
    Type: "Currency",
    Isin: null,
  },
  {
    Code: "XEM-USD",
    Name: "NEM",
  },
  {
    Code: "XEONBIT-TOKEN-USD",
    Name: "Xeonbit Token",
  },
  {
    Code: "XEP-USD",
    Name: "Electra Protocol",
  },
  {
    Code: "XEQ-USD",
    Name: "Equilibria",
  },
  {
    Code: "XFC-USD",
    Name: "Footballcoin",
  },
  {
    Code: "XFG-USD",
    Name: "Fandom Gold",
  },
  {
    Code: "XFI-USD",
    Name: "Xfinance",
  },
  {
    Code: "XFT-USD",
    Name: "Offshift",
  },
  {
    Code: "XFUEL-USD",
    Name: "XFUEL",
  },
  {
    Code: "XFUND-USD",
    Name: "xFund",
  },
  {
    Code: "XGM-USD",
    Name: "Defis",
  },
  {
    Code: "XGOX-USD",
    Name: "XGOX",
  },
  {
    Code: "XGS-USD",
    Name: "GenesisX",
  },
  {
    Code: "XHI-USD",
    Name: "HiCoin",
  },
  {
    Code: "XHV-USD",
    Name: "Haven Protocol",
  },
  {
    Code: "XIN-USD",
    Name: "Infinity Economics",
  },
  {
    Code: "XIO-USD",
    Name: "Blockzero Labs",
  },
  {
    Code: "XIOS-USD",
    Name: "Xios",
  },
  {
    Code: "XIOT-USD",
    Name: "Xiotri",
  },
  {
    Code: "XJO-USD",
    Name: "Joulecoin",
  },
  {
    Code: "XJP-USD",
    Name: "eXciting Japan Coin",
  },
  {
    Code: "XLA-USD",
    Name: "Scala",
  },
  {
    Code: "XLAB-USD",
    Name: "XcelToken Plus",
  },
  {
    Code: "XLM-USD",
    Name: "Stellar",
  },
  {
    Code: "XLPG-USD",
    Name: "StellarPayGlobal",
  },
  {
    Code: "XLQ-USD",
    Name: "ALQO",
  },
  {
    Code: "XLR-USD",
    Name: "Solaris",
  },
  {
    Code: "XLT-USD",
    Name: "Nexalt",
  },
  {
    Code: "XMC-USD",
    Name: "Monero Classic",
  },
  {
    Code: "XMG-USD",
    Name: "Magi",
  },
  {
    Code: "XMM-USD",
    Name: "Momentum",
  },
  {
    Code: "XMON-USD",
    Name: "Bitcoin Monster",
  },
  {
    Code: "XMR-BTC",
    Name: "XMR/BTC - Monero Bitcoin",
    Country: "Unknown",
    Exchange: "CC",
    Currency: "NA",
    Type: "Currency",
    Isin: null,
  },
  {
    Code: "XMR-USD",
    Name: "Monero",
  },
  {
    Code: "XMV-USD",
    Name: "MoneroV",
  },
  {
    Code: "XMX-USD",
    Name: "XMax",
  },
  {
    Code: "XMY-USD",
    Name: "Myriad",
  },
  {
    Code: "XNC-USD",
    Name: "XENIOS",
  },
  {
    Code: "XNG-USD",
    Name: "US Natural Gas Spot",
  },
  {
    Code: "XNO-USD",
    Name: "Xeno Token",
  },
  {
    Code: "XNODE-USD",
    Name: "XNODE",
  },
  {
    Code: "XNV-USD",
    Name: "Nerva",
  },
  {
    Code: "XOC-USD",
    Name: "Xonecoin",
  },
  {
    Code: "XOR-USD",
    Name: "Sora",
  },
  {
    Code: "XOS-USD",
    Name: "OASIS",
  },
  {
    Code: "XOT-USD",
    Name: "Okuru Token",
  },
  {
    Code: "XOV-USD",
    Name: "XOVBank",
  },
  {
    Code: "XP-USD",
    Name: "Experience Points",
  },
  {
    Code: "XPA-USD",
    Name: "XPA",
  },
  {
    Code: "XPC-USD",
    Name: "eXPerience Chain",
  },
  {
    Code: "XPD-USD",
    Name: "Palladium Spot Token",
  },
  {
    Code: "XPM-USD",
    Name: "Primecoin",
  },
  {
    Code: "XPN-USD",
    Name: "PANTHEON X",
  },
  {
    Code: "XPR-USD",
    Name: "Proton",
  },
  {
    Code: "XPTOKEN-IO-USD",
    Name: "XPToken.io",
  },
  {
    Code: "XPTX-USD",
    Name: "PlatinumBAR",
  },
  {
    Code: "XPX-USD",
    Name: "ProximaX",
  },
  {
    Code: "XPY-USD",
    Name: "PayCoin",
  },
  {
    Code: "XQC-USD",
    Name: "Quras Token",
  },
  {
    Code: "XQN-USD",
    Name: "Quotient",
  },
  {
    Code: "XRA-USD",
    Name: "Xriba",
  },
  {
    Code: "XRC-USD",
    Name: "Bitcoin Rhodium",
  },
  {
    Code: "XRL-USD",
    Name: "Rialto",
  },
  {
    Code: "XRP-BTC",
    Name: "XRP/BTC - XRP Bitcoin",
    Country: "Unknown",
    Exchange: "CC",
    Currency: "NA",
    Type: "Currency",
    Isin: null,
  },
  {
    Code: "XRP-USD",
    Name: "XRP",
  },
  {
    Code: "XRPBEAR-USD",
    Name: "3x Short XRP Token",
  },
  {
    Code: "XRPBULL-USD",
    Name: "3x Long XRP Token",
  },
  {
    Code: "XRPDOWN-USD",
    Name: "XRPDOWN",
  },
  {
    Code: "XRPUP-USD",
    Name: "XRPUP",
  },
  {
    Code: "XRT-USD",
    Name: "Robonomics Network",
  },
  {
    Code: "XRU-USD",
    Name: "Thorstarter",
  },
  {
    Code: "XSCR-USD",
    Name: "SECURUS",
  },
  {
    Code: "XSG-USD",
    Name: "SnowGem",
  },
  {
    Code: "XSGD-USD",
    Name: "XSGD",
  },
  {
    Code: "XSH-USD",
    Name: "SHIELD",
  },
  {
    Code: "XSM-USD",
    Name: "SpectrumCash",
  },
  {
    Code: "XSN-USD",
    Name: "Stakenet",
  },
  {
    Code: "XSPC-USD",
    Name: "Spectre Security Coin",
  },
  {
    Code: "XSPEC-USD",
    Name: "Spectrecoin",
  },
  {
    Code: "XSR-USD",
    Name: "SucreCoin",
  },
  {
    Code: "XST-USD",
    Name: "Stealth",
  },
  {
    Code: "XSTABLE-PROTOCOL-USD",
    Name: "Xstable.Protocol",
  },
  {
    Code: "XTA-USD",
    Name: "Italo",
  },
  {
    Code: "XTI-USD",
    Name: "US Crude Oil Spot Token",
  },
  {
    Code: "XTK-USD",
    Name: "Xtake",
  },
  {
    Code: "XTNC-USD",
    Name: "XtendCash",
  },
  {
    Code: "XTP-USD",
    Name: "Tap",
  },
  {
    Code: "XTRM-USD",
    Name: "XTRM COIN",
  },
  {
    Code: "XTZ-USD",
    Name: "Tezos",
  },
  {
    Code: "XTZBEAR-USD",
    Name: "3x Short Tezos Token",
  },
  {
    Code: "XTZBULL-USD",
    Name: "3x Long Tezos Token",
  },
  {
    Code: "XTZDOWN-USD",
    Name: "XTZDOWN",
  },
  {
    Code: "XTZUP-USD",
    Name: "XTZUP",
  },
  {
    Code: "XUC-USD",
    Name: "Exchange Union",
  },
  {
    Code: "XUEZ-USD",
    Name: "Xuez Coin",
  },
  {
    Code: "XUSD-USD",
    Name: "XUSD Stable",
  },
  {
    Code: "XVC-USD",
    Name: "Vcash",
  },
  {
    Code: "XVE-USD",
    Name: "The Vegan Initiative",
  },
  {
    Code: "XVG-USD",
    Name: "Verge",
  },
  {
    Code: "XVIX-USD",
    Name: "XVIX",
  },
  {
    Code: "XVS-USD",
    Name: "Venus",
  },
  {
    Code: "XWC-USD",
    Name: "WhiteCoin",
  },
  {
    Code: "XWP-USD",
    Name: "Swap",
  },
  {
    Code: "XXA-USD",
    Name: "Ixinium",
  },
  {
    Code: "XYO-USD",
    Name: "XYO",
  },
  {
    Code: "xZAR-USD",
    Name: "South African Tether",
  },
  {
    Code: "YAC-USD",
    Name: "Yacoin",
  },
  {
    Code: "YAM-USD",
    Name: "YAM v3",
  },
  {
    Code: "YAMV1-USD",
    Name: "YAM v1",
  },
  {
    Code: "YAMV2-USD",
    Name: "YAMv2",
  },
  {
    Code: "YAS-USD",
    Name: "YAS",
  },
  {
    Code: "YAX-USD",
    Name: "yAxis",
  },
  {
    Code: "yBAN-USD",
    Name: "BananoDOS",
  },
  {
    Code: "YBO-USD",
    Name: "Young Boys Fan Token",
  },
  {
    Code: "YCATT-USD",
    Name: "Catex.Finance",
  },
  {
    Code: "YCC-USD",
    Name: "Yuan Chain Coin",
  },
  {
    Code: "YCE-USD",
    Name: "MYCE",
  },
  {
    Code: "YEA-USD",
    Name: "YeaFinance",
  },
  {
    Code: "YEC-USD",
    Name: "Ycash",
  },
  {
    Code: "YEE-USD",
    Name: "YEE",
  },
  {
    Code: "YeFiM-USD",
    Name: "YFi Management",
  },
  {
    Code: "YELD-USD",
    Name: "Yeld Finance",
  },
  {
    Code: "YF-DAI-USD",
    Name: "YFDAI.FINANCE",
  },
  {
    Code: "YFA-USD",
    Name: "YFA Finance",
  },
  {
    Code: "YFB2-USD",
    Name: "Yearn Finance Bit2",
  },
  {
    Code: "YFBETA-USD",
    Name: "yfBeta",
  },
  {
    Code: "YFBT-USD",
    Name: "Yearn Finance Bit",
  },
  {
    Code: "YFBTC-USD",
    Name: "YFBitcoin",
  },
  {
    Code: "YFD-USD",
    Name: "YfDFI.Finance",
  },
  {
    Code: "YFDOT-USD",
    Name: "Yearn Finance DOT",
  },
  {
    Code: "YFE-USD",
    Name: "YFE Money",
  },
  {
    Code: "YFFI-USD",
    Name: "yffi finance",
  },
  {
    Code: "YFFII-USD",
    Name: "Yffii.finance",
  },
  {
    Code: "YFFS-USD",
    Name: "YFFS Finance",
  },
  {
    Code: "YFI-USD",
    Name: "yearn.finance",
  },
  {
    Code: "YFIA-USD",
    Name: "YFIA",
  },
  {
    Code: "YFIAG-USD",
    Name: "YearnAgnostic Finance",
  },
  {
    Code: "YFICG-USD",
    Name: "YFI Credits Group",
  },
  {
    Code: "YFID-USD",
    Name: "YFIDapp",
  },
  {
    Code: "YFIE-USD",
    Name: "YFIEXCHANGE.FINANCE",
  },
  {
    Code: "YFIEC-USD",
    Name: "Yearn Finance Ecosystem",
  },
  {
    Code: "YFII-USD",
    Name: "DFI.Money",
  },
  {
    Code: "YFIIG-USD",
    Name: "YFII Gold",
  },
  {
    Code: "YFIKING-USD",
    Name: "YFIKINGFINANCE",
  },
  {
    Code: "YFIM-USD",
    Name: "Yfi.mobi",
  },
  {
    Code: "YFIS-USD",
    Name: "YFISCURITY",
  },
  {
    Code: "YFIX-USD",
    Name: "YFIX.finance",
  },
  {
    Code: "YFL-USD",
    Name: "YF Link",
  },
  {
    Code: "YFMS-USD",
    Name: "YFMoonshot",
  },
  {
    Code: "YFN-USD",
    Name: "Yearn Finance Network",
  },
  {
    Code: "YFO-USD",
    Name: "YFIONE",
  },
  {
    Code: "YFOX-USD",
    Name: "YFOX FINANCE",
  },
  {
    Code: "YFPRO-USD",
    Name: "YFPRO Finance",
  },
  {
    Code: "YFRM-USD",
    Name: "Yearn Finance Red Moon",
  },
  {
    Code: "YFTE-USD",
    Name: "YFTether",
  },
  {
    Code: "YGG-USD",
    Name: "Yield Guild Games",
  },
  {
    Code: "YGYM-USD",
    Name: "YFGYM",
  },
  {
    Code: "YI12-USD",
    Name: "Yield Stake Finance",
  },
  {
    Code: "YIELD-USD",
    Name: "Yield Protocol",
  },
  {
    Code: "YLC-USD",
    Name: "YoloCash",
  },
  {
    Code: "YLD-USD",
    Name: "Yield Coin",
  },
  {
    Code: "YLFI-USD",
    Name: "Yearn Loans Finance",
  },
  {
    Code: "YMEN-USD",
    Name: "Ymen.Finance",
  },
  {
    Code: "YNDX-USD",
    Name: "Yandex N.V.",
  },
  {
    Code: "YO-USD",
    Name: "Yobit Token",
  },
  {
    Code: "YOK-USD",
    Name: "YOKcoin",
  },
  {
    Code: "YOLO-USD",
    Name: "AdvisorShares Pure Cannabis ETF",
  },
  {
    Code: "YOP-USD",
    Name: "YOP",
  },
  {
    Code: "YOT-USD",
    Name: "PayYoda",
  },
  {
    Code: "YOU-USD",
    Name: "YOU COIN",
  },
  {
    Code: "YOUC-USD",
    Name: "YOUcash",
  },
  {
    Code: "YOYOW-USD",
    Name: "YOYOW",
  },
  {
    Code: "yPANDA-USD",
    Name: "YieldPanda Finance",
  },
  {
    Code: "YPIE-USD",
    Name: "PieDAO Yearn Ecosystem Pie",
  },
  {
    Code: "YRISE-USD",
    Name: "yRise Finance",
  },
  {
    Code: "YSEC-USD",
    Name: "Yearn Secure",
  },
  {
    Code: "YSR-USD",
    Name: "Ystar",
  },
  {
    Code: "YT-USD",
    Name: "Cherry Token",
  },
  {
    Code: "YTN-USD",
    Name: "YENTEN",
  },
  {
    Code: "yTSLA-USD",
    Name: "yTSLA Finance",
  },
  {
    Code: "YUSRA-USD",
    Name: "YUSRA",
  },
  {
    Code: "YVS-USD",
    Name: "YVS Finance",
  },
  {
    Code: "YYFI-USD",
    Name: "YYFI.Protocol",
  },
  {
    Code: "ZAI-USD",
    Name: "Zaigar",
  },
  {
    Code: "ZAIF-USD",
    Name: "Zaif Token",
  },
  {
    Code: "ZANO-USD",
    Name: "Zano",
  },
  {
    Code: "ZAP-USD",
    Name: "Zap",
  },
  {
    Code: "ZARH-USD",
    Name: "Zarcash",
  },
  {
    Code: "ZASH-USD",
    Name: "ZIMBOCASH",
  },
  {
    Code: "ZB-USD",
    Name: "ZB",
  },
  {
    Code: "ZCC-USD",
    Name: "ZcCoin",
  },
  {
    Code: "ZCH-USD",
    Name: "0cash",
  },
  {
    Code: "ZCL-USD",
    Name: "ZClassic",
  },
  {
    Code: "ZCN-USD",
    Name: "0Chain",
  },
  {
    Code: "ZCR-USD",
    Name: "ZCore",
  },
  {
    Code: "ZDEX-USD",
    Name: "Zeedex",
  },
  {
    Code: "ZDR-USD",
    Name: "Zloadr",
  },
  {
    Code: "ZDX-USD",
    Name: "Zer-Dex",
  },
  {
    Code: "ZEBI-USD",
    Name: "Zebi Token",
  },
  {
    Code: "ZEC-USD",
    Name: "Zcash",
  },
  {
    Code: "ZEE-USD",
    Name: "ZeroSwap",
  },
  {
    Code: "ZEFU-USD",
    Name: "Zenfuse",
  },
  {
    Code: "ZEIT-USD",
    Name: "Zeitcoin",
  },
  {
    Code: "ZEL-USD",
    Name: "ZelCash",
  },
  {
    Code: "ZEN-USD",
    Name: "Horizen",
  },
  {
    Code: "ZENI-USD",
    Name: "Zennies",
  },
  {
    Code: "ZEON-USD",
    Name: "ZEON Network",
  },
  {
    Code: "ZER-USD",
    Name: "Zero",
  },
  {
    Code: "ZERO-USD",
    Name: "0.exchange",
  },
  {
    Code: "ZET-USD",
    Name: "Zetacoin",
  },
  {
    Code: "ZEUS-USD",
    Name: "ZeusNetwork",
  },
  {
    Code: "ZFL-USD",
    Name: "Zuflo Coin",
  },
  {
    Code: "ZIK-USD",
    Name: "Ziktalk",
  },
  {
    Code: "ZIL-USD",
    Name: "Zilliqa",
  },
  {
    Code: "ZIPT-USD",
    Name: "Zippie",
  },
  {
    Code: "ZKS-USD",
    Name: "ZKSwap",
  },
  {
    Code: "ZLA-USD",
    Name: "Zilla",
  },
  {
    Code: "ZLP-USD",
    Name: "Zuplo",
  },
  {
    Code: "ZLW-USD",
    Name: "Zelwin",
  },
  {
    Code: "ZMT-USD",
    Name: "Zipmex Token",
  },
  {
    Code: "ZND-USD",
    Name: "Zenad",
  },
  {
    Code: "ZNE-USD",
    Name: "Zonecoin",
  },
  {
    Code: "ZNN-USD",
    Name: "Zenon",
  },
  {
    Code: "ZNT-USD",
    Name: "Zenswap Network Token",
  },
  {
    Code: "ZNY-USD",
    Name: "Bitzeny",
  },
  {
    Code: "ZNZ-USD",
    Name: "ZENZO",
  },
  {
    Code: "ZOC-USD",
    Name: "01coin",
  },
  {
    Code: "ZOD-USD",
    Name: "Krypton",
  },
  {
    Code: "ZOOM-PROTOCOL-USD",
    Name: "Zoom Protocol",
  },
  {
    Code: "ZOOM-USD",
    Name: "CoinZoom",
  },
  {
    Code: "ZORA-USD",
    Name: "Zoracles",
  },
  {
    Code: "ZPAE-USD",
    Name: "ZelaaPayAE",
  },
  {
    Code: "ZPAY-USD",
    Name: "Zantepay",
  },
  {
    Code: "ZPB-USD",
    Name: "Zebi Public Blockchain",
  },
  {
    Code: "ZPR-USD",
    Name: "ZPER",
  },
  {
    Code: "ZPT-USD",
    Name: "Zeepin",
  },
  {
    Code: "ZRC-USD",
    Name: "ZrCoin",
  },
  {
    Code: "ZRX-USD",
    Name: "0x",
  },
  {
    Code: "ZSC-USD",
    Name: "Zeusshield",
  },
  {
    Code: "ZT-USD",
    Name: "ZTCoin",
  },
  {
    Code: "ZTC-USD",
    Name: "Zent Cash",
  },
  {
    Code: "ZUC-USD",
    Name: "ZeuxCoin",
  },
  {
    Code: "ZUM-USD",
    Name: "ZUM TOKEN",
  },
  {
    Code: "ZUMCOIN-USD",
    Name: "ZumCoin",
  },
  {
    Code: "ZUR-USD",
    Name: "Zurcoin",
  },
  {
    Code: "ZUSD-USD",
    Name: "Zytara dollar",
  },
  {
    Code: "ZUT-USD",
    Name: "Zero Utility Token",
  },
  {
    Code: "ZXC-USD",
    Name: "0xcert",
  },
  {
    Code: "ZYD-USD",
    Name: "Zayedcoin",
  },
  {
    Code: "ZYN-USD",
    Name: "Zynecoin",
  },
  {
    Code: "ZYRO-USD",
    Name: "Zyro",
  },
];
// {
//   BTC: "Bitcoin",
//   ZRX: "0x",
//   "1INCH": "1inch",
//   AAVE: "Aave",
//   ALCX: "Alchemix",
//   ACH: "Alchemy Pay",
//   AGLD: "Adventure Gold",
//   ALGO: "Algorand",
//   AMP: "Amp",
//   FORTH: "Ampleforth Governance Token",
//   ANKR: "Ankr",
//   API3: "API3",
//   ARPA: "ARPA Chain",
//   ASM: "Assemble Protocol",
//   REP: "Augur",
//   AVAX: "Avalanche",
//   AXS: "Axie Infinity",
//   BADGER: "Badger DAO",
//   BAL: "Balancer",
//   BNT: "Bancor Network Token",
//   BAND: "Band Protocol",
//   BOND: "BarnBridge",
//   BAT: "Basic Attention Token",
//   BICO: "Biconomy",
//   BCH: "Bitcoin Cash",
//   BLZ: "Bluzelle",
//   AUCTION: "Bounce Token AUCTION",
//   BTRST: "Braintrust",
//   ADA: "Cardano",
//   CTSI: "Cartesi",
//   CGLD: "Celo",
//   LINK: "Chainlink",
//   CHZ: "Chiliz",
//   CVC: "Civic",
//   CLV: "Clover Finance",
//   COMP: "Compound",
//   ATOM: "Cosmos",
//   COTI: "COTI",
//   COVAL: "COVAL",
//   CTX: "Cryptex Finance",
//   CRO: "Crypto.com Chain",
//   CRV: "Curve DAO Token",
//   DAI: "Dai",
//   DASH: "Dash",
//   MANA: "Decentraland",
//   DESO: "Decentralized Social",
//   DDX: "DerivaDAO",
//   YFII: "DFI.Money",
//   DIA: "Dia",
//   DNT: "District0x",
//   DOGE: "Dogecoin",
//   ENJ: "Enjin Coin",
//   MLN: "Enzyme",
//   EOS: "EOS",
//   ETH: "Ethereum",
//   ETC: "Ethereum Classic",
//   ENS: "Ethereum Name Service",
//   FET: "Fetch.ai",
//   FIL: "Filecoin",
//   FX: "Function X",
//   GALA: "Gala",
//   GTC: "Gitcoin",
//   GODS: "Gods Unchained",
//   GFI: "Goldfinch",
//   GNT: "Golem",
//   GYEN: "GYEN",
//   FARM: "Harvest Finance",
//   ZEN: "Horizen",
//   IDEX: "IDEX",
//   RLC: "iExec RLC",
//   IMX: "Immutable X",
//   ICP: "Internet Computer",
//   INV: "Inverse Finance",
//   IOTX: "IoTeX",
//   JASMY: "Jasmy",
//   KEEP: "Keep Network",
//   KRL: "Kryll",
//   KNC: "Kyber Network",
//   LCX: "LCX",
//   LQTY: "Liquity",
//   LTC: "Litecoin",
//   LPT: "Livepeer (LPT)",
//   LOOM: "Loom Network",
//   LRC: "Loopring",
//   MKR: "Maker",
//   MPL: "Maple",
//   MASK: "Mask Network",
//   MDT: "Measurable Data Token",
//   MIR: "Mirror Protocol",
//   MCO2: "Moss Carbon Credit",
//   MUSD: "mStableUSD",
//   NKN: "NKN",
//   NU: "NuCypher",
//   NMR: "Numeraire",
//   OMG: "OMG Network",
//   OXT: "Orchid",
//   OGN: "Origin Token",
//   TRAC: "OriginTrail",
//   ORN: "Orion Protocol",
//   PAX: "Paxos Standard",
//   PERP: "Perpetual Protocol",
//   PLA: "PlayDapp",
//   PLU: "Pluton",
//   DOT: "Polkadot",
//   POLS: "Polkastarter",
//   MATIC: "Polygon",
//   POLY: "Polymath",
//   NCT: "Polyswarm",
//   POWR: "Powerledger",
//   PRO: "Propy",
//   QNT: "Quant",
//   QUICK: "QuickSwap",
//   RAD: "Radicle",
//   RAI: "Rai Reflex Index",
//   RLY: "Rally",
//   RGT: "Rari Governance Token",
//   RARI: "Rarible",
//   REN: "Ren",
//   REQ: "Request",
//   RBN: "Ribbon Finance",
//   FOX: "Shapeshift FOX Token",
//   SHIB: "Shiba Inu",
//   SHPING: "Shping Coin",
//   SKL: "SKALE",
//   SOL: "Solana",
//   SPELL: "Spell Token",
//   STX: "Stacks",
//   XLM: "Stellar Lumens",
//   STORJ: "STORJ",
//   SUKU: "SUKU",
//   SUPER: "SuperFarm",
//   SUSHI: "SushiSwap",
//   SNX: "Synthetix Network Token",
//   TBTC: "tBTC",
//   TRB: "Tellor",
//   UST: "TerraUSD",
//   USDT: "Tether",
//   XTZ: "Tezos",
//   GRT: "The Graph",
//   TRIBE: "Tribe",
//   TRU: "TrueFi",
//   UMA: "UMA",
//   UNFI: "Unifi Protocol DAO",
//   UNI: "Uniswap",
//   USDC: "USD Coin",
//   VGX: "Voyager Token",
//   WBTC: "Wrapped Bitcoin",
//   wCFG: "Wrapped Centrifuge",
//   WLUNA: "Wrapped LUNA",
//   XYO: "XYO Network",
//   YFI: "yearn.finance",
//   ZEC: "Zcash",
// };
