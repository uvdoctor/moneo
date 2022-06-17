const { sendMail } = require("../lib/nodejs/mailUtils");
const { SESClient, SendEmailCommand } = require("@aws-sdk/client-ses");

jest.mock("@aws-sdk/client-ses");

describe("Send Mail", () => {
  const body = "body";
  const subject = "subject";
  const mail = "ww@gmail.com";
  const source = "noreply@name.co"
  
  test("should call client send function", async () => {
    const data = await sendMail(body, subject, mail, source);
    expect(SESClient.prototype.send).toHaveBeenCalled();
  });

  test("should call SendEmailCommand with given params", async () => {
    await sendMail(body, subject, mail, source);
    const sendEmailCommandParams =
    SendEmailCommand.prototype.constructor.mock.calls[1];
    expect(sendEmailCommandParams[0].Source).toEqual(source);
    expect(sendEmailCommandParams[0].Destination).toEqual({ ToAddresses: 'ww@gmail.com' });
  });

  test("should return value", async () => {
    SESClient.prototype.send.mockReturnValue({ MessageId: 124 })
    const data = await sendMail(body, subject, mail, source);
    expect(data).toEqual('Mail sent with id = 124');
  });
});