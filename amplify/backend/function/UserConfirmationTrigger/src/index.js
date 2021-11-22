const { getDataFromEventAndPush } = require('./operation');

exports.handler = async (event, context) => {
	const email = event.request.userAttributes.email;
	try {
		return await getDataFromEventAndPush(event, context);
	} catch (err) {
		console.log(`${err} in ${email}`);
	}
};
