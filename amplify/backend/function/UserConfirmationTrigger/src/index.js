const AWS = require('aws-sdk');
const ddb = new AWS.DynamoDB();
const table = 'RegEmail-fdun77s5lzbinkbgvnuidw6ihq-usdev';

const pushDataSingly = (params) => {
	return new Promise(async (resolve, reject) => {
		try {
			await ddb.putItem(params).promise();
			resolve('Email has been inserted in the table: ', email);
		} catch (err) {
			reject(`Error while inserting entry for ${email}: `, err);
		}
	});
};

const getDataFromEventAndPush = (event, context) => {
	return new Promise(async (resolve, reject) => {
		let date = new Date();
		try {
			if (event.request.userAttributes['email_verified'] === 'true') {
				let notify = event.request.userAttributes['custom:notify'];
				let email = event.request.userAttributes.email;
				let params = {
					Item: {
						__typename: { S: 'RegEmail' },
						email: { S: email },
						notify: { S: !notify || notify.length === 1 ? 'N' : 'Y' },
						createdAt: { S: date.toISOString() },
						updatedAt: { S: date.toISOString() }
					},
					TableName: table
				};
				const response = await pushDataSingly(params);
				console.log(response);
			} else {
				console.log('Error: Nothing was written to table as email is not verified');
			}
			context.done(null, event);
			resolve();
		} catch (err) {
			reject(err);
		}
	});
};

exports.handler = async (event, context) => {
	return await getDataFromEventAndPush(event, context);
};
