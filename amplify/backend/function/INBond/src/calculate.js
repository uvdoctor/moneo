const { appendGenericFields } = require('/opt/nodejs/insertIntoDB');

const monthsArray = [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec' ];
const calc = {
	calcSubType: (subt) => {
		const gbo = [ 'AT', 'CP', 'FT', 'ID', 'IF', 'IP', 'MT', 'PF', 'PG', 'PI', 'PR', 'PT', 'PZ', 'SG', 'TS' ];
		const gb = [ 'GF', 'GI', 'GS', 'TB' ];
		switch (true) {
			case gbo.indexOf(subt) > -1:
				return 'GBO';
			case gb.indexOf(subt) > -1:
				return 'GB';
			default:
				return 'CB';
		}
	},

	calcSM: (sDate) => {
		if (!sDate) return null;
		const month = monthsArray.indexOf(sDate.slice(sDate.indexOf('-') + 1, sDate.lastIndexOf('-'))) + 1;
		return month;
	},

	calcSY: (sDate) => {
		if (!sDate) return null;
		const year = sDate.slice(sDate.lastIndexOf('-') + 1, sDate.length);
		return Number(year);
	},

	calcMM: (mDate) => {
		if (!mDate) return null;
		const matMonth = monthsArray.indexOf(mDate.slice(mDate.indexOf('-') + 1, mDate.lastIndexOf('-'))) + 1;
		return matMonth;
	},

	calcMY: (mDate) => {
		if (!mDate) return null;
		const matYear = mDate.slice(mDate.lastIndexOf('-') + 1, mDate.length);
		return Number(matYear);
	},

	calcFR: (frate) => {
		if (frate === 'RESET') return true;
		return false;
	},

	calcTF: (subt) => {
		if (subt === 'IF' || subt === 'PF') return true;
		return false;
	},

	calcCR: (crstr) => {
		if (!crstr) return null;
		if (crstr.includes('AA') && !crstr.includes('-')) return 'E';
		if (crstr.includes('BBB') || crstr.includes('B+')) return 'M';
		if (crstr.includes('A')) return 'H';
		if (crstr.includes('BB') && !crstr.includes('+')) return 'L';
		return 'J';
	},

	calcPrice: (price) => {
		const value = Number(price);
		if (!value) return 100;
		return Number(value);
	}
};

const calcYTM = (record, codes) => {
	const reset = record[codes.rate];
	const rate = reset.includes('RESET') || reset >= 20 ? 0 : parseFloat(reset);
	const fv = 100;
	const matrMonth = calc.calcMM(record[codes.mDate]);
	const matrYear = calc.calcMY(record[codes.mDate]);
	const startMonth = calc.calcSM(record[codes.sDate]);
	const startYear = calc.calcSY(record[codes.sDate]);
	const numOfYear = (12 - startMonth) / 12 + (matrYear - startYear - 1) + matrMonth / 12;
	const mPrice = calc.calcPrice(record[codes.price]);
	const couponAmt = fv * Number(rate) / 100;
	const ytm = (couponAmt + (fv - mPrice) / numOfYear) / ((fv + mPrice) / 2);
	const ytmFinal = Math.round(ytm * 1000) / 1000;
	if (ytmFinal < 0) return 0;
	return ytmFinal;
};

const calcSchema = (record, codes, schema, typeExchg, isinMap, table) => {
	if (!record[codes.id] || record[codes.subt] === 'MC') return;
	schema.id = record[codes.id];
  	if(!schema.id.startsWith('IN')) return;
	schema.sid = record[codes.sid];
	schema.name = record[codes.name] ? record[codes.name] : record[codes.sid];
	schema.price = calc.calcPrice(record[codes.price]);
	schema.type = 'F';
	schema.subt = calc.calcSubType(record[codes.subt]);
	schema.exchg = typeExchg;
	schema.sm = calc.calcSM(record[codes.sDate]);
	schema.sy = calc.calcSY(record[codes.sDate]);
	schema.mm = calc.calcMM(record[codes.mDate]);
	schema.my = calc.calcMY(record[codes.mDate]);
	schema.fr = calc.calcFR(record[codes.frate]);
	schema.tf = calc.calcTF(record[codes.subt]);
	schema.cr = calc.calcCR(record[codes.crstr]);
	const reset = record[codes.rate];
	schema.rate = reset.includes('RESET') || reset > 20 ? 0 : reset === '' ? null : parseFloat(reset);
	schema.fv = 100;
	schema.ytm = calcYTM(record, codes);
	appendGenericFields(schema, table);
	isinMap[record[codes.id]] = record[codes.id];
	if (schema.rate === null) schema.name.startsWith('0') ? (schema.rate = parseFloat(0)) : schema.rate = -1;
	return schema;
};
module.exports = { calcSchema, calc, calcYTM };
