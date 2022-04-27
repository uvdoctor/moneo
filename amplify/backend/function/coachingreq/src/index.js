/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
// const {
//   COACHING_CONFIRMATION_TEMPLATE_NAME,
//   sendEmail,
// } = require("../../moneoutilslayer/lib/nodejs/sendMail/EmailSender");
// const {
//   getTabledata,
//   getTableNameFromInitialWord,
// } = require("../../moneoutilslayer/lib/nodejs/databaseUtils");
const {
  sendEmail,
  COACHING_CONFIRMATION_TEMPLATE_NAME,
} = require("/opt/nodejs/sendMail/EmailSender");
const {
  getTabledata,
  getTableNameFromInitialWord,
} = require("/opt/nodejs/databaseUtils");

const processData = (records) => {
  return new Promise(async (resolve, reject) => {
    for (let item of records) {
      if (item.eventName === "INSERT") {
        const data = item.dynamodb.NewImage;
        const user = data.owner.S;
        const duration = data.dur.N;
        const text = data.text.S;
        const userInfoTableName = await getTableNameFromInitialWord("UserInfo");
        const result = await getTabledata(
          userInfoTableName,
          "uname, email",
          `uname = :uname`,
          { ":uname": user }
        );
        const userinfodata = result.find((item) => item.uname === user);
        console.log(userinfodata);
        if (!userinfodata) return;
        const { email, mob } = userinfodata;
        try {
          const message = await sendEmail({
            templateName: COACHING_CONFIRMATION_TEMPLATE_NAME,
            email: email,
            values: {
              owner: false
            },
          });
          console.log(message);
          // to owner
          const ownerMessage = await sendEmail({
            templateName: COACHING_CONFIRMATION_TEMPLATE_NAME,
            email: ["mehzabeen1526@gmail.com", "emailumangdoctor@gmail.com" ],
            values: {
              user,
              email,
              duration,
              mob,
              text,
              owner: true
            },
          });
          console.log(ownerMessage);
        } catch (err) {
          reject(err);
        }
      }
    }
    resolve();
  });
};

exports.handler = async (event) => {
  return await processData(event.Records);
};
