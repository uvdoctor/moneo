const { getDataFromEventAndPush } = require('./operation');

exports.handler = async (event, context) => {
	// insert code to be executed by your lambda trigger
	if(context) console.log(context);
	const email = event.request.userAttributes.email;
	try {
		await getDataFromEventAndPush(event);
	} catch (err) {
		console.log(`${err} in ${email}`);
	}
};
