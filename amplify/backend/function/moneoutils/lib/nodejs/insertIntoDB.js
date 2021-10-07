const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();

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

const pushData = async (data, table) => {
	return new Promise(async (resolve, reject) => {
		const params = {
			RequestItems: {
				[table]: data
			}
		};
		try {
			const updateRecord = await docClient.batchWrite(params).promise();
			resolve(updateRecord);
		} catch (error) {
			reject(`Error in dynamoDB: ${JSON.stringify(error)}`);
		}
	});
};

const pushDataForFeed = async (table, data, identifier, url, exchg) => {
	if (!identifier) identifier = '';
	const feedData = [];
	const tname = table.slice(0, table.indexOf('-'));
	const tableName = 'Feeds-4cf7om4zvjc4xhdn4qk2auzbdm-newdev';
	const getLength = (arr) => {
		if (typeof arr === 'number') return arr;
		const len = arr.flat(Infinity);
		return len.length;
	};
	const schema = {
		id: `${tname}_${identifier}`,
		tname: tname,
		count: getLength(data),
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString(),
		__typename: tableName.slice(0, tableName.indexOf('-'))
	};
	if (exchg) schema.exchg = exchg;
	if (url) schema.url = url;
	feedData.push({ PutRequest: { Item: schema } });
	const results = await pushData(feedData, tableName);
	console.log(results, 'Data Pushed into Feeds Table');
};

module.exports = { getDataFromTable, pushData, pushDataForFeed };
