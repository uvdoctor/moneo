const { processData } = require("../src/processData");
const {
  getTableNameFromInitialWord,
  getTabledata,
} = require("../../moneoutilslayer/lib/nodejs/databaseUtils");
const {
  sendEmail,
} = require("../../moneoutilslayer/lib/nodejs/sendMail/EmailSender");

jest.mock("../../moneoutilslayer/lib/nodejs/databaseUtils");
jest.mock("../../moneoutilslayer/lib/nodejs/sendMail/EmailSender");

describe("Test Processdata", () => {
  beforeEach(() => {
    getTableNameFromInitialWord.mockReturnValue("UserInfo");
    getTabledata.mockReturnValue([
      { uname: "Mehz", email: "mehz1526@gmail.com" },
    ]);
    sendEmail.mockReturnValue(true);
  });

  test("should resolve", async () => {
    const data = await processData([
      {
        eventName: "INSERT",
        dynamodb: {
          Keys: {
            id: {
              S: "0f399aed-90d5-4711-8fcc-cf66200b26db",
            },
          },
          NewImage: {
            dur: {
              N: "30",
            },
            owner: {
              S: "Mehz",
            },
            __typename: {
              S: "CoachingReq",
            },
            type: {
              S: "FI",
            },
            createdAt: {
              S: "2022-04-26T16:50:05.508Z",
            },
            paid: {
              BOOL: false,
            },
            payment: {
              N: "0",
            },
            id: {
              S: "0f399aed-90d5-4711-8fcc-cf66200b26db",
            },
            page: {
              S: "/overview",
            },
            text: {
              S: "",
            },
            curr: {
              S: "INR",
            },
            status: {
              S: "P",
            },
            updatedAt: {
              S: "2022-04-26T16:50:05.508Z",
            },
          },
        },
      },
    ]);
    expect(data).toBe(true);
  });

  test("should throw error", async () => {
    try {
      await processData();
    } catch (e) {
      expect(e.toString()).toMatch("TypeError: records is not iterable");
    }
  });
});
