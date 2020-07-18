import React, { useState, useEffect } from 'react'
import * as APIt from '../../api/goals'
//@ts-ignore
import { AwesomeButton } from "react-awesome-button"
import { initYearOptions, toCurrency, toStringArr, getRangeFactor } from '../utils'
import SVGClose from '../svgclose'
import SVGLogo from '../svglogo'
import Section from '../form/section'
import SelectInput from '../form/selectinput'
import RadialInput from '../form/radialinput'
import NumberInput from '../form/numberinput'
import Cost from './cost'
import ActionButtons from '../form/actionbuttons'
import ResultItem from '../calc/resultitem'
import { calculateTotalCP, calculateTotalCPTaxBenefit } from '../goals/cfutils'
import DynamicTgtInput from '../form/dynamictgtinput'
interface FFGoalProps {
    goal: APIt.CreateGoalInput
    totalSavings: number
    oppDR: number
    expense: number
    expenseChgRate: number
    annualSavings: number
    savingsChgRate: number
    totalSavingsHandler: Function
    oppDRHandler: Function
    expenseHandler: Function
    expenseChgRateHandler: Function
    annualSavingsHandler: Function
    savingsChgRateHandler: Function
    cancelCallback: Function
    addCallback: Function
    updateCallback: Function
}

export default function FFGoal({ goal, totalSavings, oppDR, expense, expenseChgRate, annualSavings, savingsChgRate, totalSavingsHandler, oppDRHandler, expenseHandler, expenseChgRateHandler,
    annualSavingsHandler, savingsChgRateHandler, cancelCallback, addCallback, updateCallback }: FFGoalProps) {
    const [expenseBY, setExpenseBY] = useState<number>(goal.sy)
    const [endYear, setEndYear] = useState<number>(goal.ey)
    const eyOptions = initYearOptions(goal.by + 30, 50)
    const [cyOptions, setCYOptions] = useState(initYearOptions(endYear - 30, 20))
    const [currency, setCurrency] = useState<string>(goal?.ccy)
    const [taxRate, setTaxRate] = useState<number>(goal.tdr)
    const [leaveBehind, setLeaveBehind] = useState<number>(goal?.sa as number)
    const [carePremium, setCarePremium] = useState<number>(goal?.dr as number)
    const [carePremiumChgPer, setCarePremiumChgPer] = useState<number>(goal?.amper as number)
    const [carePremiumSY, setCarePremiumSY] = useState<number>(goal?.amsy as number)
    const [carePremiumDur, setCarePremiumDur] = useState<number>(goal?.achg as number)
    const [careTaxDedLimit, setCareTaxDedLimit] = useState<number>(goal.tdl)
    const [totalCP, setTotalCP] = useState<number>(0)
    const [totalTaxBenefit, setTotalTaxBenfit] = useState<number>(0)
    const [successionTaxRate, setSuccessionTaxRate] = useState<number>(goal?.btr as number)
    const [rangeFactor, setRangeFactor] = useState<number>(getRangeFactor(currency))
    const [gains, setGains] = useState<Array<APIt.TargetInput>>(goal.pg as Array<APIt.TargetInput>)
    const [losses, setLosses] = useState<Array<APIt.TargetInput>>(goal.pl as Array<APIt.TargetInput>)
    const nowYear = new Date().getFullYear()
    const [currentOrder, setCurrentOrder] = useState<number>(1)
    const [allInputDone, setAllInputDone] = useState<boolean>(goal.id ? true : false)
    const [btnClicked, setBtnClicked] = useState<boolean>(false)

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
            dr: carePremium,
            sa: leaveBehind,
            btr: successionTaxRate,
            pg: gains,
            pl: losses
        } as APIt.CreateGoalInput
    }

    const updateGoal = () => {
        let g: APIt.CreateGoalInput = createGoal()
        g.id = goal.id
        return g as APIt.UpdateGoalInput
    }

    const changeEndYear = (str: string) => setEndYear(parseInt(str))

    const changeCarePremiumYear = (str: string) => setCarePremiumSY(parseInt(str))

    const changeCarePremiumDur = (str: string) => setCarePremiumDur(parseInt(str))

    useEffect(() => {
        setCYOptions(initYearOptions(endYear - 30, 10))
        if (carePremiumSY > endYear - 20 || carePremiumSY < endYear - 30) setCarePremiumSY(endYear - 20)
    }, [endYear, carePremiumSY])

    useEffect(() => {
        setExpenseBY(nowYear)
    }, [expense])

    const handleSubmit = () => {
        goal.id ? updateCallback(updateGoal())
        : addCallback(createGoal())
        setBtnClicked(true)
    }
        
    useEffect(() => {
        taxRate > 0 ? setTotalTaxBenfit(calculateTotalCPTaxBenefit(taxRate, careTaxDedLimit,
            carePremiumSY, carePremium, carePremiumChgPer, carePremiumDur))
            : setTotalTaxBenfit(0)
    }, [taxRate, careTaxDedLimit, carePremiumSY, carePremium, carePremiumChgPer, carePremiumDur])

    useEffect(() => {
        carePremium > 0 ? setTotalCP(Math.round(calculateTotalCP(carePremiumSY, carePremium, carePremiumChgPer, carePremiumDur)))
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
            if (co === 19) setAllInputDone(true)
        }
    }

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
                <div className="mt-4 flex justify-around items-start w-full">
                    <SelectInput name="ey"
                        inputOrder={1}
                        currentOrder={currentOrder}
                        nextStepDisabled={false}
                        allInputDone={allInputDone}
                        nextStepHandler={handleNextStep}
                        pre="Plan Until" value={endYear}
                        changeHandler={changeEndYear} options={eyOptions} />
                    <SelectInput name="ccy" inputOrder={2} currentOrder={currentOrder}
                        nextStepDisabled={false}
                        allInputDone={allInputDone}
                        nextStepHandler={handleNextStep}
                        pre="Currency"
                        value={currency}
                        changeHandler={changeCurrency}
                        currency
                    />
                </div>
                <div className="flex flex-wrap justify-around w-full">
                    <Section title="Total Savings Accumulated" left={
                        <NumberInput name="ts" inputOrder={3} currentOrder={currentOrder}
                            nextStepDisabled={false}
                            allInputDone={allInputDone}
                            nextStepHandler={handleNextStep}
                            value={totalSavings} pre="By End" min={-100000} max={900000}
                            post={`of ${nowYear}`} changeHandler={totalSavingsHandler} step={500} currency={currency}
                            rangeFactor={rangeFactor} />
                    } right={
                        <NumberInput name="dr" inputOrder={4} currentOrder={currentOrder}
                            nextStepDisabled={false}
                            allInputDone={allInputDone}
                            nextStepHandler={handleNextStep} value={oppDR} unit="%" pre="Investment" min={0} max={15}
                            post="Earns" changeHandler={oppDRHandler} note="After taxes & fees" step={0.1} />
                    } footer="Total Savings includes cash, deposits, gold, stocks, bonds, etc. Deduct money owed on credit cards, loans, etc." />
                    <Cost startingCost={annualSavings} startingCostHandler={annualSavingsHandler} rangeFactor={rangeFactor} manualMode={0}
                        currency={currency} costChgRate={savingsChgRate} costChgRateHandler={savingsChgRateHandler} inputText="How Much Can You Save?"
                        showInputCondition={annualSavings === 0} rightPre="Savings" rightNote='Yearly' title='Annual Savings'
                        showRightCondition leftPre='Savings' leftPost={`in ${nowYear}`} leftMin={-50000} leftMax={200000}
                        footer='Include retirement fund contribution. Deduct taxes & all expenses including insurance premiums.'
                        inputOrder={5} currentOrder={currentOrder} nextStepDisabled={false}
                        nextStepHandler={handleNextStep} allInputDone={allInputDone} />
                    <Section inputText={`How Much Do You Need for Annual Living Expenses After Financial Freedom?`} showInputCondition={annualSavings != 0 && expense < 5000} title='Annual Living Cost after Financial Freedom'
                        left={
                            <NumberInput name="currExpense" inputOrder={7} currentOrder={currentOrder}
                                nextStepDisabled={false}
                                allInputDone={allInputDone}
                                nextStepHandler={handleNextStep} pre="In Today's" post='Money'
                                currency={currency} rangeFactor={rangeFactor} value={expense} changeHandler={expenseHandler} min={0} max={100000} step={1000} width="120px" />
                        } right={
                            <NumberInput name="expChgRate" inputOrder={8} currentOrder={currentOrder}
                                nextStepDisabled={false}
                                allInputDone={allInputDone}
                                nextStepHandler={handleNextStep} pre="Expense" post="Changes" note='Yearly' unit="%"
                                min={0} max={10} step={0.1} value={expenseChgRate} changeHandler={expenseChgRateHandler} />
                        } bottom={
                            <NumberInput name="tr" inputOrder={9} currentOrder={currentOrder}
                                nextStepDisabled={false}
                                allInputDone={allInputDone}
                                nextStepHandler={handleNextStep} pre="Income" post="Tax Rate" min={0} max={20} step={0.1}
                                value={taxRate} changeHandler={setTaxRate} unit="%" note="On Withdrawals And Gains" />
                        } />
                    <Section title="Long-term Care Insurance" left={
                        <div className="flex flex-col items-center justify-center">
                            <NumberInput name="cp" inputOrder={10} currentOrder={currentOrder}
                                nextStepDisabled={false}
                                allInputDone={allInputDone}
                                nextStepHandler={handleNextStep} value={carePremium} changeHandler={setCarePremium} rangeFactor={rangeFactor}
                                pre="Yearly" post="Premium" min={0} max={10000} step={100} currency={currency} />
                            <div className="flex justify-between items-start w-full">
                                <SelectInput name="cpsy" inputOrder={11} currentOrder={currentOrder}
                                    nextStepDisabled={false}
                                    allInputDone={allInputDone}
                                    nextStepHandler={handleNextStep} value={carePremiumSY} options={cyOptions}
                                    pre="Pay" post="Onwards" changeHandler={changeCarePremiumYear} />
                                <SelectInput name="cpdur" inputOrder={12} currentOrder={currentOrder}
                                    nextStepDisabled={false}
                                    allInputDone={allInputDone}
                                    nextStepHandler={handleNextStep} value={carePremiumDur} options={initYearOptions(5, 15)}
                                    pre="For" post='Years' changeHandler={changeCarePremiumDur} />
                            </div>
                        </div>
                    } right={
                        <RadialInput inputOrder={13} currentOrder={currentOrder}
                            nextStepDisabled={false}
                            allInputDone={allInputDone}
                            nextStepHandler={handleNextStep} value={carePremiumChgPer} changeHandler={setCarePremiumChgPer}
                            pre="Premium Changes" label="Yearly" labelBottom post={`Total ${toCurrency(totalCP, currency)}`}
                            data={toStringArr(0, 10, 0.5)} step={0.5} unit="%" />
                    } bottomLeft={`${taxRate > 0 ? 'Max Yearly' : ''}`}
                        bottomRight={`${taxRate > 0 ? 'Allowed' : ''}`}
                        bottom={
                            <NumberInput name="maxTDL" inputOrder={14} currentOrder={currentOrder}
                                nextStepDisabled={false}
                                allInputDone={allInputDone}
                                nextStepHandler={handleNextStep} pre="Tax" post="Deduction" currency={currency}
                                value={careTaxDedLimit} changeHandler={setCareTaxDedLimit} width="80px"
                                min={0} max={5000} step={500} rangeFactor={rangeFactor} note={
                                    <ResultItem label='Total Tax Benefit' currency={currency} result={totalTaxBenefit} />
                                } />
                        } />
                </div>
                <div className="flex flex-wrap justify-around w-full">
                    <Section title="Potential Gains due to Inheritance, Selling Assets or Investments, etc." left={
                        <DynamicTgtInput startYear={goal.by} endYear={endYear} currency={currency}
                            rangeFactor={rangeFactor} tgts={gains} tgtsHandler={setGains} />
                    } right={<div />} footer="Exclude taxes & fees." />
                    <Section title="Potential Losses due to Selling Assets, Investments, etc." left={
                        <DynamicTgtInput startYear={goal.by} endYear={endYear} currency={currency}
                            rangeFactor={rangeFactor} tgts={losses} tgtsHandler={setLosses} />
                    } right={<div />} footer="Include taxes & fees." />
                    <Section title={`Loved Ones Get At least ~ ${toCurrency(Math.round(leaveBehind * (1 - (successionTaxRate / 100))), currency)}`} left={
                        <NumberInput name="lb" inputOrder={17} currentOrder={currentOrder}
                            nextStepDisabled={false}
                            allInputDone={allInputDone}
                            nextStepHandler={handleNextStep} value={leaveBehind} changeHandler={setLeaveBehind} rangeFactor={rangeFactor}
                            min={0} max={500000} pre="Amount" currency={currency} step={1000} note={`in ${endYear + 1}`} />
                    } right={
                        <NumberInput name="str" inputOrder={18} currentOrder={currentOrder}
                            nextStepDisabled={false}
                            allInputDone={allInputDone}
                            nextStepHandler={handleNextStep} pre="Inheritance" post="Tax Rate" min={0} max={20} step={0.1}
                            value={successionTaxRate} changeHandler={setSuccessionTaxRate} unit="%"
                            note={`Total ${toCurrency(Math.round(leaveBehind * (successionTaxRate / 100)), currency)}`} />
                    } />
                </div>
            </div>

            <ActionButtons submitDisabled={annualSavings === 0 && expense < 5000 || btnClicked} cancelDisabled={btnClicked}
                cancelHandler={cancelCallback} submitHandler={handleSubmit}
                submitText='Calculate' />
        </div>
    )
}