const { sendMail } = require('/opt/nodejs/mailUtils');
// const { sendMail } = require("../../moneoutilslayer/lib/nodejs/mailUtils");

const subject = {
  C: "Comment",
  S: "Suggestion",
  Q: "Question",
};

const processData = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      for (record of data) {
        if (record.eventName == "INSERT") {
          const data = record.dynamodb.NewImage;
          console.log(data);
          const { name, email, feedback, type, uname } = data;
          console.log(name, email, feedback, type, uname);
          const firstName = name.M.fn ? name.M.fn.S : "";
          const lastName = name.M.ln ? name.M.ln.S : "";
          const template = `<html>
						<body>
							<h3>${firstName} ${lastName}</h3>
							<div>
								<p>User:- ${uname ? "Registered" : "Not Registered"}</p>
								<p>Email: -${email.S}</p>
								<p>${feedback.S}</p>
							</div>
						</body>
						</html>`;
          const message = await sendMail(
            template,
            subject[type.S],
            ["emailumangdoctor@gmail.com"],
            "no-reply@moneo.money"
          );
          console.log(message);
          resolve(message);
        }
      }
    } catch (err) {
      reject(err);
    }
  });
};

module.exports = { processData };
