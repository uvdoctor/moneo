export function getEmi(loanAmt: number, annualRate: number, months: number) {
    if(loanAmt <= 0 || annualRate < 0 || months <= 0) return 0
    if(!annualRate) return loanAmt / months
    let monthlyRate = annualRate / 1200
    return loanAmt * monthlyRate *
    Math.pow(1 + monthlyRate, months) /
    (Math.pow(1 + monthlyRate, months) - 1);
}

export function getIR(loanAmt: number, emi: number, months: number) {
    if (!loanAmt || !emi || !months) return 0;
    let monthlyRate = 1 - Math.pow(emi / (loanAmt - emi), 1 / months);
    return monthlyRate * 1200;
}

//Tested
export function getCompoundedRate(rate: number, years: number, frequency: number = 1) {
    let r = rate ? rate : 0
    let y = years ? years: 0
    let f = frequency ? frequency : 1
    return Math.pow(1 + r / (f * 100), f * y);
}
//Tested

export function getCompoundedIncome(rate: number, value: number, years: number, frequency: number = 1) {
    return value * getCompoundedRate(rate, years, frequency);
}
//Tested

export function getTotalInt(borrowAmt: number, emi: number, intRate: number, loanPaidForMonths: number) {
    let principal = borrowAmt
    let monthlyRate = intRate / 1200
    let totalInt = 0
    for(let i = 0; i < loanPaidForMonths; i++) {
        let monthlyInt = principal * monthlyRate
        totalInt += monthlyInt
        principal -= (emi - monthlyInt)
    }
    return totalInt
}
//Tested

export function getIntAmtByYear(borrowAmt: number, emi: number, intRate: number, months: number) {
    let principal = borrowAmt
    let annualInts = []
    let monthlyRate = intRate / 1200
    let annualInt = 0
    let monthlyInt = 0
    for(let i = 1; i <= months; i++) {
        monthlyInt = i === months ? emi - principal : principal * monthlyRate
        annualInt += monthlyInt
        if(i % 12 === 0 || i === months) {
            annualInts.push(annualInt)
            annualInt = 0
        }
        principal -= (emi - monthlyInt);
    }
    return annualInts
}

export function getRemainingPrincipal(borrowAmt: number, emi: number, intRate: number, loanPaidForMonths: number) {
    let principal = borrowAmt
    let monthlyRate = intRate / 1200
    for(let i = 0; i < loanPaidForMonths; i++) 
        principal -= (emi - (principal * monthlyRate))
    return principal <= 0 ? 0 : principal
}
//Tested

export function getNPV(rr: number | Array<number>, cashFlows: Array<number>, startIndex: number) {
    let npv = 0
    for(let i = cashFlows.length - 1; i > 0; i--) {
        let dr = typeof rr === 'number' ? rr : rr[startIndex + i]
        dr = dr >= 0 ? dr : 3
        npv = (cashFlows[i] + npv) / (1 + (dr/100))
    }
    return Math.round(npv + cashFlows[0])
}
