const AWS = require('aws-sdk');
var dynamodb = new AWS.DynamoDB();
const docClient = new AWS.DynamoDB.DocumentClient();

const getTableNameFromInitialWord = async (tableInitial) => {
	try {
		const table = await dynamodb.listTables().promise();
		return table.TableNames.find((item)=> item.startsWith(tableInitial));
	} catch (err) {
		console.log(err);
	}
};

const getDataFromTable = async (table) => {
	const params = { TableName: table };
	try {
		const data = await docClient.scan(params).promise();
		return data;
	} catch (err) {
		console.log(`Error in dynamoDB: ${JSON.stringify(err)}`);
		return `Error in dynamoDB: ${JSON.stringify(err)}`;
	}
};

const pushDataSingly = (schema, tableName) => {
	return new Promise(async (resolve, reject) => {
		const params = { TableName: tableName, Item: schema };
		try {
			const data = await docClient.put(params).promise();
			resolve(data);
		} catch (err) {
			reject(err);
		}
	});
};

const pushData = async (data, table) => {
	return new Promise(async (resolve, reject) => {
		const params = { RequestItems: { [table]: data } };
		try {
			const updateRecord = await docClient.batchWrite(params).promise();
			resolve(updateRecord);
		} catch (error) {
			reject(`Error in dynamoDB: ${JSON.stringify(error)}`);
		}
	});
};

const appendGenericFields = (schema, tableName) => {
	let dateStr = new Date().toISOString();
	schema.createdAt = dateStr;
	schema.updatedAt = dateStr;
	schema.__typename = tableName;
	return schema;
};

const pushDataForFeed = async (table, data, identifier, url, exchg) => {
	if (!identifier) identifier = '';
	const tableName = await getTableNameFromInitialWord('Feeds');
	const getLength = (arr) => {
		if (typeof arr === 'number') return arr;
		const len = arr.flat(Infinity);
		return len.length;
	};
	let schema = {
		id: `${table}_${identifier}`,
		tname: table,
		count: getLength(data)
	};
	schema = appendGenericFields(schema, tableName);
	console.log('Feed schema to be inserted: ', schema);
	if (exchg) schema.exchg = exchg;
	if (url) schema.url = url;
	const results = await pushDataSingly(schema, tableName);
	console.log(results, 'Data Pushed into Feeds Table');
};

const deleteData = async (data, table) => {
	return new Promise(async (resolve, reject) => {
		const params = { RequestItems: { [table]: data } };
		try {
			const updateRecord = await docClient.batchWrite(params).promise();
			console.log(updateRecord);
			resolve(updateRecord);
		} catch (error) {
			reject(`Error in dynamoDB: ${JSON.stringify(error)}`);
		}
	});
};

module.exports = {
	getDataFromTable,
	pushData,
	pushDataForFeed,
	pushDataSingly,
	appendGenericFields,
	getTableNameFromInitialWord,
	deleteData
};
