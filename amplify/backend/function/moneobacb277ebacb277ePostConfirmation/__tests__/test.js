const AWS = require('aws-sdk-mock');
const { getDataFromEventAndPush } = require('../src/operation');

describe('Inserting Data', () => {
	test('Insert', async () => {
		AWS.mock('DynamoDB', 'listTables', 'getTableNameFromInitialWord');
		AWS.mock('DynamoDB.DocumentClient', 'PutCommand', 'pushDataSingly');
		const context = {
			done: (abc, event) => {
				return event;
			}
		};
		const event = {
			request: {
				userAttributes: {
					email_verified: 'true',
					website: new Date().toISOString(),
					email: 'mehzabeen20@gmail.com'
				}
			},
			response: {}
		};
		expect(await getDataFromEventAndPush(event, context)).toEqual('Success');
		AWS.restore('DynamoDB');
		AWS.restore('DynamoDB.DocumentClient');
	},10000);
});
