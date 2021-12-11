const { DynamoDB } = require('@aws-sdk/client-dynamodb');
const {
	DynamoDBDocumentClient,
	BatchWriteCommand,
	PutCommand,
	ScanCommand,
	UpdateCommand
} = require('@aws-sdk/lib-dynamodb');
const dynamodb = new DynamoDB({});
const docClient = DynamoDBDocumentClient.from(dynamodb);

const getTableNameFromInitialWord = (tableInitial) => {
	return new Promise((resolve, reject) => {
		dynamodb.listTables({}, (err, table) => {
			if (err) reject(err);
			const tableName = table.TableNames.find((item) => item.startsWith(tableInitial));
			resolve(tableName);
		});
	});
};

const updateItem = async (table, id, fields) => {
	let exp = { UpdateExpression: 'set', ExpressionAttributeValues: {} };
	Object.entries(fields).forEach(([ key, item ]) => {
		const valKey = `:${key}`;
		exp.UpdateExpression += ` ${key} = ${valKey}, `;
		exp.ExpressionAttributeValues[valKey] = item;
	});
	exp.UpdateExpression = exp.UpdateExpression.slice(0, -1);
	const params = {
		TableName: table,
		Key: { id: id },
		...exp
	};
	try {
		const data = await docClient.send(new UpdateCommand(params));
		console.log('Success - item added or updated', data);
	} catch (err) {
		console.log('Error', err);
	}
};

const getDataFromTable = async (table) => {
	const params = { TableName: table };
	try {
		const data = await docClient.send(new ScanCommand(params));
		return data;
	} catch (err) {
		console.log('Error in dynamoDB:', err);
	}
};

const pushDataSingly = async (schema, tableName) => {
	const params = { TableName: tableName, Item: schema };
	try {
		const data = await docClient.send(new PutCommand(params));
		return data;
	} catch (err) {
		console.log('Error in dynamoDB:', err);
	}
};

const pushData = async (data, table) => {
	const params = { RequestItems: { [table]: data } };
	try {
		const data = await docClient.send(new BatchWriteCommand(params));
		return data;
	} catch (err) {
		console.log('Error in dynamoDB:', err);
	}
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
	const params = { RequestItems: { [table]: data } };
	try {
		const data = await docClient.send(new BatchWriteCommand(params));
		return data;
	} catch (error) {
		console.log('Error in dynamoDB:', err);
	}
};

module.exports = {
	getDataFromTable,
	pushData,
	pushDataForFeed,
	pushDataSingly,
	appendGenericFields,
	getTableNameFromInitialWord,
	deleteData,
	updateItem
};
