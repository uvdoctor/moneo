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
import SVGChart from '../svgchart'
import Cost from './cost'
import {
    calculateCFs, calculatePrice, calculateSellPrice, getLoanBorrowAmt,
    calculateManualPrice, calculateTotalTaxBenefit, calculatePrincipalTaxBenefit
} from './cfutils'
import { getDuration, getGoalTypes, getImpLevels } from './goalutils'
//@ts-ignore
import { AwesomeButton } from "react-awesome-button"
import SVGLogo from '../svglogo'
import AnnualAmt from './annualamt'
import ExpandCollapse from '../form/expandcollapse'
import SVGBalance from '../calc/svgbalance'
import ActionButtons from '../form/actionbuttons'
interface GoalProps {
    goal: APIt.CreateGoalInput
    cashFlows?: Array<number>
    cancelCallback: Function
    addCallback: Function
    updateCallback: Function
}

export default function Goal({ goal, cashFlows, cancelCallback, addCallback, updateCallback }: GoalProps) {
    const [startYear, setStartYear] = useState<number>(goal.sy)
    const [endYear, setEndYear] = useState<number>(goal.ey)
    const [syOptions] = useState(initYearOptions(goal.by + 1, 50))
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
    const [oppDR, setOppDR] = useState<number>(goal?.dr ? goal.dr : 6)
    const [rentTaxBenefit, setRentTaxBenefit] = useState<number | null | undefined>(goal?.tbr)
    const [showRentChart, setShowRentChart] = useState<boolean>(true)
    const [showCFChart, setShowCFChart] = useState<boolean>(true)
    const goalType = goal?.type as APIt.GoalType
    const [cfs, setCFs] = useState<Array<number>>(cashFlows ? cashFlows : [])
    const [submitDisabled, setSubmitDisabled] = useState<boolean>(true)
    const [rentAmt, setRentAmt] = useState<number>(0)
    const [rentChgPer, setRentChgPer] = useState<number>(5)
    const [annualReturnPer, setAnnualReturnPer] = useState<number | null>(0)
    const [totalTaxBenefit, setTotalTaxBenefit] = useState<number>(0)
    const [nameValid, setNameValid] = useState<boolean>(false)
    const [answer, setAnswer] = useState<string>('')
    const [rentAns, setRentAns] = useState<string>('')
    const [wipTargets, setWIPTargets] = useState<Array<APIt.TargetInput>>(goal?.tgts as Array<APIt.TargetInput>)

    const createNewBaseGoal = () => {
        return {
            name: name,
            sy: startYear,
            ey: endYear,
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
        let g: APIt.CreateGoalInput = createNewGoalInput()
        g.id = goal.id
        return g as APIt.UpdateGoalInput
    }

    const updateState = (cfs: Array<number>, g: APIt.CreateGoalInput, duration: number) => {
        let p = manualMode > 0 ? calculateManualPrice(g?.tgts as Array<APIt.TargetInput>)
            : calculatePrice(g?.cp as number, g?.chg as number, g.btr, g.sy, g.by)
        setPrice(p)
        let totalCost = goalType === APIt.GoalType.B ? -calculateSellPrice(p, g?.btr as number, g?.achg as number, duration) : 0
        cfs.forEach(cf => totalCost += cf)
        setTotalCost(Math.abs(totalCost))
        if (g.emi?.per && g.manual < 1) {
            setTotalTaxBenefit(calculatePrincipalTaxBenefit(goalType, p, g.emi.per, g.emi.rate, g.emi.dur,
                g.emi.ry, g.sy, g.ey, g.sa, g.btr as number, g.tdr, g.tdl))
        } else {
            setTotalTaxBenefit(calculateTotalTaxBenefit(g, duration))
        }
        setCFs([...cfs])
    }

    const calculateYearlyCFs = (duration: number, changeState: boolean = true) => {
        let g: APIt.CreateGoalInput = createNewGoalInput()
        let cfs = calculateCFs(g, duration)
        console.log("New cfs created: ", cfs)
        if (changeState) {
            if (g.emi?.per as number > 0 && manualMode < 1) setEndYear(g.sy + duration - 1)
            updateState(cfs, g, duration)
        }
        return cfs
    }

    const changeStartYear = (str: string) => {
        setStartYear(parseInt(str))
    }

    useEffect(() => {
        if (!loanPer) setEYOptions(initYearOptions(startYear, 80))
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
        if (sellAfter && sellAfter > 0 && oppCostCFs[sellAfter]) oppCostCFs[sellAfter] -= sellPrice
        return oppCostCFs
    }

    useEffect(() => {
        if (manualMode > 0 && endYear === startYear) setEndYear(startYear + 2)
        else if (manualMode < 1 && loanPer === 0 && goalType === APIt.GoalType.B) setEndYear(startYear)
    }, [manualMode, loanPer])

    const handleSubmit = () =>
        goal.id ? updateCallback(createUpdateGoalInput(), cfs)
            : addCallback(createNewGoalInput(), cfs)

    useEffect(() => setNameValid(name.length >= 3), [name])

    useEffect(() =>
        nameValid && price > 0 && cfs.length > 0 ? setSubmitDisabled(false) : setSubmitDisabled(true)
        , [nameValid, price, cfs])

    return (
        <div className="flex flex-col w-full h-full">
            <div className="flex flex-wrap justify-between items-center w-full">
                <SVGLogo />
                <TextInput
                    name="name"
                    pre={getGoalTypes()[goalType]}
                    placeholder="Goal Name"
                    value={name}
                    changeHandler={setName}
                    width="180px"
                />
                <div className="flex flex-col">
                    <label>In</label>
                    <CurrencyInput name="mainCurr" value={currency} changeHandler={setCurrency} />
                </div>
                <div className="mr-1 cursor-pointer border-0 outline-none focus:outline-none"
                    onClick={() => cancelCallback()}>
                    <SVGClose />
                </div>
            </div>

            {nameValid && <Fragment>
                <div className="flex justify-center w-full items-center mt-4">
                    <div className="mr-8">
                        <SelectInput name="sy"
                            pre="When?"
                            value={startYear}
                            changeHandler={changeStartYear}
                            options={syOptions}
                        />
                    </div>
                    {(manualMode > 0 || goalType !== APIt.GoalType.B) ? <SelectInput name="ey" pre="Pay Until" value={endYear}
                        changeHandler={changeEndYear} options={eyOptions} />
                        : <div className="flex flex-col">
                            <label>Pay Until</label>
                            <label className="font-semibold">{endYear}</label>
                        </div>}
                    {goalType !== APIt.GoalType.D &&
                        <div className="ml-8">
                            <RadialInput data={toStringArr(0, 20, 0.5)} step={0.5} value={buyTaxRate as number}
                                unit="%" pre="Taxes & Fees" label="of Cost" labelBottom={true}
                                post={`Total ${toCurrency(Math.round(price * (buyTaxRate as number / 100)), currency)}`}
                                changeHandler={setBuyTaxRate} />
                        </div>}
                </div>
                <div className="flex justify-center w-full">
                <Cost startingCost={startingPrice} startingCostHandler={setStartingPrice}
                    manualTargets={wipTargets} manualTargetsHandler={setWIPTargets} currency={currency}
                    costChgRate={priceChgRate} costChgRateHandler={setPriceChgRate} endYear={endYear}
                    manualMode={manualMode} manualModeHandler={setManualMode} startYear={startYear}
                    inputText="How Much Does it Cost?" showInputCondition={price < 500} rightPre="Cost"
                    title={`Cost${startYear > goal.by ? ` in ${startYear} ~ ${toCurrency(price, currency)}` : ''}`}
                    showRightCondition={startYear > goal.by} leftPre={startYear > goal.by ? 'Cost' : ''}
                    leftPost={startYear > goal.by ? `in ${goal.by}` : ''} leftMin={0} leftMax={2000000}
                    leftNote={buyTaxRate ? `including ${buyTaxRate}% taxes & fees` : ''} rightNote={`Yearly till ${startYear}`} />
                </div>
            </Fragment>}
            {nameValid && price > 0 && sellAfter && <div className="flex justify-center w-full">
                <Sell price={price} startYear={startYear} endYear={endYear} sellAfter={sellAfter}
                    sellPrice={sellPrice} sellPriceHandler={setSellPrice} sellAfterHandler={setSellAfter}
                    cfs={cfs} currency={currency} assetChgRate={assetChgRate as number} annualReturnPer={annualReturnPer as number}
                    assetChgRateHandler={setAssetChgRate} buyTaxRate={buyTaxRate as number}
                    annualReturnPerHandler={setAnnualReturnPer} />
            </div>}
            {nameValid && price > 0 && <Fragment>
                <div className="flex justify-center">
                    <TaxBenefit goalType={goalType} taxRate={taxRate} taxRateHandler={setTaxRate} currency={currency}
                        maxTaxDeduction={maxTaxDeduction} maxTaxDeductionHandler={setMaxTaxDeduction}
                        totalTaxBenefit={totalTaxBenefit} totalTaxBenefitHandler={setTotalTaxBenefit} />
                </div>
                {goal?.emi && <div className="flex w-full flex-wrap justify-around">
                    <EmiCost price={price} currency={currency} startYear={startYear} sellAfter={sellAfter}
                        repaymentSY={loanRepaymentSY ? loanRepaymentSY : startYear} endYear={endYear}
                        loanYears={loanYears as number} loanAnnualInt={loanIntRate as number} loanPer={loanPer as number}
                        loanBorrowAmt={getLoanBorrowAmt(price, buyTaxRate as number, loanPer as number)} loanAnnualIntHandler={setLoanIntRate}
                        loanPerHandler={setLoanPer} loanMonthsHandler={setLoanYears} repaymentSYHandler={setLoanRepaymentSY}
                        taxBenefitInt={taxBenefitInt as number} taxBenefitIntHandler={setTaxBenefitInt} taxRate={taxRate}
                        maxTaxDeductionInt={maxTaxDeductionInt as number} maxTaxDeductionIntHandler={setMaxTaxDeductionInt}
                    /></div>}
                <div className="flex flex-wrap justify-around items-center">
                    {sellAfter && <Fragment>
                        <AnnualAmt currency={currency} startYear={startYear} percentage={aiPer as number} chgRate={assetChgRate as number}
                            percentageHandler={setAIPer} annualSY={aiStartYear as number} annualSYHandler={setAIStartYear}
                            price={price} buyTaxRate={buyTaxRate as number} duration={getDuration(sellAfter, startYear, endYear)}
                            title="Yearly Income Potential through Rent, Dividend, etc" footer="Exclude taxes & fees" />
                        <AnnualAmt currency={currency} startYear={startYear} percentage={amCostPer as number} chgRate={assetChgRate as number}
                            percentageHandler={setAMCostPer} annualSY={amStartYear as number} annualSYHandler={setAMStartYear}
                            price={price} buyTaxRate={buyTaxRate as number} duration={getDuration(sellAfter, startYear, endYear)}
                            title="Yearly Fixes, Insurance, etc costs" footer="Include taxes & fees" />
                    </Fragment>}
                    <TimeCost amount={totalCost} currency={currency} workHoursPerWeek={60} annualWorkWeeks={47} />
                    <OppCost cfs={createOppCostCFs()} currency={currency} startYear={startYear}
                        duration={getDuration(sellAfter, startYear, endYear)} discountRate={oppDR} discountRateHandler={setOppDR} />
                    {sellAfter &&
                        <Section title="Instead, If You Rent" left={<div className="pl-4 pr-4">
                            <NumberInput name="rentAmt" pre="Yearly" post="Rent" value={rentAmt} changeHandler={setRentAmt}
                                min={1000} max={200000} step={500} currency={currency} />
                        </div>}
                            right={
                                <NumberInput name="rentChg" pre="Changes" value={rentChgPer} changeHandler={setRentChgPer}
                                    min={-10} max={10} step={0.5} unit="%" />}
                            toggle={
                                <HToggle rightText="Claim Tax Benefit" value={rentTaxBenefit as number} setter={setRentTaxBenefit} />
                            }
                            bottom={<div className="flex items-center">
                                <SVGBalance />
                                <label className="ml-2">{rentAns}</label>
                            </div>}
                        />}
                </div>
            </Fragment>}
            {nameValid && sellAfter && rentAmt > 0 && price > 0 &&
                <div className="mb-4">
                    <ExpandCollapse title="Buy v/s Rent for 20 Years" value={showRentChart}
                        handler={setShowRentChart} svg={<SVGBalance />} />
                    <BRComparison currency={currency} taxRate={taxRate} sellAfter={sellAfter}
                        discountRate={oppDR} allBuyCFs={initBuyCFsForComparison(20)}
                        rentTaxBenefit={rentTaxBenefit as number} rentTaxBenefitHandler={setRentTaxBenefit}
                        discountRateHandler={setOppDR} rentAmt={rentAmt} rentAmtHandler={setRentAmt}
                        rentChgPer={rentChgPer} rentChgPerHandler={setRentChgPer} answer={answer}
                        rentAns={rentAns} answerHandler={setAnswer} rentAnsHandler={setRentAns} showRentChart={showRentChart} />
                </div>}

            {nameValid && <Fragment>
                {price > 0 && <Fragment>
                    <ExpandCollapse title="Cash Flow Chart" value={showCFChart}
                        handler={setShowCFChart} svg={<SVGChart />} />
                    {showCFChart &&
                        <LineChart cfs={cfs} startYear={startYear} currency={currency} />
                    }
                </Fragment>}
                <div className="mt-8 flex justify-center">
                    <SelectInput name="imp"
                        pre="How Important is this Goal?"
                        value={impLevel}
                        changeHandler={setImpLevel}
                        options={getImpLevels()}
                    />
                </div>
                <ActionButtons submitDisabled={submitDisabled}
                    cancelHandler={cancelCallback} submitHandler={handleSubmit}
                    submitText={`${goal.id ? 'Update' : 'Create'} Goal`} />
            </Fragment>}
        </div>
    )
}