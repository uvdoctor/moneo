const { getAndPushData } = require('./getData');

exports.handler = async (event) => {
	return await getAndPushData(event.diff);
};
