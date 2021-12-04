/* Amplify Params - DO NOT EDIT
	API_GOALS_GRAPHQLAPIENDPOINTOUTPUT
	API_GOALS_GRAPHQLAPIIDOUTPUT
	ENV
	REGION
Amplify Params - DO NOT EDIT *//* Amplify Params - DO NOT EDIT
	AUTH_MONEO3E6273BC_USERPOOLID
	ENV
	REGION
Amplify Params - DO NOT EDIT */ const fs = require('fs');
const fsPromise = require('fs/promises');
const { pushData, pushDataForFeed, getTableNameFromInitialWord, getDataFromTable } = require('/opt/nodejs/insertIntoDB');
const { tempDir } = require('/opt/nodejs/utility');
const { cleanDirectory, downloadZip } = require('/opt/nodejs/bhavUtils');
const constructedApiArray = require('./utils');
const extractData = require('./bhavUtils');
const { mkdir } = fsPromise;
const table = 'InsMeta';
const isinMap = {};

const getAndPushData = (diff, tableName) => {
	return new Promise(async (resolve, reject) => {
		const apiArray = constructedApiArray(diff);
		for (let i = 0; i < apiArray.length; i++) {
			try {
				if (fs.existsSync(tempDir)) {
					await cleanDirectory(tempDir, 'Initial cleaning completed');
				}
				const { fileName, url, exchg, codes } = apiArray[i];
				const csvFile = `${tempDir}/${fileName}`;
				await mkdir(tempDir);
				await downloadZip(url, tempDir, csvFile);
				const data = await extractData(fileName, codes, isinMap, table);
				for (let batch in data) {
					await pushData(data[batch], tableName);
				}
				await pushDataForFeed(table, data, `${exchg}${i + 1}`, url, exchg);
			} catch (err) {
				reject(err);
			}
		}
		resolve();
	});
};

exports.handler = async (event) => {
	const tableName = await getTableNameFromInitialWord(table);
	console.log('Table name fetched: ', tableName);
	if(event.diff) return await getAndPushData(event.diff, tableName);
	if(event.data) return await getDataFromTable(tableName);
};
