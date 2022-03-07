const {
  SQSClient,
  SendMessageCommand,
  ReceiveMessageCommand,
  DeleteMessageCommand,
} = require("@aws-sdk/client-sqs");
const client = new SQSClient({ apiVersion: "2012-11-05" });

const sendMessage = async (data, queueUrl) => {
  try {
    const params = {
      MessageBody: JSON.stringify(data),
      QueueUrl: queueUrl,
    };
    console.log(params);
    const result = await client.send(new SendMessageCommand(params));
    console.log(result);
  } catch (error) {
    console.log(error);
  }
};

const receiveMessage = async (queueUrl) => {
  var params = {
    QueueUrl: queueUrl,
    MaxNumberOfMessages: 1,
    MessageAttributeNames: ["All"],
    WaitTimeSeconds: 2,
  };
  try {
    const data = await client.send(new ReceiveMessageCommand(params));
    console.log(data);
    return data.Messages;
  } catch (error) {
    console.log(error);
  }
};

const deleteMessage = async (queueUrl, receiptHandle) => {
  var deleteParams = {
    QueueUrl: queueUrl,
    ReceiptHandle: receiptHandle,
  };
  try {
    const deleteResponse = await client.send(new DeleteMessageCommand(deleteParams));
    console.log(deleteResponse);
  } catch (error) {
    console.log(error);
  }
};

module.exports = { sendMessage, receiveMessage, deleteMessage };
