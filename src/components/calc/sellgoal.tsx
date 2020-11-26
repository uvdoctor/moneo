import { useEffect } from "react";

useEffect(() => {
  () => {};
});/*import React, { useState, useEffect } from 'react'
import TextInput from '../form/textinput'
import SelectInput from '../form/selectinput'
import NumberInput from '../form/numberinput'
import * as APIt from '../../api/goals'
import { initYearOptions, getRangeFactor } from '../utils'
import CurrencyInput from '../form/currencyinput'
import BRComparison from './brcomparison'
import Section from '../form/section'
import SVGClose from '../svgclose'
import { calculateSellCFs } from '../goals/cfutils'
import { getGoalTypes } from '../goals/goalutils'
//@ts-ignore
import { AwesomeButton } from "react-awesome-button"
import SVGLogo from '../svglogo'
import AnnualAmt from '../goals/annualamt'
import ExpandCollapse from '../form/expandcollapse'
import SVGBalance from './svgbalance'
import ActionButtons from '../form/actionbuttons'
import OppCost from './oppcost'
import HToggle from '../horizontaltoggle'

interface SellGoalProps {
    goal: APIt.CreateGoalInput
    cashFlows?: Array<number>
    cancelCallback: Function
    addCallback: Function
    updateCallback: Function
}

export default function SellGoal({ goal, cashFlows, cancelCallback, addCallback, updateCallback }: SellGoalProps) {
    const [boughtYear, setBoughtYear] = useState<number>(0)
    const [sellYear, setSellYear] = useState<number>(0)
    const [cost, setCost] = useState<number>(goal?.cp as number)
    const [byOptions] = useState(initYearOptions(goal.by, -50))
    const [currentMarketPrice, setCurrentMarketPrice] = useState<number>(0)
    const [currency, setCurrency] = useState<string>(goal?.ccy)
    const [name, setName] = useState<string>(goal?.name)
    const [assetChgRate, setAssetChgRate] = useState<number | null | undefined>(goal?.achg)
    const [amCostPer, setAMCostPer] = useState<number | null | undefined>(goal?.amper)
    const [amStartYear, setAMStartYear] = useState<number | null | undefined>(goal?.amsy)
    const [aiPer, setAIPer] = useState<number | null | undefined>(goal?.aiper)
    const [aiStartYear, setAIStartYear] = useState<number | null | undefined>(goal?.aisy)
    const [oppDR, setOppDR] = useState<number>(goal?.dr ? goal.dr : 6)
    const [rentTaxBenefit, setRentTaxBenefit] = useState<number | null | undefined>(goal?.tbr)
    const [showRentChart, setShowRentChart] = useState<boolean>(true)
    const goalType = goal?.type as APIt.GoalType
    const [cfs, setCFs] = useState<Array<number>>(cashFlows ? cashFlows : [])
    const [submitDisabled, setSubmitDisabled] = useState<boolean>(true)
    const [rentAmt, setRentAmt] = useState<number>(0)
    const [rentChgPer, setRentChgPer] = useState<number>(5)
    const [nameValid, setNameValid] = useState<boolean>(false)
    const [answer, setAnswer] = useState<string>('')
    const [rentAns, setRentAns] = useState<string>('')
    const [rangeFactor, setRangeFactor] = useState<number>(getRangeFactor(currency))
    const typesList = getGoalTypes()

    const changeBoughtYear = (str: string) => {
        setBoughtYear(parseInt(str))
    }

    const changeSellYear = (str: string) => {
        setSellYear(parseInt(str))
    }

    useEffect(() => setNameValid(name.length >= 3), [name])

    useEffect(() =>
        nameValid && currentMarketPrice > 0 && cfs.length > 0 ? setSubmitDisabled(false) : setSubmitDisabled(true)
        , [nameValid, currentMarketPrice, cfs])

    const handleSubmit = () =>
        goal.id ? updateCallback(createUpdateGoalInput(), cfs)
            : addCallback(createNewGoalInput(), cfs)

    const createNewGoalInput = () => {
        return {
            name: name,
            sy: boughtYear,
            ey: sellYear,
            by: goal.by,
            tdr: goal.tdr,
            tdl: goal.tdl,
            ccy: currency,
            cp: currentMarketPrice,
            chg: assetChgRate,
            type: goal.type,
            tgts: goal.tgts,
            dr: oppDR,
            imp: goal.imp,
            manual: goal.manual,
            amper: amCostPer,
            amsy: amStartYear,
            aiper: aiPer,
            aisy: aiStartYear,
            tbr: rentTaxBenefit
        } as APIt.CreateGoalInput
    }

    const createUpdateGoalInput = () => {
        let g: APIt.CreateGoalInput = createNewGoalInput()
        g.id = goal.id
        return g as APIt.UpdateGoalInput
    }

    const calculateYearlyCFs = (duration: number, changeState: boolean = true) => {
        let g: APIt.CreateGoalInput = createNewGoalInput()
        let cfs = calculateSellCFs(g, duration)
        console.log("New cfs created: ", cfs)
        if (changeState) setCFs([...cfs])
        return cfs
    }

    const initBuyCFsForComparison = (analyzeFor: number) => {
        let allCFs: Array<Array<number>> = []
        for (let i = 1; i <= analyzeFor; i++)
            allCFs.push(i === sellYear - goal.by ? cfs : calculateYearlyCFs(i, false))
        return allCFs
    }

    useEffect(() => {
        if (!cashFlows) calculateYearlyCFs(sellYear - goal.by)
    }, [currentMarketPrice, assetChgRate, sellYear,
        amCostPer, amStartYear, aiPer, aiStartYear, cashFlows])

    return (
        <div className="flex flex-col w-full h-full">
            <div className="flex flex-wrap justify-between items-center w-full">
                <SVGLogo />
                <TextInput
                    name="name"
                    pre={typesList[goalType]}
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
            {nameValid &&
                <div className="flex flex-wrap justify-around w-full items-center mt-4">
                    <Section title="Buy Details" left={
                        <SelectInput name="by"
                            pre="When?"
                            value={boughtYear}
                            changeHandler={changeBoughtYear}
                            options={byOptions}
                        />} right={
                            <NumberInput name="cost" pre="Cost" post={`in ${boughtYear}`}
                                value={cost} changeHandler={setCost} currency={currency}
                                min={0} max={900000} step={500} />
                        } />
                    <Section title="Sell Details" right={
                        <SelectInput name="by"
                            pre="When?"
                            value={sellYear}
                            changeHandler={changeSellYear}
                            options={byOptions}
                        />} left={
                            <NumberInput name="sp" pre="Current" post="Price"
                                value={currentMarketPrice} changeHandler={setCurrentMarketPrice} currency={currency}
                                min={0} max={900000} step={500} />
                        } bottomLeft="" bottomRight="Yearly" bottom={
                            <NumberInput name="assetChgRate" pre="Sell Price" post="Changes" unit="%"
                                min={-20} max={20} step={0.5} value={assetChgRate as number} changeHandler={setAssetChgRate} />
                        } />
                    <AnnualAmt currency={currency} startYear={goal.by} percentage={aiPer as number} chgRate={assetChgRate as number}
                        percentageHandler={setAIPer} annualSY={aiStartYear as number} annualSYHandler={setAIStartYear}
                        price={currentMarketPrice} buyTaxRate={0} duration={sellYear - goal.by}
                        title="Yearly Income Potential through Rent, Dividend, etc" footer="Exclude taxes & fees" />
                    <AnnualAmt currency={currency} startYear={goal.by} percentage={amCostPer as number} chgRate={assetChgRate as number}
                        percentageHandler={setAMCostPer} annualSY={amStartYear as number} annualSYHandler={setAMStartYear}
                        price={currentMarketPrice} buyTaxRate={0} duration={sellYear - goal.by}
                        title="Yearly Fixes, Insurance, etc costs" footer="Include taxes & fees" />
                    <OppCost cfs={cfs} currency={currency} startYear={goal.by}
                        duration={sellYear - goal.by} discountRate={oppDR} discountRateHandler={setOppDR} />
                    <Section title="Instead, If You Rent" left={
                        <NumberInput name="rentAmt" pre="Yearly" post="Rent" value={rentAmt} changeHandler={setRentAmt}
                            min={1000} max={200000} step={500} currency={currency} />
                    }
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
                    />
                </div>}
            <div className="mb-4">
                <ExpandCollapse title="Hold v/s Sell & Rent for 20 Years" value={showRentChart}
                    handler={setShowRentChart} svg={<SVGBalance />} />
                <BRComparison currency={currency} taxRate={0} sellAfter={sellYear - goal.by}
                    discountRate={oppDR} allBuyCFs={initBuyCFsForComparison(20)}
                    rentTaxBenefit={rentTaxBenefit as number} rentTaxBenefitHandler={setRentTaxBenefit}
                    discountRateHandler={setOppDR} rentAmt={rentAmt} rentAmtHandler={setRentAmt}
                    rentChgPer={rentChgPer} rentChgPerHandler={setRentChgPer} answer={answer}
                    rentAns={rentAns} answerHandler={setAnswer} rentAnsHandler={setRentAns} showRentChart={showRentChart} />
            </div>
            <ActionButtons submitDisabled={submitDisabled}
                cancelHandler={cancelCallback} submitHandler={handleSubmit}
                submitText={`${goal.id ? 'Update' : 'Create'} Goal`} />
        </div>
    )
}*/