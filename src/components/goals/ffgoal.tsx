import React, { useState, Fragment, useEffect } from 'react'
import * as APIt from '../../api/goals'
//@ts-ignore
import { AwesomeButton } from "react-awesome-button"
import { initYearOptions, toCurrency, toStringArr } from '../utils'
import SVGClose from '../svgclose'
import SVGChart from '../svgchart'
import SVGLogo from '../svglogo'
import ExpandCollapse from '../form/expandcollapse'
import LineChart from './linechart'
import Section from '../form/section'
import CurrencyInput from '../form/currencyinput'
import SelectInput from '../form/selectinput'
import RadialInput from '../form/radialinput'
import NumberInput from '../form/numberinput'
import { getCompoundedIncome } from '../calc/finance'
import Cost from './cost'
import ActionButtons from '../form/actionbuttons'
import { calculateFFCFs } from '../goals/cfutils'
interface FFGoalProps {
    goal: APIt.CreateGoalInput
    cashFlows?: Array<number>
    cancelCallback: Function
    addCallback: Function
    updateCallback: Function
}

export default function FFGoal({ goal, cashFlows, cancelCallback, addCallback, updateCallback }: FFGoalProps) {
    const [startYear, setStartYear] = useState<number>(goal.sy)
    const [endYear, setEndYear] = useState<number>(goal.ey)
    const [syOptions] = useState(initYearOptions(goal.by + 1, 50))
    const [eyOptions, setEYOptions] = useState(initYearOptions(startYear + 30, 50))
    const [cyOptions, setCYOptions] = useState(initYearOptions(endYear - 30, 20))
    const [startingCost, setStartingCost] = useState<number>(goal?.cp as number)
    const [currency, setCurrency] = useState<string>(goal?.ccy)
    const [costChgRate, setCostChgRate] = useState<number>(goal?.chg as number)
    const [retirementCost, setRetirementCost] = useState<number>(0)
    const [showCFChart, setShowCFChart] = useState<boolean>(true)
    const [cfs, setCFs] = useState<Array<number>>(cashFlows ? cashFlows : [])
    const [submitDisabled, setSubmitDisabled] = useState<boolean>(true)
    const [taxRate, setTaxRate] = useState<number>(goal.tdr)
    const [leaveBehind, setLeaveBehind] = useState<number>(goal?.sa as number)
    const [savingsPer, setSavingsPer] = useState<number>(goal?.aiper as number)
    const [annualSavings, setAnnualSavings] = useState<number>(goal?.aisy as number)
    const [carePremium, setCarePremium] = useState<number>(goal?.dr as number)
    const [carePremiumChgPer, setCarePremiumChgPer] = useState<number>(goal?.amper as number)
    const [carePremiumSY, setCarePremiumSY] = useState<number>(goal?.amsy as number)
    const [carePremiumDur, setCarePremiumDur] = useState<number>(goal?.achg as number)
    const [careTaxDedLimit, setCareTaxDedLimit] = useState<number>(goal.tdl)
    const [manualMode, setManualMode] = useState<number>(goal.manual)
    const [wipTargets, setWIPTargets] = useState<Array<APIt.TargetInput>>(goal.tgts as Array<APIt.TargetInput>)

    const createGoal = () => {
        return {
            name: goal.name,
            sy: startYear,
            ey: endYear,
            by: goal.by,
            tdr: taxRate,
            tdl: careTaxDedLimit,
            ccy: currency,
            cp: startingCost,
            chg: costChgRate,
            type: goal.type,
            tgts: wipTargets,
            imp: goal.imp,
            manual: manualMode,
            aisy: annualSavings,
            aiper: savingsPer,
            amsy: carePremiumSY,
            amper: carePremiumChgPer,
            achg: carePremiumDur,
            dr: carePremium,
            sa: leaveBehind
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
        if (!startingCost) setRetirementCost(0)
        setRetirementCost(Math.round(getCompoundedIncome(costChgRate, startingCost, startYear - goal.by)))
    }, [startingCost, costChgRate, startYear])

    const handleSubmit = () =>
        goal.id ? updateCallback(updateGoal(), cfs)
            : addCallback(createGoal(), cfs)

    useEffect(() =>
        startingCost > 0 && retirementCost >= 5000 &&
            cfs.length > 0 ?
            setSubmitDisabled(false) : setSubmitDisabled(true)
        , [startingCost, retirementCost, cfs])


    useEffect(() => {
        setCFs([...calculateFFCFs(createGoal())])
    }, [startYear, endYear, taxRate, careTaxDedLimit, startingCost,
        costChgRate, wipTargets, annualSavings, savingsPer,
        carePremiumSY, carePremiumChgPer, carePremiumDur, carePremium, leaveBehind])

    const hasInput = (tgts: Array<APIt.TargetInput>) => {
        for (let i = 0; i < tgts.length; i++) {
            if (tgts[i].val) return true
        }
        return false
    }

    return (
        <Fragment>
            <div className="flex justify-between items-center">
                <SVGLogo />
                <label className="font-semibold text-xl md:text-2xl">Hello Financial Freedom!</label>
                <div className="mr-1 cursor-pointer border-0 outline-none focus:outline-none"
                    onClick={() => cancelCallback()}>
                    <SVGClose />
                </div>
            </div>
            <div className="mt-4 flex justify-around items-center w-full">
                <SelectInput name="sy" pre="Achieve By" post="Or Earlier"
                    value={startYear} changeHandler={changeStartYear} options={syOptions} />
                <SelectInput name="ey" pre="Plan Until" value={endYear}
                    changeHandler={changeEndYear} options={eyOptions} />
                <div className="flex flex-col">
                    <label>Currency</label>
                    <CurrencyInput name="mainCurr" value={currency} changeHandler={setCurrency} />
                </div>
            </div>
            <Cost startingCost={annualSavings} startingCostHandler={setAnnualSavings}
                manualTargets={wipTargets} manualTgtMin={-50000} manualTargetsHandler={setWIPTargets} currency={currency}
                costChgRate={savingsPer} costChgRateHandler={setSavingsPer} endYear={startYear - 1}
                manualMode={manualMode} manualModeHandler={setManualMode} startYear={goal.by}
                inputText="How Much Do You Save?" showInputCondition={((manualMode < 1 && annualSavings === 0) || (manualMode > 0 && !hasInput(wipTargets)))} rightPre="Savings" rightNote={`Yearly till ${startYear - 1}`}
                title={manualMode > 0 ? `Annual Savings from ${goal.by} to ${startYear - 1}`
                    : `Annual Savings in ${startYear - 1} ~ ${toCurrency(Math.round(getCompoundedIncome(savingsPer, annualSavings, startYear - 1 - goal.by)), currency)}`}
                showRightCondition={true} leftPre='Savings' leftPost={`in ${goal.by}`} leftMin={-50000} leftMax={200000}
                footer={`${annualSavings === 0 ? ' Include retirement fund contribution. Deduct taxes & all expenses including insurance premiums.' : `${startYear - 1} may be the last year for work income given You want to be Financially Free before ${startYear}.`}`} />

            <div className="flex flex-wrap justify-around w-full">
                <Section inputText={`Living Cost after Financial Freedom`} showInputCondition={((manualMode < 1 && annualSavings != 0) || (manualMode > 0 && hasInput(wipTargets))) && startingCost < 5000} title={
                    `Living Cost${startYear > goal.by ? ` in ${startYear} ~ ${toCurrency(retirementCost, currency)}` : ''}`}
                    left={
                        <NumberInput name="currExpense" pre='Yearly' post='Cost' note={`In Today's Money`}
                            currency={currency} value={startingCost} changeHandler={setStartingCost} min={0} max={200000} step={1000} width="120px" />
                    } right={
                        <NumberInput name="priceChgRate" pre="Cost" post="Changes" note='Yearly' unit="%"
                            min={0} max={10} step={0.1} value={costChgRate} changeHandler={setCostChgRate} />
                    } bottomLeft="Assume" bottomRight="Yearly" bottom={
                        <NumberInput name="tr" pre="Income" post="Tax Rate" min={0} max={20} step={0.1}
                            value={taxRate} changeHandler={setTaxRate} unit="%" />
                    }
                    footer={`Use Savings to meet expenses from ${startYear} to ${endYear}. You may have to pay income tax on retirement account withdrawals or gains from selling investments.`} />
                <Section title="Long-term Care Insurance" left={
                    <div className="flex flex-col items-center justify-center">
                        <NumberInput name="cp" value={carePremium} changeHandler={setCarePremium}
                            pre="Yearly" post="Premium" min={0} max={10000} step={100} />
                        <div className="flex justify-between items-start w-full">
                            <SelectInput name="cpsy" value={carePremiumSY} options={cyOptions}
                                pre="Pay" post="Onwards" changeHandler={changeCarePremiumYear} />
                            <SelectInput name="cpdur" value={carePremiumDur} options={initYearOptions(5, 15)}
                                pre="For" post='Years' changeHandler={changeCarePremiumDur} />
                        </div>
                    </div>
                } right={
                    <RadialInput value={carePremiumChgPer} changeHandler={setCarePremiumChgPer}
                        pre="Premium Changes" label="Yearly"
                        data={toStringArr(0, 10, 0.5)} step={0.5} unit="%" />
                } bottomLeft="Max Yearly" bottomRight="Allowed" bottom={
                    <NumberInput name="maxTDL" pre="Tax" post="Deduction"
                        value={careTaxDedLimit} changeHandler={setCareTaxDedLimit}
                        min={0} max={5000} step={500} note={`Total ${toCurrency(carePremium, currency)}`} />
                } />
            </div>
            <div className="mt-4 flex justify-center">
                <NumberInput name="lb" value={leaveBehind} changeHandler={setLeaveBehind}
                    min={0} max={900000} pre="Leave Behind" note="For Loved Ones" currency={currency} step={1000} />
            </div>
            <Fragment>
                <ExpandCollapse title="Cash Flow Chart" value={showCFChart}
                    handler={setShowCFChart} svg={<SVGChart />} />
                {showCFChart && <Fragment>
                    <p className="text-center text-base mt-4">Negative sign indicates You Pay, while Positive sign indicates You Receive</p>
                    <LineChart cfs={cfs} startYear={goal.by} currency={currency} />
                </Fragment>}
            </Fragment>
            <ActionButtons submitDisabled={submitDisabled}
                cancelHandler={cancelCallback} submitHandler={handleSubmit}
                submitText={`${goal.id ? 'Update' : 'Create'} Goal`} />
        </Fragment>
    )
}