export function getEmi(loanAmt: number, annualRate: number, months: number) {
    if(loanAmt <= 0 || annualRate <= 0 || months <= 0) return 0
    let monthlyRate = annualRate / 1200
    return loanAmt * monthlyRate *
    Math.pow(1 + monthlyRate, months) /
    (Math.pow(1 + monthlyRate, months) - 1);
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

export function getTotalInt(borrowAmt: number, emi: number, months: number) {
    return Math.round((emi * months) - borrowAmt)
}

export function getTotalAmtIncludingInt(dpAmt: number, emi: number, months: number) {
    if (emi <= 0 || months <= 0) return 0
    return Math.round((emi * months) + dpAmt)
}
