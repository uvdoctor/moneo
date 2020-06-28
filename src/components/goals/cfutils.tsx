import * as APIt from '../../api/goals'
import { getIntAmtByYear, getRemainingPrincipal, getCompoundedIncome, getEmi } from '../calc/finance'
import xirr from 'xirr'

export const calculatePrice = (startingPrice: number, priceChgRate: number, buyTaxRate: number, startYear: number, goalCreatedYear: number) => {
    if (!startingPrice) return 0
    let p = getCompoundedIncome(priceChgRate, startingPrice / (1 + (buyTaxRate / 100)), startYear - goalCreatedYear)
    return (Math.round(p * (1 + (buyTaxRate / 100))))
}

export const getTaxBenefit = (val: number, tr: number, maxTaxDL: number) => {
    if (val <= 0 || tr <= 0) return 0
    if (maxTaxDL > 0 && val > maxTaxDL) val = maxTaxDL
    return Math.round(val * (tr / 100))
}

export const calculateAMCost = (startYear: number, buyTaxRate: number, amCostPer: number, amStartYear: number, chgRate: number, index: number, p: number) => {
    if (startYear + index < amStartYear) return 0
    let priceAfterTax = p * (1 - (buyTaxRate / 100))
    let yearlyPrice = index === 0 ? priceAfterTax : getCompoundedIncome(chgRate, priceAfterTax, index)
    return Math.round(yearlyPrice * (amCostPer / 100))
}

export const calculateTMCost = (startYear: number, buyTaxRate: number, amCostPer: number, amStartYear: number, price: number, chgRate: number, duration: number) => {
    let priceAfterTax = price * (1 - (buyTaxRate / 100))
    let totalMaintCost = 0
    for (let i = 0; i < duration; i++) {
        if (startYear + i < amStartYear) continue
        let yearlyPrice = i === 0 ? priceAfterTax : getCompoundedIncome(chgRate, priceAfterTax, i)
        totalMaintCost += yearlyPrice * (amCostPer / 100)
    }
    return Math.round(totalMaintCost)
}

export const calculateSellPrice = (price: number, buyTaxRate: number, chgRate: number, duration: number) => {
    return Math.round(getCompoundedIncome(chgRate, price * (1 - (buyTaxRate / 100)), duration))
}

export const calculateCFs = (goal: APIt.CreateGoalInput, duration: number) => {
    if(goal?.manual as number > 0) return createManualCFs(goal, duration)
    else if(goal?.emi?.per as number > 0) return createLoanCFs(goal, duration)
    else return createAutoCFs(goal, duration)
}

const createAutoCFs = (goal: APIt.CreateGoalInput, duration: number) => {
    let p = calculatePrice(goal?.cp as number, goal.chg as number, goal.btr, goal.sy, goal.by)
    let cfs: Array<number> = []
    if (goal.type === APIt.GoalType.B && duration) {
        let amCost = calculateAMCost(goal.sy, goal.btr, goal.amper as number, goal.amsy as number, goal.achg as number, 0, p)
        let v = Math.round(p - getTaxBenefit(p, goal.tdr, goal.tdl) + amCost)
        cfs.push(-v)
        for (let i = 1; i < duration; i++) {
            amCost = calculateAMCost(goal.sy, goal.btr, goal.amper as number, goal.amsy as number, goal.achg as number, i, p)
            cfs.push(-amCost)
        }
        cfs.push(calculateSellPrice(p, goal.btr, goal?.achg as number, duration))
    } else {
        for (let i = 0, v = p; i < duration; i++, v = getCompoundedIncome(goal.chg as number, p/(1+(goal.btr/100)), i) * (1+(goal.btr/100))) {
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
    if(addSellCF) {
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
    let p = calculatePrice(goal?.cp as number, goal?.chg as number, goal.btr, goal.sy, goal.by)
    let cfs: Array<number> = []
    let loanBorrowAmt = getLoanBorrowAmt(p, goal.btr, goal.emi?.per as number)
    let loanDP = p - loanBorrowAmt
    let emi = Math.round(getEmi(loanBorrowAmt, goal.emi?.rate as number, goal.emi?.dur as number * 12))
    let annualInts = goal.tbi as number > 0 ? getIntAmtByYear(loanBorrowAmt, emi, goal.emi?.rate as number, goal.emi?.dur as number * 12) : []
    let ey = goal.sy + duration - 1
    let sp = 0
    for (let year = goal.sy, ly = goal.emi?.dur as number; year <= ey; year++) {
        let cf = 0
        if (year === goal.sy) cf += goal.tbi as number > 0 ? loanDP : loanDP - getTaxBenefit(loanDP, goal?.tbr as number, goal.tdl)
        if (year >= (goal.emi?.ry as number) && ly > 0) {
            let annualEmiAmt = emi * (ly === 0.5 ? 6 : 12)
            let i = year - (goal.emi?.ry as number)
            let taxBenefitEligibleAmt = goal.tbi as number > 0 ? annualInts[i] : annualEmiAmt
            let amCost = calculateAMCost(goal.sy, goal.btr, goal?.amper as number, goal?.amsy as number, goal?.achg as number, i, p)
            cf += annualEmiAmt + amCost - getTaxBenefit(taxBenefitEligibleAmt, goal?.tbr as number, goal?.tdl as number)
            ly--
        }
        cfs.push(Math.round(-cf))
    }
    if (goal.type === APIt.GoalType.B) {
        let remPayment = getRemPrincipal(goal.sy, loanBorrowAmt, emi, goal?.emi?.rate as number, goal?.emi?.ry as number, goal?.emi?.dur as number, duration)
        sp = calculateSellPrice(p, goal.btr, goal?.achg as number, duration)
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
        if (v > 0) v -= getTaxBenefit(v, goal.tbr as number, goal.tdl)
        if (goal.type === APIt.GoalType.B && duration) {
            let amCost = Math.round(calculateAMCost(goal.sy, goal.btr, goal?.amper as number, goal?.amsy as number, goal?.achg as number, i, p))
            v += amCost
        }
        cfs.push(-v)
    }
    if (goal.type === APIt.GoalType.B) {
        let remPayment = 0
        if (duration <= goal.ey - goal.sy) {
            for (let i = duration; i < goal.ey; i++) {
                if (targets[i]) remPayment += targets[i].val
            }
        }
        let sp = calculateSellPrice(p, goal.btr, goal?.achg as number, duration)
        cfs.push(Math.round(sp - remPayment))
    }
    return cfs
}