const { processData } = require("../src/processData");
const { sendMail } = require("../../moneoutilslayer/lib/nodejs/mailUtils");

jest.mock("../../moneoutilslayer/lib/nodejs/mailUtils");

describe("Test Processdata", () => {
  beforeEach(() => {
    sendMail.mockReturnValue("Mail sent with id = 1");
  });

  test("should resolve", async () => {
    const data = await processData([
      {
        eventName: "INSERT",
        dynamodb: {
          Keys: {
            id: {
              S: "e7061860-80bc-4090-b893-91acca4a8e35",
            },
          },
          NewImage: {
            feedback: {
              S: "Msajbdsjlaksnknaskf;",
            },
            createdAt: {
              S: "2022-01-30T09:00:50.143Z",
            },
            __typename: {
              S: "Feedback",
            },
            name: {
              M: {
                fn: {
                  S: "mehza48266",
                },
              },
            },
            id: {
              S: "e7061860-80bc-4090-b893-91acca4a8e35",
            },
            type: {
              S: "C",
            },
            email: {
              S: "mehzabeen1526@gmail.com",
            },
            updatedAt: {
              S: "2022-01-30T09:00:50.143Z",
            },
          },
        },
      },
    ]);
    expect(data).toBe("Mail sent with id = 1");
  });

  test("should throw error", async () => {
    try {
      await processData();
    } catch (e) {
      expect(e.toString()).toMatch("TypeError: data is not iterable");
    }
  });
});
