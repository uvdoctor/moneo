import * as APIt from '../../api/goals'
import { getIntAmtByYear, getRemainingPrincipal, getCompoundedIncome, getEmi } from '../calc/finance'
import xirr from 'xirr'
import { getDuration } from './goalutils'

export const calculatePrice = (startingPrice: number, priceChgRate: number, buyTaxRate: number | null | undefined, startYear: number, goalCreatedYear: number) => {
    if (!startingPrice) return 0
    let btr = buyTaxRate ? buyTaxRate : 0
    let p = getCompoundedIncome(priceChgRate, startingPrice / (1 + (btr / 100)), startYear - goalCreatedYear)
    return (Math.round(p * (1 + (btr / 100))))
}

export const getTaxBenefit = (val: number, tr: number, maxTaxDL: number) => {
    if (!val || val < 0 || !tr) return 0
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

export const calculateTotalCPTaxBenefit = (taxRate: number, maxTDL: number,
    paymentSY: number, payment: number, paymentChgRate: number, duration: number) => {
    if (!taxRate) return 0
    let totalTaxBenefit = 0
    for (let year = paymentSY; year < paymentSY + duration; year++) {
        let premium = getCompoundedIncome(paymentChgRate, payment, year - paymentSY)
        totalTaxBenefit += getTaxBenefit(premium, taxRate, maxTDL)
    }
    return totalTaxBenefit
}

export const calculateTotalCP = (paymentSY: number, payment: number, paymentChgRate: number, duration: number) => {
    if (!payment) return 0
    let total = 0
    for (let year = paymentSY; year < paymentSY + duration; year++) {
        total += getCompoundedIncome(paymentChgRate, payment, year - paymentSY)
    }
    return total
}

export const calculateFFCFs = (g: APIt.CreateGoalInput, annualSavings: number, savingsChgRate: number, expense: number, 
    expenseChgRate: number, ffYear: number) => {
    let cfs: Array<number> = []
    let nowYear = new Date().getFullYear()
    let duration = ffYear - (nowYear + 1)
    for (let i = 1; i <= duration; i++) {
        let val = getCompoundedIncome(savingsChgRate, annualSavings, i)
        cfs.push(Math.round(val))
    }
    for (let year = ffYear; year <= g.ey; year++) {
        let cf = getCompoundedIncome(expenseChgRate, expense, year - (g.sy + 1))
                    * (1 + (g.tdr / 100))
        cfs.push(Math.round(-cf))
    }
    //@ts-ignore
    if (g?.dr as number > 0 && nowYear < g.amsy + g.achg) {
        //@ts-ignore
        let premiumYear = nowYear > g.amsy ? nowYear : g.amsy
        //@ts-ignore
        for (let year = premiumYear; year < g.amsy + g.achg; year++) {
            //@ts-ignore
            let premium = getCompoundedIncome(g.amper, g.dr, year - premiumYear)
            //@ts-ignore
            let index = cfs.length - (g.ey - year)
            cfs[index] -= premium
            cfs[index + 1] += getTaxBenefit(premium, g.tdr, g.tdl)
        }
    }
    g.pg?.forEach((t) => {
        //@ts-ignore
        let index = cfs.length - (g.ey - t?.year)
        cfs[index] += t?.val as number
    })
    g.pl?.forEach((t) => {
        //@ts-ignore
        let index = cfs.length - (g.ey - t?.year)
        cfs[index] -= t?.val as number
    })
    //@ts-ignore
    cfs.push(-Math.round((g?.sa * (1 + g.btr / 100))))
    return cfs
}

export const calculateSellCFs = (goal: APIt.CreateGoalInput, duration: number) => {
    let cfs: Array<number> = []
    let p = goal.cp as number
    for (let i = 0; i < duration; i++) {
        let netAnnualAmt = calculateBuyAnnualNetCF(goal.sy, 0, goal.amper as number, goal.amsy as number, goal.achg as number, 0, p, goal.aiper as number, goal.aisy as number)
        cfs.push(Math.round(netAnnualAmt))
    }
    cfs.push(calculateSellPrice(p, 0, goal?.achg as number, duration))
    return cfs
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

export const calculatePrincipalTaxBenefit = (type: APIt.GoalType, price: number, loanPer: number, loanInt: number, loanYears: number,
    loanRepaymentSY: number, startYear: number, endYear: number, sellAfter: number | null | undefined, buyTaxRate: number,
    taxRate: number, maxTaxDL: number) => {
    let loanBorrowAmt = getLoanBorrowAmt(price, buyTaxRate, loanPer)
    let emi = getEmi(loanBorrowAmt, loanInt as number, loanYears * 12)
    let annualInts = getIntAmtByYear(loanBorrowAmt, emi, loanInt, loanYears * 12)
    let duration = getDuration(sellAfter, startYear, endYear)
    let ey = startYear + duration - 1
    let taxBenefit = 0
    for (let year = startYear, ly = loanYears; year <= ey; year++) {
        if (year >= loanRepaymentSY && ly > 0) {
            let i = year - loanRepaymentSY
            taxBenefit += getTaxBenefit(emi - annualInts[i], taxRate, maxTaxDL)
            ly--
        }
    }
    if (type === APIt.GoalType.B) {
        let remPayment = getRemPrincipal(startYear, loanBorrowAmt, emi, loanInt, loanRepaymentSY, loanYears, duration)
        taxBenefit += getTaxBenefit(remPayment, taxRate, maxTaxDL)
    }
    return taxBenefit
}

export const calculateInterestTaxBenefit = (loanBorrowAmt: number, loanInt: number, loanYears: number,
    loanRepaymentSY: number, startYear: number, endYear: number, sellAfter: number | null | undefined,
    taxRate: number, maxTaxDL: number) => {
    let emi = getEmi(loanBorrowAmt, loanInt as number, loanYears * 12)
    let annualInts = getIntAmtByYear(loanBorrowAmt, emi, loanInt, loanYears * 12)
    let duration = getDuration(sellAfter, startYear, endYear)
    let ey = startYear + duration - 1
    let taxBenefit = 0
    for (let year = startYear, ly = loanYears; year <= ey; year++) {
        if (year >= loanRepaymentSY && ly > 0) {
            let i = year - loanRepaymentSY
            taxBenefit += getTaxBenefit(annualInts[i], taxRate, maxTaxDL)
            ly--
        }
    }
    return taxBenefit
}


const createAutoCFs = (goal: APIt.CreateGoalInput, duration: number) => {
    let p = calculatePrice(goal?.cp as number, goal.chg as number, goal.btr, goal.sy, goal.by)
    let cfs: Array<number> = []
    if (goal.type === APIt.GoalType.B && duration) {
        let netAnnualAmt = calculateBuyAnnualNetCF(goal.sy, goal?.btr as number, goal.amper as number, goal.amsy as number, goal.achg as number, 0, p, goal.aiper as number, goal.aisy as number)
        let v = Math.round(p - netAnnualAmt)
        cfs.push(-v)
        for (let i = 1; i < duration; i++)
            cfs.push(calculateBuyAnnualNetCF(goal.sy, goal?.btr as number, goal.amper as number, goal.amsy as number, goal.achg as number, i, p, goal.aiper as number, goal.aisy as number))
        cfs.push(calculateSellPrice(p, goal?.btr as number, goal?.achg as number, duration))
        cfs[1] += getTaxBenefit(p, goal.tdr, goal.tdl)
    } else {
        let btr = goal?.btr ? goal.btr : 0
        let taxBenefit = 0
        for (let i = 0, v = p; i < duration; i++, v = getCompoundedIncome(goal.chg as number, p / (1 + (btr / 100)), i) * (1 + (btr / 100))) {
            cfs.push(Math.round(-v + taxBenefit))
            taxBenefit = getTaxBenefit(v, goal.tdr, goal.tdl)
        }
        if (taxBenefit > 0) cfs.push(taxBenefit)
    }
    return cfs
}

export const calculateXIRR = (cfs: Array<number>, startYear: number, price: number, sellAfter: number, sellPrice: number) => {
    if (!price || !sellPrice || !cfs) return null
    let xirrCFs: Array<any> = []
    let addSellCF = false
    cfs.forEach((cf, i) => {
        if (i === sellAfter && cf < 0) {
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
    let taxBenefit = 0
    for (let year = goal.sy, ly = goal.emi?.dur as number; year <= ey; year++) {
        let cf = year === goal.sy ? loanDP : 0
        cf -= taxBenefit
        taxBenefit = 0
        if (year >= (goal.emi?.ry as number) && ly > 0) {
            let annualEmiAmt = emi * (ly === 0.5 ? 6 : 12)
            cf += annualEmiAmt
            let i = year - (goal.emi?.ry as number)
            taxBenefit = getTaxBenefit(annualEmiAmt - annualInts[i], goal.tdr, goal.tdl)
            taxBenefit += goal.tbi as number > 0 ? getTaxBenefit(annualInts[i], goal.tdr, goal.tdli as number) : 0
            ly--
        }
        cf -= calculateBuyAnnualNetCF(goal.sy, goal?.btr as number, goal.amper as number, goal.amsy as number, goal.achg as number,
            year - goal.sy, p, goal.aiper as number, goal.aisy as number)
        cfs.push(Math.round(-cf))
    }
    if (goal.type === APIt.GoalType.B) {
        let remPayment = getRemPrincipal(goal.sy, loanBorrowAmt, emi, goal?.emi?.rate as number, goal?.emi?.ry as number, goal?.emi?.dur as number, duration)
        sp = calculateSellPrice(p, goal?.btr as number, goal?.achg as number, duration)
        cfs.push(Math.round(sp + taxBenefit - remPayment))
        taxBenefit = getTaxBenefit(remPayment, goal.tdr, goal.tdl)
    }
    if (taxBenefit > 0) cfs.push(Math.round(taxBenefit))
    return cfs
}

const getRemPrincipal = (startYear: number, loanBorrowAmt: number, emi: number, loanIntRate: number, loanRepaymentSY: number, loanYears: number, duration: number) => {
    let ey = startYear + duration - 1
    if (loanRepaymentSY + loanYears - 1 <= ey) return 0
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
    let taxBenefitPrev = 0
    for (let i = 0; i < duration; i++) {
        let v = 0
        if (i < targets.length) v = targets[i].val
        let taxBenefit = getTaxBenefit(v, goal.tdr, goal.tdl)
        v -= taxBenefitPrev
        taxBenefitPrev = taxBenefit
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
        cfs.push(Math.round(sp + taxBenefitPrev - remPayment))
        taxBenefitPrev = getTaxBenefit(remPayment, goal.tdr, goal.tdl)
    }
    if (taxBenefitPrev > 0) cfs.push(Math.round(taxBenefitPrev))
    return cfs
}

const checkForFF = (savings: number, dr: number, ffGoal: APIt.CreateGoalInput, ffYear: number, mergedCFs: Object,
    annualSavings: number, savingsChgRate: number, expense: number, expenseChgRate: number) => {
    let goal = Object.assign({}, ffGoal)
    let mCFs = Object.assign({}, mergedCFs)
    let cs = savings
    let cfs: Array<number> = calculateFFCFs(goal, annualSavings, savingsChgRate, expense, expenseChgRate, ffYear)
    let nowYear = new Date().getFullYear()
    cfs.forEach((cf, i) => {
        //@ts-ignore
        mCFs[nowYear + 1 + i] += cf
    })
    let ffAmt = 0
    let ffCfs = {}
    for (let [year, value] of Object.entries(mCFs)) {
        let y = parseInt(year)
        let v = parseInt(value)
        if (v < 0) cs += v
        if (y >= ffYear && cs <= 0) break
        if (cs > 0) cs *= (1 + (dr / 100))
        if (v > 0) cs += v
        if (y === ffYear - 1) ffAmt = cs
        //@ts-ignore
        ffCfs[y] = Math.round(cs)
    }
    return { ffYear: ffYear, leftAmt: Math.round(cs), ffAmt: Math.round(ffAmt), ffCfs: ffCfs }
}

export const findEarliestFFYear = (ffGoal: APIt.CreateGoalInput, oppDR: number, savings: number, mergedCFs: Object,
    annualSavings: number, savingsChgRate: number, expense: number, expenseChgRate: number, 
    yearToTry: number | undefined | null) => {
    let nowYear = new Date().getFullYear()
    if(nowYear >= ffGoal.ey ) return { ffYear: -1, leftAmt: -1, ffAmt: -1, ffCfs:[]}
    if(!yearToTry || yearToTry <= nowYear) yearToTry = nowYear + Math.round((ffGoal.ey - nowYear)/2)
    let prevResult = checkForFF(savings, oppDR, ffGoal, yearToTry, mergedCFs, annualSavings, savingsChgRate, expense, expenseChgRate)
    let increment = prevResult.ffAmt > 0 && prevResult.leftAmt > 0 ? -1 : 1
    for (let currYear = yearToTry + increment; currYear <= ffGoal.ey && currYear > nowYear; currYear += increment) {
        console.log("Prev result is ", prevResult)
        console.log("Going to calculate FF for year ", currYear)
        let result = checkForFF(savings, oppDR, ffGoal, currYear, mergedCFs, annualSavings, savingsChgRate, expense, expenseChgRate)
        if ((result.leftAmt < 0 || result.ffAmt < 0) && (prevResult.leftAmt > 0 && prevResult.ffAmt >= 0))
            return prevResult
        else if ((prevResult.leftAmt < 0 || prevResult.ffAmt < 0) && (result.ffAmt > 0 && result.leftAmt > 0))
            return result
        prevResult = result
    }
    return prevResult
}
