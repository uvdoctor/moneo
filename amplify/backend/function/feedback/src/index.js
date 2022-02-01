const { sendMail } = require('/opt/nodejs/mailUtils');

const subject = {
	C: 'Comment',
	S: 'Suggestion',
	Q: 'Question'
};

const processData = async (data) => {
	console.log(data);
	for (record of data) {
		if (record.eventName == 'INSERT') {
			const data = record.dynamodb.NewImage;
			console.log(data);
			const { name, email, feedback, type, uname } = data;
			console.log( name, email, feedback, type, uname );
			const firstName = name.M.fn ? name.M.fn.S : '';
			const lastName = name.M.ln ? name.M.ln.S : '';
			const template = `<html>
      <body>
        <h3>${firstName} ${lastName}</h3>
        <div>
					<p>User:- ${uname.S ? 'Registered' : 'Not Registered'}</p>
          <p>Email: -${email.S}</p>
          <p>${feedback.S}</p>
        </div>
      </body>
      </html>`;
			await sendMail(template, subject[type.S], [ 'emailumangdoctor@gmail.com' ], 'no-reply@moneo.money');
		}
	}
};

exports.handler = async (event) => {
	return await processData(event.Records);
};
