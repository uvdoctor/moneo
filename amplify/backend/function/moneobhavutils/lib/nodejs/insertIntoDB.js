const AWS = require("aws-sdk");
const docClient = new AWS.DynamoDB.DocumentClient();

const pushData = async (data, table, index) => {
  return new Promise(async (resolve, reject) => {
    const params = {
      RequestItems: {
        [table]: data,
      },
    };
    try {
      const updateRecord = await docClient.batchWrite(params).promise();
      resolve(updateRecord);
    } catch (error) {
      reject(`Error in dynamoDB: ${JSON.stringify(error)}, ${index}`);
    }
  });
};

module.exports = {docClient, pushData};
