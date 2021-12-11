const { pushData, getTableNameFromInitialWord, getDataFromTable, updateData } = require('/opt/nodejs/insertIntoDB');
const table = 'Universe';
const getAndPushData = async(records) => {
  const universeData =  await getDataFromTable(table);

  records.forEach(record => {
    const uname =  record.dynamodb.Keys.uname.S;
    if(record.eventName === 'INSERT') {
      record.dynamodb.NewImage.ins.L.map((item)=> {
        const doesExist = universeData.find((item) => item.id === item.M.id.S);
        if(!doesExist) pushData();
      })
    if(record.eventName === 'MODIFY') {
      let isUnique = [];
      record.dynamodb.NewImage.ins.L.map((item)=> {


      })

    }
    if(record.eventName === 'REMOVE') {
      // OldImage

    }
  })
}



exports.handler = event => {
    getAndPushData(event.Records)
    return Promise.resolve('Successfully processed DynamoDB record');
};
