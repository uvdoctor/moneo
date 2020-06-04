import React, { useState, useEffect, Fragment } from 'react'
import TextInput from '../form/textinput'
import SelectInput from '../form/selectinput'
import NumberInput from '../form/numberinput'
import SVGRemove from '../svgremove'
import { API, graphqlOperation } from 'aws-amplify'
import * as mutations from '../../graphql/mutations'
import * as queries from '../../graphql/queries';
import * as APIt from '../../api/goals'
import { getCriticalityOptions, getRAOptions, initYearOptions, toCurrency } from '../utils'
import TimeCost from '../calc/timecost'
import EmiCost from '../calc/emicost'
import OppCost from '../calc/oppcost'
import Toggle from '../toggle'
import TaxBenefit from '../calc/taxbenefit'
import CurrencyInput from '../form/currencyinput'
import { getIntAmtByYear, getRemainingPrincipal, getTotalAmtIncludingInt } from '../calc/finance'

const Goals = () => {
    const minStartYear = new Date().getFullYear()
    const [startYear, setStartYear] = useState<number>(minStartYear + 1)
    const [endYear, setEndYear] = useState<number>(startYear)
    const [syOptions] = useState(initYearOptions(startYear, 50))
    const [eyOptions, setEYOptions] = useState(initYearOptions(startYear, 100))
    const [loanRepaymentSY, setLoanRepaymentSY] = useState<number>(startYear)
    const [ryOptions, setRYOptions] = useState(initYearOptions(startYear, 10))
    const [totalCost, setTotalCost] = useState<number>(0)
    const [taxRate, setTaxRate] = useState<number>(0)
    const [taxDeductionLimit, setTaxDeductionLimit] = useState<number>(0)
    const [maxTaxDeduction, setMaxTaxDeduction] = useState<number>(10000)
    const [taxBenefitIntOnly, setTaxBenefitIntOnly] = useState<number>(0)
    const [sellAfter, setSellAfter] = useState<number>(5)
    const [sellPrice, setSellPrice] = useState<number>(0)
    const [capitalGainTax, setCapitalGainTax] = useState<number>(10)
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

    const getTaxBenefit = (val: number, tr: number, taxDL: number, maxTaxDL: number) => {
        if (val <= 0 || tr <= 0 || (taxDL > 0 && maxTaxDL <= 0)) return 0
        if (taxDL > 0 && val > maxTaxDL) val = maxTaxDL
        return Math.round(val * (tr / 100))
    }

    const createNewTarget = (year: number, val: number, curr: string, fx: number) => {
        return {
            year: year,
            val: val,
            curr: curr,
            fx: fx
        }
    }

    const initTargets = (val: number = 0, fxRate: number = 1.0) => {
        let value = manualMode < 1 ? selfAmt : val
        let curr = currency
        let fx = fxRate
        let targets: Array<APIt.TargetInput> = []
        let ey = endYear
        if (sellPrice > 0 && manualMode < 1) {
            ey = startYear + sellAfter
            setEndYear(ey)
        }
        for (let year = startYear; year <= ey; year++, value *= (manualMode < 1 && sellPrice === 0) ? (1 + (inflation / 100)) : 0) {
            let existingT = null
            if (wipTargets.length > 0 && manualMode > 0) {
                existingT = (wipTargets.filter((target) => target.year === year))[0] as APIt.TargetInput
            }
            let t = existingT ? Object.assign({}, existingT) : createNewTarget(year, value, curr, fx)
            if (t.val > 0 && manualMode < 1) t.val -= getTaxBenefit(value, taxRate, taxDeductionLimit, maxTaxDeduction)
            if (year === ey && sellPrice > 0 && manualMode < 1) {
                t.val -= sellPrice
                if (t.val < 0 && capitalGainTax > 0) {
                    t.val += (sellPrice - selfAmt) * (capitalGainTax / 100)
                }
            }
            t.val = Math.round(t.val)
            targets.push(t)
        }
        console.log("New targets created: ", targets)
        setWIPTargets([...targets])
    }

    const initLoanTargets = (fxRate: number = 1.0) => {
        let totalMonths = loanMonths > 12 ? loanMonths - 12 : loanMonths
        let ey: number = loanMonths <= 12 ? loanRepaymentSY : loanRepaymentSY + Math.floor(totalMonths / 12)
        let targets: Array<APIt.TargetInput> = []
        let annualInts = taxBenefitIntOnly ? getIntAmtByYear(loanBorrowAmt, emi, loanIntRate, loanMonths) : []
        let remLoanAdj = 0
        let sp = 0
        if (sellPrice > 0) {
            sp = sellPrice
            ey = startYear + sellAfter
            if (ey > loanRepaymentSY) {
                let loanPaidForMonths = (ey - loanRepaymentSY) * 12
                let remPrincipal = getRemainingPrincipal(loanBorrowAmt, emi, loanIntRate, loanPaidForMonths)
                if (remPrincipal > 0) {
                    if (sellPrice >= remPrincipal) {
                        sp -= remPrincipal
                    } else {
                        remLoanAdj = remPrincipal - sp
                        sp = 0
                    }
                }
            } else {
                sp -= loanBorrowAmt
            }
        }
        setEndYear(ey)
        for (let year = startYear; year <= endYear; year++, year >= loanRepaymentSY ? totalMonths -= 12 : totalMonths -= 0) {
            let cf = 0
            if (year === startYear) cf += taxBenefitIntOnly > 0 ? loanDP : loanDP - getTaxBenefit(loanDP, taxRate, taxDeductionLimit, maxTaxDeduction)
            if (year >= loanRepaymentSY && totalMonths >= 0) {
                let extraMonths = loanMonths % 12
                let factor = 12
                if (year === ey && extraMonths !== 0) factor = extraMonths
                let annualEmiAmt = emi * factor
                let i = year - loanRepaymentSY
                let taxBenefitEligibleAmt = taxBenefitIntOnly > 0 ? annualInts[i] : annualEmiAmt
                cf += annualEmiAmt - getTaxBenefit(taxBenefitEligibleAmt, taxRate, taxDeductionLimit, maxTaxDeduction)
            }
            if (year === endYear && sellPrice > 0) {
                cf += remLoanAdj
                cf -= sp
                let totalCost = getTotalAmtIncludingInt(loanDP, emi, loanMonths) - remLoanAdj
                if (capitalGainTax > 0 && sellPrice > totalCost) {
                    let cgt = (sellPrice - totalCost) * (capitalGainTax / 100)
                    cf += cgt
                }
            }
            targets.push(createNewTarget(year, Math.round(cf), currency, fxRate))
        }
        console.log("Loan targets are...", targets)
        setWIPTargets([...targets])
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
        if (borrowMode < 1) setEYOptions(initYearOptions(startYear, 100))
        if (borrowMode > 0) setRYOptions(initYearOptions(startYear, 10))
        if (borrowMode < 1 && (startYear > endYear || endYear - startYear > 100)) setEndYear(startYear)
        if (borrowMode > 0 && (startYear > loanRepaymentSY || loanRepaymentSY - startYear > 10)) setLoanRepaymentSY(startYear)
    }, [startYear, endYear, borrowMode, loanRepaymentSY])

    const changeEndYear = (str: string) => {
        let ey = parseInt(str)
        setEndYear(ey)
    }

    useEffect(() => {
        if (borrowMode > 0) initLoanTargets()
    }, [emi, loanBorrowAmt, loanRepaymentSY, loanMonths, loanDP, borrowMode, currency, startYear, endYear, sellAfter, sellPrice, taxRate, taxDeductionLimit, maxTaxDeduction, taxBenefitIntOnly, capitalGainTax])

    useEffect(() => {
        if (borrowMode < 1) initTargets()
    }, [startYear, endYear, selfAmt, inflation, currency, borrowMode, sellAfter, sellPrice, taxRate, taxDeductionLimit, maxTaxDeduction, manualMode, capitalGainTax])

    useEffect(() => {
        let totalCost = 0
        for (let i = 0; i < wipTargets.length; i++) totalCost += wipTargets[i].val * wipTargets[i].fx
        setTotalCost(Math.round(totalCost))
    }, [wipTargets])

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
                <SelectInput name="sy"
                    pre="From"
                    value={startYear}
                    changeHandler={changeStartYear}
                    options={syOptions}
                />
                {(borrowMode < 1 && (sellPrice === 0 || manualMode > 0)) ? <SelectInput name="ey" pre="To" value={endYear}
                    changeHandler={changeEndYear} options={eyOptions} />
                    : <div className="flex flex-col mr-4 md:mr-8">
                        <label>To</label>
                        <label className="font-semibold">{endYear}</label>
                    </div>}
                <div className="mr-4 font-semibold flex flex-col justify-center">
                    <label>{`Net ${totalCost < 0 ? 'Gain' : 'Cost'}`}</label>
                    <div className="flex items-center">
                        <label className="text-xl md:text-2xl mr-4">{toCurrency(Math.abs(totalCost), currency)}</label>
                        <CurrencyInput name="mainCurr" value={currency} changeHandler={setCurrency} />
                    </div>
                </div>
                <Toggle topText="Borrow" value={borrowMode} setter={changeBorrowMode} />
            </div>
            <div className="flex flex-wrap items-center w-full">
                {(borrowMode < 1 && manualMode < 1) && <NumberInput name="selfAmt" pre="Amount" width="100px"
                    currency={currency} value={selfAmt} changeHandler={setSelfAmt} min={500}
                />}

                <EmiCost currency={currency} startYear={startYear} repaymentSY={loanRepaymentSY} repaymentSYOptions={ryOptions}
                    loanMonths={loanMonths} emi={emi} loanAnnualInt={loanIntRate} loanDP={loanDP} borrowAmt={loanBorrowAmt}
                    loanAnnualIntHandler={setLoanIntRate} loanDPHandler={setLoanDP} borrowAmtHandler={setLoanBorrowAmt}
                    emiHandler={setEmi} loanMonthsHandler={setLoanMonths} borrow={borrowMode} repaymentSYHandler={setLoanRepaymentSY} />
                {borrowMode < 1 && <Fragment>
                    <Toggle topText="Manual" bottomText="Auto" value={manualMode} setter={setManualMode} />
                    {endYear > startYear && manualMode < 1 && goalType === APIt.GoalType.B && sellPrice === 0 &&
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
                {goalType === APIt.GoalType.B && manualMode < 1 && <Fragment>
                    <NumberInput name="sellAfter" pre="Sell" post="After"
                        width="30px" unit="years" value={sellAfter} changeHandler={setSellAfter} min={1} max={10} />
                    {sellAfter >= 1 && <NumberInput name="sellPrice" pre="At Price"
                        width="90px" currency={currency} value={sellPrice} changeHandler={setSellPrice} />}
                </Fragment>}
                {(manualMode < 1 || borrowMode > 0) &&
                    <TaxBenefit loan={borrowMode > 0 ? true : false} taxDeductionLimit={taxDeductionLimit} taxDeductionLimitHandler={setTaxDeductionLimit}
                        taxRate={taxRate} taxRateHandler={setTaxRate} currency={currency}
                        maxTaxDeduction={maxTaxDeduction} maxTaxDeductionHandler={setMaxTaxDeduction}
                        taxBenefitIntOnly={taxBenefitIntOnly} taxBenefitIntOnlyHandler={setTaxBenefitIntOnly} />
                }
                {goalType === APIt.GoalType.B && (borrowMode > 0 || (borrowMode < 1 && manualMode < 1)) && sellPrice > 0 && totalCost < 0 &&
                    <NumberInput name="cgt" pre="Capital Gain" post="Tax Rate" value={capitalGainTax} changeHandler={setCapitalGainTax}
                        max={30} unit="%" width="30px" />
                }
            </div>

            {(endYear > startYear || manualMode > 0) && <div className="flex flex-wrap mt-4 mb-4">
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