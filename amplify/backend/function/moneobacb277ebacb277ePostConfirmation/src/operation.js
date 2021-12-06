const { DynamoDB } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, PutCommand } = require('@aws-sdk/lib-dynamodb');
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

const pushDataSingly = async (params, email) => {
	try {
		await docClient.send(new PutCommand(params));
		return ('Email has been inserted in the table: ', email);
	} catch (err) {
		return(`Error while inserting entry for ${email}: `, err);
	}
};

const getDataFromEventAndPush = (event) => {
	return new Promise(async (resolve, reject) => {
		let date = new Date();
		if (event.request.userAttributes['email_verified'] === 'true') {
			let notify = event.request.userAttributes.website;
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
		resolve();
	});
};

module.exports = { getDataFromEventAndPush, pushDataSingly };
