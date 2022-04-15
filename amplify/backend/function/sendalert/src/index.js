const { sendEmail, PRICE_TEMPLATE_NAME, WATCH_TEMPLATE_NAME } = require("/opt/nodejs/sendMail/EmailSender");
const { deleteMessage } = require("/opt/nodejs/sqsUtils");

const processData = (queue, templateName, records) => {
  return new Promise(async (resolve, reject) => {
    for (let item of records) {
      let queueData = JSON.parse(item.body);
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
  const queueARN = event.eventSourceARN;
  let queue = "";
  let templateName = "";
  if (queueARN.contains("price")) {
    queue = PRICE_ALERTS_QUEUE;
    templateName = PRICE_TEMPLATE_NAME;
  } else {
    queue = WATCH_ALERTS_QUEUE;
    templateName = WATCH_TEMPLATE_NAME;
  }
  return await processData(queue, template, event.Records);
};
