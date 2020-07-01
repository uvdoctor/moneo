import React, { useState, useEffect, Fragment } from 'react'
import TextInput from '../form/textinput'
import SelectInput from '../form/selectinput'
import NumberInput from '../form/numberinput'
import * as APIt from '../../api/goals'
import { initYearOptions, toCurrency, toStringArr } from '../utils'
import TimeCost from '../calc/timecost'
import EmiCost from '../calc/emicost'
import OppCost from '../calc/oppcost'
import HToggle from '../horizontaltoggle'
import TaxBenefit from '../calc/taxbenefit'
import CurrencyInput from '../form/currencyinput'
import BRComparison from '../calc/brcomparison'
import RadialInput from '../form/radialinput'
import LineChart from './linechart'
import Section from '../form/section'
import Sell from './sell'
import SVGClose from '../svgclose'
import { calculateCFs, calculatePrice, calculateSellPrice, getLoanBorrowAmt, 
    calculateManualPrice, calculateTotalTaxBenefit,calculatePrincipalTaxBenefit,  calculateTotalIntTaxBenefit} from './cfutils'
import { getDuration, createNewTarget, getGoalTypes, getImpLevels } from './goalutils'
//@ts-ignore
import { AwesomeButton } from "react-awesome-button"
import SVGLogo from '../svglogo'
import AnnualAmt from './annualamt'
interface GoalProps {
    goal: APIt.CreateGoalInput
    cashFlows?: Array<number>
    cancelCallback: Function
    addCallback: Function
    updateCallback: Function
}

export default function Goal({ goal, cashFlows, cancelCallback, addCallback, updateCallback }: GoalProps) {
    //@ts-ignore
    const [id, setId] = useState<string | null>(goal.id)
    const [startYear, setStartYear] = useState<number>(goal.sy)
    const [endYear, setEndYear] = useState<number>(goal.ey)
    const [syOptions] = useState(initYearOptions(goal.by, 50))
    const [eyOptions, setEYOptions] = useState(initYearOptions(startYear, 80))
    const [loanRepaymentSY, setLoanRepaymentSY] = useState<number | null | undefined>(goal?.emi?.ry)
    const [price, setPrice] = useState<number>(0)
    const [totalCost, setTotalCost] = useState<number>(0)
    const [taxRate, setTaxRate] = useState<number>(goal?.tdr)
    const [maxTaxDeduction, setMaxTaxDeduction] = useState<number>(goal?.tdl)
    const [taxBenefitInt, setTaxBenefitInt] = useState<number | null | undefined>(goal?.tbi)
    const [maxTaxDeductionInt, setMaxTaxDeductionInt] = useState<number | null | undefined>(goal?.tdli)
    const [sellAfter, setSellAfter] = useState<number | undefined | null>(goal?.sa)
    const [buyTaxRate, setBuyTaxRate] = useState<number | undefined | null>(goal?.btr)
    const [loanPer, setLoanPer] = useState<number | undefined | null>(goal?.emi?.per)
    const [startingPrice, setStartingPrice] = useState<number>(goal?.cp as number)
    const [currency, setCurrency] = useState<string>(goal?.ccy)
    const [impLevel, setImpLevel] = useState<APIt.LMH>(goal?.imp)
    const [manualMode, setManualMode] = useState<number>(goal?.manual)
    const [name, setName] = useState<string>(goal?.name)
    const [loanYears, setLoanYears] = useState<number | null | undefined>(goal?.emi?.dur)
    const [loanIntRate, setLoanIntRate] = useState<number | null | undefined>(goal?.emi?.rate)
    const [priceChgRate, setPriceChgRate] = useState<number>(goal?.chg as number)
    const [sellPrice, setSellPrice] = useState<number>(0)
    const [assetChgRate, setAssetChgRate] = useState<number | null | undefined>(goal?.achg)
    const [amCostPer, setAMCostPer] = useState<number | null | undefined>(goal?.amper)
    const [amStartYear, setAMStartYear] = useState<number | null | undefined>(goal?.amsy)
    const [aiPer, setAIPer] = useState<number | null | undefined>(goal?.aiper)
    const [aiStartYear, setAIStartYear] = useState<number | null | undefined>(goal?.aisy)
    const [oppDR, setOppDR] = useState<number>(id && goal?.dr ? goal.dr : 6)
    const [rentTaxBenefit, setRentTaxBenefit] = useState<number | null | undefined>(goal?.tbr)
    const detailsLabel = "Details"
    const chartLabel = "Chart"
    const taxLabel = "Tax Benefit"
    const rentLabel = "Rent?"
    const [viewItems, setViewItems] = useState([detailsLabel, taxLabel, chartLabel, rentLabel])
    const [viewMode, setViewMode] = useState(detailsLabel)
    const goalType = goal?.type as APIt.GoalType
    const [cfs, setCFs] = useState<Array<number>>(cashFlows ? cashFlows : [])
    const [submitDisabled, setSubmitDisabled] = useState<boolean>(true)
    const [rentAmt, setRentAmt] = useState<number>(0)
    const [rentChgPer, setRentChgPer] = useState<number>(5)
    const [annualReturnPer, setAnnualReturnPer] = useState<number | null>(0)
    const [totalTaxBenefit, setTotalTaxBenefit] = useState<number>(0)
    const [totalIntTaxBenefit, setTotalIntTaxBenefit] = useState<number>(0)

    const createNewBaseGoal = () => {
        return {
            name: name,
            sy: startYear,
            ey: startYear,
            by: goal.by,
            tdr: taxRate,
            tdl: maxTaxDeduction,
            ccy: currency,
            cp: startingPrice,
            chg: priceChgRate,
            type: goalType,
            tgts: wipTargets,
            dr: oppDR,
            imp: impLevel,
            manual: manualMode,
        } as APIt.CreateGoalInput
    }

    const createNewGoalInput = () => {
        let bg: APIt.CreateGoalInput = createNewBaseGoal()
        if (goalType !== APIt.GoalType.D) bg.btr = buyTaxRate
        if (goalType === APIt.GoalType.B || goalType === APIt.GoalType.L) {
            bg.tbi = taxBenefitInt
            bg.tdli = maxTaxDeductionInt
            bg.emi = { rate: loanIntRate as number, dur: loanYears as number, per: loanPer as number, ry: loanRepaymentSY as number }
        }
        if (goalType === APIt.GoalType.B) {
            bg.sa = sellAfter
            bg.achg = assetChgRate
            bg.amper = amCostPer
            bg.amsy = amStartYear
            bg.aiper = aiPer
            bg.aisy = aiStartYear
            bg.tbr = rentTaxBenefit
        }
        return bg
    }

    const createUpdateGoalInput = () => {
        let goal: APIt.CreateGoalInput = createNewGoalInput()
        goal.id = id
        return goal as APIt.UpdateGoalInput
    }

    useEffect(() => {
        if (goalType === APIt.GoalType.B) setViewItems([detailsLabel, taxLabel, chartLabel, rentLabel])
        else setViewItems([detailsLabel, taxLabel, chartLabel])
    }, [goalType])

    const changeViewMode = (e: any) => {
        setViewMode(e.target.innerText)
    }

    const initManualTargets = () => {
        let targets: Array<APIt.TargetInput> = []
        for (let year = startYear; year <= endYear; year++) {
            let existingT = null
            if (wipTargets.length > 0) {
                existingT = (wipTargets.filter((target) => target.year === year))[0] as APIt.TargetInput
            }
            let t = createNewTarget(year, existingT ? existingT.val : 0)
            targets.push(t)
        }
        setWIPTargets([...targets])
    }

    useEffect(() => {
        if (manualMode > 0) initManualTargets()
    }, [manualMode, startYear, endYear])

    const updateState = (cfs: Array<number>, g: APIt.CreateGoalInput, duration: number) => {
        let p = manualMode > 0 ? calculateManualPrice(g?.tgts as Array<APIt.TargetInput>)
            : calculatePrice(g?.cp as number, g?.chg as number, g.btr, g.sy, g.by)
        setPrice(p)
        let totalCost = goalType === APIt.GoalType.B ? -calculateSellPrice(p, g?.btr as number, g?.achg as number, duration) : 0
        cfs.forEach(cf => totalCost += cf)
        setTotalCost(Math.abs(totalCost))
        if(g.emi?.per && g.manual < 1) {
            setTotalTaxBenefit(calculatePrincipalTaxBenefit(p, g.emi.per, g.emi.rate, g.emi.dur, 
                g.emi.ry, endYear, g.btr as number, g.tdr, g.tdl))
            setTotalIntTaxBenefit(calculateTotalIntTaxBenefit(g, endYear))
        } else {
            setTotalTaxBenefit(calculateTotalTaxBenefit(g, duration))
            setTotalIntTaxBenefit(0)
        }
        setCFs([...cfs])
    }

    const calculateYearlyCFs = (duration: number, changeState: boolean = true) => {
        let g: APIt.CreateGoalInput = createNewGoalInput()
        console.log("CFs to be calculated for goal: ", g)
        let cfs = calculateCFs(g, duration)
        console.log("New cfs created: ", cfs)
        if (changeState) {
            if (g.emi?.per as number > 0 && manualMode < 1) setEndYear(g.sy + duration - 1)
            updateState(cfs, g, duration)
        }
        return cfs
    }

    const [wipTargets, setWIPTargets] = useState<Array<APIt.TargetInput>>(goal?.tgts as Array<APIt.TargetInput>)

    const changeTargetVal = (val: number, i: number) => {
        wipTargets[i].val = val
        setWIPTargets([...wipTargets])
    }

    const changeStartYear = (str: string) => {
        setStartYear(parseInt(str))
    }

    useEffect(() => {
        if (!loanPer) setEYOptions(initYearOptions(startYear, 100))
        if (!loanPer && (startYear > endYear || endYear - startYear > 100)) setEndYear(startYear)
        if (loanPer && loanRepaymentSY && (startYear > loanRepaymentSY || loanRepaymentSY - startYear > 10)) setLoanRepaymentSY(startYear)
    }, [startYear, endYear, loanPer, loanRepaymentSY])

    const changeEndYear = (str: string) => {
        let ey = parseInt(str)
        setEndYear(ey)
    }

    useEffect(() => {
        if (!cashFlows) calculateYearlyCFs(getDuration(sellAfter, startYear, endYear))
    }, [goalType, startingPrice, priceChgRate, wipTargets, assetChgRate, loanPer, loanRepaymentSY,
        loanYears, currency, startYear, sellAfter, buyTaxRate, taxRate, maxTaxDeduction, taxBenefitInt,
        maxTaxDeductionInt, amCostPer, amStartYear, aiPer, aiStartYear, manualMode, cashFlows])

    useEffect(() => {
        if (goalType !== APIt.GoalType.B && manualMode < 1) calculateYearlyCFs(getDuration(sellAfter, startYear, endYear))
    }, [endYear])

    useEffect(() => setRentAmt(Math.round(price * 0.04)), [price])
    const initBuyCFsForComparison = (analyzeFor: number) => {
        let allCFs: Array<Array<number>> = []
        for (let i = 1; i <= analyzeFor; i++)
            allCFs.push(i === sellAfter ? cfs : calculateYearlyCFs(i, false))
        return allCFs
    }

    const createOppCostCFs = () => {
        let oppCostCFs: Array<number> = Object.assign([], cfs)
        if (sellAfter && oppCostCFs[sellAfter]) oppCostCFs[sellAfter] -= sellPrice
        return oppCostCFs
    }

    useEffect(() => {
        if (manualMode > 0 && endYear === startYear) setEndYear(startYear + 2)
        else if (manualMode < 1 && loanPer === 0 && goalType === APIt.GoalType.B) setEndYear(startYear)
    }, [manualMode, loanPer])

    const handleClick = () =>
        id ? updateCallback(createUpdateGoalInput(), cfs)
            : addCallback(createNewGoalInput(), cfs)

    useEffect(() =>
        name && price > 500 && cfs.length > 0 ? setSubmitDisabled(false) : setSubmitDisabled(true)
        , [name, cfs])
    return (
        <div className="flex flex-col w-full">
            <div className="flex flex-wrap justify-between items-center w-full">
                <SVGLogo />
                <TextInput
                    name="name"
                    pre={getGoalTypes()[goalType]}
                    placeholder="Goal Name"
                    value={name}
                    changeHandler={setName}
                    width="200px"
                />
                <div className="cursor-pointer border-0 outline-none focus:outline-none"
                    onClick={() => cancelCallback()}>
                    <SVGClose />
                </div>
            </div>
            <ul className="flex w-full">
                {viewItems.map((item, i) => (
                    <li key={"viewItem" + i}>
                        <button onClick={changeViewMode} style={{ color: viewMode === item ? "white" : "#718096", backgroundColor: viewMode === item ? "black" : "#edf2f7" }} className="dashmi md:mt-4 md:px-4 hover:bg-white hover:border-t hover:text-green-600 focus:outline-none rounded-full">{item}</button>
                    </li>))}
            </ul>
            {viewMode === detailsLabel &&
                <Fragment>
                    <div className="mt-4 flex justify-around items-center w-full">
                        <div className="flex flex-col items-center justify-center w-full">
                            <div className="flex justify-center">
                                <label className="text-xl md:text-2xl font-semibold">Payment</label>
                                <HToggle rightText="Manual Entry" value={manualMode} setter={setManualMode} />
                            </div>
                            <div className="mt-1 w-full flex items-center justify-around w-full">
                                {buyTaxRate && <RadialInput data={toStringArr(0, 20, 0.5)} step={0.5} value={buyTaxRate}
                                    unit="%" label="of Price" pre="Taxes & Fees" labelBottom={true} changeHandler={setBuyTaxRate} />}
                                <SelectInput name="sy"
                                    pre="Starts"
                                    value={startYear}
                                    changeHandler={changeStartYear}
                                    options={syOptions}
                                />
                                {(manualMode > 0 || goalType !== APIt.GoalType.B) ? <SelectInput name="ey" pre="Ends" value={endYear}
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

                    {manualMode < 1 ?
                        <div className="flex flex-wrap justify-around items-center">
                            <Section title={`Amount in ${startYear} ~ ${toCurrency(price, currency)}`} left={
                                <NumberInput name="startingPrice" pre="Amount" post={`in ${goal.by}`} 
                                    currency={currency} value={startingPrice} changeHandler={setStartingPrice} min={500} max={2000000} />
                            } right={
                                <NumberInput name="priceChgRate" pre="Yearly" post="Change" unit="%"
                                    min={-20} max={20} step={0.5} value={priceChgRate} changeHandler={setPriceChgRate} />
                            } />
                            {goal?.emi &&
                                <EmiCost price={price} currency={currency} startYear={startYear}
                                    repaymentSY={loanRepaymentSY ? loanRepaymentSY : startYear} endYear={endYear}
                                    loanYears={loanYears as number} loanAnnualInt={loanIntRate as number} loanPer={loanPer as number}
                                    loanBorrowAmt={getLoanBorrowAmt(price, buyTaxRate as number, loanPer as number)} loanAnnualIntHandler={setLoanIntRate}
                                    loanPerHandler={setLoanPer} loanMonthsHandler={setLoanYears} repaymentSYHandler={setLoanRepaymentSY} />}
                        </div>
                        :
                        <div className="flex flex-wrap items-center justify-center w-full">
                            {wipTargets && wipTargets.map((t, i) =>
                                <div key={"t" + i} className="mr-4 md:mr-8 mt-4 flex flex-col justify-end items-end">
                                <label>{t.year}</label>
                                    <NumberInput name="year" pre="" currency={currency}
                                        value={t.val} changeHandler={(val: number) => changeTargetVal(val, i)}
                                        min={0} max={900000} step={100} />
                                </div>)}
                        </div>}

                    {sellAfter && <div className="flex flex-wrap justify-around items-center">
                        {aiStartYear && <AnnualAmt currency={currency} startYear={startYear} percentage={aiPer as number} chgRate={assetChgRate as number}
                            percentageHandler={setAIPer} annualSY={aiStartYear} annualSYHandler={setAIStartYear}
                            price={price} buyTaxRate={buyTaxRate as number} duration={getDuration(sellAfter, startYear, endYear)}
                            title="Yearly Income Expected After Excluding Taxes & Fees" />}
                        {amCostPer && amStartYear && <AnnualAmt currency={currency} startYear={startYear} percentage={amCostPer} chgRate={assetChgRate as number}
                            percentageHandler={setAMCostPer} annualSY={amStartYear} annualSYHandler={setAMStartYear}
                            price={price} buyTaxRate={buyTaxRate as number} duration={getDuration(sellAfter, startYear, endYear)}
                            title="Yearly Fixes, Taxes, Fees, Insurance, etc costs" />}
                        <Sell price={price} startYear={startYear} endYear={endYear} sellAfter={sellAfter}
                            sellPrice={sellPrice} sellPriceHandler={setSellPrice} sellAfterHandler={setSellAfter}
                            cfs={cfs} currency={currency} assetChgRate={assetChgRate as number} annualReturnPer={annualReturnPer as number}
                            assetChgRateHandler={setAssetChgRate} buyTaxRate={buyTaxRate as number} annualReturnPerHandler={setAnnualReturnPer} />
                    </div>}

                    <div className="flex flex-wrap justify-around items-center w-full">
                        <TimeCost amount={totalCost} currency={currency} workHoursPerWeek={60} annualWorkWeeks={47} />

                        <OppCost cfs={createOppCostCFs()} currency={currency} startYear={startYear}
                            duration={getDuration(sellAfter, startYear, endYear)} discountRate={oppDR} discountRateHandler={setOppDR} />
                    </div>
                    <div className="flex justify-center">
                        <SelectInput name="imp"
                            pre="How Important is this Goal?"
                            value={impLevel}
                            changeHandler={setImpLevel}
                            options={getImpLevels()}
                        />
                    </div>
                    <div className="flex justify-center mt-8 mb-4">
                        <AwesomeButton type="secondary" onPress={() => cancelCallback()}>
                            Cancel
			            </AwesomeButton>
                        <AwesomeButton className={`ml-8 ${submitDisabled ? 'cursor-not-allowed' : 'cursor-pointer'}`} type="primary" ripple onPress={handleClick}
                            disabled={submitDisabled}>
                            {`${id ? 'Update' : 'Create'} Goal`}
                        </AwesomeButton>
                    </div>
                </Fragment>}
            {viewMode === rentLabel && sellAfter &&
            <div className="flex flex-wrap justify-around items-center">
                <BRComparison currency={currency} taxRate={taxRate} sellAfter={sellAfter}
                    discountRate={oppDR} allBuyCFs={initBuyCFsForComparison(20)}
                    rentTaxBenefit={rentTaxBenefit as number} rentTaxBenefitHandler={setRentTaxBenefit}
                    price={price} discountRateHandler={setOppDR} rentAmt={rentAmt} rentAmtHandler={setRentAmt}
                    rentChgPer={rentChgPer} rentChgPerHandler={setRentChgPer} />
            </div>}

            {viewMode === taxLabel &&
                <TaxBenefit goalType={goalType} taxRate={taxRate} taxRateHandler={setTaxRate} currency={currency}
                    maxTaxDeduction={maxTaxDeduction} maxTaxDeductionHandler={setMaxTaxDeduction} taxBenefitInt={taxBenefitInt}
                    taxBenefitIntHandler={setTaxBenefitInt} rentTaxBenefit={rentTaxBenefit} rentTaxBenefitHandler={setRentTaxBenefit} 
                    maxTaxDeductionInt={maxTaxDeductionInt} maxTaxDeductionIntHandler={setMaxTaxDeductionInt} 
                    totalTaxBenefit={totalTaxBenefit} totalTaxBenefitHandler={setTotalTaxBenefit}
                    totalIntTaxBenefit={totalIntTaxBenefit} totalIntTaxBenefitHandler={setTotalIntTaxBenefit} />
            }
            {
                viewMode === chartLabel &&
                <LineChart cfs={cfs} startYear={startYear} currency={currency} />
            }
        </div >
    )
}