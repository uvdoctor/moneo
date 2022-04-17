const {
  sendEmail,
  PRICE_TEMPLATE_NAME,
  WATCH_TEMPLATE_NAME,
} = require("/opt/nodejs/sendMail/EmailSender");
const { deleteMessage } = require("/opt/nodejs/sqsUtils");

const processData = (records) => {
  return new Promise(async (resolve, reject) => {
    for (let item of records) {
      let queueData = JSON.parse(item.body);
      const queueARN = item.eventSourceARN;
      let queue = "";
      let templateName = "";
      if (queueARN.includes("price")) {
        queue = PRICE_ALERTS_QUEUE;
        templateName = PRICE_TEMPLATE_NAME;
      } else {
        queue = WATCH_ALERTS_QUEUE;
        templateName = WATCH_TEMPLATE_NAME;
      }
      try {
        const message = await sendEmail({
          templateName: templateName,
          email: queueData.email,
          values: queueData,
        });
        console.log(message);
        await deleteMessage(queue, item.receiptHandle);
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
