const { processData } = require('./data');

exports.handler = async (event) => {
  return await processData();
};
