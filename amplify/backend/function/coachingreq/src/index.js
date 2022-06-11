const { processData } = require('./processData')

exports.handler = async (event) => {
  return await processData(event.Records);
};
