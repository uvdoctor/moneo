const { getDataFromEventAndPush } = require('./operation');

exports.handler = async (event, context) => {
	return await getDataFromEventAndPush(event, context);
};
