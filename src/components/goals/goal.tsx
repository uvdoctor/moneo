import React, { useState, useEffect, Fragment } from 'react'
import TextInput from '../form/textinput'
import SelectInput from '../form/selectinput'
import NumberInput from '../form/numberinput'
import { API, graphqlOperation } from 'aws-amplify'
import * as mutations from '../../graphql/mutations'
import * as APIt from '../../api/goals'
import { getCriticalityOptions, getRAOptions, initYearOptions, toCurrency, toStringArr } from '../utils'
import TimeCost from '../calc/timecost'
import EmiCost from '../calc/emicost'
import OppCost from '../calc/oppcost'
import Toggle from '../toggle'
import TaxBenefit from '../calc/taxbenefit'
import CurrencyInput from '../form/currencyinput'
import { createNewTarget, getGoalTypes } from '../utils'
import xirr from 'xirr'
import { getIntAmtByYear, getRemainingPrincipal, getCompoundedIncome, getEmi } from '../calc/finance'
import BRComparison from '../calc/brcomparison'
import RadialInput from '../form/radialinput'
import LineChart from './linechart'
import ResultItem from '../calc/resultitem'
import SVGMoneyBag from '../calc/svgmoneybag'
import Section from '../form/section'
import Summary from './summary'

interface GoalProps {
    goal?: APIt.CreateGoalInput | null
    summary: boolean
    deleteCallback: Function
    cancelCallback: Function
    addCallback: Function
    editCallback: Function
    updateCallback: Function
}
export default function Goal({ goal, summary, deleteCallback, cancelCallback, addCallback, editCallback, updateCallback }: GoalProps) {
    //@ts-ignore
    const [id, setId] = useState<string | null>(goal ? goal.id : null)
    const goalCreatedYear = new Date().getFullYear()
    const [startYear, setStartYear] = useState<number>(id && goal?.sy ? goal.sy : goalCreatedYear + 1)
    const [endYear, setEndYear] = useState<number>(id && goal?.ey ? goal.ey : startYear)
    const [syOptions] = useState(initYearOptions(startYear, 50))
    const [eyOptions, setEYOptions] = useState(initYearOptions(startYear, 80))
    const [loanRepaymentSY, setLoanRepaymentSY] = useState<number>(id && goal?.emi?.ry ? goal.emi.ry : startYear)
    const [amSYOptions, setAMSYOptions] = useState(initYearOptions(startYear, 10))
    const [price, setPrice] = useState<number>(0)
    const [totalCost, setTotalCost] = useState<number>(0)
    const [taxRate, setTaxRate] = useState<number>(id && goal?.tdr ? goal.tdr : 0)
    const [maxTaxDeduction, setMaxTaxDeduction] = useState<number>(id && goal?.tdl ? goal.tdl : 0)
    const [taxBenefitIntOnly, setTaxBenefitIntOnly] = useState<number>(0)
    const [sellAfter, setSellAfter] = useState<number>(id && goal?.sa ? goal.sa : 5)
    const [sellPrice, setSellPrice] = useState<number>(0)
    const [buyTaxRate, setBuyTaxRate] = useState<number>(id && goal?.btr ? goal.btr : 10)
    const [annualReturnPer, setAnnualReturnPer] = useState<number | null>(0)
    const [loanPer, setLoanPer] = useState<number>(id && goal?.emi?.per ? goal.emi.per : 0)
    const [startingPrice, setStartingPrice] = useState<number>(id && goal?.cp ? goal.cp : 0)
    const [currency, setCurrency] = useState<string>(id && goal?.ccy ? goal.ccy : "USD")
    const fxRate = 1.0
    const [criticality, setCriticality] = useState<APIt.LMH>(id && goal?.imp ? goal.imp : APIt.LMH.M)
    const [ra, setRA] = useState<APIt.LMH>(APIt.LMH.L)
    const [manualMode, setManualMode] = useState<number>(0)
    const [name, setName] = useState<string>(id && goal?.name ? goal.name : "")
    const [loanYears, setLoanYears] = useState<number>(id && goal?.emi?.dur ? goal.emi.dur : 10)
    const [loanIntRate, setLoanIntRate] = useState<number>(id && goal?.emi?.rate ? goal.emi.rate : 4)
    const [priceChgRate, setPriceChgRate] = useState<number>(id && goal?.chg ? goal.chg : 3)
    const [assetChgRate, setAssetChgRate] = useState<number>(id && goal?.achg ? goal.achg : 3)
    const [amCostPer, setAMCostPer] = useState<number>(id && goal?.amper ? goal.amper : 2)
    const [amStartYear, setAMStartYear] = useState<number>(id && goal?.amsy ? goal.amsy : startYear)
    const [totalMaintCost, setTotalMaintCost] = useState<number>(0)
    const [oppDR, setOppDR] = useState<number>(id && goal?.dr ? goal.dr : 6)
    const [rentAmt, setRentAmt] = useState(0)
    const [rentChgPer, setRentChgPer] = useState(5)
    const [rentTaxBenefit, setRentTaxBenefit] = useState(0)
    const detailsLabel = "Details"
    const chartLabel = "Cash Flows"
    const taxLabel = "Tax"
    const rentLabel = "Rent?"
    const [viewItems, setViewItems] = useState([detailsLabel, taxLabel, chartLabel, rentLabel])
    const [viewMode, setViewMode] = useState(detailsLabel)
    const [goalType, setGoalType] = useState<APIt.GoalType>(APIt.GoalType.B)
    const analyzeFor = 20
    const [cfs, setCFs] = useState<Array<number>>([])

    useEffect(() => {
        if (goalType === APIt.GoalType.B) setViewItems([detailsLabel, taxLabel, chartLabel, rentLabel])
        else setViewItems([detailsLabel, taxLabel, chartLabel])
    }, [goalType])

    const changeViewMode = (e: any) => {
        setViewMode(e.target.innerText)
    }

    const getTaxBenefit = (val: number, tr: number, maxTaxDL: number) => {
        if (val <= 0 || tr <= 0) return 0
        if (maxTaxDL > 0 && val > maxTaxDL) val = maxTaxDL
        return Math.round(val * (tr / 100))
    }

    const calculatePrice = () => {
        if(!startingPrice) return 0
        let p = getCompoundedIncome(priceChgRate, startingPrice * (1-(buyTaxRate/100)), startYear - goalCreatedYear)
        return (Math.round(p * (1+(buyTaxRate/100))))
    }

    const initManualTargets = () => {
        let targets: Array<APIt.TargetInput> = []
        for (let year = startYear; year <= endYear; year++) {
            let existingT = null
            if (wipTargets.length > 0) {
                existingT = (wipTargets.filter((target) => target.year === year))[0] as APIt.TargetInput
            }
            let t = createNewTarget(year, existingT ? existingT.val : 0, currency, fxRate)
            targets.push(t)
        }
        console.log("Manual targets are ", targets)
        return targets
    }

    const updateManualCFs = (duration: number, changeState: boolean) => {
        if(!isManualMode() || wipTargets.length === 0) return []
        let p = 0
        wipTargets.forEach(t => p += t.val * t.fx)
        p = Math.round(p)
        if (changeState) setPrice(p)
        let totalCost = p
        let totalMaintCost = 0
        let targets = wipTargets
        let cfs: Array<number> = []
        let sp = 0
        if (duration) {
            for (let i = 0; i < duration; i++) {
                let v = 0
                if (i < targets.length) v = targets[i].val * targets[i].fx
                if (v > 0) v -= getTaxBenefit(v, taxRate, maxTaxDeduction)
                if (goalType === APIt.GoalType.B && duration) {
                    let amCost = Math.round(getAnnualMaintCost(i, p))
                    totalMaintCost += amCost
                    v += amCost
                    totalCost += amCost
                }
                cfs.push(-v)
            }
            if (goalType === APIt.GoalType.B) {
                let remPayment = 0
                if (duration <= endYear - startYear) {
                    for (let i = duration; i < endYear; i++) {
                        if (targets[i]) remPayment += targets[i].val * targets[i].fx
                    }
                }
                sp = getCompoundedIncome(assetChgRate, p * (1 - (buyTaxRate / 100)), duration)
                if (changeState) setSellPrice(Math.round(sp))
                cfs.push(Math.round(sp - remPayment))
            }
        }
        if (changeState) {
            setTotalCost(totalCost)
            setCFs([...cfs])
            if (goalType === APIt.GoalType.B) {
                setTotalMaintCost(totalMaintCost)
                calculateAnnualPerformance(cfs, p, sellAfter, sp)
            }
        }
        return cfs
    }

    const initAutoTargets = (duration: number, changeState: boolean = true) => {
        let p = calculatePrice()
        if (changeState) setPrice(p)
        let cfs: Array<number> = []
        let totalCost = 0
        let totalMaintCost = 0
        let sp = 0
        if (goalType === APIt.GoalType.B && duration) {
            let amCost = getAnnualMaintCost(0, p)
            let v = Math.round(p - getTaxBenefit(p, taxRate, maxTaxDeduction) + amCost)
            cfs.push(-v)
            totalMaintCost += amCost
            totalCost = v
            for (let i = 1; i < duration; i++) {
                amCost = Math.round(getAnnualMaintCost(i, p))
                totalCost += amCost
                totalMaintCost += amCost
                cfs.push(-amCost)
            }
            sp = getCompoundedIncome(assetChgRate, p, duration)
            if (changeState) setSellPrice(Math.round(sp))
            cfs.push(Math.round(sp))
        } else {
            for (let i = 0, v = p * (1 - (buyTaxRate / 100)); i < duration; i++, v = getCompoundedIncome(priceChgRate, v, i)) {
                let value = i === 0 ? p : v * (1 + (buyTaxRate / 100))
                if (value > 0) value -= getTaxBenefit(value, taxRate, maxTaxDeduction)
                cfs.push(Math.round(-value))
                totalCost += value
            }
        }
        if (changeState) {
            setTotalCost(totalCost)
            setWIPTargets([...[]])
            setCFs([...cfs])
            if (goalType === APIt.GoalType.B) {
                setTotalMaintCost(totalMaintCost)
                calculateAnnualPerformance(cfs, p, sellAfter, sp)
            }
        }
        console.log("New auto cfs created: ", cfs)
        return cfs
    }

    const getLoanBorrowAmt = (p: number) => {
        return Math.round((p * (1 - (buyTaxRate / 100))) * (loanPer / 100))
    }

    const getRemPrincipal = (loanBorrowAmt: number, emi: number, duration: number) => {
        let ey = startYear + duration - 1
        let remPrincipal = loanBorrowAmt
        if (ey >= loanRepaymentSY) {
            let loanPaidForMonths = (ey + 1 - loanRepaymentSY) * 12
            console.log("Loan paid for months ", loanPaidForMonths)
            remPrincipal = getRemainingPrincipal(loanBorrowAmt, emi, loanIntRate, loanPaidForMonths)
        }
        return remPrincipal
    }

    const initLoanTargets = (duration: number, changeState: boolean = true) => {
        let p = calculatePrice()
        if (changeState) setPrice(p)
        let cfs: Array<number> = []
        let totalMaintCost = 0
        let totalCost = 0
        let loanBorrowAmt = getLoanBorrowAmt(p)
        let loanDP = p - loanBorrowAmt
        let emi = Math.round(getEmi(loanBorrowAmt, loanIntRate, loanYears * 12))
        let annualInts = taxBenefitIntOnly ? getIntAmtByYear(loanBorrowAmt, emi, loanIntRate, loanYears * 12) : []
        let ey = startYear + duration - 1
        if (changeState) setEndYear(ey)
        let ly = loanYears
        let sp = 0
        for (let year = startYear; year <= ey; year++) {
            let cf = 0
            if (year === startYear) cf += taxBenefitIntOnly > 0 ? loanDP : loanDP - getTaxBenefit(loanDP, taxRate, maxTaxDeduction)
            if (year >= loanRepaymentSY && ly > 0) {
                let annualEmiAmt = emi * (ly === 0.5 ? 6 : 12)
                let i = year - loanRepaymentSY
                let taxBenefitEligibleAmt = taxBenefitIntOnly > 0 ? annualInts[i] : annualEmiAmt
                let amCost = getAnnualMaintCost(year - startYear, p)
                totalMaintCost += amCost
                cf += annualEmiAmt + amCost - getTaxBenefit(taxBenefitEligibleAmt, taxRate, maxTaxDeduction)
                ly--
            }
            totalCost += cf
            cfs.push(Math.round(-cf))
        }
        if (goalType === APIt.GoalType.B) {
            let remPayment = getRemPrincipal(loanBorrowAmt, emi, duration)
            totalCost += remPayment
            sp = getCompoundedIncome(assetChgRate, p * (1 - (buyTaxRate / 100)), duration)
            if (changeState) setSellPrice(Math.round(sp))
            cfs.push(Math.round(sp - remPayment))
        }
        if (changeState) {
            setTotalCost(totalCost)
            setWIPTargets([])
            setCFs([...cfs])
            if (goalType === APIt.GoalType.B) {
                setTotalMaintCost(totalMaintCost)
                calculateAnnualPerformance(cfs, p, sellAfter, sp)
            }
        }
        console.log("Loan cfs are...", cfs)
        return cfs
    }

    const [wipTargets, setWIPTargets] = useState<Array<APIt.TargetInput>>(id && goal?.tgts ? goal.tgts : [])

    useEffect(() => {
        if (isManualMode() && wipTargets.length > 0) {
            console.log("Going to update manual cfs...")
            updateManualCFs(goalType === APIt.GoalType.B ? sellAfter : endYear - startYear, true)
        }
    }, [wipTargets, goalType, sellAfter, priceChgRate, assetChgRate, amCostPer, amStartYear, buyTaxRate, taxRate, maxTaxDeduction, currency, fxRate])

    const createNewGoalInput = () => {
        return {
            name: name,
            sy: startYear,
            ey: endYear,
            sa: sellAfter,
            btr: buyTaxRate,
            tdr: taxRate,
            tdl: maxTaxDeduction,
            ccy: currency,
            cp: startingPrice,
            chg: priceChgRate,
            achg: assetChgRate,
            type: goalType as APIt.GoalType,
            tgts: wipTargets,
            amper: amCostPer,
            amsy: amStartYear,
            dr: oppDR,
            imp: criticality,
            ra: ra,
            emi: loanPer > 0 ? { rate: loanIntRate, dur: loanYears, per: loanPer, ry: loanRepaymentSY } as APIt.EmiInput : null,
        }
    }

    const createNewGoal = async () => {
        let goal: APIt.CreateGoalInput = createNewGoalInput()
        try {
            const { data } = (await API.graphql(graphqlOperation(mutations.createGoal, { input: goal }))) as {
                data: APIt.CreateGoalMutation
            }
            console.log("New goal created in db: ", data ? data.createGoal : "")
            if (addCallback) addCallback(data.createGoal)
        } catch (e) {
            console.log("Error while creating goal: ", e)
        }
    }

    const updateGoal = async() => {
        let goal: APIt.CreateGoalInput = createNewGoalInput()
        goal.id = id
        try {
            const { data } = (await API.graphql(graphqlOperation(mutations.updateGoal, { input: goal }))) as {
                data: APIt.UpdateGoalMutation
            }
            console.log("Goal updated in db: ", data ? data.updateGoal : "")
            updateCallback(id, data.updateGoal)
        } catch (e) {
            console.log("Error while creating goal: ", e)
        }
    }

    const changeTargetVal = (val: number, i: number) => {
        wipTargets[i].val = val
        setWIPTargets([...wipTargets])
    }

    const changeStartYear = (str: string) => {
        setStartYear(parseInt(str))
    }

    useEffect(() => {
        if (loanPer === 0) setEYOptions(initYearOptions(startYear, 100))
        setAMSYOptions(initYearOptions(startYear, 10))
        if (loanPer === 0 && (startYear > endYear || endYear - startYear > 100)) setEndYear(startYear)
        if (loanPer > 0 && (startYear > loanRepaymentSY || loanRepaymentSY - startYear > 10)) setLoanRepaymentSY(startYear)
    }, [startYear, endYear, loanPer, loanRepaymentSY])

    const changeEndYear = (str: string) => {
        let ey = parseInt(str)
        setEndYear(ey)
    }

    const isManualMode = () => (endYear > startYear && ((goalType === APIt.GoalType.B && loanPer === 0) 
                                || (goalType !== APIt.GoalType.B && manualMode > 0)))
                                
    useEffect(() => {
        if (!isManualMode() && loanPer > 0) initLoanTargets(sellAfter)
    }, [goalType, startingPrice, priceChgRate, assetChgRate, loanPer, loanRepaymentSY, loanYears, currency, startYear, endYear, sellAfter, buyTaxRate, taxRate, maxTaxDeduction, taxBenefitIntOnly, amCostPer, amStartYear])
    
    useEffect(() => {
        if (!isManualMode() && loanPer === 0) initAutoTargets(goalType === APIt.GoalType.B ? sellAfter : endYear - startYear)
    }, [goalType, startYear, endYear, startingPrice, priceChgRate, assetChgRate, currency, sellAfter, taxRate, maxTaxDeduction, manualMode, buyTaxRate, amCostPer, amStartYear])
    
    useEffect(() => {
        if (isManualMode()) setWIPTargets([...id ? wipTargets : initManualTargets()])
    }, [goalType, loanPer, startYear, endYear, currency, fxRate, manualMode])

    useEffect(() => {
        setRentAmt(Math.round(price * 0.04))
    }, [price])

    const getAnnualMaintCost = (index: number, p: number) => {
        if (startYear + index < amStartYear) return 0
        let priceAfterTax = p * (1 - (buyTaxRate / 100))
        let yearlyPrice = index === 0 ? priceAfterTax : getCompoundedIncome(priceChgRate, priceAfterTax, index)
        return Math.round(yearlyPrice * (amCostPer / 100))
    }

    const initBuyCFsForComparison = () => {
        console.log("Going to initiate comparison CFs...")
        let allCFs: Array<Array<number>> = []
        for (let i = 1; i <= analyzeFor; i++) {
            let cashFlows = analyzeFor === sellAfter ? cfs : []
            if (analyzeFor !== sellAfter) {
                if (isManualMode()) cashFlows = updateManualCFs(analyzeFor, false)
                else if (loanPer > 0) cashFlows = initLoanTargets(analyzeFor, false)
                else cashFlows = initAutoTargets(analyzeFor, false)
            }
            allCFs.push(cashFlows)
        }
        return allCFs
    }

    const createChartCFs = () => {
        let x = [], y = []
        for (let i = 0; i < cfs.length; i++) {
            x.push(startYear + i)
            y.push(cfs[i])
        }
        console.log("Chart cfs for y are: ", y)
        return [x, y]
    }

    const calculateAnnualPerformance = (cfs: Array<number>, price: number, sellAfter: number, sellPrice: number) => {
        console.log("Going to calculate annual performance...")
        if (goalType === APIt.GoalType.B && price > 0 && sellPrice > 0) {
            let xirrCFs: Array<any> = []
            console.log("Going to calculate xirr from cfs...")
            cfs.forEach((cf, i) => {
                if (i === sellAfter) cf -= sellPrice
                xirrCFs.push({
                    amount: cf,
                    when: new Date(startYear + i, 0, 1)
                })
            })
            xirrCFs.push({
                amount: Math.round(sellPrice),
                when: new Date(startYear + sellAfter, 1, 1)
            })
            console.log("XIRR cfs are ", xirrCFs)
            try {
                setAnnualReturnPer(xirr(xirrCFs) * 100)
            } catch (e) {
                console.log("Error while calculating xirr: ", e)
                setAnnualReturnPer(null)
            }
        } else {
            setSellPrice(0)
            setAnnualReturnPer(null)
        }
    }

    const changeTargetCurrency = (val: string, index: number) => {
        wipTargets[index].curr = val
        setWIPTargets([...wipTargets])
    }

    const createOppCostCFs = () => {
        if (goalType !== APIt.GoalType.B || sellPrice === 0) return cfs
        let oppCostCFs: Array<number> = Object.assign([], cfs)
        if (oppCostCFs[sellAfter]) oppCostCFs[sellAfter] -= sellPrice
        return oppCostCFs
    }

    return (
        summary && id ? <Summary goal={goal as APIt.CreateGoalInput} chartData={createChartCFs()} deleteCallback={deleteCallback} editCallback={editCallback} />
            :
            <div className="flex flex-col text-lg md:text-xl w-screen">
                <div className="flex flex-wrap justify-around items-center w-full bg-black text-white">
                    <div className="flex flex-wrap justify-around items-center">
                        <SelectInput name="goalType" pre="I want to" value={goalType} options={getGoalTypes()} changeHandler={setGoalType} />
                        <TextInput
                            name="name"
                            pre="Goal Name"
                            placeholder="My Goal"
                            value={name}
                            changeHandler={setName}
                            width="150px"
                        />
                        <SelectInput name="criticality"
                            pre="Criticality"
                            value={criticality}
                            changeHandler={setCriticality}
                            options={getCriticalityOptions()}
                        />
                        <SelectInput name="ra"
                            pre="OK with loss"
                            post="Of Investment"
                            value={ra}
                            changeHandler={setRA}
                            options={getRAOptions()}
                        />
                    </div>
                    <label className="1/12 cursor-pointer border-0 outline-none focus:outline-none"
                        onClick={() => cancelCallback()}>
                        X
                    </label>
                </div>
                <ul className="flex w-full">
                    {viewItems.map((item, i) => (
                        <li key={"viewItem" + i}>
                            <button onClick={changeViewMode} style={{ color: viewMode === item ? "green" : "#4a5568", backgroundColor: viewMode === item ? "#edf2f7" : "#f7fafc" }} className="dashmi md:mt-4 md:px-4 hover:bg-white hover:border-t hover:text-green-600 focus:outline-none">{item}</button>
                        </li>))}
                </ul>
                {viewMode === detailsLabel &&
                    <Fragment>
                        <div className="mt-4 flex justify-around items-center w-full">
                            <div className="flex flex-col items-center justify-center w-full">
                                <label className="text-xl md:text-2xl font-semibold">Payment</label>
                                <div className="mt-1 w-full flex items-center justify-around w-full">
                                    <RadialInput data={toStringArr(0, 20, 0.5)} step={0.5} value={buyTaxRate} width={120} unit="%" label="of Price" pre="Taxes & Fees" labelBottom={true} changeHandler={setBuyTaxRate} />
                                    <SelectInput name="sy"
                                        pre="Starts"
                                        value={startYear}
                                        changeHandler={changeStartYear}
                                        options={syOptions}
                                    />
                                    {(loanPer === 0 || (goalType !== APIt.GoalType.B && manualMode > 0)) ? <SelectInput name="ey" pre="Ends" value={endYear}
                                        changeHandler={changeEndYear} options={eyOptions} />
                                        : <div className="flex flex-col">
                                            <label>Ends</label>
                                            <label className="font-semibold">{endYear}</label>
                                        </div>}
                                    <div className="flex flex-col">
                                        <label>In</label>
                                        <CurrencyInput name="mainCurr" value={currency} changeHandler={setCurrency} />
                                    </div>
                                    {loanPer === 0 && goalType !== APIt.GoalType.B && endYear > startYear && <Toggle topText="Manual Entry" bottomText="Auto Change" value={manualMode} setter={setManualMode} />}
                                </div>
                            </div>
                        </div>

                        {!isManualMode() ?
                            <div className="flex flex-wrap justify-around items-center">
                                <Section title={`Price in ${startYear} ~ ${price}`} left={
                                    <NumberInput name="startingPrice" pre="Price" post={`in ${startYear}`} width="110px"
                                        currency={currency} value={startingPrice} changeHandler={setStartingPrice} min={500} max={2000000} />
                                } right={
                                    <NumberInput name="priceChgRate" pre="Price" post="Changes" unit="%"
                                        width="30px" min={-20} max={20} step={0.5} value={priceChgRate} changeHandler={setPriceChgRate} />
                                } />
                                {goalType !== APIt.GoalType.R && goalType !== APIt.GoalType.D && <EmiCost price={price} currency={currency} startYear={startYear} repaymentSY={loanRepaymentSY}
                                    loanYears={loanYears} loanAnnualInt={loanIntRate} loanPer={loanPer} loanBorrowAmt={getLoanBorrowAmt(price)}
                                    loanAnnualIntHandler={setLoanIntRate} loanPerHandler={setLoanPer}
                                    loanMonthsHandler={setLoanYears} repaymentSYHandler={setLoanRepaymentSY} />}
                            </div> :
                            <div className="mt-4 md:mt-8 flex flex-wrap items-center justify-center w-full">
                                {wipTargets && wipTargets.map((t, i) =>
                                    <div key={"t" + i} className="mr-4 md:mr-8 mt-4 flex flex-col justify-end items-end">
                                        <label>{t.year}</label>
                                        <NumberInput name="year" pre="" currency={t.curr}
                                            value={t.val} changeHandler={(val: number) => changeTargetVal(val, i)}
                                            width="120px" min={0} max={999999} step={100} />
                                        <CurrencyInput name={"curr" + i} value={t.curr} changeHandler={(val: string) => changeTargetCurrency(val, i)} />
                                    </div>)}
                            </div>}

                        {goalType === APIt.GoalType.B && <div className="flex flex-wrap justify-around items-center">
                            <Section title="Yearly Fixes, Taxes, Fees, Insurance, etc costs"
                                left={
                                    <RadialInput data={toStringArr(0, 10, 0.1)} float={true} changeHandler={setAMCostPer} width={120}
                                        unit="%" labelBottom={true} label="of Price" post={`Total ${toCurrency(totalMaintCost, currency)}`} value={amCostPer} step={0.1} />
                                } right={
                                    <SelectInput name="maintainFrom" pre="Starting" options={amSYOptions} value={amStartYear}
                                        changeHandler={setAMStartYear} />
                                } />
                            <Section title="Sell After" left={
                                <RadialInput width={120} label="Years" labelBottom={true} data={toStringArr(1, analyzeFor)}
                                    value={sellAfter} step={1} changeHandler={setSellAfter} />
                            } right={
                                <ResultItem svg={<SVGMoneyBag />} label={`In ${startYear + sellAfter} for`}
                                    result={Math.round(sellPrice)} currency={currency}
                                    footer={annualReturnPer ? `${annualReturnPer.toFixed(2)}% Yearly ${annualReturnPer > 0 ? 'Gain' : 'Loss'}` : ''} />
                            } bottomLeft="Assume" bottomRight="Yearly"
                                bottom={
                                    <NumberInput name="assetChgRate" pre="Sell Price" post="Changes" unit="%"
                                        width="30px" min={-20} max={20} step={0.5} value={assetChgRate} changeHandler={setAssetChgRate} />
                                } footer='Amount after paying taxes & fees.' />
                        </div>}

                        <div className="flex flex-wrap justify-around items-center w-full">
                            <TimeCost amount={totalCost} currency={currency} workHoursPerWeek={60} annualWorkWeeks={47} />

                            <OppCost cfs={createOppCostCFs()} currency={currency} startYear={startYear}
                                duration={goalType === APIt.GoalType.B ? sellAfter : endYear - startYear} discountRate={oppDR} discountRateHandler={setOppDR} />
                        </div>
                        <div className="flex justify-center mt-8 mb-4">
                            <button className="cancel" onClick={() => cancelCallback()}>
                                Cancel
			                    </button>
                            <button className="ml-8 button" onClick={() => id ? updateGoal() : createNewGoal()}>
                                {`${id ? 'Update' : 'Create'} Goal`}
			                    </button>
                        </div>
                    </Fragment>}
                {viewMode === rentLabel &&
                    <BRComparison currency={currency} taxRate={taxRate} sellAfter={sellAfter}
                        discountRate={oppDR} initAllBuyCFsForComparison={initBuyCFsForComparison}
                        rentAmt={rentAmt} rentAmtHandler={setRentAmt} rentChgPer={rentChgPer}
                        rentChgPerHandler={setRentChgPer} rentTaxBenefit={rentTaxBenefit}
                        rentTaxBenefitHandler={setRentTaxBenefit} price={price} />
                }

                {viewMode === taxLabel && (loanPer > 0 || manualMode < 1) &&
                    <TaxBenefit loan={loanPer > 0 ? true : false} taxRate={taxRate} taxRateHandler={setTaxRate} currency={currency}
                        maxTaxDeduction={maxTaxDeduction} maxTaxDeductionHandler={setMaxTaxDeduction} taxBenefitIntOnly={taxBenefitIntOnly}
                        taxBenefitIntOnlyHandler={setTaxBenefitIntOnly} buyTaxRate={buyTaxRate} buyTaxRateHandler={setBuyTaxRate}
                        rentTaxBenefit={rentTaxBenefit} rentTaxBenefitHandler={setRentTaxBenefit} />
                }
                {
                    viewMode === chartLabel &&
                    <LineChart data={createChartCFs()} xTitle="Year" title="Yearly Cash Flows" />
                }
            </div >
    )
}