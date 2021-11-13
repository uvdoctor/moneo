const { getDataFromEventAndPush, getTableNameFromInitialWord, pushDataSingly } = require('../src/operation');

describe('Inserting Data', () => {
	test('Insert', async () => {
		const context = {
			done: (abc, event) => {
				return event;
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
		const pushDataSingly = jest.fn().mockImplementation(() => {
			return 'Success';
		});
		const getTableNameFromInitialWord = jest.fn().mockImplementation(() => {
			return 'Contacts';
		});
		expect(getDataFromEventAndPush(event, context)).toEqual(3);
	},10000);
});
