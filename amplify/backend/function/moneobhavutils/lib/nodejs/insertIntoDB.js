const AWS = require("aws-sdk");
const docClient = new AWS.DynamoDB.DocumentClient();

const getAllData = async(table) =>{
  const params = { TableName: table };
  try {
    const data = await docClient.scan(params).promise();
    return data;
  } catch (err) {
    console.log(`Error in dynamoDB: ${JSON.stringify(err)}`);
    return `Error in dynamoDB: ${JSON.stringify(err)}`;
  }
}

const pushData = async (data, table) => {
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
      reject(`Error in dynamoDB: ${JSON.stringify(error)}`)
    }
  });
};

module.exports = {getAllData, pushData};
