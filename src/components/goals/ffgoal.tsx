import React, { useState, useEffect } from 'react'
import * as APIt from '../../api/goals'
//@ts-ignore
import { AwesomeButton } from "react-awesome-button"
import { initYearOptions, toCurrency, toStringArr, getRangeFactor } from '../utils'
import SVGClose from '../svgclose'
import SVGLogo from '../svglogo'
import Section from '../form/section'
import CurrencyInput from '../form/currencyinput'
import SelectInput from '../form/selectinput'
import RadialInput from '../form/radialinput'
import NumberInput from '../form/numberinput'
import { getCompoundedIncome } from '../calc/finance'
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
    const [startYear, setStartYear] = useState<number>(goal.sy)
    const [endYear, setEndYear] = useState<number>(goal.ey)
    const [syOptions] = useState(initYearOptions(goal.by, 50))
    const [eyOptions, setEYOptions] = useState(initYearOptions(startYear + 30, 50))
    const [cyOptions, setCYOptions] = useState(initYearOptions(endYear - 30, 20))
    const [currency, setCurrency] = useState<string>(goal?.ccy)
    const [retirementCost, setRetirementCost] = useState<number>(0)
    const [submitDisabled, setSubmitDisabled] = useState<boolean>(true)
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

    const createGoal = () => {
        return {
            name: goal.name,
            sy: startYear,
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

    const changeStartYear = (str: string) => setStartYear(parseInt(str))

    const changeCarePremiumYear = (str: string) => setCarePremiumSY(parseInt(str))

    const changeCarePremiumDur = (str: string) => setCarePremiumDur(parseInt(str))

    useEffect(() => {
        setEYOptions(initYearOptions(startYear + 30, 50))
        if (startYear > endYear - 30) setEndYear(startYear + 30)
        setCYOptions(initYearOptions(endYear - 30, 10))
        if (carePremiumSY > endYear - 20 || carePremiumSY < endYear - 30) setCarePremiumSY(endYear - 20)
    }, [startYear, endYear, carePremiumSY])

    useEffect(() => {
        if (!expense) {
            setRetirementCost(0)
            return
        }
        if (startYear <= nowYear) setRetirementCost(expense)
        else setRetirementCost(Math.round((getCompoundedIncome(expenseChgRate, expense, startYear - nowYear))))
    }, [expense, expenseChgRate, startYear])

    const handleSubmit = () =>
        goal.id ? updateCallback(updateGoal())
            : addCallback(createGoal())

    useEffect(() =>
        retirementCost >= 5000 ?
            setSubmitDisabled(false) : setSubmitDisabled(true)
        , [retirementCost])


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
                    <SelectInput name="sy" pre="Achieve By" post="Or Earlier"
                        value={startYear} changeHandler={changeStartYear} options={syOptions} />
                    <SelectInput name="ey" pre="Plan Until" value={endYear}
                        changeHandler={changeEndYear} options={eyOptions} />
                    <div className="flex flex-col">
                        <label>Currency</label>
                        <CurrencyInput name="mainCurr" value={currency} changeHandler={changeCurrency} />
                    </div>
                </div>
                <div className="flex flex-wrap justify-around w-full">
                    <Section title="Total Savings Accumulated" left={
                        <NumberInput name="ts" value={totalSavings} pre="By End" min={-100000} max={900000}
                            post={`of ${nowYear}`} changeHandler={totalSavingsHandler} step={500} currency={currency}
                            rangeFactor={rangeFactor} />
                    } right={
                        <NumberInput name="dr" value={oppDR} unit="%" pre="Investment" min={0} max={15}
                            post="Earns" changeHandler={oppDRHandler} note="After taxes & fees" step={0.1} />
                    } footer="Total Savings includes cash, deposits, gold, stocks, bonds, etc. Deduct money owed on credit cards, loans, etc." />
                    <Cost startingCost={annualSavings} startingCostHandler={annualSavingsHandler} rangeFactor={rangeFactor}
                        currency={currency} costChgRate={savingsChgRate} costChgRateHandler={savingsChgRateHandler} endYear={startYear - 1}
                        startYear={nowYear} inputText="How Much Can You Save?" showInputCondition={annualSavings === 0}
                        rightPre="Savings" rightNote='Yearly' title={startYear - 1 > nowYear ?
                            `Annual Savings in ${startYear - 1} ~ ${toCurrency(Math.round(getCompoundedIncome(savingsChgRate, annualSavings, startYear - nowYear - 1)), currency)}`
                            : 'Annual Savings'}
                        showRightCondition leftPre='Savings' leftPost={`in ${nowYear}`} leftMin={-50000} leftMax={200000}
                        footer={`${annualSavings === 0 ? ' Include retirement fund contribution. Deduct taxes & all expenses including insurance premiums.' : `${startYear - 1} may be the last year for work income given You want to be Financially Free before ${startYear}.`}`} />
                    <Section inputText={`Living Cost after Financial Freedom`} showInputCondition={annualSavings != 0 && retirementCost < 5000} title={
                        `Withdraw Savings ~ ${toCurrency(Math.round(retirementCost * (1 + taxRate / 100)), currency)} in ${startYear}`}
                        left={
                            <NumberInput name="currExpense" pre='Yearly' post='Cost' note={`In Today's Money`}
                                currency={currency} rangeFactor={rangeFactor} value={expense} changeHandler={expenseHandler} min={0} max={100000} step={1000} width="120px" />
                        } right={
                            <NumberInput name="priceChgRate" pre="Cost" post="Changes" note='Yearly' unit="%"
                                min={0} max={10} step={0.1} value={expenseChgRate} changeHandler={expenseChgRateHandler} />
                        } bottom={
                            <NumberInput name="tr" pre="Income" post="Tax Rate" min={0} max={20} step={0.1}
                                value={taxRate} changeHandler={setTaxRate} unit="%" note="On Withdrawals And Gains" />
                        } />
                    <Section title="Long-term Care Insurance" left={
                        <div className="flex flex-col items-center justify-center">
                            <NumberInput name="cp" value={carePremium} changeHandler={setCarePremium} rangeFactor={rangeFactor}
                                pre="Yearly" post="Premium" min={0} max={10000} step={100} currency={currency} />
                            <div className="flex justify-between items-start w-full">
                                <SelectInput name="cpsy" value={carePremiumSY} options={cyOptions}
                                    pre="Pay" post="Onwards" changeHandler={changeCarePremiumYear} />
                                <SelectInput name="cpdur" value={carePremiumDur} options={initYearOptions(5, 15)}
                                    pre="For" post='Years' changeHandler={changeCarePremiumDur} />
                            </div>
                        </div>
                    } right={
                        <RadialInput value={carePremiumChgPer} changeHandler={setCarePremiumChgPer}
                            pre="Premium Changes" label="Yearly" labelBottom post={`Total ${toCurrency(totalCP, currency)}`}
                            data={toStringArr(0, 10, 0.5)} step={0.5} unit="%" />
                    } bottomLeft={`${taxRate > 0 ? 'Max Yearly' : ''}`}
                        bottomRight={`${taxRate > 0 ? 'Allowed' : ''}`}
                        bottom={taxRate > 0 &&
                            <NumberInput name="maxTDL" pre="Tax" post="Deduction" currency={currency}
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
                        <NumberInput name="lb" value={leaveBehind} changeHandler={setLeaveBehind} rangeFactor={rangeFactor}
                            min={0} max={500000} pre="Amount" currency={currency} step={1000} note={`in ${endYear + 1}`} />
                    } right={
                        <NumberInput name="str" pre="Inheritance" post="Tax Rate" min={0} max={20} step={0.1}
                            value={successionTaxRate} changeHandler={setSuccessionTaxRate} unit="%"
                            note={`Total ${toCurrency(Math.round(leaveBehind * (successionTaxRate / 100)), currency)}`} />
                    } />
                </div>
            </div>

            <ActionButtons submitDisabled={submitDisabled}
                cancelHandler={cancelCallback} submitHandler={handleSubmit}
                submitText='Calculate' />
        </div>
    )
}