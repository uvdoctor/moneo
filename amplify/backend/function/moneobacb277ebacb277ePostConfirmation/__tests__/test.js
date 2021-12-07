const AWS = require('aws-sdk-mock');
const { getDataFromEventAndPush } = require('../src/operation');

describe('Post Confirmation Trigger', () => {
	test('Inserting Data Successfully', async () => {
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
	});
	test('Throw error as email is not verified', async () => {
		const context = {
			done: (abc, event) => {
				return event;
			}
		};
		const event = {
			request: {
				userAttributes: {
					email_verified: 'false',
					website: new Date().toISOString(),
					email: 'mehzabeen20@gmail.com'
				}
			},
			response: {}
		};
		try {
			await getDataFromEventAndPush(event, context);
		} catch (e) {
			expect(e).toEqual('Error: Nothing was written to table as email is not verified');
		}
	});
});
