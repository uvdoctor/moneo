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
import {toReadableNumber} from '../utils'
import RadialInput from '../form/radialinput'

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
    const [annualReturnPer, setAnnualReturnPer] = useState<number | null>(0)
    const [loanBorrowAmt, setLoanBorrowAmt] = useState<number>(0)
    const [selfAmt, setSelfAmt] = useState<number>(0)
    const [currency, setCurrency] = useState<string>("USD")
    const [criticality, setCriticality] = useState<APIt.LMH>(APIt.LMH.H)
    const [ra, setRA] = useState<APIt.LMH>(APIt.LMH.L)
    const [manualMode, setManualMode] = useState<number>(0)
    const [name, setName] = useState<string>("")
    const [inflation, setInflation] = useState<number>(3)
    const [borrowMode, setBorrowMode] = useState<number>(0)
    const [emi, setEmi] = useState<number>(0)
    const [loanMonths, setLoanMonths] = useState<number>(60)
    const [loanDP, setLoanDP] = useState<number>(0)
    const [loanIntRate, setLoanIntRate] = useState<number>(4)
    const [priceChgRate, setPriceChgRate] = useState<number>(0)
    const [amCostPer, setAMCostPer] = useState<number>(2)
    const [amStartYear, setAMStartYear] = useState<number>(startYear)
    const [analyzeFor, setAnalyzeFor] = useState<number>(20)
    const [rentAns, setRentAns] = useState<string>('')

    const getTaxBenefit = (val: number, tr: number, maxTaxDL: number) => {
        if (val <= 0 || tr <= 0) return 0
        if (maxTaxDL > 0 && val > maxTaxDL) val = maxTaxDL
        return Math.round(val * (tr / 100))
    }

    const initTargets = (val: number = 0, fxRate: number = 1.0) => {
        let value = manualMode < 1 ? selfAmt : val
        let curr = currency
        let fx = fxRate
        let targets: Array<APIt.TargetInput> = []
        let ey = endYear
        if (goalType === APIt.GoalType.B && manualMode < 1) {
            ey = startYear
            setEndYear(ey)
        }
        for (let year = startYear; year <= ey; year++, value *= (manualMode < 1 && sellPrice === 0 && goalType !== APIt.GoalType.B) ? (1 + (inflation / 100)) : 0) {
            let existingT = null
            if (wipTargets.length > 0 && manualMode > 0) {
                existingT = (wipTargets.filter((target) => target.year === year))[0] as APIt.TargetInput
            }
            let t = existingT ? Object.assign({}, existingT) : createNewTarget(year, value, curr, fx)
            if (t.val > 0 && manualMode < 1) t.val -= getTaxBenefit(value, taxRate, maxTaxDeduction)
            t.val = Math.round(t.val)
            targets.push(t)
        }
        console.log("New targets created: ", targets)
        setWIPTargets([...targets])
    }

    const initLoanTargets = (fxRate: number = 1.0, duration: number, sp: number, changeState: boolean = true) => {
        let totalMonths = loanMonths > 12 ? loanMonths - 12 : loanMonths
        let ey: number = loanMonths <= 12 ? loanRepaymentSY : loanRepaymentSY + Math.floor(totalMonths / 12)
        let targets: Array<APIt.TargetInput> = []
        let annualInts = taxBenefitIntOnly ? getIntAmtByYear(loanBorrowAmt, emi, loanIntRate, loanMonths) : []
        let remPrincipal = 0
        if (duration > 0 && sp > 0) {
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
            if (year === ey && duration > 0 && sellPrice > 0) {
                cf += remPrincipal
            }
            targets.push(createNewTarget(year, Math.round(cf), currency, fxRate))
        }
        console.log("Loan targets are...", targets)
        return targets
    }

    const [allGoals, setAllGoals] = useState<Array<APIt.CreateGoalInput> | null>(null)
    const [goalType, setGoalType] = useState<APIt.GoalType>(APIt.GoalType.B)
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

    const calculatePrice = () => {
        let price = selfAmt
        if (borrowMode > 0) price = loanDP + loanBorrowAmt
        else if (manualMode > 0) {
            price = 0
            for (let i = 0; i < wipTargets.length; i++) price += Math.round((wipTargets[i].val * wipTargets[i].fx))
        }
        return price
    }

    const createNewGoal = async () => {
        let goal: APIt.CreateGoalInput = {
            name: name,
            type: goalType as APIt.GoalType,
            tgts: wipTargets,
            imp: criticality,
            ra: ra,
            emi: borrowMode > 0 ? { rate: loanIntRate, dur: loanMonths, dp: loanDP } as APIt.EmiInput : null,
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
        console.log("Inside useEffect...setEYOptions")
        if (borrowMode < 1) setEYOptions(initYearOptions(startYear, 100))
        if (borrowMode > 0) setRYOptions(initYearOptions(startYear, 10))
        setAMSYOptions(initYearOptions(startYear, 10))
        if (borrowMode < 1 && (startYear > endYear || endYear - startYear > 100)) setEndYear(startYear)
        if (borrowMode > 0 && (startYear > loanRepaymentSY || loanRepaymentSY - startYear > 10)) setLoanRepaymentSY(startYear)
    }, [startYear, endYear, borrowMode, loanRepaymentSY])

    const changeEndYear = (str: string) => {
        let ey = parseInt(str)
        setEndYear(ey)
    }

    useEffect(() => {
        if (borrowMode > 0) setWIPTargets([...initLoanTargets(1.0, sellAfter, sellPrice, true)])
    }, [goalType, emi, loanBorrowAmt, loanRepaymentSY, loanMonths, loanDP, borrowMode, currency, startYear, endYear, sellAfter, sellPrice, taxRate, maxTaxDeduction, taxBenefitIntOnly])

    useEffect(() => {
        if (borrowMode < 1) initTargets()
    }, [goalType, startYear, endYear, selfAmt, inflation, currency, borrowMode, sellAfter, sellPrice, taxRate, maxTaxDeduction, manualMode])

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

    const initBuyCFs = (duration: number, sp: number) => {
        let tgts = wipTargets
        if (duration !== sellAfter && borrowMode > 0) tgts = initLoanTargets(1.0, duration, sp, false)
        let cfs: Array<number> = []
        for (let i = 0; i < duration; i++) {
            let cf = getAnnualMaintCost(i)
            if (i < tgts.length) cf += tgts[i].val * tgts[i].fx
            cfs.push(Math.round(-1 * cf))
        }
        cfs[cfs.length - 1] += sp
        return cfs
    }

    const initBuyCFsForComparison = () => {
        let allCFs: Array<Array<number>> = []
        for (let i = 1, sp = price * (1 + (priceChgRate / 100)); i <= analyzeFor; i++, sp *= (1 + (priceChgRate / 100))) {
            allCFs.push(initBuyCFs(i, sp))
        }
        return allCFs
    }

    const calculateAnnualReturn = () => {
        console.log("Calculating annual return...")
        if (price > 0 && sellAfter > 0 && sellPrice > 0) {
            let cfs = initBuyCFs(sellAfter, sellPrice)
            let xirrCFs = []
            for (let i = 0; i < cfs.length; i++) {
                xirrCFs.push({
                    amount: cfs[i],
                    when: new Date(startYear + i, 0, 1)
                })
            }
            try {
                setAnnualReturnPer(xirr(xirrCFs) * 100)
            } catch (e) {
                console.log("Error while calculating xirr: ", e)
                setAnnualReturnPer(null)
            }
        } else setAnnualReturnPer(null)
    }

    useEffect(() => {
        let totalCost = getTotalMaintCost()
        for (let i = 0; i < wipTargets.length; i++) totalCost += wipTargets[i].val * wipTargets[i].fx
        if (goalType === APIt.GoalType.B && sellAfter > 0 && sellPrice > 0) {
            let price = calculatePrice()
            setPrice(price)
            let cagr = (Math.pow((sellPrice / price), (1 / sellAfter)) - 1) * 100
            console.log("CAGR calculated: ", cagr)
            setPriceChgRate(cagr)
            calculateAnnualReturn()
        }
        setTotalCost(totalCost)
    }, [wipTargets, amStartYear, amCostPer])

    const changeBorrowMode = (val: number) => {
        setBorrowMode(val)
        if (val < 1) {
            setEndYear(startYear)
        }
    }

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
        <div className="ml-1 mr-1 md:ml-4 md:mr-4 w-full">
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
            <div className="flex items-center justify-center mt-4 mb-4">
                <div className="mr-4 font-semibold flex flex-col justify-center">
                    <label>You Pay Total About</label>
                    <div className="flex items-center">
                        <label className="text-xl md:text-2xl mr-4">{toCurrency(Math.abs(totalCost), currency)}</label>
                        <CurrencyInput name="mainCurr" value={currency} changeHandler={setCurrency} />
                    </div>
                </div>
                <SelectInput name="sy"
                    pre="From"
                    value={startYear}
                    changeHandler={changeStartYear}
                    options={syOptions}
                />
                {(borrowMode < 1 && (sellAfter === 0 || manualMode > 0)) ? <SelectInput name="ey" pre="To" value={endYear}
                    changeHandler={changeEndYear} options={eyOptions} />
                    : <div className="flex flex-col mr-4 md:mr-8">
                        <label>To</label>
                        <label className="font-semibold">{endYear}</label>
                    </div>}
                <Toggle topText="Borrow" value={borrowMode} setter={changeBorrowMode} />

            </div>
            {goalType === APIt.GoalType.B && sellPrice > 0 && sellAfter > 0 && annualReturnPer &&
                <div className="flex flex-col items-center justify-center align-center font-semibold">
                    <div className="flex justify-center mb-4">
                        {annualReturnPer === 0 ? <label className="mr-1">You will break-even</label>
                            : <label className="mr-1">{`Annual ${annualReturnPer < 0 ? 'Loss' : 'Gain'} of about ${toReadableNumber(Math.abs(annualReturnPer), 2)}%,`}</label>}
                        <label>{`if You get ${toCurrency(sellPrice, currency)} after paying taxes & fees upon selling in ${startYear + sellAfter}.`}</label>
                    </div>
                    {rentAns && <p className="mb-4">{rentAns}</p>}
                </div>
            }
            <div className="flex flex-wrap items-center w-full">
                <Toggle topText="Custom" value={manualMode} setter={setManualMode} />
                {(borrowMode < 1 && manualMode < 1) && <NumberInput name="selfAmt" pre="Price" width="100px"
                    currency={currency} value={selfAmt} changeHandler={setSelfAmt} min={500} max={9999999}
                />}

                <EmiCost currency={currency} startYear={startYear} repaymentSY={loanRepaymentSY} repaymentSYOptions={ryOptions}
                    loanMonths={loanMonths} emi={emi} loanAnnualInt={loanIntRate} loanDP={loanDP} borrowAmt={loanBorrowAmt}
                    loanAnnualIntHandler={setLoanIntRate} loanDPHandler={setLoanDP} borrowAmtHandler={setLoanBorrowAmt}
                    emiHandler={setEmi} loanMonthsHandler={setLoanMonths} borrow={borrowMode} repaymentSYHandler={setLoanRepaymentSY} />
                {borrowMode < 1 && <Fragment>

                    {endYear > startYear && manualMode < 1 && goalType !== APIt.GoalType.B && sellAfter === 0 &&
                        <NumberInput
                            name="inflation"
                            pre="Change"
                            unit="%"
                            width="50px"
                            value={inflation}
                            changeHandler={setInflation}
                            min={-10.0}
                            max={10.0}
                            step={0.1}
                        />}
                </Fragment>}
                {goalType === APIt.GoalType.B && <Fragment>
                    <NumberInput name="maintainCost" pre="Maintenance" post="Costs" note="of Price every Year" unit="%"
                        value={amCostPer} changeHandler={setAMCostPer} min={0} max={10} step={0.1} width="30px" />
                    <SelectInput name="maintainFrom" pre="Starting" options={amSYOptions} value={amStartYear}
                        changeHandler={setAMStartYear} />
                    <RadialInput width={150} label="Years" labelBottom={true} data={toStringArr(1, 30)}
                        dataIndex={4} changeHandler={setSellAfter} />    
                    {sellAfter > 0 && <NumberInput name="sellPrice" pre="You Get" note="after taxes & fees"
                        width="90px" currency={currency} value={sellPrice} changeHandler={setSellPrice} />}
                </Fragment>}
                {(manualMode < 1 || borrowMode > 0) &&
                    <TaxBenefit loan={borrowMode > 0 ? true : false} taxRate={taxRate} taxRateHandler={setTaxRate} currency={currency}
                        maxTaxDeduction={maxTaxDeduction} maxTaxDeductionHandler={setMaxTaxDeduction}
                        taxBenefitIntOnly={taxBenefitIntOnly} taxBenefitIntOnlyHandler={setTaxBenefitIntOnly} />
                }
            </div>

            {sellPrice > 0 && sellAfter > 0 && totalCost > 0 && goalType === APIt.GoalType.B &&
                <div className="flex flex-wrap items-center mt-4 mb-4">
                    <NumberInput min={1} max={30} name="analyzeFor" value={analyzeFor} changeHandler={setAnalyzeFor}
                        pre="Compare Rent" post="Option for" unit="years" width="30px" />
                    <BRComparison price={price} currency={currency} taxRate={taxRate} priceChgRate={priceChgRate} sellAfter={sellAfter}
                        analyzeFor={analyzeFor} initAllBuyCFsForComparison={initBuyCFsForComparison} setRentAns={setRentAns} />
                </div>}
            {(endYear > startYear || manualMode > 0) && <div className="flex flex-col mt-4 mb-4">
                <div className="mt-4 flex flex-wrap">
                    {wipTargets && wipTargets.map((t, i) =>
                        <div key={"t" + i} className="mr-2 md:mr-4 items-center">
                            {(borrowMode < 1 && manualMode > 0) ? <NumberInput
                                name="year"
                                pre={`${t.year}`}
                                currency={t.curr}
                                value={t.val}
                                changeHandler={(val: number) => changeTargetVal(val, i)}
                                currencyHandler={(val: string) => changeTargetCurrency(val, i)}
                                width="80px"
                            /> :
                                <div className="mt-4 flex flex-col w-16 md:w-20 lg:w-24 justify-between text-right">
                                    <label>{t.year}</label>
                                    <label className="font-semibold">{toCurrency(t.val, currency)}</label>
                                </div>}
                        </div>)}
                </div>
            </div>}

            {totalCost > 0 && <Fragment>
                <TimeCost amount={totalCost} currency={currency} workHoursPerWeek={60} annualWorkWeeks={47} />
                <OppCost targets={wipTargets} currency={currency} startYear={startYear} endYear={endYear} />
            </Fragment>}
            <div className="flex justify-center mt-8">
                <button className="cancel" onClick={createNewGoal}>
                    Cancel
			    </button>
                <button className="ml-8 button" onClick={createNewGoal}>
                    Create Goal
			    </button>
            </div>
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