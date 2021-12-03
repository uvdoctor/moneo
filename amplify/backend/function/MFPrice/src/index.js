/* Amplify Params - DO NOT EDIT
	API_GOALS_GRAPHQLAPIENDPOINTOUTPUT
	API_GOALS_GRAPHQLAPIIDOUTPUT
	ENV
	REGION
Amplify Params - DO NOT EDIT */ /* Amplify Params - DO NOT EDIT
	AUTH_MONEO3E6273BC_USERPOOLID
	ENV
	REGION
Amplify Params - DO NOT EDIT */ const mfData = require('india-mutual-fund-info');
const {
	pushData,
	pushDataForFeed,
	getTableNameFromInitialWord,
	appendGenericFields
} = require('/opt/nodejs/insertIntoDB');
const { directISIN, getDirISIN } = require('./data');
const { getType, getSubType, mfType, mCap, getName } = require('./calculate');
const table = 'INMutual';

const getData = () => {
	return new Promise(async (resolve, reject) => {
		let batches = [];
		let batchRecords = [];
		let isinMap = {};
		let count = 0;
		const mfInfoArray = await mfData.today();
		const regdirData = directISIN(mfInfoArray);
		const { regularData, directData } = regdirData;
		mfInfoArray.map((element) => {
			const id = element['ISIN Div Payout/ ISIN Growth'];
			const price = parseFloat(element['Net Asset Value']);
			if (
				id.length < 12 ||
				element['Scheme Type'].includes('ETF') ||
				element['Scheme Name'].includes('ETF') ||
				Number.isNaN(price) ||
				isinMap[id]
			)
				return;
			let dataToPush = {
				id: id,
				sid: element['Scheme Code'],
				tid: element['ISIN Div Reinvestment'],
				dir: getDirISIN(regularData, directData, element),
				name: getName(element),
				type: getType(element),
				subt: getSubType(element),
				price: price,
				mftype: mfType(element['Scheme Type']),
				mcap: mCap(element),
				tf: element['Scheme Name'].includes('Tax') ? true : false
			};
			dataToPush = appendGenericFields(dataToPush, table);
			batches.push({ PutRequest: { Item: dataToPush } });
			isinMap[id] = id;
			count++;
			if (count === 25) {
				batchRecords.push(batches);
				batches = [];
				count = 0;
			}
		});
		if (count < 25 && count > 0) {
			batchRecords.push(batches);
		}
		resolve(batchRecords);
	});
};

exports.handler = async (event) => {
	const tableName = await getTableNameFromInitialWord(table);
	console.log('Table name fetched: ', tableName);
	const data = await getData();
	for (let batch in data) {
		await pushData(data[batch], tableName);
	}
	await pushDataForFeed(table, data);
};
