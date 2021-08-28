const AWS = require("aws-sdk");
const region = "us-east-1";
const creds = new AWS.Credentials({
  accessKeyId: "AKIAROHCVNGYE4MNWMOM",
  secretAccessKey: "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",
  sessionToken: null,
});
AWS.config.update({ region: region, credentials: creds });
const ddb = new AWS.DynamoDB.DocumentClient();
const https = require("https");
const fs = require("fs");
const fsPromise = require("fs/promises");
const { rmdir } = fsPromise;
const extract = require("extract-zip");
const csv = require("csv-parser");

const cleanDirectory = async (tempDir, msg) => {
  await rmdir(tempDir, { recursive: true });
  console.log(msg);
};

const downloadZip = (NSE_URL, tempDir, zipFile) => {
  return new Promise((resolve, reject) => {
    const req = https.get(NSE_URL, async (res) => {
      const { statusCode } = res;
      if (statusCode < 200 || statusCode >= 300) {
        await cleanDirectory(
          tempDir,
          `Unable to download zip file, ${statusCode}`
        );
        return reject(new Error("statusCode=" + statusCode));
      }
      res.pipe(fs.createWriteStream(zipFile));
      res.on("end", function () {
        resolve();
      });
    });
    req.on("error", async (e) => {
      await cleanDirectory(
        tempDir,
        `Unable to download zip file, ${e.message}`
      );
      reject(e.message);
    });
    req.end();
  });
};

const unzipDownloads = async (zipFile, tempDir) => {
  try {
    await extract(zipFile, {
      dir: tempDir,
    });
  } catch (err) {
    await cleanDirectory(tempDir, `Unable to extract zip file, ${err.message}`);
    throw new Error(err.message);
  }
};

const extractDataFromCSV = async (
  tempDir,
  fileName,
  typeExchg,
  codes,
  typeIdentifier,
  schema,
  calcSchema,
  instrumentList
) => {
  const end = new Promise((resolve, reject) => {
    let results = [];
    let batches = [];
    fs.createReadStream(`${tempDir}/${fileName}`)
      .pipe(csv())
      .on("data", (record) => {
        const idCheck = instrumentList.some(
          (item) => item === record[codes.id]
        );
        if (!idCheck) {
          const updateSchema = calcSchema(
            record,
            codes,
            schema,
            typeIdentifier,
            typeExchg
          );
          batches.push(
            Object.assign({}, { PutRequest: { Item: updateSchema } })
          );
          // instrumentList.push(Object.assign({},updateSchema.id))
        }
      })
      .on("end", async () => {
        await cleanDirectory(
          tempDir,
          `${typeIdentifier} results extracted successfully and directory is cleaned`
        );
        resolve(batches);
      })
      .on("error", (err) => {
        cleanDirectory(
          tempDir,
          `Unable to read ${type} csv file, ${err.message}`
        );
        throw new Error(err.message);
      });
  });
  return await end;
};

const pushData = async (data) => {
  return new Promise((resolve, reject) => {
    const result = new Array(Math.ceil(data.length / 25))
      .fill()
      .map((_) => data.splice(0, 25));

    const table = "INExchange-bvyjaqmusfh5zelcbeeji6xxoe-dev";
    result.filter(async (bunch) => {
      var params = {
        RequestItems: {
          [table]: bunch,
        },
      };
      try {
        resolve(await ddb.batchWrite(params).promise());
      } catch (error) {
        throw new Error(`Error in dynamoDB: ${JSON.stringify(error)}`);
=======
        const updatedData = await executeMutation(updateMutation, data[i]);
        if (!updatedData.body.data.updateINExchg) {
          await executeMutation(createMutation, data[i]);
        }
        // console.log(updatedData.body.data);
        updatedData.body.errors
          ? instrumentData.errorIDs.push({
              id: data[i].id,
              error: updatedData.body.errors,
            })
          : instrumentData.updatedIDs.push(data[i]);
      } catch (err) {
        console.log(err);
>>>>>>> 7b86e597c65ea675967884ffa89e589c7b2fd30c
      }
    });
  });
};
module.exports = {
  downloadZip,
  unzipDownloads,
  extractDataFromCSV,
  cleanDirectory,
  pushData,
};
