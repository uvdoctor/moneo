const { sendMail } = require('/opt/nodejs/mailUtils');

const subject = {
	C: 'Comment',
	S: 'Suggestion',
	Q: 'Question'
};

exports.handler = (event) => {
	event.Records.forEach((record) => {
		if (record.eventName == 'INSERT') {
			const { name, email, feedback, type, uname } = record.dynamodb.NewImage;
			const firstName = name.M.fn ? name.M.fn.S : '';
			const lastName = name.M.ln ? name.M.ln.S : '';
			const template = `<html>
      <body>
        <h3>${firstName} ${lastName}</h3>
        <div>
					<p>User:- ${uname.S ? "Registered" : "Not Registered"}</p>
          <p>Email: -${email.S}</p>
          <p>${feedback.S}</p>
        </div>
      </body>
      </html>`;
			sendMail(template, subject[type.S], ['emailumangdoctor@gmail.com'], 'no-reply@moneo.money');
		}
	});
	return Promise.resolve('Successfully processed DynamoDB record');
};
