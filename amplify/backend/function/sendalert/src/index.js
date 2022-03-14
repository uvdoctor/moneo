const { sendEmail } = require("/opt/nodejs/sendMail/EmailSender");
const { deleteMessage } = require("/opt/nodejs/sqsUtils");

const processData = (records) => {
  return new Promise(async (resolve, reject) => {
    let queueData;
    records.forEach(async (item) => {
      queueData = JSON.parse(item.body);
      await deleteMessage(process.env.PRICE_ALERTS_QUEUE, item.receiptHandle);
    });

    const users = Object.keys(queueData);
    for (let user of users) {
      const { gainers, losers, yhigh, ylow, chg, chgAmount, chgImpact } = queueData[user];
      try {
        const message = await sendEmail({
          templateName: "alerts",
          email: user,
          // email: [user],
          values: {
            url: "https://moneo.in/get",
            gainers: gainers,
            losers: losers,
            yhigh: yhigh,
            ylow: ylow,
            chg: chg,
            chgImpact: chgImpact,
            chgAmount: chgAmount
          },
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
