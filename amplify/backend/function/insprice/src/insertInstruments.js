const https = require("https");
const AWS = require("aws-sdk");
const gql = require("graphql-tag");
const urlParse = require("url").URL;
const appsyncUrl = process.env.API_GOALS_GRAPHQLAPIENDPOINTOUTPUT;
const region = process.env.REGION;
const endpoint = new urlParse(appsyncUrl).hostname.toString();
const graphqlQuery = require("./query.js").mutation;
const apiKey = process.env.API_GOALS_GRAPHQLAPIKEYOUTPUT;
module.exports = async function insertInstrument(inputData, operationName) {
  const req = new AWS.HttpRequest(appsyncUrl, region);

  const item = {
    input: inputData,
  };

  req.method = "POST";
  req.path = "/graphql";
  req.headers.host = endpoint;
  req.headers["Content-Type"] = "application/json";
  req.body = JSON.stringify({
    query: graphqlQuery[operationName],
    operationName: operationName,
    variables: item,
  });
  if (apiKey) {
    req.headers["x-api-key"] = apiKey;
  } else {
    const signer = new AWS.Signers.V4(req, "appsync", true);
    signer.addAuthorization(AWS.config.credentials, AWS.util.date.getDate());
  }

  const data = await new Promise((resolve, reject) => {
    const httpRequest = https.request({ ...req, host: endpoint }, (result) => {
      let data = "";

      result.on("data", (chunk) => {
        data += chunk;
      });

      result.on("end", () => {
        resolve(JSON.parse(data.toString()));
      });
    });

    httpRequest.write(req.body);
    httpRequest.end();
  });

  return {
    statusCode: 200,
    body: data,
  };
};
