const { utility } = require('/opt/nodejs/utility');
const constructedApiArray = (diff) => {
	const { date, month, monthChar, year, yearFull } = utility(diff);
	const nseFileName = `wdmlist_${date}${month}${yearFull}`;
	const bseDate = `${date}${month}${yearFull}`;

	const apiArray = [
		{
			typeExchg: 'NSE',
			fileName: nseFileName,
			url: `https://www1.nseindia.com/content/historical/WDM/${yearFull}/${monthChar}/${nseFileName}.csv`,
			schema: {
				id: '',
				sid: '',
				name: '',
				exchg: '',
				subt: '',
				price: 0,
				sm: 0,
				sy: 0,
				mm: 0,
				my: 0,
				rate: 0,
				itype: '',
				fv: 0,
				cr: null,
				crstr: null,
				ytm: 0,
				createdAt: '',
				updatedAt: ''
			},
			codes: {
				sid: 'SECURITY',
				id: 'ISIN NO.',
				name: 'ISSUE_DESC',
				price: 'Last Traded Price (in Rs.)',
				subt: 'SECTYPE',
				frate: 'ISSUE_NAME',
				sDate: 'ISSUE_DATE',
				mDate: 'MAT_DATE',
				rate: 'ISSUE_NAME',
				crstr: ''
			}
		},
		{
			typeExchg: 'BSE',
			fileName: `fgroup${bseDate}.csv`,
			url: `https://www.bseindia.com/download/Bhavcopy/Debt/DEBTBHAVCOPY${bseDate}.zip`,
			schema: {
				id: '',
				sid: '',
				name: '',
				subt: '',
				price: 0,
				exchg: '',
				sm: 0,
				sy: 0,
				mm: 0,
				my: 0,
				rate: 0,
				itype: '',
				fv: 0,
				cr: null,
				crstr: null,
				ytm: 0,
				createdAt: '',
				updatedAt: ''
			},
			codes: {
				sid: 'Security_cd',
				id: 'ISIN No.',
				name: 'sc_name',
				price: 'Close Price',
				subt: '',
				rate: 'COUP0N (%)',
				frate: 'COUP0N (%)',
				fv: 'FACE VALUE',
				sDate: '',
				mDate: '',
				crstr: ''
			}
		},
		{
			typeExchg: 'BSE',
			fileName: `icdm${bseDate}.csv`,
			url: `https://www.bseindia.com/download/Bhavcopy/Debt/DEBTBHAVCOPY${bseDate}.zip`,
			schema: {
				id: '',
				sid: '',
				name: '',
				subt: '',
				price: 0,
				exchg: '',
				sm: 0,
				sy: 0,
				itype: '',
				mm: 0,
				my: 0,
				rate: 0,
				fv: 0,
				cr: null,
				crstr: null,
				ytm: 0
			},
			codes: {
				sid: 'Security Code',
				id: 'ISIN No.',
				name: 'Issuer Name',
				price: 'LTP',
				subt: '',
				rate: 'Coupon (%)',
				mDate: 'Maturity Date',
				frate: 'Coupon (%)',
				fv: 'FACE VALUE',
				sDate: '',
				crstr: '',
				createdAt: '',
				updatedAt: ''
			}
		}
	];
	return apiArray;
};

module.exports = constructedApiArray;
