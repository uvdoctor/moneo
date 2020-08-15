//import type { CreateGoalInput } from '../src/api/goals';
//import * as APIt from '../../api/goals'
//import { GoalType } from '../src/api/goals';
import * as cfutils from '../src/components/goals/cfutils';

describe('getTaxBenefit test suite', () => {
    test('Tax benefit null test', () => {
        let taxBenefit = cfutils.getTaxBenefit(-2,10,100000);
        expect(taxBenefit).toBe(0);
        expect(taxBenefit).not.toBe(null);
    })
    test('Tax benefit zero tr test', () => {
        let taxBenefit = cfutils.getTaxBenefit(2000,0,100000);
        expect(taxBenefit).toBe(0);
        expect(taxBenefit).not.toBe(null);
    })
    test('Tax benefit claim less than maxDL test', () => {
        let taxBenefit = cfutils.getTaxBenefit(2000,17,100000);
        expect(taxBenefit).toBe(340);
        expect(taxBenefit).not.toBe(null);
    })
    test('Tax benefit claim greater than maxDL test', () => {
        let taxBenefit = cfutils.getTaxBenefit(200000,17,100000);
        expect(taxBenefit).toBe(17000);
        expect(taxBenefit).not.toBe(null);
    })
    test('Tax benefit round off test', () => {
        let taxBenefit = cfutils.getTaxBenefit(2222,17.2,100000);
        expect(taxBenefit).toBe(382);
        expect(taxBenefit).not.toBe(null);
    })
})

describe('calculateTotalAmt',()=>{

    test('Total Amount not null', () => {
        let totalAmount = cfutils.calculateTotalAmt(2025, 4, 2040, 765689, 3, 10 );
        expect(totalAmount).not.toBe(null);
    })
    
    test('Total Amount correct amount', () => {
        let totalAmount = cfutils.calculateTotalAmt(2023,2.6,2023,7053634, 3, 13);
        expect(totalAmount).toBe(2864217);
    })

    test('Total Amount should be zero as start year + duration < annualSY', () => {
        let totalAmount = cfutils.calculateTotalAmt(2022,2.6,2023,7053634, 3, 1);
        expect(totalAmount).toBe(0);
    })
})

describe('calculateSellPrice',()=>{
    test('Compounded Sell Price not null', () => {
        let sellPrice = cfutils.calculateSellPrice(14322150, 3, 6);
        expect(sellPrice).not.toBe(null);
        expect(sellPrice).toBe(17101396);
    })
})
describe('calculateCFs Test suite',()=>{
    // createGoalInput goal = {
    //     id: "75004807-9102-4858-88ce-b01df75d3fa4", 
    //     sy: 2027, 
    //     ey: 2027, 
    //     by: 2020, 
    //     btr: null,
    //     ccy: "INR",
    //     chg: 3,
    //     cp: 400000,
    //     createdAt: "2020-08-06T06:21:39.492Z",
    //     dr: null,
    //     emi: {per: 0, rate: 4, dur: 10, ry: 2021},
    //     imp: "H",
    //     manual: 0,
    //     met: null,
    //     name: "House",
    //     owner: "manishagarg",
    //     pg: null,
    //     pl: null,
    //     prob: null,
    //     ra: null,
    //     rachg: null,
    //     sa: 5,
    //     tbi: 0,
    //     tbr: 0,
    //     tdl: 0,
    //     tdli: 0,
    //     tdr: 0,
    //     tgts: [],
    //     type: "B",
    //     updatedAt: "2020-08-06T06:21:39.492Z"
    // };
    // test('price is null', () => {
    //     let sellPrice = cfutils.calculateCFs(2232, null, 12);
    //     expect(sellPrice).not.toBe(null);
        
    // })
})

describe('getLoanBorrowAmt test suite', ()=>{
    enum GoalType {
        B = "B",
        S = "S"
      }
    //manual mode etc
    test('Zero amount', () => {
        let getLoanBorrowAmt = cfutils.getLoanBorrowAmt(100000, GoalType.B, 0, 3, 0, 0);
        expect(getLoanBorrowAmt).toBe(0);
    })
    test('Not null amount', () => {
        let getLoanBorrowAmt = cfutils.getLoanBorrowAmt(100000, GoalType.B, 0, 3, 0, 0);
        expect(getLoanBorrowAmt).not.toBe(null);
    })
   
})

describe('getLoanPaidForMonths test suite', ()=>{
    
    test('getLoanPaidForMonths test not null',()=>{
        let loanPaidForMonths = cfutils.getLoanPaidForMonths(2030, 2025, 20);
        expect(loanPaidForMonths).not.toBe(null);
        expect(loanPaidForMonths).toBe(72);     
    })
    test('getLoanPaidForMonths test not null',()=>{
        let loanPaidForMonths = cfutils.getLoanPaidForMonths(0, 2025, 20);
        expect(loanPaidForMonths).not.toBe(null);
    })
    test('getLoanPaidForMonths test not null',()=>{
        let loanPaidForMonths = cfutils.getLoanPaidForMonths(2040, 2025, 10);
        expect(loanPaidForMonths).toBe(120);
    })
    // Right now sell after gives non zero end year but after brush ups there can be a case of zero 
    // If negative that means loan is taken till loan years
    // Include that check
})

