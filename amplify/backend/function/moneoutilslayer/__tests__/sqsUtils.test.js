const { sendMessage, receiveMessage, deleteMessage } = require("../lib/nodejs/sqsUtils");
const  {
    SQSClient,
    SendMessageCommand,
    ReceiveMessageCommand,
    DeleteMessageCommand,
  } = require("@aws-sdk/client-sqs");
jest.mock("@aws-sdk/client-sqs");

// const client = new SQSClient({ apiVersion: "2012-11-05" });

// const sendMessage = async (data, queueUrl) => {
//   try {
//     const params = {
//       MessageBody: JSON.stringify(data),
//       QueueUrl: queueUrl,
//     };
//     console.log(params);
//     const result = await client.send(new SendMessageCommand(params));
//     console.log(result);
//   } catch (error) {
//     console.log(error);
//   }
// };

describe("Test Divide array by size", () => {
  test("", async() => {
    // SQSClient.mockReturnValue(true);
    // client.mockReturnValue(true);
    await sendMessage("shdhasd", "url")

    expect(SQSClient).toHaveBeenCalled()  
    // expect(client.SendMessageCommand).toHaveBeenCalled()  
  });
  
});