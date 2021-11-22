const AWS = require('aws-sdk');
const ddb = new AWS.DynamoDB();

const getTableNameFromInitialWord = (tableInitial) => {
	return new Promise(async (resolve, reject) => {
		var params = { ExclusiveStartTableName: tableInitial, Limit: 1 };
		try {
			const table = await ddb.listTables(params).promise();
			resolve(table.TableNames[0]);
		} catch (err) {
			console.log(err);
			reject(err);
		}
	});
};

const pushDataSingly = (params, email) => {
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
		// const table = 'Contacts-fdun77s5lzbinkbgvnuidw6ihq-dev';
		let date = new Date();
		try {
			if (event.request.userAttributes['email_verified'] === 'true') {
				let notify = event.request.userAttributes['custom:notify'];
				let email = event.request.userAttributes.email;
				const table = await getTableNameFromInitialWord('Contacts');
				let params = {
					Item: {
						__typename: { S: 'Contacts' },
						email: { S: email },
						notify: { BOOL: !notify || notify.length === 1 ? false : true },
						createdAt: { S: date.toISOString() },
						updatedAt: { S: date.toISOString() }
					},
					TableName: table
				};
				const response = await pushDataSingly(params, email);
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

module.exports = { getDataFromEventAndPush, pushDataSingly };
