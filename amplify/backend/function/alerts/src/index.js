const fs = require("fs");
const fsPromise = require("fs/promises");
const {
  getDataByFilter,
  batchReadItem,
  getTableNameFromInitialWord,
} = require("/opt/nodejs/insertIntoDB");
const { sendMail } = require("/opt/nodejs/mailUtils");
const { tempDir } = require("/opt/nodejs/utility");
const { cleanDirectory, downloadZip } = require("/opt/nodejs/bhavUtils");
const constructedApiArray = require("./utils");
const extractDataFromCSV = require("./bhavUtils");
const { mkdir } = fsPromise;
// const {
//   getDataByFilter,
//   batchReadItem,
//   getTableNameFromInitialWord,
// } = require("../../moneopricelayer/lib/nodejs/insertIntoDB");
// const { tempDir } = require("../../moneopricelayer/lib/nodejs/utility");
// const {
//   cleanDirectory,
//   downloadZip,
// } = require("../../moneopricelayer/lib/nodejs/bhavUtils");
// const { sendMail } = require("../../moneoutilslayer/lib/nodejs/mailUtils");

const sidMap = {};
const processData = (diff) => {
  return new Promise(async (resolve, reject) => {
    const { apiArray } = constructedApiArray(diff);
    try {
      if (fs.existsSync(tempDir)) {
        await cleanDirectory(tempDir, "Initial cleaning completed");
      }
      for (let i = 0; i < apiArray.length; i++) {
        const { fileName, url, codes } = apiArray[i];
        console.log(url);
        const csvFile = `${tempDir}/${fileName}`;
        await mkdir(tempDir);
        await downloadZip(url, tempDir, csvFile);
        await extractDataFromCSV(fileName, codes, sidMap);
      }

      const insunitableName = await getTableNameFromInitialWord("InsUserMap");
      console.log(insunitableName);
      const sidkeys = Object.keys(sidMap);
      const results = await getDataByFilter(insunitableName, sidkeys, "sid");

      let userMap = {};
      results.forEach((item) => {
        if (userMap[item.user]) {
          userMap[item.user] = { ...userMap[item.user], ...item.sid };
        } else {
          userMap[item.user] = [item.sid];
        }
      });

      let userBatchKeys = [];
      let userBatchCount = 0;
      let userkeys = [];
      Object.keys(userMap).forEach((key) => {
        userkeys.push({ uname: key });
        userBatchCount++;
        if (userBatchCount === 100) {
          userBatchKeys.push(userkeys);
          userkeys = [];
          userBatchCount = 0;
        }
      });
      if (userBatchCount > 0 && userBatchCount < 100) {
        userBatchKeys.push(userkeys);
      }
      const userInfoTableName = await getTableNameFromInitialWord("UserInfo");
      let userdata = [];
      for (let batch of userBatchKeys) {
        const results = await batchReadItem(userInfoTableName, batch);
        userdata = [...results, ...userdata];
      }

      const users = Object.keys(userMap);
      for (let user of users) {
        const userInfo = userdata.find((re) => re.uname === user);
        console.log(userInfo);
        let content = "";
        userMap[user].forEach((item) => {
          const data = sidMap[item];
          if (!data) return;
          content += `<p>${item} ${data.yhigh ? "- Week High -" : ""} ${
            data.yhigh ? data.yhigh : ""
          } ${data.ylow ? "- Week Low -" : ""} ${
            data.ylow ? data.ylow : ""
          } </p></br>`;
        });
        if (!content) continue;
        try {
          const template = `<html>
              <body>
                  <div>
                      ${content}
                  </div>
              </body>
              </html>`;
          console.log(template);
          const message = await sendMail(
            template,
            "Moneo - Week High Low Digest",
            ["emailumangdoctor@gmail.com", "mehzabeen1526@gmail.com"],
            "no-reply@moneo.money"
          );
          console.log(message);
        } catch (err) {
          reject(err);
        }
      }
    } catch (err) {
      reject(err);
    }
    resolve();
  });
};

exports.handler = async (event) => {
  return await processData(event.diff);
};
