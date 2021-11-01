const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();
const table = 'RegEmail-fdun77s5lzbinkbgvnuidw6ihq-usdev';

const pushDataSingly = async (data, table) => {
	const params = { TableName: table, Item: data };
	try {
		const data = await docClient.put(params).promise();
		return data;
	} catch (err) {
		console.log(`Error in dynamoDB: ${JSON.stringify(err)}`);
		return `Error in dynamoDB: ${JSON.stringify(err)}`;
	}
};

exports.handler = async (event, context, callback) => {
	const data = event.request.userAttributes;
	console.log("Going to insert email: ", data.email);
	if (data.email) {
		await pushDataSingly(
			{
				__typename: 'RegEmail',
				email: data.email,
				user: data.username,
				data: data.notify,
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString()
			},
			table
		);
		console.log('Success: Everything executed correctly');
		callback(null, event);
	} else {
		console.log('Error: Nothing was written to DynamoDB');
		callback(null, event);
	}
};
