const { SESClient, SendEmailCommand } = require('@aws-sdk/client-ses');

const client = new SESClient({
	region: 'us-east-1',
	apiVersion: '2010-12-01',
	credentials: {
		accessKeyId: 'AKIAROHCVNGYBO5Y6IPU',
		secretAccessKey: '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'
	}
});

const sendMail = (body, subject) => {
	const params = {
		Destination: {
			ToAddresses: [ 'emailumangdoctor@gmail.com' ]
		},
		Source: 'no-reply@moneo.money',
		Message: {
			Body: {
				Html: {
					Charset: 'UTF-8',
					Data: body
				}
			},
			Subject: {
				Charset: 'UTF-8',
				Data: `Moneo Feedback - ${subject}`
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
