const { SESClient, SendEmailCommand } = require('@aws-sdk/client-ses');
const client = new SESClient({ apiVersion: '2010-12-01' });

const sendMail = async (body, subject, toAddresses, source) => {
	const params = {
		Destination: {
			ToAddresses: toAddresses
		},
		Source: source,
		Message: {
			Body: {
				Html: {
					Charset: 'UTF-8',
					Data: body
				}
			},
			Subject: {
				Charset: 'UTF-8',
				Data: subject
			}
		}
	};
	try {
		const data = await client.send(new SendEmailCommand(params));
		return ('Mail sent with id = ' + data.MessageId);
	} catch (error) {
		console.error('Mail send error: ' + error);
	}
};

module.exports = { sendMail };
