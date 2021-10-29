const fs = require('fs');
const csv = require('csv-parser');
const { cleanDirectory } = require('/opt/nodejs/bhavUtils');
const { tempDir } = require('/opt/nodejs/utility');
const { calcSchema } = require('./calculate');

const extractDataFromCSV = async (fileName, exchg, codes, schema, table, isinMap, nameMap, weekHLMap) => {
	const end = new Promise((resolve, reject) => {
		let batches = [];
		let batchRecords = [];
		let count = 0;
		fs
			.createReadStream(`${tempDir}/${fileName}`)
			.pipe(csv())
			.on('data', (record) => {
				if (isinMap[record[codes.id]]) return;
				const updateSchema = calcSchema(record, codes, schema, exchg, isinMap, table);
				if (!updateSchema) return;
				const dataToPush = JSON.parse(JSON.stringify(updateSchema));
				const id = dataToPush.id;
				const sid = dataToPush.sid;
				if (nameMap[id]) {
					dataToPush.name = nameMap[id].name;
					dataToPush.fv = nameMap[id].fv;
					if (nameMap[id].under) dataToPush.under = nameMap[id].under;
				}
				if (weekHLMap[sid]) {
					dataToPush.yhigh = weekHLMap[sid].yhigh;
					dataToPush.ylow = weekHLMap[sid].ylow;
				}
				batches.push({ PutRequest: { Item: dataToPush } });
				count++;
				if (count === 25) {
					batchRecords.push(batches);
					batches = [];
					count = 0;
				}
			})
			.on('end', async () => {
				if (count < 25 && count > 0) {
					batchRecords.push(batches);
				}
				await cleanDirectory(
					tempDir,
					`${fileName} of ${exchg} results extracted successfully and directory is cleaned`
				);
				resolve(batchRecords);
			})
			.on('error', (err) => {
				cleanDirectory(tempDir, `Unable to read ${type} csv file, ${err.message}`);
				throw new Error(err.message);
			});
	});
	return await end;
};

const extractPartOfData = async (fileName, codes, nameMap, weekHLMap) => {
	const end = new Promise((resolve, reject) => {
		let count = 0;
		const csvFormat = fileName.includes('CM_52_wk_High_low') ? csv({ headers: true }) : csv();
		fs
			.createReadStream(`${tempDir}/${fileName}`)
			.pipe(csvFormat)
			.on('data', (record) => {
				const parse = (data) => (parseFloat(data) ? parseFloat(data) : null);
				if (fileName.includes('CM_52_wk_High_low')) {
					weekHLMap[record[codes.sid]] = {
						yhigh: parse(record[codes.yhigh]),
						ylow: parse(record[codes.ylow])
					};
				} else {
					nameMap[record[codes.id]] = {
						fv: parse(record[codes.fv]),
						name: record[codes.name]
					};
					if (fileName === 'eq_etfseclist.csv'){
						nameMap[record[codes.id]].under = record[codes.under].replace(/\n/g, '');
					}
				}
				count++;
			})
			.on('end', async () => {
				await cleanDirectory(tempDir, `${fileName} results extracted successfully and directory is cleaned`);
				resolve(count);
			})
			.on('error', (err) => {
				cleanDirectory(tempDir, `Unable to read ${fileName} csv file, ${err.message}`);
				throw new Error(err.message);
			});
	});
	return await end;
};

const addMetaData = async (exchgData, getDataFromTable) => {
	const table = 'INExchgMeta-4cf7om4zvjc4xhdn4qk2auzbdm-newdev';
	const data = await getDataFromTable(table);
	exchgData.map((element) => {
		element.map((item) => {
			const metaData = data.Items.find((re) => re.id === item.PutRequest.Item.id);
			if (!metaData) return;
			item.PutRequest.Item.meta = metaData;
		});
	});

	return exchgData;
};

module.exports = {
	extractDataFromCSV,
	extractPartOfData,
	addMetaData
};
