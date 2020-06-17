import React, { useState, useEffect, Fragment } from 'react'
import TextInput from '../form/textinput'
import SelectInput from '../form/selectinput'
import NumberInput from '../form/numberinput'
import SVGRemove from '../svgremove'
import { API, graphqlOperation } from 'aws-amplify'
import * as mutations from '../../graphql/mutations'
import * as queries from '../../graphql/queries';
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
import { LineChart } from './linechart'
import SVGExpand from '../svgexpand'
import SVGCollapse from '../svgcollapse'
import ResultItem from '../calc/resultitem'
import SVGMoneyBagPer from '../svgmoneybagper'

const Goals = () => {
    const minStartYear = new Date().getFullYear()
    const [startYear, setStartYear] = useState<number>(minStartYear + 1)
    const [endYear, setEndYear] = useState<number>(startYear)
    const [syOptions] = useState(initYearOptions(startYear, 50))
    const [eyOptions, setEYOptions] = useState(initYearOptions(startYear, 100))
    const [loanRepaymentSY, setLoanRepaymentSY] = useState<number>(startYear)
    const [ryOptions, setRYOptions] = useState(initYearOptions(startYear, 10))
    const [amSYOptions, setAMSYOptions] = useState(initYearOptions(startYear, 10))
    const [price, setPrice] = useState<number>(0)
    const [totalCost, setTotalCost] = useState<number>(0)
    const [taxRate, setTaxRate] = useState<number>(0)
    const [maxTaxDeduction, setMaxTaxDeduction] = useState<number>(0)
    const [taxBenefitIntOnly, setTaxBenefitIntOnly] = useState<number>(0)
    const [sellAfter, setSellAfter] = useState<number>(5)
    const [sellPrice, setSellPrice] = useState<number>(0)
    const [buyTaxRate, setBuyTaxRate] = useState<number>(10)
    const [sellTaxRate, setSellTaxRate] = useState<number>(5)
    const [annualReturnPer, setAnnualReturnPer] = useState<number | null>(0)
    const [loanPer, setLoanPer] = useState<number>(0)
    const [currentPrice, setCurrentPrice] = useState<number>(0)
    const [currency, setCurrency] = useState<string>("USD")
    const [criticality, setCriticality] = useState<APIt.LMH>(APIt.LMH.H)
    const [ra, setRA] = useState<APIt.LMH>(APIt.LMH.L)
    const [manualMode, setManualMode] = useState<number>(0)
    const [name, setName] = useState<string>("")
    const [emi, setEmi] = useState<number>(0)
    const [loanMonths, setLoanMonths] = useState<number>(60)
    const [loanIntRate, setLoanIntRate] = useState<number>(4)
    const [priceChgRate, setPriceChgRate] = useState<number>(3)
    const [amCostPer, setAMCostPer] = useState<number>(2)
    const [amStartYear, setAMStartYear] = useState<number>(startYear)
    const [oppDR, setOppDR] = useState<number>(6)
    const [rentAmt, setRentAmt] = useState(0)
    const [rentChgPer, setRentChgPer] = useState(5)
    const [rentTaxBenefit, setRentTaxBenefit] = useState(0)
    const [chartData, setChartData] = useState<Array<Array<number>>>([])
    const detailsLabel = "Details"
    const chartLabel = "Show Chart"
    const taxLabel = "Tax"
    const maintainLabel = "Maintain"
    const [showRentOption, setShowRentOption] = useState<boolean>(false)
    const [viewItems, setViewItems] = useState([detailsLabel, taxLabel, maintainLabel, chartLabel])
    const [viewMode, setViewMode] = useState(detailsLabel)
    const [goalType, setGoalType] = useState<APIt.GoalType>(APIt.GoalType.B)
    const analyzeFor = 30
    const [oppCostCFs, setOppCostCFs] = useState<Array<number>>([])

    useEffect(() => {
        if (goalType === APIt.GoalType.B) setViewItems([detailsLabel, taxLabel, maintainLabel, chartLabel])
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

    const initTargets = (val: number | null, fxRate: number = 1.0) => {
        let value = val ? val : price
        let curr = currency
        let fx = fxRate
        let targets: Array<APIt.TargetInput> = []
        for (let year = startYear; year <= endYear; year++, value *= !isManualEntry() ? (1 + (priceChgRate / 100)) : 0) {
            let existingT = null
            if (wipTargets.length > 0 && isManualEntry() && !val) {
                existingT = (wipTargets.filter((target) => target.year === year))[0] as APIt.TargetInput
                if (existingT) {
                    existingT.curr = curr
                    existingT.fx = fx
                }
            }
            let t = existingT ? Object.assign({}, existingT) : createNewTarget(year, value, curr, fx)
            if (t.val > 0 && !isManualEntry()) t.val -= getTaxBenefit(value, taxRate, maxTaxDeduction)
            t.val = Math.round(t.val)
            targets.push(t)
        }
        console.log("New targets created: ", targets)
        setWIPTargets([...targets])
    }

    const initLoanTargets = (fxRate: number = 1.0, duration: number, changeState: boolean = true) => {
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

    const [allGoals, setAllGoals] = useState<Array<APIt.CreateGoalInput> | null>(null)

    const [wipTargets, setWIPTargets] = useState<Array<APIt.TargetInput>>([createNewTarget(startYear, totalCost, currency, 1.0)])

    const getAllGoals = async () => {
        try {
            const { data: { listGoals } } = (await API.graphql(graphqlOperation(queries.listGoals))) as {
                data: APIt.ListGoalsQuery
            }
            let goals: Array<APIt.CreateGoalInput> | null = listGoals ? listGoals.items as Array<APIt.CreateGoalInput> : null
            console.log("Got all goals from db....", goals)
            setAllGoals(goals)
        } catch (e) {
            console.log("Error while getting list of goals: ", e)
        }
    }

    const removeGoal = (id: string) => {
        allGoals?.forEach((goal, i) => goal.id === id ? allGoals.splice(i, 1) : console.log("No need to delete id: ", goal.id))
        setAllGoals([...allGoals as Array<APIt.CreateGoalInput>])
    }

    const deleteGoal = async (id: string) => {
        try {
            await API.graphql(graphqlOperation(mutations.deleteGoal, { input: { id: id } }))
            removeGoal(id)
        } catch (e) {
            console.log("Error while deleting goal: ", e)
        }
    }

    useEffect(() => {
        console.log("Going to get all goals...")
        getAllGoals()
    }, [])

    const isManualEntry = () => {
        return (endYear > startYear && loanPer === 0 && (goalType === APIt.GoalType.B || manualMode > 0))
    }

    const createNewGoal = async () => {
        let goal: APIt.CreateGoalInput = {
            name: name,
            type: goalType as APIt.GoalType,
            tgts: wipTargets,
            imp: criticality,
            ra: ra,
            emi: loanPer > 0 ? { rate: loanIntRate, dur: loanMonths, dp: loanPer } as APIt.EmiInput : null,
        }
        try {
            const { data } = (await API.graphql(graphqlOperation(mutations.createGoal, { input: goal }))) as {
                data: APIt.CreateGoalMutation
            }
            console.log("New goal created in db: ", data ? data.createGoal : "")
            setAllGoals([...allGoals as Array<APIt.CreateGoalInput>, data.createGoal as APIt.CreateGoalInput])
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
        if (loanPer > 0) setWIPTargets([...initLoanTargets(1.0, sellAfter, true)])
    }, [goalType, price, emi, loanPer, loanRepaymentSY, loanMonths, currency, startYear, endYear, sellAfter, taxRate, maxTaxDeduction, taxBenefitIntOnly])

    useEffect(() => {
        if (loanPer === 0) {
            if (endYear > startYear) initTargets(0)
            else initTargets(null)
        }
    }, [goalType, startYear, endYear, price, priceChgRate, currency, sellAfter, taxRate, maxTaxDeduction, manualMode])

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
        if (duration !== sellAfter && loanPer > 0) tgts = initLoanTargets(1.0, duration, false)
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
        if(sellPrice > 0) {
            x.push(startYear + sellAfter)
            y.push(Math.round(sellPrice * (1 + (sellTaxRate/100))))
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
        if (goalType === APIt.GoalType.B && price > 0 && sellAfter > 0) {
            setSellPrice(Math.round(getCompoundedIncome(priceChgRate, price, sellAfter)))
            calculateAnnualReturn()
        } else {
            setSellPrice(0)
            setAnnualReturnPer(null)
        }
    }, [wipTargets, priceChgRate, sellAfter, price])

    useEffect(() => {
        let price = 0
        if (isManualEntry()) {
            for (let i = 0; i < wipTargets.length; i++) {
                price += (wipTargets[i].val * wipTargets[i].fx)
            }
            price = currentPrice * (1 - (buyTaxRate/100))
        } else {
            let currentYear = new Date().getFullYear()
            let compoundPeriod = startYear - currentYear
            price = currentPrice * (1 - (buyTaxRate/100))
            price = getCompoundedIncome(priceChgRate, price, compoundPeriod)
        }
        setPrice(Math.round(price))
    }, [currentPrice, priceChgRate, startYear, goalType, manualMode, wipTargets, loanPer, buyTaxRate])

    useEffect(() => {
        let totalCost = 0
        if (goalType === APIt.GoalType.B) totalCost += getTotalMaintCost()
        for (let i = 0; i < wipTargets.length; i++) totalCost += wipTargets[i].val * wipTargets[i].fx
        setTotalCost(totalCost)
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
        <div className="ml-1 mr-1 md:ml-4 md:mr-4 overflow-hidden flex flex-col text-lg md:text-xl">
            <div className="flex flex-wrap justify-between items-center">
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
            <ul className="flex w-full">
                {viewItems.map((item, i) => (
                    <li key={"viewItem" + i}>
                        <button onClick={changeViewMode} style={{ color: viewMode === item ? "green" : "#4a5568", backgroundColor: viewMode === item ? "#edf2f7" : "#f7fafc" }} className="dashmi md:mt-4 md:px-4 hover:bg-white hover:border-t hover:text-green-600 focus:outline-none">{item}</button>
                    </li>))}
            </ul>
            {viewMode === detailsLabel &&
                <Fragment>
                    <div className="flex items-center justify-around">
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
                            <label>Pay In</label>
                            <CurrencyInput name="mainCurr" value={currency} changeHandler={setCurrency} />
                        </div>
                        {loanPer === 0 && goalType !== APIt.GoalType.B && endYear > startYear && <Toggle topText="Manual Entry" value={manualMode} setter={setManualMode} />}
                    </div>
                    {!isManualEntry() ?
                        <Fragment>
                            <div className="mt-4 flex flex-wrap justify-around items-center">
                                <NumberInput name="selfAmt" pre="Current" post="Price" note="including taxes & fees" width="120px"
                                    currency={currency} value={currentPrice} changeHandler={setCurrentPrice} min={500} max={2000000} />
                                <NumberInput name="priceChgRate" pre="Yearly" post="Change" note={`Price ${toCurrency(Math.round(price * (1 + (buyTaxRate/100))), currency)} in ${startYear}`} unit="%"
                                    width="30px" min={-20} max={20} value={priceChgRate} changeHandler={setPriceChgRate} />
                            </div>
                            <EmiCost price={price} currency={currency} startYear={startYear} repaymentSY={loanRepaymentSY} repaymentSYOptions={ryOptions}
                                loanMonths={loanMonths} emi={emi} loanAnnualInt={loanIntRate} loanPer={loanPer}
                                loanAnnualIntHandler={setLoanIntRate} loanPerHandler={setLoanPer}
                                emiHandler={setEmi} loanMonthsHandler={setLoanMonths} repaymentSYHandler={setLoanRepaymentSY} />
                        </Fragment> :
                        <div className="flex flex-wrap items-center justify-center w-full">
                            {wipTargets && wipTargets.map((t, i) =>
                                <div key={"t" + i} className="mr-4 md:mr-8 mt-4 flex flex-col justify-end items-end">
                                    <label>{t.year}</label>
                                    <NumberInput name="year" pre="" currency={t.curr}
                                        value={t.val} changeHandler={(val: number) => changeTargetVal(val, i)}
                                        width="120px" min={0} max={999999} step={100} />
                                    <CurrencyInput name={"curr" + i} value={currency} changeHandler={(val: string) => changeTargetCurrency(val, i)} />
                                </div>)}
                        </div>}



                    <div className="flex flex-col items-center mt-4 md:mt-8">
                        <p className="font-semibold text-xl md:text-2xl">To Pay Total {toCurrency(totalCost, currency)}</p>
                        <TimeCost amount={totalCost} currency={currency} workHoursPerWeek={60} annualWorkWeeks={47} displayFooter={false} />
                    </div>

                    {goalType === APIt.GoalType.B && <div className="flex flex-col items-center mt-4">
                        <div className="flex items-center justify-center">
                            <label className="mr-4 text-xl md:text-2xl font-semibold">Sell After</label>
                            <RadialInput width={100} label="Years" labelBottom={true} data={toStringArr(1, 30)}
                                value={sellAfter} step={1} changeHandler={setSellAfter} />
                        </div>
                        <div className="w-full flex justify-around items-center mt-4">
                            {isManualEntry() && <NumberInput name="priceChgRate" pre="Given Price" post="Changes" note="Yearly" unit="%"
                                width="30px" min={-20} max={20} value={priceChgRate} changeHandler={setPriceChgRate} />}
                            <ResultItem svg={<SVGMoneyBagPer />} label={`In ${startYear + sellAfter}, You May Get`} result={Math.round(sellPrice * (1 + (sellTaxRate/100)))} currency={currency} footer="including taxes & fees." />
                            <ResultItem svg={<SVGMoneyBagPer />} label="You May Earn" footer="Yearly" result={annualReturnPer ? annualReturnPer : 0} unit="%" decimal={2} />
                        </div>
                    </div>}

                    <div className="mt-4 md:mt-8">
                        <p className="mb-2 text-center text-xl md:text-2xl font-semibold">If You Invest Instead,</p>
                        <OppCost cfs={oppCostCFs} currency={currency} startYear={startYear}
                            discountRate={oppDR} discountRateHandler={setOppDR} />
                    </div>
                    {goalType === APIt.GoalType.B && <div className="flex justify-center items-center mt-4 md:mt-8">
                        <label className="mr-2 text-xl md:text-2xl font-semibold">Evaluate Rent Option</label>
                        {showRentOption ?
                            <div className="cursor-pointer" onClick={() => setShowRentOption(false)}>
                                <SVGCollapse />
                            </div>
                            : <div className="cursor-pointer" onClick={() => setShowRentOption(true)}>
                                <SVGExpand />
                            </div>}
                    </div>}
                    {goalType === APIt.GoalType.B && showRentOption &&
                        <div className="flex flex-wrap items-center">
                            <BRComparison currency={currency} taxRate={taxRate} sellAfter={sellAfter}
                                discountRate={oppDR} initAllBuyCFsForComparison={initBuyCFsForComparison}
                                rentAmt={rentAmt} rentAmtHandler={setRentAmt} rentChgPer={rentChgPer}
                                rentChgPerHandler={setRentChgPer} rentTaxBenefit={rentTaxBenefit}
                                rentTaxBenefitHandler={setRentTaxBenefit} />
                        </div>}
                    <div className="flex justify-center mt-8">
                        <button className="cancel" onClick={createNewGoal}>
                            Cancel
			                        </button>
                        <button className="ml-8 button" onClick={createNewGoal}>
                            Create Goal
			                        </button>
                    </div>
                </Fragment>}
            {viewMode === maintainLabel && <div className="mt-4 md:mt-8 flex flex-col items-center w-full justify-around text-lg md:text-xl lg:text-2xl">
                <label>Wear & Tear, Insurance, Taxes, etc costs</label>
                <div className="flex items-center mt-4 justify-around w-full">
                    <RadialInput data={toStringArr(0, 10, 0.1)} float={true} changeHandler={setAMCostPer} width={120}
                        unit="%" labelBottom={true} label="of Price" value={amCostPer} step={0.1} />
                    <label className="mr-4 ml-4">Every Year</label>
                    <SelectInput name="maintainFrom" pre="Starting" options={amSYOptions} value={amStartYear}
                        changeHandler={setAMStartYear} />
                </div>
            </div>}
            {viewMode === taxLabel && (loanPer > 0 || manualMode < 1) &&
                <TaxBenefit loan={loanPer > 0 ? true : false} taxRate={taxRate} taxRateHandler={setTaxRate} currency={currency}
                    maxTaxDeduction={maxTaxDeduction} maxTaxDeductionHandler={setMaxTaxDeduction}
                    taxBenefitIntOnly={taxBenefitIntOnly} taxBenefitIntOnlyHandler={setTaxBenefitIntOnly} 
                    buyTaxRate={buyTaxRate} buyTaxRateHandler={setBuyTaxRate} sellTaxRate={sellTaxRate} 
                    sellTaxRateHandler={setSellTaxRate} showBuySellTaxes={goalType === APIt.GoalType.B} />
            }
            {
                viewMode === chartLabel &&
                <LineChart data={chartData} xTitle="Year" title="Yearly Cash Flows" />
            }

            <div className="flex flex-wrap justify-around">
                {allGoals && allGoals.map((g: any, i: number) =>
                    <ul key={i} className="w-full flex flex-col justify-center items-center md:w-1/2 lg:w-1/3 mt-4 ml-2 mr-2 text-center max-w-sm rounded overflow-hidden shadow-xl">
                        <li className="mt-4 text-xl font-bold">
                            <div className="flex w-full justify-between">
                                <label>{g.name}</label>
                                <label className="cursor" onClick={() => deleteGoal(g.id)}><SVGRemove /></label>
                            </div>
                            {g.emi && <label>{`EMI @ ${g.emi.rate} for ${g.emi.dur}`}</label>}
                        </li>
                        <li className="mt-4">Chart</li>
                        <li className="mt-4 ml-4">
                            {g.tgts && g.tgts.map((t: APIt.TargetInput, i: number) =>
                                <div key={"milestone" + i} className="flex flex-wrap flex-col">
                                    <label>{t.year}</label>
                                    <label className="mt-2">{toCurrency(t.val, t.curr)}</label>
                                </div>)}
                        </li>
                    </ul>)}
            </div>
        </div >
    )
}

export default Goals