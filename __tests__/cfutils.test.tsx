import * as goals from '../src/api/goals';
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
    
    const goal: goals.CreateGoalInput = {
        achg: 3,
        aiper: 0,
        aisy: 2021,
        amper: 2,
        amsy: 2021,
        by: 2020,
        ccy: "INR",
        chg: 3,
        cp: 5800000,
        emi: {rate: 4, dur: 10, per: 0, ry: 2021},
        ey: 2021,
        imp: goals.LMH.M,
        manual: 0,
        name: "House",
        ra: 0,
        rachg: 5,
        sa: 5,
        sy: 2021,
        tbi: 0,
        tbr: 0,
        tdl: 0,
        tdli: 0,
        tdr: 0,
        tgts: [],
        type: goals.GoalType.B,
        id: "75004807-9102-4858-88ce-b01df75d3fa4"
       
    };
    test('price is passed', () => {
        let duration = 5;
        let sellPrice = cfutils.calculateCFs(5974000, goal, duration);
        expect(sellPrice).not.toBe(null);
        expect(sellPrice).toEqual([-6093480,-123064,-126756,-130559,-134476,6925503]);
        expect(sellPrice).toHaveLength(duration+1);
        
    })
    test('price is null', () => {
        let duration = 5;
        let sellPrice = cfutils.calculateCFs(null, goal, duration);
        let sellPriceExpected = cfutils.calculateCFs(5974000, goal, duration);
        expect(sellPrice).not.toBe(null);
        expect(sellPrice).toEqual(sellPriceExpected);
        expect(sellPrice).toHaveLength(duration+1);
    });

})

describe('getLoanBorrowAmt test suite', ()=>{
    enum GoalType {
        B = "B"
      }
    
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

describe('calculateCFs Test with createAutoCF suite',()=>{
    
    const goal: goals.CreateGoalInput = {
        achg: 3,
        aiper: 0,
        aisy: 2021,
        amper: 2,
        amsy: 2021,
        by: 2020,
        ccy: "INR",
        chg: 2.5,
        cp: 6550000,
        emi: {rate: 4, dur: 10, per: 0, ry: 2021},
        ey: 2023,
        imp: goals.LMH.M,
        manual: 0,
        name: "House",
        ra: 0,
        rachg: 5,
        sa: 5,
        sy: 2023,
        tbi: 0,
        tbr: 0,
        tdl: 0,
        tdli: 0,
        tdr: 0,
        tgts: [],
        type: goals.GoalType.B,
        id: "75004807-9102-4858-88ce-b01df75d3fa4"
       
    };
    test('AutoCF is called', () => {
        let duration = 5;
        let price = 7157362;
        let cashFlows = cfutils.calculateCFs(price, goal, duration);
        expect(cashFlows).not.toBe(null);
        expect(cashFlows).toEqual([-7300509, -147442, -151865, -156421, -161113, 8297344]);
    })
    

})

describe('calculateCFs Test with createLoanCF suite',()=>{
    
    const goal: goals.CreateGoalInput = {
        achg: 3,
        aiper: 0,
        aisy: 2021,
        amper: 2,
        amsy: 2021,
        by: 2020,
        ccy: "INR",
        chg: 2.5,
        cp: 6550000,
        emi: {rate: 9, dur: 12, per: 40, ry: 2024},
        ey: 2023,
        imp: goals.LMH.M,
        manual: 0,
        name: "House",
        ra: 0,
        rachg: 5,
        sa: 5,
        sy: 2023,
        tbi: 0,
        tbr: 0,
        tdl: 800000,
        tdli: 0,
        tdr: 10,
        tgts: [],
        type: goals.GoalType.B
    };

    test('price is passed', () => {
        let duration = 5;
        let price = 7053634;
        // ey = sy+duration-1 = 2027, sy =2023, loan for 12 years.
        // loanDP = price = 7053634
        //tax benefit on LoanDP = 0
        //First CF = -loanDP
        //emi = 32109 tested
        //received annualInt array of length 12 = loan years (correct)
        let loanCF = cfutils.calculateCFs(price, goal, duration);
        expect(loanCF).not.toBe(null);
        //expect(loanCF).toHaveLength(duration+1);

    })
    

})


// To be tested
//XIRR
// calculateTotalTaxBenefit
// calculatePrincipalTaxBenefit(158)
// calculateInterestTaxBenefit (174)