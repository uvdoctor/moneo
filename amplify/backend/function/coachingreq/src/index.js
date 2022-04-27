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
const { sendEmail, COACHING_CONFIRMATION_TEMPLATE_NAME } = require("/opt/nodejs/sendMail/EmailSender");
const { getTabledata, getTableNameFromInitialWord } = require('/opt/nodejs/databaseUtils');

const processData = (records) => {
  return new Promise(async (resolve, reject) => {
    let userinfodata;
    for (let item of records) {
      if (item.eventName === "INSERT") {
        const data = item.dynamodb.NewImage;
        const user = data.owner.S;
        const userInfoTableName = await getTableNameFromInitialWord("UserInfo");
        const result = await getTabledata(
          userInfoTableName,
          "uname, email",
          `uname = :uname`,
          { ":uname": user }
        );
        userinfodata = result.find((item) => item.uname === user);
        console.log(userinfodata);
      }
      if (!userinfodata) return;
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
  return await processData(event.Records);
};
