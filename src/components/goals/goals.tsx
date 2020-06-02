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

const Goals = () => {
    const minStartYear = new Date().getFullYear()
    const [totalCost, setTotalCost] = useState<number>(0)
    const [taxRate, setTaxRate] = useState<number>(10)
    const [taxDeductionLimit, setTaxDeductionLimit] = useState<number>(0)
    const [maxTaxDeduction, setMaxTaxDeduction] = useState<number>(10000)
    const [taxBenefitIntOnly, setTaxBenefitIntOnly] = useState<number>(0)
    
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
        console.log(`Init targets: ${startYear}, ${endYear}`)
        for (let year = startYear; year <= endYear; year++, value *= manualMode < 1 ? (1 + (inflation / 100)) : 1) {
            let existingT = null
            if (wipTargets.length > 0 && manualMode > 0) {
                existingT = (wipTargets.filter((target) => target.year === year))[0] as APIt.TargetInput
            }
            let t = existingT ? Object.assign({}, existingT) : createNewTarget(year, value, curr, fx)
            if (t.val > 0 && manualMode < 1) t.val -= getTaxBenefit(value, taxRate, taxDeductionLimit, maxTaxDeduction)
            targets.push(t)
        }
        console.log("New targets created: ",targets)
        setWIPTargets([...targets])
    }

    const initLoanTargets = (fxRate: number = 1.0) => {
        let totalMonths = loanMonths > 12 ? loanMonths - 12 : loanMonths
        let ey = loanMonths <= 12 ? loanRepaymentSY : loanRepaymentSY + Math.floor(totalMonths / 12)
        setEndYear(ey)
        let targets: Array<APIt.TargetInput> = []
        for (let year = startYear; year <= endYear; year++, year >= loanRepaymentSY ? totalMonths -= 12 : totalMonths -= 0) {
            let cf = 0
            let extraMonths = loanMonths % 12
            let factor = 12
            if (year === ey && extraMonths !== 0) factor = extraMonths
            let annualEmiAmt = emi * factor
            if (year === startYear) cf += loanDP
            if (year >= loanRepaymentSY) {
                cf += annualEmiAmt
                cf -= getTaxBenefit(cf, taxRate, taxDeductionLimit, maxTaxDeduction)
            }
            targets.push(createNewTarget(year, cf, currency, fxRate))
        }
        setWIPTargets([...targets])
    }

    const [startYear, setStartYear] = useState<number>(minStartYear + 1)
    const [endYear, setEndYear] = useState<number>(startYear)
    const [syOptions] = useState(initYearOptions(startYear, 50))
    const [eyOptions, setEYOptions] = useState(initYearOptions(startYear, 100))
    const [name, setName] = useState<string>("")
    const [inflation, setInflation] = useState<number>(3)
    const [loan, setLoan] = useState<boolean>(false)
    const [emi, setEmi] = useState<number>(0)
    const [loanMonths, setLoanMonths] = useState<number>(60)
    const [loanDP, setLoanDP] = useState<number>(0)
    const [loanIntRate, setLoanIntRate] = useState<number>(4)
    const [loanRepaymentSY, setLoanRepaymentSY] = useState<number>(startYear)
    const [ryOptions, setRYOptions] = useState(initYearOptions(startYear, 10))
    const [loanBorrowAmt, setLoanBorrowAmt] = useState<number>(0)
    const [selfAmt, setSelfAmt] = useState<number>(0)
    const [currency, setCurrency] = useState<string>("USD")
    const [criticality, setCriticality] = useState<APIt.LMH>(APIt.LMH.H)
    const [ra, setRA] = useState<APIt.LMH>(APIt.LMH.L)
    const [manualMode, setManualMode] = useState<number>(0)
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
            emi: loan ? { rate: loanIntRate, dur: loanMonths, dp: loanDP } as APIt.EmiInput : null,
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
        setEYOptions(initYearOptions(startYear, 100))
        setRYOptions(initYearOptions(startYear, 10))
        if(startYear > endYear) setEndYear(startYear)
        if(startYear > loanRepaymentSY) setLoanRepaymentSY(startYear)
    }, [startYear, loan])

    const changeEndYear = (str: string) => {
        let ey = parseInt(str)
        setEndYear(ey)
    }

    useEffect(() => {
        if (loan) initLoanTargets()
    }, [emi, loanBorrowAmt, loanRepaymentSY, loanMonths, loanDP, loan, currency, startYear, endYear, taxRate, taxDeductionLimit, maxTaxDeduction])

    useEffect(() => {
        if (!loan) initTargets()
    }, [startYear, endYear, selfAmt, inflation, currency, loan, taxRate, taxDeductionLimit, maxTaxDeduction, manualMode])

    useEffect(() => {
        let totalCost = 0
        for (let i = 0; i < wipTargets.length; i++) totalCost += wipTargets[i].val * wipTargets[i].fx
        setTotalCost(Math.round(totalCost))
    }, [wipTargets])

    const changeBorrowMode = (val: number) => {
        let emi = val > 0 ? true : false
        setLoan(emi)
        if (!emi) {
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
        <div className="ml-1 mr-1 md:ml-4 md:mr-4">
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
            <div className="flex items-center justify-center mt-4 mb-4 text-xl md:text-2xl">
                <label>Total Needed is</label>
                <label className="ml-2 mr-4 font-semibold">{toCurrency(totalCost, currency)}</label>
                <CurrencyInput name="mainCurr" value={currency} changeHandler={setCurrency} />
            </div>
            <div className="flex flex-wrap items-center">
                <SelectInput name="sy"
                    pre="From"
                    value={startYear}
                    changeHandler={changeStartYear}
                    options={syOptions}
                />
                {!loan && <Fragment>
                    <SelectInput name="ey"
                        pre="To"
                        value={endYear}
                        changeHandler={changeEndYear}
                        options={eyOptions}
                    />
                    {(!loan && manualMode < 1) && <NumberInput name="selfAmt" pre="Amount" width="100px"
                        currency={currency} value={selfAmt} changeHandler={setSelfAmt} min={500}
                    />}
                </Fragment>}
                <EmiCost currency={currency} startYear={startYear} repaymentSY={loanRepaymentSY} repaymentSYOptions={ryOptions}
                    loanMonths={loanMonths} emi={emi} loanAnnualInt={loanIntRate} loanDP={loanDP} borrowAmt={loanBorrowAmt}
                    loanAnnualIntHandler={setLoanIntRate} loanDPHandler={setLoanDP} borrowAmtHandler={setLoanBorrowAmt}
                    emiHandler={setEmi} loanMonthsHandler={setLoanMonths} borrow={loan ? 1 : 0} borrowModeHandler={changeBorrowMode}
                    repaymentSYHandler={setLoanRepaymentSY} />
                {!loan && endYear > startYear && <Toggle topText="Manual" bottomText="Auto" value={manualMode} setter={setManualMode} />}
                {!loan && endYear > startYear && manualMode < 1 && <div className="mt-12"><NumberInput
                    name="inflation"
                    pre="Change"
                    unit="%"
                    width="50px"
                    value={inflation}
                    changeHandler={setInflation}
                    min={-10.0}
                    max={10.0}
                    step={0.1}
                /></div>}
                {(manualMode < 1 || loan) &&
                    <TaxBenefit loan={loan} taxDeductionLimit={taxDeductionLimit} taxDeductionLimitHandler={setTaxDeductionLimit}
                        taxRate={taxRate} taxRateHandler={setTaxRate} currency={currency}
                        maxTaxDeduction={maxTaxDeduction} maxTaxDeductionHandler={setMaxTaxDeduction} 
                        taxBenefitIntOnly={taxBenefitIntOnly} taxBenefitIntOnlyHandler={setTaxBenefitIntOnly} />
                }
            </div>

            <div className="flex flex-wrap mt-4">
                {wipTargets && wipTargets.map((t, i) =>
                    <div key={"t" + i} className="mr-2 md:mr-4 items-center">
                        {(!loan && manualMode > 0) ? <NumberInput
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
            <div className="flex flex-wrap items-center mt-8">
                <TimeCost amount={totalCost} currency={currency} workHoursPerWeek={60} annualWorkWeeks={47} />
            </div>
            <div className="mt-4">
                <OppCost targets={wipTargets} currency={currency} startYear={startYear} endYear={endYear} />
            </div>
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