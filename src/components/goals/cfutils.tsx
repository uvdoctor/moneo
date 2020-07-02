import * as APIt from '../../api/goals'
import { getIntAmtByYear, getRemainingPrincipal, getCompoundedIncome, getEmi, getTotalInt } from '../calc/finance'
import xirr from 'xirr'

export const calculatePrice = (startingPrice: number, priceChgRate: number, buyTaxRate: number | null | undefined, startYear: number, goalCreatedYear: number) => {
    if (!startingPrice) return 0
    let btr = buyTaxRate ? buyTaxRate : 0
    let p = getCompoundedIncome(priceChgRate, startingPrice / (1 + (btr / 100)), startYear - goalCreatedYear)
    return (Math.round(p * (1 + (btr / 100))))
}

const getTaxBenefit = (val: number, tr: number, maxTaxDL: number) => {
    if (!val || !tr) return 0
    if (maxTaxDL > 0 && val > maxTaxDL) val = maxTaxDL
    return Math.round(val * (tr / 100))
}

const calculateBuyAnnualNetCF = (startYear: number, buyTaxRate: number, amCostPer: number, amStartYear: number, chgRate: number, index: number, p: number, aiPer: number, aiSY: number) => {
    let annualNetCF = 0
    let priceAfterTax = p * (1 - (buyTaxRate / 100))
    let yearlyPrice = index === 0 ? priceAfterTax : getCompoundedIncome(chgRate, priceAfterTax, index)
    if (startYear + index >= amStartYear) annualNetCF -= yearlyPrice * (amCostPer / 100)
    if (startYear + index >= aiSY) annualNetCF += yearlyPrice * (aiPer / 100)
    return Math.round(annualNetCF)
}

export const calculateTotalAmt = (startYear: number, buyTaxRate: number, annualPer: number, annualSY: number, price: number, chgRate: number, duration: number) => {
    let priceAfterTax = price * (1 - (buyTaxRate / 100))
    let ta = 0
    for (let i = 0; i < duration; i++) {
        if (startYear + i < annualSY) continue
        let yearlyPrice = i === 0 ? priceAfterTax : getCompoundedIncome(chgRate, priceAfterTax, i)
        ta += yearlyPrice * (annualPer / 100)
    }
    return Math.round(ta)
}

export const calculateSellPrice = (price: number, buyTaxRate: number, chgRate: number, duration: number) => {
    return Math.round(getCompoundedIncome(chgRate, price * (1 - (buyTaxRate / 100)), duration))
}

export const calculateCFs = (goal: APIt.CreateGoalInput, duration: number) => {
    if (goal?.manual as number > 0) return createManualCFs(goal, duration)
    else if (goal?.emi?.per as number > 0) return createLoanCFs(goal, duration)
    else return createAutoCFs(goal, duration)
}

export const calculateTotalTaxBenefit = (goal: APIt.CreateGoalInput, duration: number) => {
    if (goal.manual > 0) {
        let p = calculateManualPrice(goal.tgts as APIt.TargetInput[])
        return Math.round(getTaxBenefit(p, goal.tdr, goal.tdl))
    } else if (!goal.emi || !goal.emi.per) {
        let p = calculatePrice(goal?.cp as number, goal.chg as number, goal.btr, goal.sy, goal.by)
        if (goal.type === APIt.GoalType.B && duration) {
            return Math.round(getTaxBenefit(p, goal.tdr, goal.tdl))
        }
        let btr = goal?.btr ? goal.btr : 0
        let tb = 0
        for (let i = 0, v = p; i < duration; i++, v = getCompoundedIncome(goal.chg as number, p / (1 + (btr / 100)), i) * (1 + (btr / 100))) {
            tb += getTaxBenefit(v, goal.tdr, goal.tdl)
        }
        return Math.round(tb)
    }
    return 0
}

export const calculatePrincipalTaxBenefit = (price: number, loanPer: number, loanInt: number, loanYears: number, 
    loanRepaymentSY: number, endYear: number, buyTaxRate: number, taxRate: number, maxTaxDL: number) => {
    let loanBorrowAmt = getLoanBorrowAmt(price, buyTaxRate, loanPer)
    let emi = getEmi(loanBorrowAmt, loanInt as number, loanYears * 12)
    let loanPaidForMonths = getLoanPaidForMonths(endYear, loanRepaymentSY, loanYears)
    let totalInt = getTotalInt(loanBorrowAmt, emi, loanInt, loanPaidForMonths)
    return getTaxBenefit(loanBorrowAmt - totalInt, taxRate, maxTaxDL as number)
}

export const calculateTotalIntTaxBenefit = (goal: APIt.CreateGoalInput, endYear: number) => {
    if (goal.emi && goal.emi.per > 0 && goal.tbi as number > 0) {
        let p = calculatePrice(goal?.cp as number, goal.chg as number, goal.btr, goal.sy, goal.by)
        let loanBorrowAmt = getLoanBorrowAmt(p, goal.btr as number, goal.emi.per)
        let emi = getEmi(loanBorrowAmt, goal.emi.rate, goal.emi.dur * 12)
        let loanPaidForMonths = getLoanPaidForMonths(endYear, goal.emi.ry, goal.emi.dur)
        let totalInt = getTotalInt(loanBorrowAmt, emi, goal.emi.rate, loanPaidForMonths)
        return getTaxBenefit(totalInt, goal.tdr, goal.tdli as number)
    } else return 0
}

const createAutoCFs = (goal: APIt.CreateGoalInput, duration: number) => {
    let p = calculatePrice(goal?.cp as number, goal.chg as number, goal.btr, goal.sy, goal.by)
    let cfs: Array<number> = []
    if (goal.type === APIt.GoalType.B && duration) {
        let netAnnualAmt = calculateBuyAnnualNetCF(goal.sy, goal?.btr as number, goal.amper as number, goal.amsy as number, goal.achg as number, 0, p, goal.aiper as number, goal.aisy as number)
        let v = Math.round(p - getTaxBenefit(p, goal.tdr, goal.tdl) - netAnnualAmt)
        cfs.push(-v)
        for (let i = 1; i < duration; i++)
            cfs.push(calculateBuyAnnualNetCF(goal.sy, goal?.btr as number, goal.amper as number, goal.amsy as number, goal.achg as number, i, p, goal.aiper as number, goal.aisy as number))
        cfs.push(calculateSellPrice(p, goal?.btr as number, goal?.achg as number, duration))
    } else {
        let btr = goal?.btr ? goal.btr : 0
        for (let i = 0, v = p; i < duration; i++, v = getCompoundedIncome(goal.chg as number, p / (1 + (btr / 100)), i) * (1 + (btr / 100))) {
            if (v > 0) v -= getTaxBenefit(v, goal.tdr, goal.tdl)
            cfs.push(Math.round(-v))
        }
    }
    return cfs
}

export const calculateXIRR = (cfs: Array<number>, startYear: number, price: number, sellAfter: number, sellPrice: number) => {
    if (!price || !sellPrice || !cfs) return null
    let xirrCFs: Array<any> = []
    let addSellCF = false
    cfs.forEach((cf, i) => {
        if (i === sellAfter && cf <= 0) {
            cf -= sellPrice
            addSellCF = true
        }
        xirrCFs.push({
            amount: cf,
            when: new Date(startYear + i, 0, 1)
        })
    })
    if (addSellCF) {
        xirrCFs.push({
            amount: Math.round(sellPrice),
            when: new Date(startYear + sellAfter, 1, 1)
        })
    }
    console.log("XIRR cfs are ", xirrCFs)
    try {
        return (xirr(xirrCFs) * 100)
    } catch (e) {
        console.log("Error while calculating xirr: ", e)
        return null
    }
}

export const getLoanBorrowAmt = (price: number, buyTaxRate: number, loanPer: number) => {
    return Math.round((price * (1 - (buyTaxRate / 100))) * (loanPer / 100))
}

export const getLoanPaidForMonths = (endYear: number, loanRepaymentYear: number, loanYears: number) => {
    let totalMonths = loanYears * 12
    let loanPaidForMonths = (endYear + 1 - loanRepaymentYear) * 12
    return loanPaidForMonths < totalMonths ? loanPaidForMonths : totalMonths
}

const createLoanCFs = (goal: APIt.CreateGoalInput, duration: number) => {
    let p = calculatePrice(goal?.cp as number, goal?.chg as number, goal?.btr as number, goal.sy, goal.by)
    let cfs: Array<number> = []
    let loanBorrowAmt = getLoanBorrowAmt(p, goal?.btr as number, goal.emi?.per as number)
    let loanDP = p - loanBorrowAmt
    let emi = Math.round(getEmi(loanBorrowAmt, goal.emi?.rate as number, goal.emi?.dur as number * 12))
    let annualInts = getIntAmtByYear(loanBorrowAmt, emi, goal.emi?.rate as number, goal.emi?.dur as number * 12)
    let ey = goal.sy + duration - 1
    let sp = 0
    for (let year = goal.sy, ly = goal.emi?.dur as number; year <= ey; year++) {
        let cf = year === goal.sy ? loanDP : 0
        if (year >= (goal.emi?.ry as number) && ly > 0) {
            let annualEmiAmt = emi * (ly === 0.5 ? 6 : 12)
            let i = year - (goal.emi?.ry as number)
            let taxBenefit = getTaxBenefit(annualEmiAmt - annualInts[i], goal.tdr, goal.tdl)
            taxBenefit += goal.tbi as number > 0 ? getTaxBenefit(annualInts[i], goal.tdr, goal.tdli as number) : 0
            cf += annualEmiAmt - taxBenefit
            ly--
        }
        cf -= calculateBuyAnnualNetCF(goal.sy, goal?.btr as number, goal.amper as number, goal.amsy as number, goal.achg as number, 
            year - goal.sy, p, goal.aiper as number, goal.aisy as number)
        cfs.push(Math.round(-cf))
    }
    if (goal.type === APIt.GoalType.B) {
        let remPayment = getRemPrincipal(goal.sy, loanBorrowAmt, emi, goal?.emi?.rate as number, goal?.emi?.ry as number, goal?.emi?.dur as number, duration)
        remPayment -= getTaxBenefit(remPayment, goal.tdr, goal.tdl)
        sp = calculateSellPrice(p, goal?.btr as number, goal?.achg as number, duration)
        cfs.push(Math.round(sp - remPayment))
    }
    return cfs
}

const getRemPrincipal = (startYear: number, loanBorrowAmt: number, emi: number, loanIntRate: number, loanRepaymentSY: number, loanYears: number, duration: number) => {
    let ey = startYear + duration - 1
    let remPrincipal = loanBorrowAmt
    if (ey >= loanRepaymentSY) {
        let loanPaidForMonths = getLoanPaidForMonths(ey, loanRepaymentSY, loanYears)
        remPrincipal = getRemainingPrincipal(loanBorrowAmt, emi, loanIntRate, loanPaidForMonths)
    }
    return remPrincipal
}

export const calculateManualPrice = (targets: Array<APIt.TargetInput>) => {
    let p = 0
    targets.forEach(t => p += t.val)
    return Math.round(p)
}

const createManualCFs = (goal: APIt.CreateGoalInput, duration: number) => {
    if (!goal.tgts) return []
    let targets = goal.tgts
    let p = calculateManualPrice(targets)
    let cfs: Array<number> = []
    for (let i = 0; i < duration; i++) {
        let v = 0
        if (i < targets.length) v = targets[i].val
        if (v > 0) v -= getTaxBenefit(v, goal.tdr, goal.tdl)
        if (goal.type === APIt.GoalType.B && duration)
            v -= Math.round(calculateBuyAnnualNetCF(goal.sy, goal?.btr as number, goal?.amper as number, goal?.amsy as number, goal?.achg as number, i, p, goal.aiper as number, goal.aisy as number))
        cfs.push(-v)
    }
    if (goal.type === APIt.GoalType.B) {
        let remPayment = 0
        if (duration <= goal.ey - goal.sy) {
            for (let i = duration; i < goal.ey; i++) {
                if (targets[i]) remPayment += targets[i].val
            }
        }
        let sp = calculateSellPrice(p, goal?.btr as number, goal?.achg as number, duration)
        cfs.push(Math.round(sp - remPayment))
    }
    return cfs
}