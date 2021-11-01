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

const getEntry = (data) => {
	return {
		__typename: 'RegEmail',
		email: data.email,
		user: data.username,
		notify: data.notify,
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString()
	}
}

exports.handler = async (event, context, callback) => {
	const data = event.request.userAttributes;
	console.log("Going to insert email: ", data.email);
	if (data.email) {
		try {
			await pushDataSingly(getEntry(data), table);
			console.log('Success: Everything executed correctly');
		} catch(e) {
			console.log('Error while inserting email into db: ', e);
		} finally {
			callback(null, event);
		}
	} 
};
