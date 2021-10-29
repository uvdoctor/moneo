const fs = require('fs');
const fsPromise = require('fs/promises');
const { cleanDirectory, downloadZip, unzipDownloads } = require('/opt/nodejs/bhavUtils');
const { getDataFromTable, pushData, pushDataForFeed } = require('/opt/nodejs/insertIntoDB');
const { tempDir, zipFile } = require('/opt/nodejs/utility');
const constructedApiArray = require('./utils');
const { extractPartOfData, extractDataFromCSV, addMetaData } = require('./bhavUtils');
const { mkdir } = fsPromise;
const table = 'INExchg-4cf7om4zvjc4xhdn4qk2auzbdm-newdev';
const isinMap = {};

const getAndPushData = (diff) => {
	return new Promise(async (resolve, reject) => {
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
				await pushDataForFeed(table, dataCount, `${id}${ind + 1}`, url, exchg);
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
					await pushData(data[batch], table);
				}
				await pushDataForFeed(table, data, exchg, url, exchg);
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
