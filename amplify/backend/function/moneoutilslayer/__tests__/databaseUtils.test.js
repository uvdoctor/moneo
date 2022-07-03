const { DynamoDB } = require("@aws-sdk/client-dynamodb");
const {
  DynamoDBDocumentClient,
  BatchWriteCommand,
  BatchGetCommand,
  PutCommand,
  ScanCommand,
  UpdateCommand,
} = require("@aws-sdk/lib-dynamodb");
const { getTableNameFromInitialWord } = require("../lib/nodejs/databaseUtils");
const { appendGenericFields } = require("../lib/nodejs/utility");

jest.mock("@aws-sdk/client-dynamodb");
jest.mock("@aws-sdk/lib-dynamodb");

describe("getTableNameFromInitialWord", () => {
  const table = "Table";
  test("should call DynamoDB function", () => {
    try {
      getTableNameFromInitialWord(table);
      expect(DynamoDB.prototype.listTables).toHaveBeenCalled();
    } catch (e) {
      console.log(e);
    }
  });

  test("should return value", async () => {
    DynamoDB.prototype.listTables.mockReturnValue({
      TableNames: ["Table-dev"],
    });
    let data = "";
    getTableNameFromInitialWord(table).then((res) => {
      console.log(res);
      expect(res).toEqual("Mail sent with id = 124");
    });
  });
});

