const { getDataFromEventAndPush } = require('./operation');

exports.handler = async (event) => {
	// insert code to be executed by your lambda trigger
	const email = event.request.userAttributes.email;
	try {
		await getDataFromEventAndPush(event);
	} catch (err) {
		console.log(`${err} in ${email}`);
	}
};
