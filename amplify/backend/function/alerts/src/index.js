const fs = require("fs");
const fsPromise = require("fs/promises");
const {
  getDataByFilter,
  batchReadItem,
  getTableNameFromInitialWord,
} = require("/opt/nodejs/insertIntoDB");
const { sendEmail } = require("/opt/nodejs/sendMail/EmailSender");
const { tempDir } = require("/opt/nodejs/utility");
const { cleanDirectory, downloadZip } = require("/opt/nodejs/bhavUtils");
const constructedApiArray = require("./utils");
const extractDataFromCSV = require("./bhavUtils");
const { deleteMessage } = require("/opt/nodejs/sqsUtils");
const { mkdir } = fsPromise;

const sidMap = {};
const processData = (records, diff) => {
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

      let queueData;
      records.forEach(async (item) => {
        queueData = JSON.parse(item.body);
        await deleteMessage(process.env.PRICE_ALERTS_QUEUE, item.receiptHandle);
      });
      Object.keys(queueData).map((key) => {
        for (item of queueData[key]) {
          if (sidMap[item.sid]) {
            sidMap[item.sid] = { ...sidMap[item.sid], [key]: item.name };
          } else {
            sidMap[item.sid] = { [key]: item.name };
          }
        }
      });

      const insunitableName = await getTableNameFromInitialWord("InsUserMap");
      console.log(insunitableName);
      const sidkeys = Object.keys(sidMap);
      const splittedArray = [];
      if (sidkeys.length > 100) {
        while (sidkeys.length > 0) {
          splittedArray.push(sidkeys.splice(0, 100));
        }
      } else {
        splittedArray = sidkeys;
      }

      let results = [];
      for (arrays of splittedArray) {
        const data = await getDataByFilter(insunitableName, arrays, "sid");
        results = [...results, ...data];
      }

      let userMap = {};
      results.forEach((item) => {
        if (userMap[item.user]) {
          let sidlist = userMap[item.user];
          sidlist.push(item.sid);
          userMap[item.user] = sidlist;
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
        let yhigh = [];
        let ylow = [];
        let gainers = [];
        let losers = [];
        userMap[user].forEach((item) => {
          const data = sidMap[item];
          if (!data) return;
          if (data.yhigh) yhigh.push(item);
          if (data.ylow) ylow.push(item);
          if (data.gainers) gainers.push(item);
          if (data.losers) losers.push(item);
        });
        if (!yhigh.length && !ylow.length && !gainers.length && !losers.length)
          continue;
        try {
          const message = await sendEmail({
            templateName: "weekHL",
            email: [userInfo?.email, "emailumangdoctor@gmail.com"],
            values: {
              url: "https://moneo.in/get",
              gainers: gainers,
              losers: losers,
              yhigh: yhigh,
              ylow: ylow,
            },
          });
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
  return await processData(event.Records, event.diff ? event.diff : "");
};
