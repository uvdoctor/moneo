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
    expect(getEMI).toBe(0)
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
    let remainingPrinciple = finance.getRemainingPrincipal(borrowAmt, emi, intRate, loanPaidForMonths);
    expect(totalInt).not.toBe(null);
    expect(remainingPrinciple).not.toBe(null);
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
    remainingPrinciple = finance.getRemainingPrincipal(borrowAmt, emi, intRate, loanPaidForMonths);
    expect(remainingPrinciple).toBe(0);    
  })
}) 

describe('getTotalInt functionality check 3 with different loan paid for months', ()=>{
  let borrowAmt = 50000;
  let intRate = 8;
  let years = 2;
  let months = years*12;
  let emi = finance.getEmi(borrowAmt,intRate,months);

  test('Return Value check for period 1', () => {
    let loanPaidForMonths = 1; 
    let remainingPrinciple = finance.getRemainingPrincipal(borrowAmt, emi, intRate, loanPaidForMonths);
    expect(remainingPrinciple).not.toBe(null);
    expect(remainingPrinciple).toBe(48071.968760524105);
  })

  test('Return Value check for whole period', () => {
    let loanPaidForMonths = months; 
    let remainingPrinciple = finance.getRemainingPrincipal(borrowAmt, emi, intRate, loanPaidForMonths);
    expect(remainingPrinciple).not.toBe(null);
    expect(remainingPrinciple).toBe(0);
  })

  test('Return Value check for whole period', () => {
    let loanPaidForMonths = 2; 
    let remainingPrinciple = finance.getRemainingPrincipal(borrowAmt, emi, intRate, loanPaidForMonths);
    expect(remainingPrinciple).not.toBe(null);
    expect(remainingPrinciple).toBe(46131.0839794517);
  })

  test('Return Value check for whole period', () => {
    let loanPaidForMonths = 7; 
    let remainingPrinciple = finance.getRemainingPrincipal(borrowAmt, emi, intRate, loanPaidForMonths);
    expect(remainingPrinciple).not.toBe(null);
    expect(remainingPrinciple).toBe(36230.83771588272);
  })

  test('Return Value check for whole period', () => {
    let loanPaidForMonths = 12; 
    let remainingPrinciple = finance.getRemainingPrincipal(borrowAmt, emi, intRate, loanPaidForMonths);
    expect(remainingPrinciple).not.toBe(null);
    expect(remainingPrinciple).toBe(25996.153702104042);
  })

  test('Return Value check for various periods', () => {
    let loanPaidForMonths = 15; 
    let remainingPrinciple = finance.getRemainingPrincipal(borrowAmt, emi, intRate, loanPaidForMonths);
    expect(remainingPrinciple).toBe(19690.129117561133);
    loanPaidForMonths = 18; 
    remainingPrinciple = finance.getRemainingPrincipal(borrowAmt, emi, intRate, loanPaidForMonths);
    expect(remainingPrinciple).toBe(13257.141369597697);
    loanPaidForMonths = 20; 
    remainingPrinciple = finance.getRemainingPrincipal(borrowAmt, emi, intRate, loanPaidForMonths);
    expect(remainingPrinciple).toBe(8896.687551371573);
    loanPaidForMonths = 22; 
    remainingPrinciple = finance.getRemainingPrincipal(borrowAmt, emi, intRate, loanPaidForMonths);
    expect(remainingPrinciple).toBe(4477.900550954957);
    loanPaidForMonths = 24; 
    remainingPrinciple = finance.getRemainingPrincipal(borrowAmt, emi, intRate, loanPaidForMonths);
    expect(remainingPrinciple).toBe(0);
  })
})