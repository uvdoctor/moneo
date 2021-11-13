const { getDataFromEventAndPush, getTableNameFromInitialWord, pushDataSingly } = require('../src/operation');

describe('Inserting Data', () => {
	test('Insert', async () => {
		const context = {
			done: (abc, event) => {
				console.log(event);
			}
		};
		const event = {
			request: {
				userAttributes: {
					email_verified: 'true',
					'custom:notify': new Date().toISOString(),
					email: 'mehzabeen20@gmail.com'
				}
			},
			response: {}
		};
		const data = await getDataFromEventAndPush(event, context);
		pushDataSingly = jest.fn().mockImplementation(() => {
			return 3;
		});
		getTableNameFromInitialWord = jest.fn().mockImplementation(() => {
			return 5;
		});
		expect(await getDataFromEventAndPush()).toEqual(3);
	},10000);
});
