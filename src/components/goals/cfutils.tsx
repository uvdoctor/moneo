import * as APIt from '../../api/goals'
import { getIntAmtByYear, getRemainingPrincipal, getCompoundedIncome, getEmi } from '../calc/finance'
import xirr from 'xirr'
import { buildArray } from '../utils'

export const calculatePrice = (startingPrice: number, priceChgRate: number, startYear: number, goalCreatedYear: number) => {
    if (!startingPrice) return 0
    let p = getCompoundedIncome(priceChgRate, startingPrice, startYear - goalCreatedYear)
    return (Math.round(p))
}

export const getTaxBenefit = (val: number, tr: number, maxTaxDL: number) => {
    if (!val || val < 0 || !tr) return 0
    if (maxTaxDL > 0 && val > maxTaxDL) val = maxTaxDL
    return Math.round(val * (tr / 100))
}

const calculateBuyAnnualNetCF = (startYear: number, amCostPer: number, amStartYear: number, chgRate: number, index: number, p: number, aiPer: number, aiSY: number) => {
    let annualNetCF = 0
    let yearlyPrice = index === 0 ? p : getCompoundedIncome(chgRate, p, index)
    if (startYear + index >= amStartYear) annualNetCF -= yearlyPrice * (amCostPer / 100)
    if (startYear + index >= aiSY) annualNetCF += yearlyPrice * (aiPer / 100)
    return Math.round(annualNetCF)
}

export const calculateTotalAmt = (startYear: number, annualPer: number, annualSY: number, price: number, chgRate: number, duration: number) => {
    let ta = 0
    for (let i = 0; i < duration; i++) {
        if (startYear + i < annualSY) continue
        let yearlyPrice = i === 0 ? price : getCompoundedIncome(chgRate, price, i)
        ta += yearlyPrice * (annualPer / 100)
    }
    return Math.round(ta)
}

export const calculateSellPrice = (price: number, chgRate: number, duration: number) => {
    return Math.round(getCompoundedIncome(chgRate, price, duration))
}

export const calculateCFs = (goal: APIt.CreateGoalInput, duration: number) => {
    if (goal?.manual as number > 0) return createManualCFs(goal, duration)
    else if (goal?.emi?.per as number > 0) return createLoanCFs(goal, duration)
    else return createAutoCFs(goal, duration)
}

export const calculateTotalCPTaxBenefit = (taxRate: number, maxTDL: number,
    paymentSY: number, payment: number, paymentChgRate: number, duration: number, premiumBY: number) => {
    if (!taxRate) return 0
    let totalTaxBenefit = 0
    let nowYear = new Date().getFullYear()
    let premiumYear = nowYear > paymentSY ? nowYear + 1 : paymentSY
    for (let year = premiumYear; year < paymentSY + duration; year++) {
        let premium = getCompoundedIncome(paymentChgRate, payment, year - (premiumBY + 1))
        totalTaxBenefit += getTaxBenefit(premium, taxRate, maxTDL)
    }
    return totalTaxBenefit
}

export const calculateTotalCP = (paymentSY: number, payment: number, paymentChgRate: number, duration: number, premiumBY: number) => {
    if (!payment) return 0
    let total = 0
    let nowYear = new Date().getFullYear()
    let premiumYear = nowYear > paymentSY ? nowYear + 1 : paymentSY
    for (let year = premiumYear; year < paymentSY + duration; year++) {
        total += getCompoundedIncome(paymentChgRate, payment, year - (premiumBY + 1))
    }
    return total
}

export const calculateFFCFs = (g: APIt.CreateGoalInput, annualSavings: number, savingsChgRate: number, ffYear: number) => {
    let cfs: Array<number> = []
    let nowYear = new Date().getFullYear()
    let duration = ffYear - (nowYear + 1)
    for (let i = 1; i <= duration; i++) {
        let val = getCompoundedIncome(savingsChgRate * 12, annualSavings, i, 12)
        cfs.push(Math.round(val))
    }
    for (let year = ffYear; year <= g.ey; year++) {
        let cf = getCompoundedIncome(g.btr as number, g.tbr as number, year - (g.sy + 1))
            * (1 + (g.tdr / 100))
        cfs.push(Math.round(-cf))
    }
    //@ts-ignore
    if (g?.cp as number > 0 && nowYear < g.amsy + g.achg) {
        //@ts-ignore
        let premiumYear = nowYear >= g.amsy ? nowYear + 1 : g.amsy
        //@ts-ignore
        for (let year = premiumYear; year < g.amsy + g.achg; year++) {
            //@ts-ignore
            let premium = getCompoundedIncome(g.amper, g.cp, year - (g.chg + 1))
            //@ts-ignore
            let index = cfs.length - 1 - (g.ey - year)
            cfs[index] -= premium
            cfs[index + 1] += getTaxBenefit(premium, g.tdr, g.tdl)
        }
    }
    //@ts-ignore
    if (g?.tbi > 0) {
        //@ts-ignore
        let incomeYear = nowYear >= g.aisy ? nowYear + 1 : g.aisy
        //@ts-ignore
        for (let year = incomeYear; year <= g.ey; year++) {
            //@ts-ignore
            let income = getCompoundedIncome(g.aiper, g.tbi, year - incomeYear)
            //@ts-ignore
            let index = cfs.length - 1 - (g.ey - year)
            cfs[index] += income
        }
    }
    g.pg?.forEach((t) => {
        //@ts-ignore
        let index = cfs.length - 1 - (g.ey - t?.year)
        cfs[index] += t?.val as number
    })
    g.pl?.forEach((t) => {
        //@ts-ignore
        let index = cfs.length - 1 - (g.ey - t?.year)
        cfs[index] -= t?.val as number
    })
    return cfs
}

export const calculateSellCFs = (goal: APIt.CreateGoalInput, duration: number) => {
    let cfs: Array<number> = []
    let p = goal.cp as number
    for (let i = 0; i < duration; i++) {
        let netAnnualAmt = calculateBuyAnnualNetCF(goal.sy, goal.amper as number, goal.amsy as number, goal.achg as number, 0, p, goal.aiper as number, goal.aisy as number)
        cfs.push(Math.round(netAnnualAmt))
    }
    cfs.push(calculateSellPrice(p, goal?.achg as number, duration))
    return cfs
}

export const calculateTotalTaxBenefit = (goalType: APIt.GoalType, price: number, manualMode: number, duration: number,
    taxRate: number, maxTaxDL: number, priceChgRate: number = 0) => {
    if (manualMode > 0) {
        return Math.round(getTaxBenefit(price, taxRate, maxTaxDL))
    }
    if (goalType === APIt.GoalType.B) {
        return Math.round(getTaxBenefit(price, taxRate, maxTaxDL))
    }
    let tb = 0
    for (let i = 0, v = price; i < duration; i++, v = getCompoundedIncome(priceChgRate, price, i)) {
        tb += getTaxBenefit(v, taxRate, maxTaxDL)
    }
    return Math.round(tb)
}

export const calculatePrincipalTaxBenefit = (price: number, loanPer: number, loanInt: number, loanYears: number,
    loanRepaymentSY: number, startYear: number, duration: number, taxRate: number, maxTaxDL: number) => {
    let loanBorrowAmt = getLoanBorrowAmt(price, loanPer)
    let emi = getEmi(loanBorrowAmt, loanInt as number, loanYears * 12)
    let annualInts = getIntAmtByYear(loanBorrowAmt, emi, loanInt, loanYears * 12)
    let taxBenefit = 0
    for (let index = loanRepaymentSY - startYear, ly = loanYears; index < (duration < loanYears ? duration : loanYears); index++, ly--) {
        let annualEmiAmt = emi * (ly === 0.5 ? 6 : 12)
        let i = index - (loanRepaymentSY - startYear)
        taxBenefit += getTaxBenefit(annualEmiAmt - annualInts[i], taxRate, maxTaxDL)
    }
    let remPayment = getRemPrincipal(startYear, loanBorrowAmt, emi, loanInt, loanRepaymentSY, loanYears, duration)
    taxBenefit += getTaxBenefit(remPayment, taxRate, maxTaxDL)
    return taxBenefit
}

export const calculateInterestTaxBenefit = (loanBorrowAmt: number, loanInt: number, loanYears: number,
    loanRepaymentSY: number, startYear: number, duration: number, taxRate: number, maxTaxDL: number) => {
    let emi = getEmi(loanBorrowAmt, loanInt as number, loanYears * 12)
    let annualInts = getIntAmtByYear(loanBorrowAmt, emi, loanInt, loanYears * 12)
    let taxBenefit = 0
    for (let index = loanRepaymentSY - startYear; index < (duration < loanYears ? duration : loanYears); index++) {
        let i = index - (loanRepaymentSY - startYear)
        taxBenefit += getTaxBenefit(annualInts[i], taxRate, maxTaxDL)
    }
    return taxBenefit
}


const createAutoCFs = (goal: APIt.CreateGoalInput, duration: number) => {
    let p = calculatePrice(goal?.cp as number, goal.chg as number, goal.sy, goal.by)
    let cfs: Array<number> = []
    if (goal.type === APIt.GoalType.B && duration) {
        let netAnnualAmt = calculateBuyAnnualNetCF(goal.sy, goal.amper as number, goal.amsy as number, goal.achg as number, 0, p, goal.aiper as number, goal.aisy as number)
        let v = Math.round(p - netAnnualAmt)
        cfs.push(-v)
        for (let i = 1; i < duration; i++)
            cfs.push(calculateBuyAnnualNetCF(goal.sy, goal.amper as number, goal.amsy as number, goal.achg as number, i, p, goal.aiper as number, goal.aisy as number))
        cfs.push(calculateSellPrice(p, goal?.achg as number, duration))
        cfs[1] += getTaxBenefit(p, goal.tdr, goal.tdl)
    } else {
        let taxBenefit = 0
        for (let i = 0, v = p; i < duration; i++, v = getCompoundedIncome(goal.chg as number, p, i)) {
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

export const getLoanBorrowAmt = (price: number, loanPer: number) => {
    return Math.round(price * (loanPer / 100))
}

export const getLoanPaidForMonths = (endYear: number, loanRepaymentYear: number, loanYears: number) => {
    let totalMonths = loanYears * 12
    let loanPaidForMonths = (endYear + 1 - loanRepaymentYear) * 12
    return loanPaidForMonths < totalMonths ? loanPaidForMonths : totalMonths
}

const createLoanCFs = (goal: APIt.CreateGoalInput, duration: number) => {
    let p = calculatePrice(goal?.cp as number, goal?.chg as number, goal.sy, goal.by)
    let cfs: Array<number> = []
    let loanBorrowAmt = getLoanBorrowAmt(p, goal.emi?.per as number)
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
        cf -= calculateBuyAnnualNetCF(goal.sy, goal.amper as number, goal.amsy as number, goal.achg as number,
            year - goal.sy, p, goal.aiper as number, goal.aisy as number)
        cfs.push(Math.round(-cf))
    }
    if (goal.type === APIt.GoalType.B) {
        let remPayment = getRemPrincipal(goal.sy, loanBorrowAmt, emi, goal?.emi?.rate as number, goal?.emi?.ry as number, goal?.emi?.dur as number, duration)
        sp = calculateSellPrice(p, goal?.achg as number, duration)
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
            v -= Math.round(calculateBuyAnnualNetCF(goal.sy, goal?.amper as number, goal?.amsy as number, goal?.achg as number, i, p, goal.aiper as number, goal.aisy as number))
        cfs.push(-v)
    }
    if (goal.type === APIt.GoalType.B) {
        let remPayment = 0
        if (duration <= goal.ey - goal.sy) {
            for (let i = duration; i < goal.ey; i++) {
                if (targets[i]) remPayment += targets[i].val
            }
        }
        let sp = calculateSellPrice(p, goal?.achg as number, duration)
        cfs.push(Math.round(sp + taxBenefitPrev - remPayment))
        taxBenefitPrev = getTaxBenefit(remPayment, goal.tdr, goal.tdl)
    }
    if (taxBenefitPrev > 0) cfs.push(Math.round(taxBenefitPrev))
    return cfs
}


const calculateCashAllocation = (ffGoal: APIt.CreateGoalInput, mustCFs: Array<number>,
    avgAnnualExpense: number, expChgRate: number, ffYear: number | null) => {
    let nowYear = new Date().getFullYear()
    let cashAA: any = {}
    for (let year = nowYear + 1; year <= ffGoal.ey; year++) {
        let livingExp: number = !ffYear || year < ffYear ?
            Math.round(getCompoundedIncome(expChgRate, avgAnnualExpense, year - nowYear) / 2)
            : getCompoundedIncome(ffGoal.btr as number, ffGoal.tbr as number, year - ffYear)
        let mustCF = mustCFs[year - (nowYear + 1)]
        livingExp -= mustCF < 0 ? mustCF : 0
        cashAA[year] = livingExp
    }
    return cashAA
}

const calculateBondAllocation = (ffGoal: APIt.CreateGoalInput, mustCFs: Array<number>, tryCFs: Array<number>,
    ffYear: number | null) => {
    let nowYear = new Date().getFullYear()
    let bondAA: any = {}
    for (let year = nowYear + 1; year <= ffGoal.ey; year++) {
        let bondCF = 0
        for (let bondYear = year + 1; bondYear < year + 5; bondYear++) {
            let mustCF = mustCFs[bondYear - (nowYear + 1)]
            if (mustCF && mustCF < 0) bondCF -= mustCF
            if (ffYear && bondYear >= ffYear) {
                bondCF += getCompoundedIncome(ffGoal.btr as number, ffGoal.tbr as number, bondYear - ffYear)
            }
        }
        for (let bondYear = year; bondYear < year + 3; bondYear++) {
            let tryCF = tryCFs[bondYear - (nowYear + 1)]
            if (tryCF && tryCF < 0) bondCF -= tryCF
        }
        bondAA[year] = bondCF
    }
    return bondAA
}

const buildEmptyAA = (fromYear: number, toYear: number) => {
    return {
        cash: buildArray(fromYear, toYear),
        bonds: buildArray(fromYear, toYear),
        reit: buildArray(fromYear, toYear),
        gold: buildArray(fromYear, toYear),
        stocks: buildArray(fromYear, toYear)
    }
}

const getRR = (aa: any, index: number, pp: any) => {
    let perf = 0
    for (const prop in aa) {
        //@ts-ignore
        perf += (pp[prop] * aa[prop][index]) / 100
    }
    return perf
}

const checkForFF = (savings: number, ffGoal: APIt.CreateGoalInput, ffYear: number, mergedCFs: Object,
    annualSavings: number, savingsChgRate: number, mustCFs: Array<number>, tryCFs: Array<number>,
    avgAnnualExpense: number, expChgRate: number, pp: any) => {
    let goal = Object.assign({}, ffGoal)
    let mCFs = Object.assign({}, mergedCFs)
    let cs = savings
    let cfs: Array<number> = calculateFFCFs(goal, annualSavings, savingsChgRate, ffYear)
    let nowYear = new Date().getFullYear()
    cfs.forEach((cf, i) => {
        //@ts-ignore
        mCFs[nowYear + 1 + i] += cf
    })
    let ffAmt = 0
    let ffCfs = {}
    let cash = calculateCashAllocation(ffGoal, mustCFs, avgAnnualExpense, expChgRate, ffYear)
    let bonds = calculateBondAllocation(ffGoal, mustCFs, tryCFs, ffYear)
    let aa: any = buildEmptyAA(nowYear + 1, ffGoal.ey)
    let rr: Array<number> = []
    let minReq = 0
    for (let [year, value] of Object.entries(mCFs)) {
        let y = parseInt(year)
        let v = parseInt(value)
        console.log("Year is ", y)
        let ca = cash[y] ? parseInt(cash[y]) : 0
        let ba = bonds[y] ? parseInt(bonds[y]) : 0
        minReq = y < ffYear ? ca : ca + ba
        if (cs < minReq) {
            //@ts-ignore
            ffCfs[y] = Math.round(cs)
            ffAmt = cs
            break
        }
        let i = y - (nowYear + 1)
        let cashPer = Math.round((ca / cs) * 100)
        if (y > ffGoal.ey - 5 && cashPer < 20) cashPer = 20
        aa.cash[i] = cashPer
        let bondsPer = cs > ca ? Math.round((ba / cs) * 100) : 0
        if (bondsPer + cashPer > 100) bondsPer = 100 - cashPer
        aa.bonds[i] = bondsPer
        let remPer = 100 - (cashPer + bondsPer)
        console.log("Rem per before reit allocation is ", remPer)
        if (remPer > 0) {
            let reitPer = remPer > 10 ? 10 : remPer
            aa.reit[i] = reitPer
            remPer -= reitPer
            if (remPer > 0) {
                if (y <= ffGoal.ey - 5) {
                    let stocksPer = Math.round(remPer * 0.9)
                    if (y >= ffYear && stocksPer > 50) stocksPer = 50
                    if (y >= ffGoal.ey - 20) {
                        let maxPer = 2 * (ffGoal.ey - y)
                        if (stocksPer > maxPer) stocksPer = maxPer
                    }
                    if (stocksPer > remPer) stocksPer = remPer
                    aa.stocks[i] = stocksPer
                    remPer -= stocksPer
                    if (remPer > 0) {
                        let goldPer = Math.round(stocksPer * 0.1)
                        if (goldPer > remPer) goldPer = remPer
                        aa.gold[i] = goldPer
                        remPer -= goldPer
                    }
                    if(remPer > 0) aa.bonds[i] += remPer
                } else {
                    aa.bonds[i] += remPer
                }
            }
        }
        let rate = getRR(aa, i, pp)
        rr.push(rate)
        if (v < 0) cs += v
        if (cs > 0) cs *= (1 + (rate / 100))
        if (v > 0) cs += v
        if (ffYear === y && i === 0) ffAmt = savings
        else if (y === ffYear - 1) ffAmt = cs
        //@ts-ignore
        ffCfs[y] = Math.round(cs)
    }
    return {
        ffYear: ffYear, leftAmt: Math.round(cs), ffAmt: Math.round(ffAmt), ffCfs: ffCfs,
        minReq: minReq, aa: aa, rr: rr
    }
}

export const findEarliestFFYear = (ffGoal: APIt.CreateGoalInput, savings: number, mergedCFs: Object,
    annualSavings: number, savingsChgRate: number, yearToTry: number | undefined | null,
    mustCFs: Array<number>, tryCFs: Array<number>, avgAnnualExpense: number, expChgRate: number, pp: any) => {
    let nowYear = new Date().getFullYear()
    if (nowYear >= ffGoal.ey) return { ffYear: -1, leftAmt: -1, ffAmt: -1, ffCfs: {}, minReq: -1, aa: {}, rr: [] }
    if (!yearToTry || yearToTry <= nowYear) yearToTry = nowYear + Math.round((ffGoal.ey - nowYear) / 2)
    //@ts-ignore
    let nomineeAmt = ffGoal?.sa as number
    let prevResult = checkForFF(savings, ffGoal, yearToTry, mergedCFs, annualSavings, savingsChgRate,
        mustCFs, tryCFs, avgAnnualExpense, expChgRate, pp)
    let increment = prevResult.ffAmt >= prevResult.minReq && prevResult.leftAmt >= nomineeAmt ? -1 : 1
    for (let currYear = yearToTry + increment; currYear <= ffGoal.ey - 20 && currYear > nowYear; currYear += increment) {
        let result = checkForFF(savings, ffGoal, currYear, mergedCFs, annualSavings, savingsChgRate,
            mustCFs, tryCFs, avgAnnualExpense, expChgRate, pp)
        if ((result.leftAmt < nomineeAmt || result.ffAmt < result.minReq) && (prevResult.leftAmt >= nomineeAmt && prevResult.ffAmt >= prevResult.minReq))
            return prevResult
        else if ((prevResult.leftAmt < nomineeAmt || prevResult.ffAmt < prevResult.minReq) && (result.ffAmt >= result.minReq && result.leftAmt >= nomineeAmt))
            return result
        prevResult = result
    }
    return prevResult
}
