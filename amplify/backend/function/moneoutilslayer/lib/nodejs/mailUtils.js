const { SESClient, SendEmailCommand } = require('@aws-sdk/client-ses');
const client = new SESClient({});

const sendMail = (body, subject, toAddresses, source) => {
	const params = {
		Destination: {
			// toAddresses - Array
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
	client
		.send(new SendEmailCommand(params))
		.then((data) => {
			console.log('Mail sent with id = ' + data.MessageId);
		})
		.catch((error) => {
			console.error('Mail send error: ' + error);
		});
};

module.exports = { sendMail };
