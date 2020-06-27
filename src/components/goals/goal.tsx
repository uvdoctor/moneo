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
import Summary from './summary'
import Sell from './sell'
import { calculateCFs, calculatePrice, calculateTMCost, calculateSellPrice, getLoanBorrowAmt, calculateManualPrice } from './cfutils'
import { getDuration, createNewTarget, getGoalTypes, getCriticalityOptions } from './goalutils'

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
    const goalCreatedYear = id ? goal?.by : new Date().getFullYear()
    const [startYear, setStartYear] = useState<number>(id && goal?.sy ? goal.sy : goalCreatedYear as number + 1)
    const [endYear, setEndYear] = useState<number>(id && goal?.ey ? goal.ey : startYear)
    const [syOptions] = useState(initYearOptions(startYear, 50))
    const [eyOptions, setEYOptions] = useState(initYearOptions(startYear, 80))
    const [loanRepaymentSY, setLoanRepaymentSY] = useState<number>(id && goal?.emi?.ry ? goal.emi.ry : startYear)
    const [amSYOptions, setAMSYOptions] = useState(initYearOptions(startYear, 10))
    const [price, setPrice] = useState<number>(0)
    const [totalCost, setTotalCost] = useState<number>(0)
    const [taxRate, setTaxRate] = useState<number>(id && goal?.tdr ? goal.tdr : 0)
    const [maxTaxDeduction, setMaxTaxDeduction] = useState<number>(id && goal?.tdl ? goal.tdl : 0)
    const [taxBenefitIntOnly, setTaxBenefitIntOnly] = useState<number>(id && goal?.tbi ? goal.tbi : 0)
    const [sellAfter, setSellAfter] = useState<number>(id && goal?.sa ? goal.sa : 5)
    const [buyTaxRate, setBuyTaxRate] = useState<number>(id && goal?.btr ? goal.btr : 10)
    const [loanPer, setLoanPer] = useState<number>(id && goal?.emi?.per ? goal.emi.per : 0)
    const [startingPrice, setStartingPrice] = useState<number>(id && goal?.cp ? goal.cp : 0)
    const [currency, setCurrency] = useState<string>(id && goal?.ccy ? goal.ccy : "USD")
    const [criticality, setCriticality] = useState<APIt.LMH>(id && goal?.imp ? goal.imp : APIt.LMH.M)
    const [manualMode, setManualMode] = useState<number>(id && goal?.manual ? goal.manual : 0)
    const [name, setName] = useState<string>(id && goal?.name ? goal.name : "")
    const [loanYears, setLoanYears] = useState<number>(id && goal?.emi?.dur ? goal.emi.dur : 10)
    const [loanIntRate, setLoanIntRate] = useState<number>(id && goal?.emi?.rate ? goal.emi.rate : 4)
    const [priceChgRate, setPriceChgRate] = useState<number>(id && goal?.chg ? goal.chg : 3)
    const [sellPrice, setSellPrice] = useState<number>(0)
    const [assetChgRate, setAssetChgRate] = useState<number>(id && goal?.achg ? goal.achg : 3)
    const [amCostPer, setAMCostPer] = useState<number>(id && goal?.amper ? goal.amper : 2)
    const [amStartYear, setAMStartYear] = useState<number>(id && goal?.amsy ? goal.amsy : startYear)
    const [totalMaintCost, setTotalMaintCost] = useState<number>(0)
    const [oppDR, setOppDR] = useState<number>(id && goal?.dr ? goal.dr : 6)
    const [rentTaxBenefit, setRentTaxBenefit] = useState(id && goal?.tbr ? goal.tbr : 0)
    const detailsLabel = "Details"
    const chartLabel = "Cash Flows"
    const taxLabel = "Tax Benefit"
    const rentLabel = "Rent?"
    const [viewItems, setViewItems] = useState([detailsLabel, taxLabel, chartLabel, rentLabel])
    const [viewMode, setViewMode] = useState(detailsLabel)
    const [goalType, setGoalType] = useState<APIt.GoalType>(APIt.GoalType.B)
    const [cfs, setCFs] = useState<Array<number>>([])

    const createNewGoalInput = () => {
        return {
            id: id,
            name: name,
            sy: startYear,
            ey: endYear,
            by: goalCreatedYear,
            sa: sellAfter,
            btr: buyTaxRate,
            tdr: taxRate,
            tdl: maxTaxDeduction,
            tbi: taxBenefitIntOnly,
            tbr: rentTaxBenefit,
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
            manual: manualMode,
            emi: loanPer > 0 ? { rate: loanIntRate, dur: loanYears, per: loanPer, ry: loanRepaymentSY } as APIt.EmiInput : null,
        } as APIt.CreateGoalInput
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
        let sp = goalType === APIt.GoalType.B ? calculateSellPrice(p, g.btr, g?.achg as number, duration) : 0
        let totalCost = -sp
        cfs.forEach(cf => totalCost += cf)
        setTotalCost(Math.abs(totalCost))
        setCFs([...cfs])
        if (goalType === APIt.GoalType.B) {
            setTotalMaintCost(calculateTMCost(g.sy, g.btr, g?.amper as number, g?.amsy as number, p, g?.achg as number, duration))
        }
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

    const [wipTargets, setWIPTargets] = useState<Array<APIt.TargetInput>>(id && goal?.tgts ? goal.tgts : [])

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

    useEffect(() => {
        calculateYearlyCFs(getDuration(goalType, sellAfter, startYear, endYear))
    }, [goalType, startingPrice, priceChgRate, wipTargets, assetChgRate, loanPer, loanRepaymentSY, loanYears, currency, startYear, endYear, sellAfter, buyTaxRate, taxRate, maxTaxDeduction, taxBenefitIntOnly, amCostPer, amStartYear, manualMode])

    const initBuyCFsForComparison = (analyzeFor: number) => {
        console.log("Going to initiate comparison CFs...")
        let allCFs: Array<Array<number>> = []
        for (let i = 1; i <= analyzeFor; i++)
            allCFs.push(i === sellAfter ? cfs : calculateYearlyCFs(i, false))
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

    const createOppCostCFs = () => {
        let oppCostCFs: Array<number> = Object.assign([], cfs)
        if (oppCostCFs[sellAfter]) oppCostCFs[sellAfter] -= sellPrice
        return oppCostCFs
    }

    useEffect(() => {
        if(manualMode > 0 && endYear === startYear) setEndYear(startYear + 2)
        else if(manualMode < 1 && loanPer === 0) setEndYear(startYear)
    }, [manualMode, loanPer])

    return (
        summary && id ? <Summary goal={goal as APIt.CreateGoalInput} chartData={createChartCFs()} deleteCallback={deleteCallback} editCallback={editCallback} />
            :
            <div className="flex flex-col text-lg md:text-xl w-screen">
                <div className="flex flex-wrap justify-around items-center w-full">
                    <div className="w-11/12 flex flex-wrap justify-between items-center">
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
                                <div className="flex justify-center">
                                    <label className="text-xl md:text-2xl font-semibold">Payment</label>
                                    <HToggle rightText="Manual Entry" value={manualMode} setter={setManualMode} />
                                </div>
                                <div className="mt-1 w-full flex items-center justify-around w-full">
                                    <RadialInput data={toStringArr(0, 20, 0.5)} step={0.5} value={buyTaxRate} width={120} unit="%" label="of Price" pre="Taxes & Fees" labelBottom={true} changeHandler={setBuyTaxRate} />
                                    <SelectInput name="sy"
                                        pre="Starts"
                                        value={startYear}
                                        changeHandler={changeStartYear}
                                        options={syOptions}
                                    />
                                    {manualMode > 0 ? <SelectInput name="ey" pre="Ends" value={endYear}
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
                                <Section title={`Price in ${startYear} ~ ${toCurrency(price, currency)}`} left={
                                    <NumberInput name="startingPrice" pre="Current" post="Price" width="110px"
                                        currency={currency} value={startingPrice} changeHandler={setStartingPrice} min={500} max={2000000} />
                                } right={
                                    <NumberInput name="priceChgRate" pre="Yearly" post="Change" unit="%"
                                        width="30px" min={-20} max={20} step={0.5} value={priceChgRate} changeHandler={setPriceChgRate} />
                                } />
                                {goalType !== APIt.GoalType.R && goalType !== APIt.GoalType.D && <EmiCost price={price} currency={currency} startYear={startYear}
                                    repaymentSY={loanRepaymentSY} endYear={endYear} loanYears={loanYears} loanAnnualInt={loanIntRate} loanPer={loanPer}
                                    loanBorrowAmt={getLoanBorrowAmt(price, buyTaxRate, loanPer)} loanAnnualIntHandler={setLoanIntRate}
                                    loanPerHandler={setLoanPer} loanMonthsHandler={setLoanYears} repaymentSYHandler={setLoanRepaymentSY} />}
                            </div>
                            :
                            <div className="flex flex-wrap items-center justify-center w-full">
                                {wipTargets && wipTargets.map((t, i) =>
                                    <div key={"t" + i} className="mr-4 md:mr-8 mt-4 flex flex-col justify-end items-end">
                                        <label>{t.year}</label>
                                        <NumberInput name="year" pre="" currency={currency}
                                            value={t.val} changeHandler={(val: number) => changeTargetVal(val, i)}
                                            width="120px" min={0} max={999999} step={100} />
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
                            <Sell price={price} startYear={startYear} endYear={endYear} sellAfter={sellAfter} 
                            sellPrice={sellPrice} sellPriceHandler={setSellPrice} sellAfterHandler={setSellAfter} 
                            cfs={cfs} type={goalType} currency={currency} assetChgRate={assetChgRate} 
                            assetChgRateHandler={setAssetChgRate} buyTaxRate={buyTaxRate} />                        
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
                            <button className="ml-8 button" onClick={() => id ? updateCallback(createNewGoalInput()) : addCallback(createNewGoalInput())}>
                                {`${id ? 'Update' : 'Create'} Goal`}
                            </button>
                        </div>
                    </Fragment>}
                {viewMode === rentLabel &&
                    <BRComparison currency={currency} taxRate={taxRate} sellAfter={sellAfter}
                        discountRate={oppDR} allBuyCFs={initBuyCFsForComparison(20)}
                        rentTaxBenefit={rentTaxBenefit} rentTaxBenefitHandler={setRentTaxBenefit} 
                        price={price} discountRateHandler={setOppDR} />
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