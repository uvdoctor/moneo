const AWS = require('aws-sdk');
const ddb = new AWS.DynamoDB();
const table = 'RegEmail-fdun77s5lzbinkbgvnuidw6ihq-usdev';

exports.handler = async (event, context) => {
	let date = new Date();

	if (event.request.userAttributes.sub) {
		let params = {
			Item: {
				__typename: { S: 'RegEmail' },
				user: { S: event.request.userAttributes.name },
				email: { S: event.request.userAttributes.email },
				notify: { S: event.request.userAttributes.notify },
				createdAt: { S: date.toISOString() },
				updatedAt: { S: date.toISOString() }
			},
			TableName: table
		};
		// Call DynamoDB
		try {
			await ddb.putItem(params).promise();
			console.log('Success');
		} catch (err) {
			console.log('Error', err);
		}
		console.log('Success: Everything executed correctly');
		context.done(null, event);
	} else {
		// Nothing to do, the user's email ID is unknown
		console.log('Error: Nothing was written to DynamoDB');
		context.done(null, event);
	}
};
