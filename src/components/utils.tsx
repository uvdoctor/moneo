export function getCurrencyList() {
	return {
		"USD": "United States dollar", "CAD": "Canadian dollar", "GBP": "Pound sterling", "EUR": "Euro", "CHF": "Swiss franc", "JPY": "Japanese yen", "CNY": "Renminbi|Chinese yuan", "INR": "Indian rupee", "SGD": "Singapore dollar", "AUD": "Australian dollar", "AED": "United Arab Emirates dirham", "AFN": "Afghan afghani", "ALL": "Albanian lek", "AMD": "Armenian dram", "ANG": "Netherlands Antillean guilder", "AOA": "Angolan kwanza", "ARS": "Argentine peso", "AWG": "Aruban florin", "AZN": "Azerbaijani manat", "BAM": "Bosnia and Herzegovina convertible mark", "BBD": "Barbados dollar", "BDT": "Bangladeshi taka", "BGN": "Bulgarian lev", "BHD": "Bahraini dinar", "BIF": "Burundian franc", "BMD": "Bermudian dollar", "BND": "Brunei dollar", "BOB": "Boliviano", "BRL": "Brazilian real", "BSD": "Bahamian dollar", "BTN": "Bhutanese ngultrum", "BWP": "Botswana pula", "BYN": "New Belarusian ruble", "BYR": "Belarusian ruble", "BZD": "Belize dollar", "CDF": "Congolese franc", "CLF": "Unidad de Fomento", "CLP": "Chilean peso", "COP": "Colombian peso", "CRC": "Costa Rican colon", "CUC": "Cuban convertible peso", "CUP": "Cuban peso", "CVE": "Cape Verde escudo", "CZK": "Czech koruna", "DJF": "Djiboutian franc", "DKK": "Danish krone", "DOP": "Dominican peso", "DZD": "Algerian dinar", "EGP": "Egyptian pound", "ERN": "Eritrean nakfa", "ETB": "Ethiopian birr", "FJD": "Fiji dollar", "FKP": "Falkland Islands pound", "GEL": "Georgian lari", "GHS": "Ghanaian cedi", "GIP": "Gibraltar pound", "GMD": "Gambian dalasi", "GNF": "Guinean franc", "GTQ": "Guatemalan quetzal", "GYD": "Guyanese dollar", "HKD": "Hong Kong dollar", "HNL": "Honduran lempira", "HRK": "Croatian kuna", "HTG": "Haitian gourde", "HUF": "Hungarian forint", "IDR": "Indonesian rupiah", "ILS": "Israeli new shekel", "IQD": "Iraqi dinar", "IRR": "Iranian rial", "ISK": "Icelandic króna", "JMD": "Jamaican dollar", "JOD": "Jordanian dinar", "KES": "Kenyan shilling", "KGS": "Kyrgyzstani som", "KHR": "Cambodian riel", "KMF": "Comoro franc", "KPW": "North Korean won", "KRW": "South Korean won", "KWD": "Kuwaiti dinar", "KYD": "Cayman Islands dollar", "KZT": "Kazakhstani tenge", "LAK": "Lao kip", "LBP": "Lebanese pound", "LKR": "Sri Lankan rupee", "LRD": "Liberian dollar", "LSL": "Lesotho loti", "LYD": "Libyan dinar", "MAD": "Moroccan dirham", "MDL": "Moldovan leu", "MGA": "Malagasy ariary", "MKD": "Macedonian denar", "MMK": "Myanmar kyat", "MNT": "Mongolian tögrög", "MOP": "Macanese pataca", "MRO": "Mauritanian ouguiya", "MUR": "Mauritian rupee", "MVR": "Maldivian rufiyaa", "MWK": "Malawian kwacha", "MXN": "Mexican peso", "MXV": "Mexican Unidad de Inversion", "MYR": "Malaysian ringgit", "MZN": "Mozambican metical", "NAD": "Namibian dollar", "NGN": "Nigerian naira", "NIO": "Nicaraguan córdoba", "NOK": "Norwegian krone", "NPR": "Nepalese rupee", "NZD": "New Zealand dollar", "OMR": "Omani rial", "PAB": "Panamanian balboa", "PEN": "Peruvian Sol", "PGK": "Papua New Guinean kina", "PHP": "Philippine peso", "PKR": "Pakistani rupee", "PLN": "Polish złoty", "PYG": "Paraguayan guaraní", "QAR": "Qatari riyal", "RON": "Romanian leu", "RSD": "Serbian dinar", "RUB": "Russian ruble", "RWF": "Rwandan franc", "SAR": "Saudi riyal", "SBD": "Solomon Islands dollar", "SCR": "Seychelles rupee", "SDG": "Sudanese pound", "SEK": "Swedish krona", "SHP": "Saint Helena pound", "SLL": "Sierra Leonean leone", "SOS": "Somali shilling", "SRD": "Surinamese dollar", "SSP": "South Sudanese pound", "STD": "São Tomé and Príncipe dobra", "SVC": "Salvadoran colón", "SYP": "Syrian pound", "SZL": "Swazi lilangeni", "THB": "Thai baht", "TJS": "Tajikistani somoni", "TMT": "Turkmenistani manat", "TND": "Tunisian dinar", "TOP": "Tongan paʻanga", "TRY": "Turkish lira", "TTD": "Trinidad and Tobago dollar", "TWD": "New Taiwan dollar", "TZS": "Tanzanian shilling", "UAH": "Ukrainian hryvnia", "UGX": "Ugandan shilling", "UYI": "Uruguay Peso en Unidades Indexadas", "UYU": "Uruguayan peso", "UZS": "Uzbekistan som", "VEF": "Venezuelan bolívar", "VND": "Vietnamese đồng", "VUV": "Vanuatu vatu", "WST": "Samoan tala", "XAF": "Central African CFA franc", "XCD": "East Caribbean dollar", "XOF": "West African CFA franc", "XPF": "CFP franc", "XXX": "No currency", "YER": "Yemeni rial", "ZAR": "South African rand", "ZMW": "Zambian kwacha", "ZWL": "Zimbabwean dollar"
	}
}

export const toCurrency = (num: number | undefined, currency: string, decimal: boolean = false) => {
	const formatter = new Intl.NumberFormat(undefined, {
		style: "currency",
		currency: currency,
		minimumFractionDigits: decimal ? 2 : 0,
		maximumFractionDigits: decimal ? 2 : 0
	})
	return num ? formatter.format(num) : formatter.format(0)
}

export const toReadableNumber = (num: number, decimalDigits: number = 0) => {
	const formatter = new Intl.NumberFormat(undefined, {
		minimumFractionDigits: decimalDigits,
		maximumFractionDigits: decimalDigits
	});
	return num ? formatter.format(num) : formatter.format(0);
}

export function getCriticalityOptions() {
	return {
		"H": "Must Meet", "M": "Try Best", "L": "OK if Not Met"
	}
}

export function getRAOptions() {
	return {
		"L": "Up to 0%", "M": "Up to 20%", "H": "Up to 50%"
	}
}

export function getTimeCostUnits() {
	return { 'hours': 'hours', 'weeks': 'weeks', 'years': 'years' }
}

export function initYearOptions(firstYear: number, duration: number) {
	let years: any = {}
	for (let i = firstYear; i <= firstYear + duration; i++) years[i] = i
	return years
}

export const createNewTarget = (year: number, val: number, curr: string, fx: number) => {
	return {
		year: year,
		val: val,
		curr: curr,
		fx: fx
	}
}

export const toStringArr = (startNum: number, endNum: number, step: number = 1) => {
	let returnArr: Array<string> = []
	for (let i = startNum; i <= endNum; i += step) returnArr.push("" + i)
	return returnArr
}