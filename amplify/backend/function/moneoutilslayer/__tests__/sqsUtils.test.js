const {
  sendMessage,
  receiveMessage,
  deleteMessage,
} = require("../lib/nodejs/sqsUtils");
const {
  SQSClient,
  SendMessageCommand,
  ReceiveMessageCommand,
  DeleteMessageCommand,
} = require("@aws-sdk/client-sqs");

jest.mock("@aws-sdk/client-sqs");

describe("Test Divide array by size", () => {
  test("should call client send function", async () => {
    await sendMessage("shdhasd", "url");

    expect(SQSClient.prototype.send).toHaveBeenCalled();
  });

  test("should call SendMessageCommand with given params", async () => {
    const name = "Moneo";
    const queueUrl = "/testing";
    const params = {
      MessageBody: name,
      QueueUrl: queueUrl,
    };

    await sendMessage(name, queueUrl);

    const sendMessageCommandParams =
      SendMessageCommand.prototype.constructor.mock.calls[1];

    expect(sendMessageCommandParams[0].QueueUrl).toEqual(queueUrl);
  });
});
