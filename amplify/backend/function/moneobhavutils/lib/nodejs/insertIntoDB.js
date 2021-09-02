const AWS = require("aws-sdk");
const region = "us-east-1";
const creds = new AWS.Credentials({
  accessKeyId: "AKIAROHCVNGYE4MNWMOM",
  secretAccessKey: "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",
  sessionToken: null,
});
AWS.config.update({ region: region, credentials: creds });
const docClient = new AWS.DynamoDB.DocumentClient();

module.exports = docClient;
