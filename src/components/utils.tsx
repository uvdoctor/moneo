import { Menu } from "antd";
import Link from "next/link";
import { RiskProfile, TaxLiability } from "../api/goals";
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
    minimumFractionDigits: 0,
    maximumFractionDigits: decimalDigits
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

export const sendMail = async (template: any, subject: string) => {
  await fetch('/api/sendemail', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify({
      template: template,
      subject: subject
    })
  }).then((res: any) => 
    res.json()
  ).then((data: any) => {
    return data.success;
  }).catch(() => {
    return false;
  });
}

export const emailTemplate = (template: any, rating?: any) => {
  const lastName = template.lastName ? template.lastName : '';
  const ratingContent = `<h3>Rating:- ${rating}</h3>`;
  const content = `<html>
  <body>
   <h3>${template.firstName} ${lastName}</h3>
   ${rating ? ratingContent : ''}
    <div>
      <p>User:- ${template.reg}</p>
      <p>Email: -${template.email}</p>
      <p>${template.content}</p>
    </div>
  </body>
  </html>`
  return content;
};

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

export const countrylist = [
	{ countryCode: 'US', value: '+1', label: 'USA (+1)' },
	{ countryCode: 'GB', value: '+44', label: 'UK (+44)' },
	{ countryCode: 'DZ', value: '+213', label: 'Algeria (+213)' },
	{ countryCode: 'AD', value: '+376', label: 'Andorra (+376)' },
	{ countryCode: 'AO', value: '+244', label: 'Angola (+244)' },
	{ countryCode: 'AI', value: '+1264', label: 'Anguilla (+1264)' },
	{ countryCode: 'AG', value: '+1268', label: 'Antigua & Barbuda (+1268)' },
	{ countryCode: 'AR', value: '+54', label: 'Argentina (+54)' },
	{ countryCode: 'AM', value: '+374', label: 'Armenia (+374)' },
	{ countryCode: 'AW', value: '+297', label: 'Aruba (+297)' },
	{ countryCode: 'AU', value: '+61', label: 'Australia (+61)' },
	{ countryCode: 'AT', value: '+43', label: 'Austria (+43)' },
	{ countryCode: 'AZ', value: '+994', label: 'Azerbaijan (+994)' },
	{ countryCode: 'BS', value: '+1242', label: 'Bahamas (+1242)' },
	{ countryCode: 'BH', value: '+973', label: 'Bahrain (+973)' },
	{ countryCode: 'BD', value: '+880', label: 'Bangladesh (+880)' },
	{ countryCode: 'BB', value: '+1246', label: 'Barbados (+1246)' },
	{ countryCode: 'BY', value: '+375', label: 'Belarus (+375)' },
	{ countryCode: 'BE', value: '+32', label: 'Belgium (+32)' },
	{ countryCode: 'BZ', value: '+501', label: 'Belize (+501)' },
	{ countryCode: 'BJ', value: '+229', label: 'Benin (+229)' },
	{ countryCode: 'BM', value: '+1441', label: 'Bermuda (+1441)' },
	{ countryCode: 'BT', value: '+975', label: 'Bhutan (+975)' },
	{ countryCode: 'BO', value: '+591', label: 'Bolivia (+591)' },
	{ countryCode: 'BA', value: '+387', label: 'Bosnia Herzegovina (+387)' },
	{ countryCode: 'BW', value: '+267', label: 'Botswana (+267)' },
	{ countryCode: 'BR', value: '+55', label: 'Brazil (+55)' },
	{ countryCode: 'BN', value: '+673', label: 'Brunei (+673)' },
	{ countryCode: 'BG', value: '+359', label: 'Bulgaria (+359)' },
	{ countryCode: 'BF', value: '+226', label: 'Burkina Faso (+226)' },
	{ countryCode: 'BI', value: '+257', label: 'Burundi (+257)' },
	{ countryCode: 'KH', value: '+855', label: 'Cambodia (+855)' },
	{ countryCode: 'CM', value: '+237', label: 'Cameroon (+237)' },
	{ countryCode: 'CA', value: '+1', label: 'Canada (+1)' },
	{ countryCode: 'CV', value: '+238', label: 'Cape Verde Islands (+238)' },
	{ countryCode: 'KY', value: '+1345', label: 'Cayman Islands (+1345)' },
	{ countryCode: 'CF', value: '+236', label: 'Central African Republic (+236)' },
	{ countryCode: 'CL', value: '+56', label: 'Chile (+56)' },
	{ countryCode: 'CN', value: '+86', label: 'China (+86)' },
	{ countryCode: 'CO', value: '+57', label: 'Colombia (+57)' },
	{ countryCode: 'KM', value: '+269', label: 'Comoros (+269)' },
	{ countryCode: 'CG', value: '+242', label: 'Congo (+242)' },
	{ countryCode: 'CK', value: '+682', label: 'Cook Islands (+682)' },
	{ countryCode: 'CR', value: '+506', label: 'Costa Rica (+506)' },
	{ countryCode: 'HR', value: '+385', label: 'Croatia (+385)' },
	{ countryCode: 'CU', value: '+53', label: 'Cuba (+53)' },
	{ countryCode: 'CW', value: '+599', label: 'Curacao (+599)' },
	{ countryCode: 'CY', value: '+90392', label: 'Cyprus North (+90392)' },
	{ countryCode: 'CY', value: '+357', label: 'Cyprus South (+357)' },
	{ countryCode: 'CZ', value: '+420', label: 'Czech Republic (+420)' },
	{ countryCode: 'DK', value: '+45', label: 'Denmark (+45)' },
	{ countryCode: 'DJ', value: '+253', label: 'Djibouti (+253)' },
	{ countryCode: 'DM', value: '+1809', label: 'Dominica (+1809)' },
	{ countryCode: 'DO', value: '+1809', label: 'Dominican Republic (+1809)' },
	{ countryCode: 'EC', value: '+593', label: 'Ecuador (+593)' },
	{ countryCode: 'EG', value: '+20', label: 'Egypt (+20)' },
	{ countryCode: 'SV', value: '+503', label: 'El Salvador (+503)' },
	{ countryCode: 'GQ', value: '+240', label: 'Equatorial Guinea (+240)' },
	{ countryCode: 'ER', value: '+291', label: 'Eritrea (+291)' },
	{ countryCode: 'EE', value: '+372', label: 'Estonia (+372)' },
	{ countryCode: 'ET', value: '+251', label: 'Ethiopia (+251)' },
	{ countryCode: 'FK', value: '+500', label: 'Falkland Islands (+500)' },
	{ countryCode: 'FO', value: '+298', label: 'Faroe Islands (+298)' },
	{ countryCode: 'FJ', value: '+679', label: 'Fiji (+679)' },
	{ countryCode: 'FI', value: '+358', label: 'Finland (+358)' },
	{ countryCode: 'FR', value: '+33', label: 'France (+33)' },
	{ countryCode: 'GF', value: '+594', label: 'French Guiana (+594)' },
	{ countryCode: 'PF', value: '+689', label: 'French Polynesia (+689)' },
	{ countryCode: 'GA', value: '+241', label: 'Gabon (+241)' },
	{ countryCode: 'GM', value: '+220', label: 'Gambia (+220)' },
	{ countryCode: 'GE', value: '+7880', label: 'Georgia (+7880)' },
	{ countryCode: 'DE', value: '+49', label: 'Germany (+49)' },
	{ countryCode: 'GH', value: '+233', label: 'Ghana (+233)' },
	{ countryCode: 'GI', value: '+350', label: 'Gibraltar (+350)' },
	{ countryCode: 'GR', value: '+30', label: 'Greece (+30)' },
	{ countryCode: 'GL', value: '+299', label: 'Greenland (+299)' },
	{ countryCode: 'GD', value: '+1473', label: 'Grenada (+1473)' },
	{ countryCode: 'GP', value: '+590', label: 'Guadeloupe (+590)' },
	{ countryCode: 'GU', value: '+671', label: 'Guam (+671)' },
	{ countryCode: 'GT', value: '+502', label: 'Guatemala (+502)' },
	{ countryCode: 'GN', value: '+224', label: 'Guinea (+224)' },
	{ countryCode: 'GW', value: '+245', label: 'Guinea - Bissau (+245)' },
	{ countryCode: 'GY', value: '+592', label: 'Guyana (+592)' },
	{ countryCode: 'HT', value: '+509', label: 'Haiti (+509)' },
	{ countryCode: 'HN', value: '+504', label: 'Honduras (+504)' },
	{ countryCode: 'HK', value: '+852', label: 'Hong Kong (+852)' },
	{ countryCode: 'HU', value: '+36', label: 'Hungary (+36)' },
	{ countryCode: 'IS', value: '+354', label: 'Iceland (+354)' },
	{ countryCode: 'IN', value: '+91', label: 'India (+91)' },
	{ countryCode: 'ID', value: '+62', label: 'Indonesia (+62)' },
	{ countryCode: 'IR', value: '+98', label: 'Iran (+98)' },
	{ countryCode: 'IQ', value: '+964', label: 'Iraq (+964)' },
	{ countryCode: 'IE', value: '+353', label: 'Ireland (+353)' },
	{ countryCode: 'IL', value: '+972', label: 'Israel (+972)' },
	{ countryCode: 'IT', value: '+39', label: 'Italy (+39)' },
	{ countryCode: 'JM', value: '+1876', label: 'Jamaica (+1876)' },
	{ countryCode: 'JP', value: '+81', label: 'Japan (+81)' },
	{ countryCode: 'JO', value: '+962', label: 'Jordan (+962)' },
	{ countryCode: 'KZ', value: '+7', label: 'Kazakhstan (+7)' },
	{ countryCode: 'KE', value: '+254', label: 'Kenya (+254)' },
	{ countryCode: 'KI', value: '+686', label: 'Kiribati (+686)' },
	{ countryCode: 'KP', value: '+850', label: 'Korea North (+850)' },
	{ countryCode: 'KR', value: '+82', label: 'Korea South (+82)' },
	{ countryCode: 'KW', value: '+965', label: 'Kuwait (+965)' },
	{ countryCode: 'KG', value: '+996', label: 'Kyrgyzstan (+996)' },
	{ countryCode: 'LA', value: '+856', label: 'Laos (+856)' },
	{ countryCode: 'LV', value: '+371', label: 'Latvia (+371)' },
	{ countryCode: 'LB', value: '+961', label: 'Lebanon (+961)' },
	{ countryCode: 'LS', value: '+266', label: 'Lesotho (+266)' },
	{ countryCode: 'LR', value: '+231', label: 'Liberia (+231)' },
	{ countryCode: 'LY', value: '+218', label: 'Libya (+218)' },
	{ countryCode: 'LI', value: '+417', label: 'Liechtenstein (+417)' },
	{ countryCode: 'LT', value: '+370', label: 'Lithuania (+370)' },
	{ countryCode: 'LU', value: '+352', label: 'Luxembourg (+352)' },
	{ countryCode: 'MO', value: '+853', label: 'Macao (+853)' },
	{ countryCode: 'MK', value: '+389', label: 'Macedonia (+389)' },
	{ countryCode: 'MG', value: '+261', label: 'Madagascar (+261)' },
	{ countryCode: 'MW', value: '+265', label: 'Malawi (+265)' },
	{ countryCode: 'MY', value: '+60', label: 'Malaysia (+60)' },
	{ countryCode: 'MV', value: '+960', label: 'Maldives (+960)' },
	{ countryCode: 'ML', value: '+223', label: 'Mali (+223)' },
	{ countryCode: 'MT', value: '+356', label: 'Malta (+356)' },
	{ countryCode: 'MH', value: '+692', label: 'Marshall Islands (+692)' },
	{ countryCode: 'MQ', value: '+596', label: 'Martinique (+596)' },
	{ countryCode: 'MR', value: '+222', label: 'Mauritania (+222)' },
	{ countryCode: 'YT', value: '+269', label: 'Mayotte (+269)' },
	{ countryCode: 'MX', value: '+52', label: 'Mexico (+52)' },
	{ countryCode: 'FM', value: '+691', label: 'Micronesia (+691)' },
	{ countryCode: 'MD', value: '+373', label: 'Moldova (+373)' },
	{ countryCode: 'MC', value: '+377', label: 'Monaco (+377)' },
	{ countryCode: 'MN', value: '+976', label: 'Mongolia (+976)' },
	{ countryCode: 'MS', value: '+1664', label: 'Montserrat (+1664)' },
	{ countryCode: 'MA', value: '+212', label: 'Morocco (+212)' },
	{ countryCode: 'MZ', value: '+258', label: 'Mozambique (+258)' },
	{ countryCode: 'MN', value: '+95', label: 'Myanmar (+95)' },
	{ countryCode: 'NA', value: '+264', label: 'Namibia (+264)' },
	{ countryCode: 'NR', value: '+674', label: 'Nauru (+674)' },
	{ countryCode: 'NP', value: '+977', label: 'Nepal (+977)' },
	{ countryCode: 'NL', value: '+31', label: 'Netherlands (+31)' },
	{ countryCode: 'NC', value: '+687', label: 'New Caledonia (+687)' },
	{ countryCode: 'NZ', value: '+64', label: 'New Zealand (+64)' },
	{ countryCode: 'NI', value: '+505', label: 'Nicaragua (+505)' },
	{ countryCode: 'NE', value: '+227', label: 'Niger (+227)' },
	{ countryCode: 'NG', value: '+234', label: 'Nigeria (+234)' },
	{ countryCode: 'NU', value: '+683', label: 'Niue (+683)' },
	{ countryCode: 'NF', value: '+672', label: 'Norfolk Islands (+672)' },
	{ countryCode: 'NP', value: '+670', label: 'Northern Marianas (+670)' },
	{ countryCode: 'NO', value: '+47', label: 'Norway (+47)' },
	{ countryCode: 'OM', value: '+968', label: 'Oman (+968)' },
	{ countryCode: 'PW', value: '+680', label: 'Palau (+680)' },
	{ countryCode: 'PA', value: '+507', label: 'Panama (+507)' },
	{ countryCode: 'PG', value: '+675', label: 'Papua New Guinea (+675)' },
	{ countryCode: 'PY', value: '+595', label: 'Paraguay (+595)' },
	{ countryCode: 'PE', value: '+51', label: 'Peru (+51)' },
	{ countryCode: 'PH', value: '+63', label: 'Philippines (+63)' },
	{ countryCode: 'PL', value: '+48', label: 'Poland (+48)' },
	{ countryCode: 'PT', value: '+351', label: 'Portugal (+351)' },
	{ countryCode: 'PR', value: '+1787', label: 'Puerto Rico (+1787)' },
	{ countryCode: 'QA', value: '+974', label: 'Qatar (+974)' },
	{ countryCode: 'RE', value: '+262', label: 'Reunion (+262)' },
	{ countryCode: 'RO', value: '+40', label: 'Romania (+40)' },
	{ countryCode: 'RU', value: '+7', label: 'Russia (+7)' },
	{ countryCode: 'RW', value: '+250', label: 'Rwanda (+250)' },
	{ countryCode: 'SM', value: '+378', label: 'San Marino (+378)' },
	{ countryCode: 'ST', value: '+239', label: 'Sao Tome & Principe (+239)' },
	{ countryCode: 'SA', value: '+966', label: 'Saudi Arabia (+966)' },
	{ countryCode: 'SN', value: '+221', label: 'Senegal (+221)' },
	{ countryCode: 'CS', value: '+381', label: 'Serbia (+381)' },
	{ countryCode: 'SC', value: '+248', label: 'Seychelles (+248)' },
	{ countryCode: 'SL', value: '+232', label: 'Sierra Leone (+232)' },
	{ countryCode: 'SX', value: '+1', label: 'Sint Maarten (+1)' },
	{ countryCode: 'SG', value: '+65', label: 'Singapore (+65)' },
	{ countryCode: 'SK', value: '+421', label: 'Slovak Republic (+421)' },
	{ countryCode: 'SI', value: '+386', label: 'Slovenia (+386)' },
	{ countryCode: 'SB', value: '+677', label: 'Solomon Islands (+677)' },
	{ countryCode: 'SO', value: '+252', label: 'Somalia (+252)' },
	{ countryCode: 'ZA', value: '+27', label: 'South Africa (+27)' },
	{ countryCode: 'ES', value: '+34', label: 'Spain (+34)' },
	{ countryCode: 'LK', value: '+94', label: 'Sri Lanka (+94)' },
	{ countryCode: 'SH', value: '+290', label: 'St. Helena (+290)' },
	{ countryCode: 'KN', value: '+1869', label: 'St. Kitts (+1869)' },
	{ countryCode: 'SC', value: '+1758', label: 'St. Lucia (+1758)' },
	{ countryCode: 'SD', value: '+249', label: 'Sudan (+249)' },
	{ countryCode: 'SR', value: '+597', label: 'Suriname (+597)' },
	{ countryCode: 'SZ', value: '+268', label: 'Swaziland (+268)' },
	{ countryCode: 'SE', value: '+46', label: 'Sweden (+46)' },
	{ countryCode: 'CH', value: '+41', label: 'Switzerland (+41)' },
	{ countryCode: 'SI', value: '+963', label: 'Syria (+963)' },
	{ countryCode: 'TW', value: '+886', label: 'Taiwan (+886)' },
	{ countryCode: 'TJ', value: '+7', label: 'Tajikstan (+7)' },
	{ countryCode: 'TH', value: '+66', label: 'Thailand (+66)' },
	{ countryCode: 'TG', value: '+228', label: 'Togo (+228)' },
	{ countryCode: 'TO', value: '+676', label: 'Tonga (+676)' },
	{ countryCode: 'TT', value: '+1868', label: 'Trinidad & Tobago (+1868)' },
	{ countryCode: 'TN', value: '+216', label: 'Tunisia (+216)' },
	{ countryCode: 'TR', value: '+90', label: 'Turkey (+90)' },
	{ countryCode: 'TM', value: '+7', label: 'Turkmenistan (+7)' },
	{ countryCode: 'TM', value: '+993', label: 'Turkmenistan (+993)' },
	{ countryCode: 'TC', value: '+1649', label: 'Turks & Caicos Islands (+1649)' },
	{ countryCode: 'TV', value: '+688', label: 'Tuvalu (+688)' },
	{ countryCode: 'UG', value: '+256', label: 'Uganda (+256)' },
	{ countryCode: 'UA', value: '+380', label: 'Ukraine (+380)' },
	{ countryCode: 'AE', value: '+971', label: 'United Arab Emirates (+971)' },
	{ countryCode: 'UY', value: '+598', label: 'Uruguay (+598)' },
	{ countryCode: 'UZ', value: '+7', label: 'Uzbekistan (+7)' },
	{ countryCode: 'VU', value: '+678', label: 'Vanuatu (+678)' },
	{ countryCode: 'VA', value: '+379', label: 'Vatican City (+379)' },
	{ countryCode: 'VE', value: '+58', label: 'Venezuela (+58)' },
	{ countryCode: 'VN', value: '+84', label: 'Vietnam (+84)' },
	{ countryCode: 'VG', value: '+84', label: 'Virgin Islands - British (+1284)' },
	{ countryCode: 'VI', value: '+84', label: 'Virgin Islands - US (+1340)' },
	{ countryCode: 'WF', value: '+681', label: 'Wallis and Futuna (+681)' },
	{ countryCode: 'YE', value: '+969', label: 'Yemen (North) (+969)' },
	{ countryCode: 'YE', value: '+967', label: 'Yemen (South) (+967)' },
	{ countryCode: 'ZM', value: '+260', label: 'Zambia (+260)' },
	{ countryCode: 'ZW', value: '+263', label: 'Zimbabwe (+263)' },
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

export const getDiscountRate = (key: string) => {
  const percent = 5;
  switch (key) {
    case RiskProfile.VC:
      return percent;
    case RiskProfile.C:
      return percent+2;
    case RiskProfile.M:
      return percent+4;
    case RiskProfile.A:
      return percent+6;
    case RiskProfile.VA:
      return percent+11;
  }
}