/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
const {
  COACHING_CONFIRMATION_TEMPLATE_NAME,
  sendEmail
} = require("../../moneoutilslayer/lib/nodejs/sendMail/EmailSender");

const {
 getTabledata
} = require("../../moneoutilslayer/lib/nodejs/databaseUtils");
// const { sendEmail } = require("/opt/nodejs/sendMail/EmailSender");

const processData = (records) => {
  return new Promise(async (resolve, reject) => {
    for (let item of records) {
      if (item.eventName === "INSERT") {
        const data = item.dynamodb.NewImage;
        const user = data.owner.S;
        const userInfoTableName = await getTableNameFromInitialWord("UserInfo");
        const userinfodata = await getTabledata(
          userInfoTableName,
          "uname, email",
          `owner = :owner`,
          { ":owner": user }
        );
        console.log(userinfodata);
      }
      try {
        const message = await sendEmail({
          templateName: COACHING_CONFIRMATION_TEMPLATE_NAME,
          email: userinfodata.email,
          values: {},
        });
        console.log(message);
      } catch (err) {
        reject(err);
      }
    }
    resolve();
  });
};

exports.handler = async (event) => {
  return await processData(JSON.parse(event.Records));
};