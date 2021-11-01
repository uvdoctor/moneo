const AWS = require('aws-sdk');
const ddb = new AWS.DynamoDB();
const table = 'RegEmail-fdun77s5lzbinkbgvnuidw6ihq-usdev';

exports.handler = async (event, context) => {
	let date = new Date();
	console.log('Event request: ', event.request);
	if (
		event.request.userAttributes['cognito:user_status'] === 'CONFIRMED' &&
		event.request.userAttributes['email_verified'] === 'true'
	) {
		let notify = event.request.userAttributes['custom:notify'];
		let params = {
			Item      : {
				__typename : { S: 'RegEmail' },
				email      : { S: event.request.userAttributes.email },
				notify     : { S: !notify || notify.length === 1 ? 'N' : 'Y' },
				createdAt  : { S: date.toISOString() },
				updatedAt  : { S: date.toISOString() }
			},
			TableName : table
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
