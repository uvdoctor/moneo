const { getAndPushData } = require("./getAndPushData");

exports.handler = async (event) => {
  return await getAndPushData(event.diff);
};
