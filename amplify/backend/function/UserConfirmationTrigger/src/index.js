const { pushDataSingly } = require('../../moneopriceutils/lib/nodejs/insertIntoDB');
const table = 'RegEmail-4cf7om4zvjc4xhdn4qk2auzbdm-usdev';

exports.handler = async (event, context, callback) => {
	const data = event.request.userAttributes;
    console.log(data);
	if (data) {
		await pushDataSingly({ email: data.email, user: data.username, data: data.notify }, table);
        callback(null, event);
	} else {
        callback(null, event);
		return 'Error in updating Email';
	}
};
