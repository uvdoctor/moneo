const extractDataFromCSV = require("../src/bhavUtils");
const { createReadStream } = require("fs");
// const aws = require('@aws-sdk/shared-ini-file-loader')
// const calculate = require("../src/calculate");


// jest.mock('fs');

describe("Test Bhavutils", () => {
  test("Ex 1", async() => {
    const mockReadStream = { pipe: jest.fn() };

    jest.mock('fs',() => {
      return { 
        createReadStream: jest.fn().mockReturnValueOnce(mockReadStream)
      }
    })
    // fs.createReadStream.mockReturnValue(true)
    await extractDataFromCSV("cm11MAY2022bhav.csv", "NSE", {
      sid: 'SECURITY',
      id: 'ISIN NO.',
      name: 'ISSUE_DESC',
      price: 'Last Traded Price (in Rs.)',
      subt: 'SECTYPE',
      frate: 'ISSUE_NAME',
      sDate: 'ISSUE_DATE',
      mDate: 'MAT_DATE',
      rate: 'ISSUE_NAME',
      crstr: '',
      fv: ''
    }, {
      id: '',
      sid: '',
      name: '',
      exchg: '',
      subt: '',
      price: 0,
      sm: 0,
      sy: 0,
      mm: 0,
      my: 0,
      rate: 0,
      itype: '',
      fv: 0,
      cr: null,
      crstr: null,
      ytm: 0,
      createdAt: '',
      updatedAt: ''
    }, {}, "INBond", {}, false, [])
    expect(createReadStream).toHaveBeenCalled()
  })
})