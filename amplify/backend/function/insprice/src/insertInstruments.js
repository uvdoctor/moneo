const https = require("https");
const AWS = require("aws-sdk");
const urlParse = require("url").URL;
const appsyncUrl = process.env.API_GOALS_GRAPHQLAPIENDPOINTOUTPUT;
const region = process.env.REGION;
const endpoint = new urlParse(appsyncUrl).hostname.toString();
const graphqlQuery = require("./query.js").mutation;
const apiKey = process.env.API_GOALS_GRAPHQLAPIKEYOUTPUT;

module.exports = async function insertInstrument (event){
  const req = new AWS.HttpRequest(appsyncUrl, region);

  const item = {
    input: {
      id: "101",
      sid: "12",
      name: "Service",
      exchg: "BSE",
      country: "IN",
      curr: "11",
      type: "E",
      subt: "S",
      price: 12.00,
      prev: 11.99,
      sm: 1,
      sy: 2,
      mm: 3,
      my: 4,
      rate: 5.5
    },
  };

  req.method = "POST";
  req.path = "/graphql";
  req.headers.host = endpoint;
  req.headers["Content-Type"] = "application/json";
  req.body = JSON.stringify({
    query: graphqlQuery,
    operationName: "createInstrument",
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
