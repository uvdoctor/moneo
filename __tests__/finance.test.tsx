import * as finance from '../src/components/calc/finance';

// getEMI - amount must be positive number, rate as percent without decimals, number of months as tenure
describe('getEMI function absurd values', ()=>{
  
  test('Zero amount', () => {
    let getEMI = finance.getEmi(0,10,12);
    expect(getEMI).toBe(0)
  })

  test('Negative amount', () => {
    let getEMI = finance.getEmi(-2000,2,12);
    expect(getEMI).toBe(0)
  })

  test('Zero rate', () => {
    let getEMI = finance.getEmi(2000,0,12);
    expect(getEMI).toBe(2000/12)
  })

  test('Negative rate', () => {
    let getEMI = finance.getEmi(2000,-2,12);
    expect(getEMI).toBe(0)
  })

  test('Zero time', () => {
    let getEMI = finance.getEmi(2000,11.1,0);
    expect(getEMI).toBe(0)
  })

  test('Negative time', () => {
    let getEMI = finance.getEmi(2000,2,-12);
    expect(getEMI).toBe(0)
  })

  test('Loan years in decimal', () => {
    let getEMI = Math.round(finance.getEmi(1000000, 9.6, 30));
    expect(getEMI).toBe(37626);
  })
})

// Suite 2
describe('getEMI functionality', ()=>{
  
  test('Return Amount is not null or undefined', () => {
    let getEMI = finance.getEmi(405745.926,10,120);    
    expect(getEMI).not.toEqual(null);
  })

  test('Return Amount is not zero', () => {
    let getEMI = finance.getEmi(405745.926,10,120);    
    expect(getEMI).not.toBe(0);
  })

  test('Return Amount is correct', () => {
    let getEMI = finance.getEmi(800000,10,10*12);
    getEMI = Math.round(getEMI); // function returns decimal (setEMI)
    expect(getEMI).toBe(10572);
  })

})

// getCompoundedRate(rate: number, years: number, frequency: number = 1)

describe('getCompundedRate functionality', ()=>{
  test('Return Amount is correct', () => {
    let getCompoundedRate = finance.getCompoundedRate(2,10,1);
    expect(getCompoundedRate).toBe(1.2189944199947573);
  })
  test('Return Amount is correct', () => {
    let getCompoundedRate = finance.getCompoundedRate(2,10,0); //f=0 should be set to 1
    expect(getCompoundedRate).toBe(1.2189944199947573);
  })
  test('Return Amount is correct', () => {
    let getCompoundedRate = finance.getCompoundedRate(2,10,2);
    expect(getCompoundedRate).toBe(1.220190039947967);
  })
  
  test('Return Amount is correct', () => {
    let getCompoundedRate = finance.getCompoundedRate(2,10); // f is not passed as an aurgument
    expect(getCompoundedRate).toBe(1.2189944199947573);
  })
  
})

// Testing getCompoundedIncome(rate: number, value: number, years: number, frequency: number = 1)
describe('getCompundedRate functionality', ()=>{
  
  test('Return Amount is correct', () => {
    let getCompoundedIncome = finance.getCompoundedIncome(2,1000, 10,1);
    expect(getCompoundedIncome).toBe(1218.9944199947574);
  })
  
  test('Return Amount is correct', () => {
    let getCompoundedIncome = finance.getCompoundedIncome(2,0, 10,1);
    expect(getCompoundedIncome).toBe(0);
  })

})

//Testing getTotalInt (borrowAmt: number, emi: number, intRate: number, loanPaidForMonths: number)
describe('getTotalInt functionality', ()=>{
  let borrowAmt = 9000000;
  let intRate = 10;
  let months = 120;
  let emi = finance.getEmi(borrowAmt,intRate,months); // No rounding

  test('emi not null', () => {
    expect(emi).not.toEqual(null);
    expect(emi).not.toBe(0);
  })

  test('Return Value check', () => {
    let loanPaidForMonths = months; 
    let totalInt = finance.getTotalInt(borrowAmt, emi, intRate, loanPaidForMonths);
    expect(totalInt).toBe(5272279.583230232);
  })
})

describe('getTotalInt functionality check 2', ()=>{
  let borrowAmt = 500000;
  let intRate = 14.60;
  let months = 48;
  let emi = finance.getEmi(borrowAmt,intRate,months);

  test('emi not null', () => {
    expect(emi).not.toEqual(null);
    expect(emi).not.toBe(0);
    expect(emi).toBe(13814.20326578634); //matches with PMT function on excel (13814)
  })

  test('Return Value check', () => {
    let loanPaidForMonths = months; 
    let totalInt = finance.getTotalInt(borrowAmt, emi, intRate, loanPaidForMonths);
    expect(totalInt).toBe(163081.7567577438);
    expect(totalInt).not.toBe(null);
  })
}) 

// getTotalInt and getRemainingPrincipal
describe('getTotalInt functionality check 3 with different loan paid for months', ()=>{
  let borrowAmt = 50000;
  let intRate = 8;
  let years = 2;
  let months = years*12;
  let emi = finance.getEmi(borrowAmt,intRate,months);

  test('Return Value check for all periods', () => {
    let loanPaidForMonths = 1; 
    let totalInt = finance.getTotalInt(borrowAmt, emi, intRate, loanPaidForMonths);
    expect(totalInt).not.toBe(null);
    expect(totalInt).toBe(333.33333333333337);
    loanPaidForMonths++;
    totalInt = finance.getTotalInt(borrowAmt, emi, intRate, loanPaidForMonths);
    expect(totalInt).toBe(653.8131250701608);
    loanPaidForMonths++;
    totalInt = finance.getTotalInt(borrowAmt, emi, intRate, loanPaidForMonths);
    expect(totalInt).toBe(961.3536849331722);
    loanPaidForMonths++;
    totalInt = finance.getTotalInt(borrowAmt, emi, intRate, loanPaidForMonths);
    expect(totalInt).toBe(1255.8687513765421);
    loanPaidForMonths++;
    totalInt = finance.getTotalInt(borrowAmt, emi, intRate, loanPaidForMonths);
    expect(totalInt).toBe(1537.2714877774729);
    loanPaidForMonths++;
    totalInt = finance.getTotalInt(borrowAmt, emi, intRate, loanPaidForMonths);
    expect(totalInt).toBe(1805.4744786023484);
    loanPaidForMonths++;
    totalInt = finance.getTotalInt(borrowAmt, emi, intRate, loanPaidForMonths);
    expect(totalInt).toBe(2060.3897255473285);
    loanPaidForMonths++;
    totalInt = finance.getTotalInt(borrowAmt, emi, intRate, loanPaidForMonths);
    expect(totalInt).toBe(2301.9286436532134);
    loanPaidForMonths++;
    totalInt = finance.getTotalInt(borrowAmt, emi, intRate, loanPaidForMonths);
    expect(totalInt).toBe(2530.0020573944093);
    loanPaidForMonths++;
    totalInt = finance.getTotalInt(borrowAmt, emi, intRate, loanPaidForMonths);
    expect(totalInt).toBe(2744.5201967418184);
    loanPaidForMonths++;
    totalInt = finance.getTotalInt(borrowAmt, emi, intRate, loanPaidForMonths);
    expect(totalInt).toBe(2945.392693199482);
    loanPaidForMonths++;
    totalInt = finance.getTotalInt(borrowAmt, emi, intRate, loanPaidForMonths);
    expect(totalInt).toBe(3132.5285758148016);
    loanPaidForMonths++;
    totalInt = finance.getTotalInt(borrowAmt, emi, intRate, loanPaidForMonths);
    expect(totalInt).toBe(3305.8362671621617);
    loanPaidForMonths=20;
    totalInt = finance.getTotalInt(borrowAmt, emi, intRate, loanPaidForMonths);
    expect(totalInt).toBe(4123.979007556167);
    loanPaidForMonths=18;
    totalInt = finance.getTotalInt(borrowAmt, emi, intRate, loanPaidForMonths);
    expect(totalInt).toBe(3961.7036801638324);
    loanPaidForMonths=23;
    totalInt = finance.getTotalInt(borrowAmt, emi, intRate, loanPaidForMonths);
    expect(totalInt).toBe(4257.773823097709);
    loanPaidForMonths=24;
    totalInt = finance.getTotalInt(borrowAmt, emi, intRate, loanPaidForMonths);
    expect(totalInt).toBe(4272.749747420946);
  })
}) 

describe('Get NPV Suite', ()=>{
  const rr = 
    [
      0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 1.49, 0.5, 0.5, 0.5, 0.5, 0.5, 5.765, 5.765, 5.765, 5.765, 5.765, 5.875, 5.875, 5.875, 5.875, 5.875, 5.875, 5.875, 4.2, 4.16, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5
    ];
    const cashflows= [-13086499, 13618106];
    test('getNPV not null', ()=> {
      let npv = finance.getNPV(rr, cashflows, 2);
      expect(npv).not.toBe(null);
    });
    test('Correct NPV', ()=> {
      let npv = finance.getNPV(rr, cashflows, 0); //buy today
      expect(npv).toBe(463855);
    });
    test('Correct NPV', ()=> {
      let npv = finance.getNPV(rr, cashflows, 2); //buy today
      expect(npv).toBe(463855);
    });

})

describe('Get NPV Suite 2 excel data', ()=>{
  const rr = 
    [
    0.5,	0.5,	0.5,	0.5,	0.5,	0.5,	0.5,	0.5,	0.5,	0.5,	0.5,	0.5,	0.5,	0.5,	0.5,	0.5,	5.98,	5.98,	5.98,	4.2,	4.16,	4.12,	4.08
    ];
    const startIndex = 2;
    const buyCashflow1= [-7053634,	0,	0,	0,	7938927.21];
    const rentCashflow1= [-300000,	-309000,	-318270,	-327818.1,	5925147.045];
    const buyCashflow2= [-7053634,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,10056795.47];
    const rentCashflow2= [-300000,	-309000,	-318270,	-327818.1,	-337652.643,	-347782.2223,	-358215.689,-368962.1596,	-380031.0244,	-391431.9551,	-403174.9138,	-415270.1612,	3097844.827];
    const buyCashflow3= [-7053634,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	12368590];
    const rentCashflow3= [-300000,	-309000,	-318270,	-327818.1,	-337652.643,	-347782.2223,	-358215.689,	-368962.1596,	-380031.0244,	-391431.9551,	-403174.9138,	-415270.1612,	-427728.2661,	-440560.114,	-453776.9175,	-467390.225,	-481411.9317,	-495854.2897,	-510729.9184,	132266.6572
    ];
    
    test('getNPV buyCF1 not null', ()=> {
      let npv = finance.getNPV(rr, buyCashflow1, startIndex);
      expect(npv).not.toBe(null);
    });
    test('getNPV rentCF1 not null', ()=> {
      let npv = finance.getNPV(rr, rentCashflow1, startIndex);
      expect(npv).not.toBe(null);
    });
    test('getNPV buyCF2 not null', ()=> {
      let npv = finance.getNPV(rr, buyCashflow2, startIndex);
      expect(npv).not.toBe(null);
    });
    test('getNPV rentlCF2 not null', ()=> {
      let npv = finance.getNPV(rr, rentCashflow2, startIndex);
      expect(npv).not.toBe(null);
    });
    test('Correct NPV for buyCF1', ()=> {
      let npv = finance.getNPV(rr, buyCashflow1, startIndex); //buy today
      expect(npv).toBe(Math.round(728479.7221));
    });
    test('Correct NPV for rentCF1', ()=> {
      let npv = finance.getNPV(rr, rentCashflow1, startIndex); //buy today
      expect(npv).toBe(Math.round(4562587.414));
    });
    test('Correct NPV for buyCF2', ()=> {
      let npv = finance.getNPV(rr, buyCashflow2, startIndex); //buy today
      expect(npv).toBe(Math.round(2418915.351));
    });
    test('Correct NPV for rentCF2', ()=> {
      let npv = finance.getNPV(rr, rentCashflow2, startIndex); //buy today
      expect(npv).toBe(Math.round(-1217880.833));
    });
    test('Correct NPV for buyCF3', ()=> {
      let npv = finance.getNPV(rr, buyCashflow3, startIndex); //buy today
      expect(npv).toBe(Math.round(1563975.204));
    });
    test('Correct NPV for rentCF3', ()=> {
      let npv = finance.getNPV(rr, rentCashflow3, startIndex); //buy today
      expect(npv).toBe(Math.round(-6774902.875));
    });
    
})

describe('get interest by year test suite', ()=>{
  test('getIntAmtByYear is a number and not null', ()=> {
    let interest = finance.getIntAmtByYear(0,21,1,144);
    expect(interest).not.toBe(null);
    expect(interest).not.toBeNaN();
  });
  test('getIntAmtByYear returns array with length = LY', ()=> {
    let loanYears = 12;
    let months: number = loanYears*12;
    let interest = finance.getIntAmtByYear(2821453.6,32268,9.1,months);
    expect(interest).not.toBe(null);
    expect(interest).toHaveLength(loanYears)
  });

  test('getIntAmtByYear check each years annual interest', ()=> {
    let interest = finance.getIntAmtByYear(2821453.6,32268,9.1,144);
    expect(interest[0]).toBe(251170.93043394785);
    expect(interest[1]).toBe(238261.1980136186);
    expect(interest[2]).toBe(224126.42163031368);
    expect(interest[3]).toBe(208650.3531185125);
    expect(interest[4]).toBe(191705.71316900107);
    expect(interest[5]).toBe(173153.1445499335);
    expect(interest[6]).toBe(152840.06599584265);
    expect(interest[7]).toBe(130599.41733867567);
    expect(interest[8]).toBe(106248.28556047815);
    expect(interest[9]).toBe(79586.40046801895);
    expect(interest[10]).toBe(50394.487617382976);
    expect(interest[11]).toBe(18432.46494254415);
  });
});