const https = require("https");
const AWS = require("aws-sdk");
const urlParse = require("url").URL;
const appsyncUrl = process.env.API_GOALS_GRAPHQLAPIENDPOINTOUTPUT;
const region = process.env.REGION;
const endpoint = new urlParse(appsyncUrl).hostname.toString();
const graphqlQuery = require("./query.js").mutation;
const apiKey = process.env.API_GOALS_GRAPHQLAPIKEYOUTPUT;
const eodApiKey = process.env.EOD_API_KEY;
const axios = require("axios");
exports.handler = async (inputData) => {
  const req = new AWS.HttpRequest(appsyncUrl, region);
  const item = {
    input: inputData,
  };

  req.method = "POST";
  req.path = "/graphql";
  req.headers.host = endpoint;
  req.headers["Content-Type"] = "application/json";
  req.body = JSON.stringify({
    query: graphqlQuery,
    variables: item,
  });

  if (apiKey) {
    req.headers["x-api-key"] = apiKey;
  } else {
    const signer = new AWS.Signers.V4(req, "appsync", true);
    signer.addAuthorization(AWS.config.credentials, AWS.util.date.getDate());
  }

  try {
    const res = await axios.get(
      `https://eodhistoricaldata.com/api/real-time/EUR.FOREX?api_token=${eodApiKey}&order=d&fmt=json`
    );
    console.log(res.data.close)
    return {
      statusCode: 200,
      body: JSON.stringify(res.data.close)
    };
  } catch (e) {
    console.log(e);
    return {
      statusCode: 400,
      body: JSON.stringify(e),
    };
  }
  
};
