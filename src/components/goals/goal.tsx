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
import { createNewTarget } from '../utils'
import xirr from 'xirr'
import { getIntAmtByYear, getRemainingPrincipal, getCompoundedIncome } from '../calc/finance'
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
    modalCallback: Function
    wipGoalCallback: Function
    addCallback?: Function
}
export default function Goal({ goal, summary, deleteCallback, modalCallback, wipGoalCallback, addCallback }: GoalProps) {
    //@ts-ignore
    const [id, setId] = useState<string | null>(goal ? goal.id : null)
    const goalCreatedYear = new Date().getFullYear()
    const [startYear, setStartYear] = useState<number>(id && goal?.sy ? goal.sy : goalCreatedYear + 1)
    const [endYear, setEndYear] = useState<number>(id && goal?.ey ? goal.ey : startYear)
    const [syOptions] = useState(initYearOptions(startYear, 50))
    const [eyOptions, setEYOptions] = useState(initYearOptions(startYear, 80))
    const [loanRepaymentSY, setLoanRepaymentSY] = useState<number>(id && goal?.emi?.ry ? goal.emi.ry : startYear)
    const [ryOptions, setRYOptions] = useState(initYearOptions(startYear, 10))
    const [amSYOptions, setAMSYOptions] = useState(initYearOptions(startYear, 10))
    const [price, setPrice] = useState<number>(0)
    const [totalCost, setTotalCost] = useState<number>(0)
    const [taxRate, setTaxRate] = useState<number>(id && goal?.tdr ? goal.tdr : 0)
    const [maxTaxDeduction, setMaxTaxDeduction] = useState<number>(id && goal?.tdl ? goal.tdl : 0)
    const [taxBenefitIntOnly, setTaxBenefitIntOnly] = useState<number>(0)
    const [sellAfter, setSellAfter] = useState<number>(id ? (endYear - startYear) + 1 : 5)
    const [sellPrice, setSellPrice] = useState<number>(0)
    const [buyTaxRate, setBuyTaxRate] = useState<number>(id && goal?.btr ? goal.btr : 10)
    const [sellTaxRate, setSellTaxRate] = useState<number>(id && goal?.str ? goal.str : 5)
    const [annualReturnPer, setAnnualReturnPer] = useState<number | null>(0)
    const [loanPer, setLoanPer] = useState<number>(id && goal?.emi?.per ? goal.emi.per : 0)
    const [currentPrice, setCurrentPrice] = useState<number>(id && goal?.cp ? goal.cp : 0)
    const [currency, setCurrency] = useState<string>(id && goal?.ccy ? goal.ccy : "USD")
    const fxRate = 1.0
    const [criticality, setCriticality] = useState<APIt.LMH>(id && goal?.imp ? goal.imp : APIt.LMH.M)
    const [ra, setRA] = useState<APIt.LMH>(APIt.LMH.L)
    const [manualMode, setManualMode] = useState<number>(0)
    const [name, setName] = useState<string>(id && goal?.name ? goal.name : "")
    const [emi, setEmi] = useState<number>(0)
    const [loanMonths, setLoanMonths] = useState<number>(id && goal?.emi?.dur ? goal.emi.dur : 6)
    const [loanIntRate, setLoanIntRate] = useState<number>(id && goal?.emi?.rate ? goal.emi.rate : 4)
    const [priceChgRate, setPriceChgRate] = useState<number>(id && goal?.chg ? goal.chg : 3)
    const [amCostPer, setAMCostPer] = useState<number>(id && goal?.amper ? goal.amper : 2)
    const [amStartYear, setAMStartYear] = useState<number>(id && goal?.amsy ? goal.amsy : startYear)
    const [oppDR, setOppDR] = useState<number>(id && goal?.dr ? goal.dr : 6)
    const [rentAmt, setRentAmt] = useState(0)
    const [rentChgPer, setRentChgPer] = useState(5)
    const [rentTaxBenefit, setRentTaxBenefit] = useState(0)
    const [chartData, setChartData] = useState<Array<Array<number>>>([])
    const detailsLabel = "Details"
    const chartLabel = "Cash Flows"
    const taxLabel = "Tax"
    const rentLabel = "Rent?"
    const [viewItems, setViewItems] = useState([detailsLabel, taxLabel, chartLabel, rentLabel])
    const [viewMode, setViewMode] = useState(detailsLabel)
    const [goalType, setGoalType] = useState<APIt.GoalType>(APIt.GoalType.B)
    const analyzeFor = 20
    const [oppCostCFs, setOppCostCFs] = useState<Array<number>>([])

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

    const initTargets = (val: number | null) => {
        let value = val ? val : price
        let targets: Array<APIt.TargetInput> = []
        for (let year = startYear; year <= endYear; year++, value *= !isManualEntry() ? (1 + (priceChgRate / 100)) : 0) {
            let existingT = null
            if (wipTargets.length > 0 && isManualEntry() && !val) {
                existingT = (wipTargets.filter((target) => target.year === year))[0] as APIt.TargetInput
                if (existingT) {
                    existingT.curr = currency
                    existingT.fx = fxRate
                }
            }
            let t = existingT ? Object.assign({}, existingT) : createNewTarget(year, value, currency, fxRate)
            if (t.val > 0 && !isManualEntry()) t.val -= getTaxBenefit(value, taxRate, maxTaxDeduction)
            t.val = Math.round(t.val)
            targets.push(t)
        }
        console.log("New targets created: ", targets)
        setWIPTargets([...targets])
    }

    const initLoanTargets = (duration: number, changeState: boolean = true) => {
        let totalMonths = loanMonths > 12 ? loanMonths - 12 : loanMonths
        let ey: number = loanMonths <= 12 ? loanRepaymentSY : loanRepaymentSY + Math.floor(totalMonths / 12)
        let loanBorrowAmt = Math.round(price * (loanPer / 100))
        let loanDP = price - loanBorrowAmt
        let targets: Array<APIt.TargetInput> = []
        let annualInts = taxBenefitIntOnly ? getIntAmtByYear(loanBorrowAmt, emi, loanIntRate, loanMonths) : []
        let remPrincipal = 0
        if (duration > 0) {
            ey = startYear + duration - 1
            if (ey >= loanRepaymentSY) {
                let loanPaidForMonths = (ey - loanRepaymentSY) * 12
                remPrincipal = getRemainingPrincipal(loanBorrowAmt, emi, loanIntRate, loanPaidForMonths)
            } else remPrincipal = loanBorrowAmt
        }
        if (changeState) setEndYear(ey)
        for (let year = startYear; year <= ey; year++, year >= loanRepaymentSY ? totalMonths -= 12 : totalMonths -= 0) {
            let cf = 0
            if (year === startYear) cf += taxBenefitIntOnly > 0 ? loanDP : loanDP - getTaxBenefit(loanDP, taxRate, maxTaxDeduction)
            if (year >= loanRepaymentSY && totalMonths >= 0) {
                let extraMonths = loanMonths % 12
                let factor = 12
                if (year === ey && extraMonths !== 0) factor = extraMonths
                let annualEmiAmt = emi * factor
                let i = year - loanRepaymentSY
                let taxBenefitEligibleAmt = taxBenefitIntOnly > 0 ? annualInts[i] : annualEmiAmt
                cf += annualEmiAmt - getTaxBenefit(taxBenefitEligibleAmt, taxRate, maxTaxDeduction)
            }
            if (year === ey) {
                cf += remPrincipal
            }
            targets.push(createNewTarget(year, Math.round(cf), currency, fxRate))
        }
        console.log("Loan targets are...", targets)
        return targets
    }

    const [wipTargets, setWIPTargets] = useState<Array<APIt.TargetInput>>(id && goal?.tgts ? goal.tgts : [createNewTarget(startYear, totalCost, currency, fxRate)])

    const isManualEntry = () => {
        return (endYear > startYear && loanPer === 0 && (goalType === APIt.GoalType.B || manualMode > 0))
    }

    const createNewGoal = async () => {
        let goal: APIt.CreateGoalInput = {
            name: name,
            sy: startYear,
            ey: endYear,
            btr: buyTaxRate,
            str: sellTaxRate,
            tdr: taxRate,
            tdl: maxTaxDeduction,
            ccy: currency,
            cp: currentPrice,
            chg: priceChgRate,
            type: goalType as APIt.GoalType,
            tgts: wipTargets,
            amper: amCostPer,
            amsy: amStartYear,
            dr: oppDR,
            imp: criticality,
            ra: ra,
            emi: loanPer > 0 ? { rate: loanIntRate, dur: loanMonths, per: loanPer, ry: loanRepaymentSY } as APIt.EmiInput : null,
        }
        try {
            const { data } = (await API.graphql(graphqlOperation(mutations.createGoal, { input: goal }))) as {
                data: APIt.CreateGoalMutation
            }
            console.log("New goal created in db: ", data ? data.createGoal : "")
            if (addCallback) addCallback(data.createGoal)
            modalCallback(false)
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
        if (loanPer > 0) setRYOptions(initYearOptions(startYear, 10))
        setAMSYOptions(initYearOptions(startYear, 10))
        if (loanPer === 0 && (startYear > endYear || endYear - startYear > 100)) setEndYear(startYear)
        if (loanPer > 0 && (startYear > loanRepaymentSY || loanRepaymentSY - startYear > 10)) setLoanRepaymentSY(startYear)
    }, [startYear, endYear, loanPer, loanRepaymentSY])

    const changeEndYear = (str: string) => {
        let ey = parseInt(str)
        setEndYear(ey)
    }

    useEffect(() => {
        if (loanPer > 0) {
            id ? setWIPTargets([...wipTargets])
                : setWIPTargets([...initLoanTargets(sellAfter, true)])
        }
    }, [goalType, price, emi, loanPer, loanRepaymentSY, loanMonths, currency, startYear, endYear, sellAfter, taxRate, maxTaxDeduction, taxBenefitIntOnly])

    useEffect(() => {
        if (loanPer === 0) {
            id ? setWIPTargets([...wipTargets])
                : endYear > startYear ? initTargets(0) : initTargets(null)
        }
    }, [goalType, startYear, endYear, price, priceChgRate, currency, sellAfter, taxRate, maxTaxDeduction, manualMode])

    useEffect(() => {
        if (rentAmt === 0) setRentAmt(Math.round(price * 0.04))
    }, [price, rentAmt, price])

    const getTotalMaintCost = () => {
        let total = 0
        for (let year = startYear, val = price; year < startYear + sellAfter; year++, val *= (1 + (priceChgRate / 100))) {
            if (year < amStartYear) continue
            total += Math.round(val * (amCostPer / 100))
        }
        return total
    }

    const getAnnualMaintCost = (index: number) => {
        if (startYear + index < amStartYear) return 0
        let yearlyPrice = index === 0 ? price : getCompoundedIncome(priceChgRate, price, index)
        return Math.round(yearlyPrice * (amCostPer / 100))
    }

    const initBuyCFs = (duration: number) => {
        let tgts = wipTargets
        if (duration !== sellAfter && loanPer > 0) tgts = initLoanTargets(duration, false)
        let cfs: Array<number> = []
        for (let i = 0; i < duration; i++) {
            let cf = getAnnualMaintCost(i)
            if (i < tgts.length) cf += tgts[i].val * tgts[i].fx
            cfs.push(Math.round(-1 * cf))
        }
        return cfs
    }

    const initBuyCFsForComparison = () => {
        let allCFs: Array<Array<number>> = []
        for (let i = 1; i <= analyzeFor; i++) {
            allCFs.push(initBuyCFs(i))
        }
        return allCFs
    }

    const createChartCFs = () => {
        let cfs = initBuyCFs(sellAfter)
        let x = [], y = []
        for (let i = 0; i < cfs.length; i++) {
            x.push(startYear + i)
            y.push(cfs[i])
        }
        if (sellPrice > 0) {
            x.push(startYear + sellAfter)
            y.push(Math.round(sellPrice * (1 + (sellTaxRate / 100))))
        }
        return [x, y]
    }

    const createOppCostCFs = () => {
        let cfs = initBuyCFs(sellAfter)
        for (let i = 0; i < cfs.length; i++) {
            cfs[i] *= -1
        }
        return cfs
    }

    const calculateAnnualReturn = () => {
        console.log("Calculating annual return...")
        if (price === 0) {
            setAnnualReturnPer(0)
            return
        }
        let cfs = initBuyCFs(sellAfter)
        let xirrCFs = []
        for (let i = 0; i < cfs.length; i++) {
            xirrCFs.push({
                amount: cfs[i],
                when: new Date(startYear + i, 0, 1)
            })
        }
        xirrCFs.push({
            amount: sellPrice < 0 ? 0 : sellPrice,
            when: new Date(startYear + cfs.length, 0, 1)
        })
        try {
            setAnnualReturnPer(xirr(xirrCFs) * 100)
        } catch (e) {
            console.log("Error while calculating xirr: ", e)
            setAnnualReturnPer(null)
        }
    }

    useEffect(() => {
        if (goalType === APIt.GoalType.B) {
            console.log("Goal name: ", name)
            console.log("Goal id: ", id)
            console.log("Going to calculate sell price...")
            setSellPrice(Math.round(getCompoundedIncome(priceChgRate, price, sellAfter)))
            calculateAnnualReturn()
        }
    }, [priceChgRate, sellAfter, price])

    useEffect(() => {
        let price = 0
        if (isManualEntry()) {
            for (let i = 0; i < wipTargets.length; i++) {
                price += (wipTargets[i].val * wipTargets[i].fx)
            }
            price *= (1 - (buyTaxRate / 100))
        } else {
            let compoundPeriod = startYear - goalCreatedYear
            price = currentPrice * (1 - (buyTaxRate / 100))
            price = getCompoundedIncome(priceChgRate, price, compoundPeriod)
        }
        setPrice(Math.round(price))
    }, [currentPrice, priceChgRate, startYear, goalType, manualMode, wipTargets, loanPer, buyTaxRate])

    useEffect(() => {
        let totalCost = 0
        if (goalType === APIt.GoalType.B) totalCost += getTotalMaintCost()
        for (let i = 0; i < wipTargets.length; i++) totalCost += wipTargets[i].val * wipTargets[i].fx
        setTotalCost(totalCost)
        console.log("Goal name: ", name)
        console.log("Goal id: ", id)
        console.log("Start Year is ", startYear)
        console.log("End year is ", endYear)
        console.log("Total cost is ", totalCost)
        console.log("Total maintenance cost is ", getTotalMaintCost())
        console.log("Going to calculate opp cost and chart cfs...")
        setOppCostCFs(createOppCostCFs())
        setChartData(createChartCFs())
    }, [wipTargets, sellAfter, amStartYear, amCostPer])

    useEffect(() => {
        setChartData(createChartCFs())
    }, [sellTaxRate])

    useEffect(() => {
        if (loanPer === 0) setEndYear(startYear)
    }, [loanPer])

    const changeTargetCurrency = (val: string, index: number) => {
        wipTargets[index].curr = val
        setWIPTargets([...wipTargets])
    }

    const getGoalTypes = () => {
        return {
            "B": "Buy",
            "R": "Rent",
            "X": "Experience",
            "L": "Learn",
            "C": "Celebrate",
            "F": "Provide for Family",
            "FF": "Be Financially Free",
            "D": "Donate",
            "O": "Spend for Other Things"
        }
    }

    return (
        summary && id ? <Summary goal={goal as APIt.CreateGoalInput} chartData={chartData} deleteCallback={deleteCallback} wipGoalCallback={wipGoalCallback} />
            :
            <div className="z-150 flex flex-col text-lg md:text-xl w-screen">
                <div className="flex flex-wrap justify-around items-center w-full bg-black text-white">
                    <div className="w-11/12 flex flex-wrap justify-around items-center">
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
                        onClick={() => modalCallback(false)}>
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
                        <div className="mt-4 z-50 flex justify-center w-full">
                            <div className="flex justify-around items-center w-2/3">
                                {loanPer === 0 && goalType !== APIt.GoalType.B && endYear > startYear && <Toggle topText="Manual" value={manualMode} setter={setManualMode} />}
                                <div className="flex flex-col items-center justify-between w-full">
                                    <label className="text-xl md:text-2xl font-semibold">Payment Schedule</label>
                                    <div className="mt-1 w-full flex items-center justify-around">
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
                                    </div>
                                </div>
                            </div>
                        </div>

                        {!isManualEntry() ?
                            <div className="flex flex-wrap justify-around items-center">
                                <Section title={`Price in ${startYear} ~ ${toCurrency(Math.round(price * (1 + (buyTaxRate / 100))), currency)}`} left={
                                    <NumberInput name="currPrice" pre="Current" post="Price" width="110px"
                                        currency={currency} value={currentPrice} changeHandler={setCurrentPrice} min={500} max={2000000} />
                                } right={<RadialInput data={toStringArr(-5, 15, 0.5)} value={priceChgRate} label="Yearly" step={0.5}
                                    width={120} changeHandler={setPriceChgRate} unit="%" labelBottom={true} pre="Changes" />
                                } footer={`Amount includes ${buyTaxRate}% taxes & fees`} />
                                <EmiCost price={price} currency={currency} startYear={startYear} repaymentSY={loanRepaymentSY} repaymentSYOptions={ryOptions}
                                    loanMonths={loanMonths} emi={emi} loanAnnualInt={loanIntRate} loanPer={loanPer}
                                    loanAnnualIntHandler={setLoanIntRate} loanPerHandler={setLoanPer}
                                    emiHandler={setEmi} loanMonthsHandler={setLoanMonths} repaymentSYHandler={setLoanRepaymentSY} />
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
                            <Section title="Wear & Tear, Taxes, Fees, Insurance, etc costs Yearly"
                                left={
                                    <RadialInput data={toStringArr(0, 10, 0.1)} float={true} changeHandler={setAMCostPer} width={120}
                                        unit="%" labelBottom={true} label="of Price" value={amCostPer} step={0.1} />
                                } right={
                                    <SelectInput name="maintainFrom" pre="Starting" options={amSYOptions} value={amStartYear}
                                        changeHandler={setAMStartYear} />
                                } />
                            <Section title="Sell After" left={
                                <RadialInput width={120} label="Years" labelBottom={true} data={toStringArr(1, analyzeFor)}
                                    value={sellAfter} step={1} changeHandler={setSellAfter} />
                            } right={
                                <ResultItem svg={<SVGMoneyBag />} label={`In ${startYear + sellAfter} for`}
                                    result={Math.round(sellPrice * (1 + (sellTaxRate / 100)))} currency={currency}
                                    footer={annualReturnPer ? `${annualReturnPer.toFixed(2)}% Yearly ${annualReturnPer > 0 ? 'Gain' : 'Loss'}` : ''} />
                            } bottomCondition={isManualEntry()} bottomLeft="Assuming" bottomRight="Yearly"
                                bottom={
                                    <NumberInput name="priceChgRate" pre="Price" post="Changes" unit="%"
                                        width="30px" min={-20} max={20} value={priceChgRate} changeHandler={setPriceChgRate} />
                                } footer={sellPrice ? `Amount includes ${sellTaxRate}% taxes & fees.` : ''} />
                        </div>}

                        <div className="flex flex-wrap justify-around items-center w-full">
                            <TimeCost amount={totalCost} currency={currency} workHoursPerWeek={60} annualWorkWeeks={47} />

                            <OppCost cfs={oppCostCFs} currency={currency} startYear={startYear}
                                discountRate={oppDR} discountRateHandler={setOppDR} />
                        </div>
                        <div className="flex justify-center mt-8 mb-4">
                            <button className="cancel" onClick={() => modalCallback(false)}>
                                Cancel
			                    </button>
                            <button className="ml-8 button" onClick={() => createNewGoal()}>
                                Create Goal
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
                        maxTaxDeduction={maxTaxDeduction} maxTaxDeductionHandler={setMaxTaxDeduction}
                        taxBenefitIntOnly={taxBenefitIntOnly} taxBenefitIntOnlyHandler={setTaxBenefitIntOnly}
                        buyTaxRate={buyTaxRate} buyTaxRateHandler={setBuyTaxRate} sellTaxRate={sellTaxRate}
                        sellTaxRateHandler={setSellTaxRate} showBuySellTaxes={goalType === APIt.GoalType.B}
                        rentTaxBenefit={rentTaxBenefit} rentTaxBenefitHandler={setRentTaxBenefit} />
                }
                {
                    viewMode === chartLabel &&
                    <LineChart data={chartData} xTitle="Year" title="Yearly Cash Flows" />
                }
            </div >
    )
}