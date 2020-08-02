import React, { useState, useEffect, Fragment } from 'react'
import * as APIt from '../../api/goals'
//@ts-ignore
import { AwesomeButton } from "react-awesome-button"
import { initYearOptions, toCurrency, toStringArr, getRangeFactor, changeSelection } from '../utils'
import SVGClose from '../svgclose'
import SVGLogo from '../svglogo'
import Section from '../form/section'
import SelectInput from '../form/selectinput'
import RadialInput from '../form/radialinput'
import NumberInput from '../form/numberinput'
import ActionButtons from '../form/actionbuttons'
import ResultItem from '../calc/resultitem'
import { calculateTotalCP, calculateTotalCPTaxBenefit } from '../goals/cfutils'
import DynamicTgtInput from '../form/dynamictgtinput'
import { findEarliestFFYear } from './cfutils'
import FFResult from './ffresult'
import SVGChart from '../svgchart'
import ExpandCollapse from '../form/expandcollapse'
import LineChart from './linechart'

interface FFGoalProps {
    goal: APIt.CreateGoalInput
    totalSavings: number
    rr: Array<number>
    annualSavings: number
    savingsChgRate: number
    avgAnnualExp: number
    expChgRate: number
    ffYear: number | null
    ffAmt: number
    ffLeftOverAmt: number
    ffCfs: any
    mustCFs: Array<number>
    tryCFs: Array<number>
    mergedCfs: any
    pp: Object
    aaHandler: Function
    rrHandler: Function
    ffYearHandler: Function
    ffAmtHandler: Function
    ffLeftOverAmtHandler: Function
    ffCfsHandler: Function
    cancelCallback: Function
    addCallback: Function
    updateCallback: Function
}

export default function FFGoal({ goal, totalSavings, rr, annualSavings, savingsChgRate,
    avgAnnualExp, expChgRate, ffYear, ffAmt, ffLeftOverAmt, ffCfs, mustCFs, tryCFs, mergedCfs, pp,
    aaHandler, rrHandler, ffYearHandler, ffAmtHandler, ffLeftOverAmtHandler, ffCfsHandler,
    cancelCallback, addCallback, updateCallback }: FFGoalProps) {
    const [expenseBY, setExpenseBY] = useState<number>(goal.sy)
    const [expenseAfterFF, setExpenseAfterFF] = useState<number>(goal?.tbr as number)
    const [expenseChgRate, setExpenseChgRate] = useState<number>(goal?.btr as number)
    const [endYear, setEndYear] = useState<number>(goal.ey)
    const eyOptions = initYearOptions(goal.by + 30, 50)
    const [cyOptions, setCYOptions] = useState(initYearOptions(endYear - 30, 20))
    const [currency, setCurrency] = useState<string>(goal.ccy)
    const [taxRate, setTaxRate] = useState<number>(goal.tdr)
    const [leaveBehind, setLeaveBehind] = useState<number>(goal?.sa as number)
    const [carePremium, setCarePremium] = useState<number>(goal?.cp as number)
    const [carePremiumChgPer, setCarePremiumChgPer] = useState<number>(goal?.amper as number)
    const [carePremiumSY, setCarePremiumSY] = useState<number>(goal?.amsy as number)
    const [carePremiumDur, setCarePremiumDur] = useState<number>(goal?.achg as number)
    const [careTaxDedLimit, setCareTaxDedLimit] = useState<number>(goal.tdl)
    const [cpBY, setCPBY] = useState<number>(goal?.chg as number)
    const [totalCP, setTotalCP] = useState<number>(0)
    const [retirementIncomePer, setRetirementIncomePer] = useState<number>(goal?.aiper as number)
    const [retirementIncomeSY, setRetirementIncomeSY] = useState<number>(goal?.aisy as number)
    const [retirementIncome, setRetirementIncome] = useState<number>(goal?.tbi as number)
    const [ryOptions, setRYOptions] = useState(initYearOptions(endYear - 30, 15))
    const [totalTaxBenefit, setTotalTaxBenfit] = useState<number>(0)
    const [successionTaxRate, setSuccessionTaxRate] = useState<number>(goal?.dr as number)
    const [rangeFactor, setRangeFactor] = useState<number>(getRangeFactor(currency))
    const [gains, setGains] = useState<Array<APIt.TargetInput>>(goal.pg as Array<APIt.TargetInput>)
    const [losses, setLosses] = useState<Array<APIt.TargetInput>>(goal.pl as Array<APIt.TargetInput>)
    const nowYear = new Date().getFullYear()
    const [currentOrder, setCurrentOrder] = useState<number>(1)
    const [allInputDone, setAllInputDone] = useState<boolean>(goal.id ? true : false)
    const [btnClicked, setBtnClicked] = useState<boolean>(false)
    const [showCFChart, setShowCFChart] = useState<boolean>(true)

    const createGoal = () => {
        return {
            name: goal.name,
            sy: expenseBY,
            ey: endYear,
            by: goal.by,
            tdr: taxRate,
            tdl: careTaxDedLimit,
            ccy: currency,
            type: goal.type,
            imp: goal.imp,
            manual: 0,
            amsy: carePremiumSY,
            amper: carePremiumChgPer,
            achg: carePremiumDur,
            cp: carePremium,
            chg: cpBY,
            aisy: retirementIncomeSY,
            aiper: retirementIncomePer,
            tbi: retirementIncome,
            sa: leaveBehind,
            dr: successionTaxRate,
            pg: gains,
            pl: losses,
            tbr: expenseAfterFF,
            btr: expenseChgRate
        } as APIt.CreateGoalInput
    }

    const updateGoal = () => {
        let g: APIt.CreateGoalInput = createGoal()
        g.id = goal.id
        return g as APIt.UpdateGoalInput
    }

    useEffect(() => {
        if (!allInputDone) return
        let result = findEarliestFFYear(createGoal(), totalSavings, mergedCfs,
            annualSavings, savingsChgRate, ffYear ? ffYear : null, mustCFs, tryCFs, 
            avgAnnualExp, expChgRate, pp)
        ffAmtHandler(result.ffAmt)
        ffYearHandler(result.ffYear < 0 ? null : result.ffYear)
        ffLeftOverAmtHandler(result.leftAmt)
        ffCfsHandler(result.ffCfs)
        aaHandler(result.aa)
        rrHandler([...result.rr])
    }, [expenseBY, endYear, taxRate, careTaxDedLimit, carePremiumSY, carePremiumChgPer,
        carePremiumDur, carePremium, cpBY, retirementIncomeSY, retirementIncomePer,
        retirementIncome, leaveBehind, successionTaxRate, gains, losses, totalSavings, rr,
        annualSavings, expenseAfterFF, expenseChgRate, savingsChgRate, allInputDone, currentOrder])

    useEffect(() => {
        setCYOptions(initYearOptions(endYear - 30, 10))
        if (carePremiumSY > endYear - 20 || carePremiumSY < endYear - 30) setCarePremiumSY(endYear - 20)
    }, [endYear, carePremiumSY])

    useEffect(() => {
        setRYOptions(initYearOptions(endYear - 30, 15))
        if (retirementIncomeSY > endYear - 15 || retirementIncomeSY < endYear - 30) setRetirementIncomeSY(endYear - 20)
    }, [endYear, retirementIncomeSY])

    useEffect(() => {
        setExpenseBY(nowYear)
    }, [expenseAfterFF])

    useEffect(() => {
        setCPBY(nowYear)
    }, [carePremium])

    const handleSubmit = async() => {
        setBtnClicked(true)
        goal.id ? await updateCallback(updateGoal())
            : await addCallback(createGoal())
        setBtnClicked(false)
    }

    useEffect(() => {
        taxRate > 0 ? setTotalTaxBenfit(calculateTotalCPTaxBenefit(taxRate, careTaxDedLimit,
            carePremiumSY, carePremium, carePremiumChgPer, carePremiumDur, cpBY))
            : setTotalTaxBenfit(0)
    }, [taxRate, careTaxDedLimit, carePremiumSY, carePremium, carePremiumChgPer, carePremiumDur])

    useEffect(() => {
        carePremium > 0 ?
            setTotalCP(Math.round(calculateTotalCP(carePremiumSY, carePremium, carePremiumChgPer, carePremiumDur, cpBY)))
            : setTotalCP(0)
    }, [carePremiumSY, carePremium, carePremiumChgPer, carePremiumDur])

    const changeCurrency = (curr: string) => {
        setRangeFactor(Math.round(getRangeFactor(curr) / getRangeFactor(currency)))
        setCurrency(curr)
    }

    const handleNextStep = (count: number = 1) => {
        if (!allInputDone) {
            let co = currentOrder + count
            setCurrentOrder(co)
            if (co === 18) setAllInputDone(true)
        }
    }

    const buildChartCFs = (ffCfs: Object) => Object.values(ffCfs)

    return (
        <div className="flex flex-col w-full h-screen">
            <div className="container mx-auto overflow-y-auto flex flex-1 flex-col">
                <div className="flex justify-between items-center">
                    <SVGLogo />
                    <label className="font-semibold text-xl md:text-2xl">Hello Financial Freedom!</label>
                    <div className="mr-1 cursor-pointer border-0 outline-none focus:outline-none"
                        onClick={() => cancelCallback()}>
                        <SVGClose />
                    </div>
                </div>
                <div className="mt-4 flex justify-around items-end w-full">
                    <SelectInput name="ey"
                        info="Select the Year till You Want to Plan. After this Year, it is assumed that You will leave behind inheritance for Your Nominees, if any."
                        inputOrder={1}
                        currentOrder={currentOrder}
                        nextStepDisabled={false}
                        allInputDone={allInputDone}
                        nextStepHandler={handleNextStep}
                        pre="Plan Until" value={endYear}
                        changeHandler={(val: string) => changeSelection(val, setEndYear)} options={eyOptions} />
                    <SelectInput name="ccy" inputOrder={2} currentOrder={currentOrder}
                        nextStepDisabled={false}
                        allInputDone={allInputDone}
                        nextStepHandler={handleNextStep}
                        pre="Currency"
                        value={currency}
                        changeHandler={changeCurrency}
                        currency />
                </div>
                <div className="flex flex-wrap justify-around items-start w-full">
                    {((!allInputDone && currentOrder >= 3) || allInputDone) &&
                        <Section title='Expenses after Financial Freedom'
                            titleInfo="After You Achieve Financial Freedom, how much Money do You Need in Today's terms for Your Expenses? This will be used to derive the amount needed after Financial Freedom."
                            left={
                                <NumberInput name="currExpense" inputOrder={3} currentOrder={currentOrder}
                                    nextStepDisabled={expenseAfterFF === 0} allInputDone={allInputDone} nextStepHandler={handleNextStep}
                                    info="If You had already achieved Financial Freedom this year, How Much Money Would You Need for Your Living Expenses?"
                                    pre="Yearly" post='Expenses' note="In Today's Money"
                                    currency={currency} rangeFactor={rangeFactor} value={expenseAfterFF} changeHandler={setExpenseAfterFF} min={0} max={50000} step={100} width="120px" />
                            } right={
                                <NumberInput name="expChgRate" inputOrder={4} currentOrder={currentOrder}
                                    nextStepDisabled={false} allInputDone={allInputDone} nextStepHandler={handleNextStep}
                                    info="Rate at which Your Living Expenses increase every Year."
                                    pre="Expense" post="Increases" note='Yearly' unit="%"
                                    min={0} max={10} step={0.1} value={expenseChgRate} changeHandler={setExpenseChgRate} />
                            } bottom={
                                <NumberInput name="tr" inputOrder={5} currentOrder={currentOrder}
                                    nextStepDisabled={false} allInputDone={allInputDone} nextStepHandler={handleNextStep}
                                    info="Tax Rate, in case You have to pay tax for Investment Gains and Withdrawing from Retirement Accounts beyond the allowed Yearly Limit."
                                    pre="Tax" post="Rate" min={0} max={20} step={0.1}
                                    value={taxRate} changeHandler={setTaxRate} unit="%" />
                            } insideForm />}

                    {((!allInputDone && currentOrder >= 6) || allInputDone) &&
                        <Section title="Retirement Income Benefit (eg: Pension, Social Security, etc.)"
                            left={
                                <NumberInput name="ri" inputOrder={6} currentOrder={currentOrder}
                                    nextStepDisabled={false} allInputDone={allInputDone} nextStepHandler={handleNextStep}
                                    value={retirementIncome} changeHandler={setRetirementIncome} rangeFactor={rangeFactor}
                                    pre="Yearly" post="Benefit" min={0} max={50000} step={500} currency={currency} />
                            } right={
                                <NumberInput name="richgper" inputOrder={7} currentOrder={currentOrder}
                                    nextStepDisabled={false} allInputDone={allInputDone}
                                    nextStepHandler={handleNextStep} value={retirementIncomePer} changeHandler={setRetirementIncomePer}
                                    pre="Benefit" post="Increases" note="Yearly" min={0} max={3} step={0.1} unit="%" />
                            } bottom={
                                <SelectInput name="risy" inputOrder={8} currentOrder={currentOrder}
                                    nextStepDisabled={false} allInputDone={allInputDone} nextStepHandler={handleNextStep}
                                    info="When do You Plan to Receive the Benefit? Around 70 years of age is preferable for optimal benefit."
                                    value={retirementIncomeSY} options={ryOptions}
                                    pre="From" post="Onwards" changeHandler={(val: string) => {
                                        changeSelection(val, setRetirementIncomeSY)
                                    }} />
                            } insideForm />}

                    {(currency === 'USD' || currency === 'CAD' || currency === 'GBP') ?
                        ((!allInputDone && currentOrder >= 9) || allInputDone) &&
                        <Section title="Long-term Care Insurance"
                            titleInfo="About 70% individuals over age 65 need some form of living assistance for activities such as bathing, dressing, eating, toileting, walking, etc. 
                        It isn't covered by traditional health insurance or government-sponsored old-age care programs."
                            left={
                                <div className="flex flex-col items-center justify-center">
                                    <NumberInput name="cp" inputOrder={9} currentOrder={currentOrder}
                                        nextStepDisabled={false} allInputDone={allInputDone} nextStepHandler={handleNextStep}
                                        info="How much does annual insurance premium cost today? Actual price will be derived based on this price."
                                        value={carePremium} changeHandler={setCarePremium} rangeFactor={rangeFactor}
                                        pre="Yearly" post="Premium" note="In Today's Money" min={0} max={7000} step={100} currency={currency} />
                                    <div className="flex justify-between items-end w-full">
                                        <SelectInput name="cpsy" inputOrder={10} currentOrder={currentOrder}
                                            nextStepDisabled={false} allInputDone={allInputDone} nextStepHandler={handleNextStep}
                                            info="It may be a good option to buy this insurance when You are healthier (between 60 to 65 years of age) to get lower premiums."
                                            value={carePremiumSY} options={cyOptions}
                                            pre="Pay" post="Onwards" changeHandler={(val: string) => changeSelection(val, setCarePremiumSY)} />
                                        <SelectInput name="cpdur" inputOrder={11} currentOrder={currentOrder}
                                            nextStepDisabled={false}
                                            allInputDone={allInputDone}
                                            nextStepHandler={handleNextStep} value={carePremiumDur} options={initYearOptions(1, 15)}
                                            pre="For" post='Years' changeHandler={(val: string) => changeSelection(val, setCarePremiumDur)} />
                                    </div>
                                </div>
                            } right={
                                <RadialInput inputOrder={12} currentOrder={currentOrder}
                                    nextStepDisabled={false}
                                    allInputDone={allInputDone}
                                    nextStepHandler={handleNextStep} value={carePremiumChgPer} changeHandler={setCarePremiumChgPer}
                                    pre="Premium Changes" label="Yearly" labelBottom post={<ResultItem label='Total Premium' result={totalCP} currency={currency} />}
                                    data={toStringArr(0, 10, 0.5)} step={0.5} unit="%" />
                            } bottomLeft={currentOrder >= 14 && 'Max Yearly'} bottomRight={currentOrder >= 14 && 'Allowed'}
                            bottom={
                                <NumberInput name="maxTDL" inputOrder={13} currentOrder={currentOrder}
                                    nextStepDisabled={false} allInputDone={allInputDone}
                                    nextStepHandler={handleNextStep} pre="Tax" post="Deduction" currency={currency}
                                    value={careTaxDedLimit} changeHandler={setCareTaxDedLimit} width="80px"
                                    min={0} max={5000} step={500} rangeFactor={rangeFactor} note={
                                        <ResultItem label='Total Tax Benefit' currency={currency} result={totalTaxBenefit} />
                                    } />
                            } insideForm /> : !allInputDone && currentOrder === 9 && handleNextStep(5)}
                </div>
                <div className="flex flex-wrap justify-around items-start w-full">
                    {((!allInputDone && currentOrder >= 14) || allInputDone) &&
                        <Section title="Major Wealth Expected due to Gifts, Inheritance, Selling Property, etc." left={
                            <DynamicTgtInput inputOrder={14} currentOrder={currentOrder}
                                nextStepDisabled={false} allInputDone={allInputDone}
                                nextStepHandler={handleNextStep} startYear={goal.by} endYear={endYear} currency={currency}
                                rangeFactor={rangeFactor} tgts={gains} tgtsHandler={setGains} />
                        } insideForm footer="Exclude taxes & fees." />}
                    {((!allInputDone && currentOrder >= 15) || allInputDone) &&
                        <Section title="Major Losses Expected due to Selling Existing Assets, Investments, etc." left={
                            <DynamicTgtInput inputOrder={15} currentOrder={currentOrder}
                                nextStepDisabled={false} allInputDone={allInputDone}
                                nextStepHandler={handleNextStep} startYear={goal.by} endYear={endYear} currency={currency}
                                rangeFactor={rangeFactor} tgts={losses} tgtsHandler={setLosses} />
                        } insideForm footer="Include taxes & fees." />}
                    {((!allInputDone && currentOrder >= 16) || allInputDone) &&
                        <Section title={`Nominees Inherit At least ~ ${toCurrency(Math.round(leaveBehind * (1 - (successionTaxRate / 100))), currency)}`} left={
                            <NumberInput name="lb" inputOrder={16} currentOrder={currentOrder}
                                nextStepDisabled={false}
                                allInputDone={allInputDone}
                                nextStepHandler={handleNextStep} value={leaveBehind} changeHandler={setLeaveBehind} rangeFactor={rangeFactor}
                                min={0} max={500000} pre="Amount" currency={currency} step={1000} post={`in ${endYear + 1}`} />
                        } right={
                            <NumberInput name="str" inputOrder={17} currentOrder={currentOrder}
                                nextStepDisabled={false} allInputDone={allInputDone}
                                nextStepHandler={handleNextStep} pre="Inheritance" post="Tax Rate" min={0} max={20} step={0.1}
                                value={successionTaxRate} changeHandler={setSuccessionTaxRate} unit="%"
                                note={`Total ${toCurrency(Math.round(leaveBehind * (successionTaxRate / 100)), currency)}`} />
                        } insideForm />}
                </div>
                {((!allInputDone && currentOrder > 17) || allInputDone) &&
                    <div className="mt-2 md:mt-4 text-xl">
                        <ExpandCollapse title={`Total Savings Chart in ${currency}`} value={showCFChart}
                            handler={setShowCFChart} svg={<SVGChart />} />
                        {showCFChart &&
                            <LineChart cfs={buildChartCFs(ffCfs)} startYear={nowYear + 1} />
                        }
                    </div>}
            </div>
            {allInputDone &&
                <Fragment>
                    <FFResult endYear={endYear} ffAmt={ffAmt} ffLeftOverAmt={ffLeftOverAmt + leaveBehind} ffYear={ffYear} currency={currency} />
                    <ActionButtons submitDisabled={annualSavings === 0 && expenseAfterFF < 5000 || btnClicked} cancelDisabled={btnClicked}
                        cancelHandler={cancelCallback} submitHandler={handleSubmit} submitText={`${goal.id ? 'UPDATE' : 'CREATE'} TARGET`} />
                </Fragment>}
        </div>
    )
}