const { utility } = require("/opt/nodejs/utility");

const constructedApiArray = (diff) => {
  const { date, month, yearFull } = utility(diff);
  const fileName = `NAV_File_${date}${month}${yearFull}`;

  const apiArray = {
    fileName: `${fileName}.out`,
    url: `https://npscra.nsdl.co.in/download/${fileName}.zip`,
  };

  return apiArray;
};

module.exports = constructedApiArray;
