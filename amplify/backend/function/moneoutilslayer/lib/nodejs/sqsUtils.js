const {
  SQSClient,
  SendMessageCommand,
  ReceiveMessageCommand,
  DeleteMessageCommand,
} = require("@aws-sdk/client-sqs");
const client = new SQSClient({ apiVersion: "2012-11-05" });

const sendMessage = async (fundata, queueUrl, funtableName) => {
  const messageBody = {};
  const messageAttributes = {};
  for (item of fundata) {
    messageBody[item.id] = {
      yhigh: item.yhigh,
      ylow: item.ylow,
      name: item.name,
    };
    messageAttributes[item.id] = {
      DataType: "String",
      StringValue: messageBody[item.id],
    };
  }

  try {
    const params = {
      MessageBody: JSON.stringify(data),
      QueueUrl: queueUrl,
      MessageAttributes: messageAttributes,
      MessageDeduplicationId: funtableName,
      MessageGroupId: "FundamentalData",
    };
    const data = await client.send(new SendMessageCommand(params));
    console.log(data);
    // return data;
    // process data.
  } catch (error) {
    console.log(error);
    // error handling.
  }
};

const receiveMessage = async (fundata, queueUrl, funtableName) => {
  let responses;
  var params = {
    QueueUrl: queueUrl,
    // AttributeNames: [All],
    // MaxNumberOfMessages: "NUMBER_VALUE",
    MessageAttributeNames: ["All"],
    WaitTimeSeconds: 10,
  };
  try {
    const data = await client.send(new ReceiveMessageCommand(params));
    console.log(data);
    responses = data.Messages;
    var deleteParams = {
      QueueUrl: queueUrl,
      ReceiptHandle: data.Messages[0].ReceiptHandle,
    };
    try {
      const deleteResponse = await client.send(
        new DeleteMessageCommand(deleteParams)
      );
      console.log(deleteResponse);
    } catch (error) {
      console.log(error);
    }
    return responses;
  } catch (error) {
    console.log(error);
  }
};
module.exports = { sendMessage, receiveMessage };
