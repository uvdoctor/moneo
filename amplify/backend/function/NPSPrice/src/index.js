/* Amplify Params - DO NOT EDIT
	API_GOALS_GRAPHQLAPIENDPOINTOUTPUT
	API_GOALS_GRAPHQLAPIIDOUTPUT
	ENV
	REGION
Amplify Params - DO NOT EDIT */ /* Amplify Params - DO NOT EDIT
	AUTH_MONEO3E6273BC_USERPOOLID
	ENV
	REGION
Amplify Params - DO NOT EDIT */ const fs = require('fs');
const fsPromise = require('fs/promises');
const { pushData, pushDataForFeed, getTableNameFromInitialWord } = require('/opt/nodejs/insertIntoDB');
const { downloadZip, unzipDownloads, cleanDirectory } = require('/opt/nodejs/bhavUtils');
const { tempDir, zipFile } = require('/opt/nodejs/utility');
const calc = require('./calculate');
const getDataFromTxtFile = require('./bhavUtils');
const constructedApiArray = require('./utils');
const { mkdir } = fsPromise;
const table = 'NPS';

const getAndPushData = (diff) => {
	return new Promise(async (resolve, reject) => {
		const tableName = await getTableNameFromInitialWord(table);
		console.log('Table name fetched: ', tableName);
		const apiArray = constructedApiArray(diff);
		try {
			if (fs.existsSync(tempDir)) {
				await cleanDirectory(tempDir, 'Initial cleaning completed');
			}
			const { fileName, url } = apiArray;
			await mkdir(tempDir);
			await downloadZip(url, tempDir, zipFile);
			await unzipDownloads(zipFile, tempDir);
			const data = await getDataFromTxtFile(fileName, calc, table);
			for (let batch in data) {
				await pushData(data[batch], tableName);
			}
			await pushDataForFeed(table, data, '', url);
		} catch (err) {
			reject(err);
		}

		resolve();
	});
};

exports.handler = async (event) => {
	return await getAndPushData(event.diff);
};
