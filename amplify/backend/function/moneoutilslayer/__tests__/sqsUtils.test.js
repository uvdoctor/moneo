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

describe("Send Message", () => {
  test("should call client send function", async () => {
    await sendMessage("shdhasd", "url");

    expect(SQSClient.prototype.send).toHaveBeenCalled();
  });

  test("should call SendMessageCommand with given params", async () => {
    const name = "Moneo";
    const queueUrl = "/testing";
    await sendMessage(name, queueUrl);

    const sendMessageCommandParams =
      SendMessageCommand.prototype.constructor.mock.calls[1];

    expect(sendMessageCommandParams[0].QueueUrl).toEqual(queueUrl);
  });
});

describe("Receive Message", () => {
  test("should call client send function", async () => {
    await receiveMessage("url");
    expect(SQSClient.prototype.send).toHaveBeenCalled();
  });

  test("should call receiveMessageCommand with given params", async () => {
    const queueUrl = "/testing";
    await receiveMessage(queueUrl);

    const receiveMessageCommandParams =
      ReceiveMessageCommand.prototype.constructor.mock.calls[1];

    expect(receiveMessageCommandParams[0].QueueUrl).toEqual(queueUrl);
  });

  test("should return value", async () => {
    SQSClient.prototype.send.mockReturnValue({ Messages: 'sent' })
    const data = await receiveMessage("url");
    expect(data).toEqual('sent');
  });
});

describe("Delete Message", () => {
  test("should call client send function", async () => {
    await deleteMessage("url", "handle");
    expect(SQSClient.prototype.send).toHaveBeenCalled();
  });

  test("should call deleteMessageCommand with given params", async () => {
    const queueUrl = "/testing";
    await deleteMessage(queueUrl);

    const deleteMessageCommandParams =
      DeleteMessageCommand.prototype.constructor.mock.calls[1];

    expect(deleteMessageCommandParams[0].QueueUrl).toEqual(queueUrl);
  });
});
