const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();
const table = 'RegEmail-4cf7om4zvjc4xhdn4qk2auzbdm-usdev';

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

exports.handler = async (event) => {
	const data = event.request.userAttributes;
	console.log(data);
	if (data) {
		await pushDataSingly(
			{
				email: data.email,
				user: data.username,
				data: data.notify,
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString()
			},
			table
		);
	} else {
		return 'Error in updating Email';
	}
};
