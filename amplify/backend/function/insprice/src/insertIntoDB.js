const AWS = require("aws-sdk");
const region = "us-east-1";
var creds = new AWS.Credentials({
  accessKeyId: "AKIAROHCVNGYE4MNWMOM",
  secretAccessKey: "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",
  sessionToken: null,
});
AWS.config.update({ region: region, credentials: creds });

const ddb = new AWS.DynamoDB.DocumentClient();



// exports.handler = async (event) => {
//     const tableName = "yourtablename"; 
//     try {
//       await dynamodb.putItem({
//           "TableName": tableName,
//           "Item" : {
//               "Id": event.Id,
//               "Ut": event.Ut,
//               "Temp": event.Temp,
//               "Rh":event.Rh
//           }
//       }).promise();
//     } catch (error) {
//       throw new Error(`Error in dynamoDB: ${JSON.stringify(error)}`);
//     }  
// };

module.exports = ddb;
