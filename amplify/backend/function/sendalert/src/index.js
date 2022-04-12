const { sendEmail } = require("/opt/nodejs/sendMail/EmailSender");
const { deleteMessage } = require("/opt/nodejs/sqsUtils");

const processData = (records) => {
  return new Promise(async (resolve, reject) => {
    for (let item of records) {
      let queueData = JSON.parse(item.body);
      try {
        const message = await sendEmail({
          templateName: "alerts",
          email: queueData.email,
          values: queueData,
        });
        console.log(message);
        await deleteMessage(process.env.PRICE_ALERTS_QUEUE, item.receiptHandle);
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
