const fs = require('fs');
const fsPromise = require('fs/promises');
const { pushData, pushDataForFeed, getTableNameFromInitialWord } = require("/opt/nodejs/databaseUtils");
const { tempDir, zipFile } = require('/opt/nodejs/utility');
const { cleanDirectory, downloadZip, unzipDownloads } = require("/opt/nodejs/downloadUtils");
const constructedApiArray = require('./utils');
const extractDataFromCSV = require('./bhavUtils');
const { getPrev } = require('/opt/nodejs/prevUtils');
const { mkdir } = fsPromise;
const table = 'INBondPrice';
const isinMap = {};

const downloadFile = async (apiArray, prevMap, isPrevFile) => {
	const { typeExchg, fileName, url, schema, codes } = apiArray;
	const csvFile = `${tempDir}/${fileName}`;
	await mkdir(tempDir);
	if (url.includes('zip')) {
		await downloadZip(url, tempDir, zipFile);
		await unzipDownloads(zipFile, tempDir);
	} else {
		await downloadZip(url, tempDir, csvFile);
	}
	const data = await extractDataFromCSV(fileName, typeExchg, codes, schema, isinMap, table, prevMap, isPrevFile);
	return data;
}

const getAndPushData = (diff) => {
	return new Promise(async (resolve, reject) => {
		const tableName = await getTableNameFromInitialWord(table);
		console.log('Table name fetched: ', tableName);
		const apiArray = constructedApiArray(diff);
		for (let i = 0; i < apiArray.length; i++) {
			try {
				if (fs.existsSync(tempDir)) {
					await cleanDirectory(tempDir, 'Initial cleaning completed');
				}
				const prevMap = await getPrev(diff, downloadFile, constructedApiArray, table, i);
				console.log(Object.keys(prevMap).length);
				const data = await downloadFile(apiArray[i], prevMap, false);
				for (let batch in data) {
					await pushData(data[batch], tableName);
				}
				await pushDataForFeed(table, data, `${typeExchg}${i}`, url, typeExchg);
			} catch (err) {
				reject(err);
			}
		}
		resolve();
	});
};

exports.handler = async (event) => {
	return await getAndPushData(event.diff);
};
