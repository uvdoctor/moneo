const AWS = require('aws-sdk');
const ddb = new AWS.DynamoDB();
const table = 'RegEmail-fdun77s5lzbinkbgvnuidw6ihq-usdev';

exports.handler = async (event, context) => {
	let date = new Date();
	if (
		event.request.userAttributes['email_verified'] === 'true'
	) {
		let notify = event.request.userAttributes['custom:notify'];
		let email = event.request.userAttributes.email
		let params = {
			Item      : {
				__typename : { S: 'RegEmail' },
				email      : { S:  email},
				notify     : { S: !notify || notify.length === 1 ? 'N' : 'Y' },
				createdAt  : { S: date.toISOString() },
				updatedAt  : { S: date.toISOString() }
			},
			TableName : table
		};
		try {
			await ddb.putItem(params).promise();
			console.log('Email has been inserted in the table: ', email);
		} catch (err) {
			console.log(`Error while inserting entry for ${email}: `, err);
		}
	} else {
		console.log('Error: Nothing was written to table as email is not verified');
	}
	context.done(null, event);
};
