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
    try {
      for (let item of records) {
        let userinfodata = {};
        if (item.eventName === "INSERT") {
          const data = item.dynamodb.NewImage;
          const user = data.owner ? data.owner.S : null;
          const duration = data.dur.N;
          const text = data.text.S;
          let email = data.email ? data.email.S : null;
          if (user) {
            const userInfoTableName = await getTableNameFromInitialWord(
              "UserInfo"
            );
            const result = await getTabledata(
              userInfoTableName,
              "uname, email",
              `uname = :uname`,
              { ":uname": user }
            );
            userinfodata = result.find((item) => item.uname === user);
            console.log(userinfodata);
          }
          email = userinfodata.email ? userinfodata.email : email;
          if (!email) return;
          try {
            const message = await sendEmail({
              templateName: COACHING_CONFIRMATION_TEMPLATE_NAME,
              email,
              values: {
                owner: false,
              },
            });
            console.log(message);
            // to owner
            const ownerMessage = await sendEmail({
              templateName: COACHING_CONFIRMATION_TEMPLATE_NAME,
              email: "emailumangdoctor@gmail.com",
              values: {
                user: user ? user : email,
                email,
                duration,
                mob: userinfodata?.mob,
                text,
                owner: true,
              },
            });
            console.log(ownerMessage);
          } catch (err) {
            reject(err);
          }
        }
      }
      resolve(true);
    } catch (err) {
      reject(err);
    }
  });
};

module.exports = { processData };
