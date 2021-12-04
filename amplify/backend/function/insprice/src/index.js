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
const { cleanDirectory, downloadZip, unzipDownloads } = require('/opt/nodejs/bhavUtils');
const { getDataFromTable, pushData, pushDataForFeed, getTableNameFromInitialWord } = require('/opt/nodejs/insertIntoDB');
const { tempDir, zipFile } = require('/opt/nodejs/utility');
const constructedApiArray = require('./utils');
const { extractPartOfData, extractDataFromCSV, addMetaData } = require('./bhavUtils');
const { mkdir } = fsPromise;
const table = 'INExchgPrice';
const isinMap = {};
const dataToPushInFeeds = [];

const getAndPushData = (diff) => {
	return new Promise(async (resolve, reject) => {
		const tableName = await getTableNameFromInitialWord(table);
		console.log('Table name fetched: ', tableName);
		const { apiArray, partOfDataApiArray } = constructedApiArray(diff);
		const nameMap = {};
		const weekHLMap = {};
		try {
			if (fs.existsSync(tempDir)) {
				await cleanDirectory(tempDir, 'Initial cleaning completed');
			}
			for (let ind = 0; ind < partOfDataApiArray.length; ind++) {
				const { exchg, id, fileName, url, codes } = partOfDataApiArray[ind];
				const csvFile = `${tempDir}/${fileName}`;
				await mkdir(tempDir);
				await downloadZip(url, tempDir, csvFile);
				const dataCount = await extractPartOfData(fileName, codes, nameMap, weekHLMap);
				dataToPushInFeeds.push({ table, dataCount, identifier: `${id}${ind + 1}`, url, exchg });
			}
			for (let i = 0; i < apiArray.length; i++) {
				const { exchg, fileName, url, schema, codes } = apiArray[i];
				console.log(url);
				await mkdir(tempDir);
				await downloadZip(url, tempDir, zipFile);
				await unzipDownloads(zipFile, tempDir);
				const exchgData = await extractDataFromCSV(
					fileName,
					exchg,
					codes,
					schema,
					table,
					isinMap,
					nameMap,
					weekHLMap
				);
				const data = await addMetaData(exchgData, getDataFromTable);
				for (let batch in data) {
					await pushData(data[batch], tableName);
				}
				dataToPushInFeeds.push({ table, dataCount: data, identifier: exchg, url, exchg });
			}
			for (item of dataToPushInFeeds) {
				await pushDataForFeed(item.table, item.dataCount, item.identifier, item.url, item.exchg);
			}
		} catch (err) {
			reject(err);
		}
		resolve();
	});
};

exports.handler = async (event) => {
	return await getAndPushData(event.diff);
};
