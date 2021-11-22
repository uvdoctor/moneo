const { getDataFromEventAndPush } = require('./operation');

exports.handler = async (event, context, callback) => {
  // insert code to be executed by your lambda trigger
  const email = event.request.userAttributes.email;
	try {
		await getDataFromEventAndPush(event, context);
	} catch (err) {
		console.log(`${err} in ${email}`);
	} finally {
    callback(null, event);
  }
};
