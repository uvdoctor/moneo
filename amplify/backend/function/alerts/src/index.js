const {
  batchReadItem,
  getDataFromTable,
  getTableNameFromInitialWord
} = require("/opt/nodejs/insertIntoDB");
const { sendMail } = require("/opt/nodejs/mailUtils");
// const {
//   batchReadItem,
//   getDataFromTable,
//   getTableNameFromInitialWord,
// } = require("../../moneopricelayer/lib/nodejs/insertIntoDB");
// const { sendMail } = require("../../moneoutilslayer/lib/nodejs/mailUtils");

const isFund = (id) => id.substring(2, 3) === "F";

const processData = () => {
  return new Promise(async (resolve, reject) => {
    const insunitableName = await getTableNameFromInitialWord("InsUserMap");
    console.log(insunitableName);
    const insuniTableData = await getDataFromTable(insunitableName);
    let userMap = {};
    let sidMap = {};
    insuniTableData.Items.forEach((item) => {
      if (item.subt === "S" && !isFund(item.id) && item.sid !== "542641") {
        if (!sidMap[item.sid]) sidMap[item.sid] = item.sid;
        if (userMap[item.user]) {
          let sidlist = userMap[item.user];
          sidlist.push(item.sid);
          userMap[item.user] = sidlist;
        } else {
          userMap[item.user] = [item.sid];
        }
      }
    });

    let sidBatchKeys = [];
    let sidBatchCount = 0;
    let sidKeys = [];
    Object.keys(sidMap).forEach((key) => {
      sidKeys.push({ id: key });
      sidBatchCount++;
      if (sidBatchCount === 100) {
        sidBatchKeys.push(sidKeys);
        sidKeys = [];
        sidBatchCount = 0;
      }
    });
    if (sidBatchCount > 0 && sidBatchCount < 100) {
      sidBatchKeys.push(sidKeys);
    }
    const funtableName = await getTableNameFromInitialWord("INExchgFun");
    console.log(funtableName);
    let data = [];
    for (let batch of sidBatchKeys) {
      const results = await batchReadItem(funtableName, batch);
      data = [...results, ...data];
    }

    for (let item of data) {
      if (sidMap[item.id]) {
        sidMap[item.id] = item;
      }
    }

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
      let content = `<p>Name -  Week High  -  Week Low</p>`;
      userMap[user].forEach((item) => {
        const data = sidMap[item];
        if (!data) return;
        content += `<p>${data.id} - ${data.tech["52WeekLow"]} - ${data.tech["52WeekHigh"]}</p>`;
      });
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
    resolve();
  });
};

exports.handler = async (event) => {
  return await processData();
};
