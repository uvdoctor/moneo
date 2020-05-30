export function getEmi(total: number, dpInPer: number, annualRate: number, months: number) {
    let totalAmt = total ? total : 0
    let loanDP = dpInPer ? dpInPer : 0
    let monthlyRate = annualRate ? (annualRate / 1200) : 0
    let loanMonths = months ? months : 0
    if(totalAmt <= 0 || monthlyRate <= 0 || loanMonths <= 0) return null
    let loanAmt = totalAmt * (1 - (loanDP / 100))
    if(loanAmt <= 0) return null
    return loanAmt * monthlyRate *
    Math.pow(1 + monthlyRate, loanMonths) /
    (Math.pow(1 + monthlyRate, loanMonths) - 1);
}

export function getCompoundedRate(rate: number, years: number, frequency: number = 1) {
    let r = rate ? rate : 0
    let y = years ? years: 0
    let f = frequency ? frequency : 0
    return Math.pow(1 + r / (f * 100), f * y);
}

export function getCompoundedIncome(rate: number, value: number, years: number, frequency: number = 1) {
    return value * getCompoundedRate(rate, years, frequency);
}

export function getTotalInt(amt: number, dpInPer: number, emi: number, months: number) {
    return Math.round(getTotalAmtIncludingInt(amt, dpInPer, emi, months) - amt)
}

export function getTotalAmtIncludingInt(amt: number, dpInPer: number, emi: number, months: number) {
    if (emi <= 0 || months <= 0) return 0
    return Math.round((emi * months) + (amt * (dpInPer / 100)))
}
