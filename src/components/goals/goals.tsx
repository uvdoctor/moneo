import React, { useState, useEffect } from 'react'
import Input from '../input'
import SVGRemove from '../svgremove'
import Toggle from '../toggle'
import { getEmi } from '../calc/finance'
import { API, graphqlOperation } from 'aws-amplify'
import * as mutations from '../../graphql/mutations'
import * as queries from '../../graphql/queries';
import * as APIt from '../../api/goals'
import { getCurrencyList } from '../utils'
import { toCurrency } from '../input'

const Goals = () => {
    const minStartYear = new Date().getFullYear()

    const initYearOptions = (firstYear: number, duration: number) => {
        let years: any = {}
        for (let i = firstYear; i <= firstYear + duration; i++) years[i] = i
        return years
    }

    const initTargets = (startYear: number, endYear: number, val: number, inflation: number, curr: string, updateVal: boolean = false) => {
        if (!val || val < 0) return
        let targets: Array<APIt.TargetInput> = []
        for (let year = startYear, value = val; year <= endYear; year++, value *= (1 + (inflation / 100))) {
            let t: APIt.TargetInput | null = null
            if (wipTargets && wipTargets.length > 0) {
                t = (wipTargets.filter((t) => t.year === year))[0]
            }
            targets.push({
                year: year,
                val: t && t.val > 0 ? (updateVal ? Math.round(value) : t.val) : Math.round(value),
                curr: curr
            })
        }
        return targets
    }

    const initLoanTargets = (startYear: number, months: number, dpInPer: number, total: number, loanAnnualInt: number, curr: string) => {
        let emi = getLoanEmi(total, dpInPer, loanAnnualInt, months)
        let targets: Array<APIt.TargetInput> = []
        if (!emi || emi <= 0) return targets
        let totalMonths = months > 12 ? months - 12 : months
        let ey = months <= 12 ? startYear : startYear + Math.floor(totalMonths / 12)
        setEndYear(ey)
        for (let year = startYear; totalMonths >= 0; year++, totalMonths -= 12) {
            let extraMonths = months % 12
            let factor = 12
            if (ey - year === 0 && extraMonths !== 0) factor = extraMonths
            let annualEmiAmt = emi * factor
            targets.push({
                year: year,
                val: year === startYear ? (total * (dpInPer / 100)) + annualEmiAmt : annualEmiAmt,
                curr: curr,
            })
        }
        console.log("New targets: ", targets)
        return targets
    }

    const getLoanEmi = (total: number, dpInPer: number, annualInt: number, dur: number) => {
        let emi = getEmi(total, dpInPer, annualInt, dur)
        if (emi) return Math.round(emi)
        return null
    }

    const [startYear, setStartYear] = useState(minStartYear + 1)
    const [endYear, setEndYear] = useState(startYear)
    const [syOptions] = useState(initYearOptions(startYear, 50))
    const [eyOptions, setEYOptions] = useState(initYearOptions(startYear, 100))
    const [amount, setAmount] = useState(100000)
    const [name, setName] = useState("")
    const [inflation, setInflation] = useState(3)
    const [loan, setLoan] = useState(false)
    const [loanDPInPer, setLoanDPInPer] = useState(20)
    const [loanAnnualInt, setLoanAnnualInt] = useState(4)
    const [loanMonths, setLoanMonths] = useState(60)
    const [currency, setCurrency] = useState("USD")
    const [wipTargets, setWIPTargets] = useState<Array<APIt.TargetInput>>(initTargets(startYear, endYear, amount, inflation, currency) as Array<APIt.TargetInput>)
    const [allGoals, setAllGoals] = useState<Array<APIt.CreateGoalInput> | null>(null)

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
            targets: wipTargets,
            imp: APIt.LMH.H,
            ra: APIt.LMH.L
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

    const changeWIPTargets = (newTargets: Array<APIt.TargetInput>) => {
        setWIPTargets([...newTargets])
    }

    const changeTargetVal = (val: number, i: number) => {
        wipTargets[i].val = val
        changeWIPTargets(wipTargets)
    }

    const changeStartYear = (str: string) => {
        let sy = parseInt(str)
        setEYOptions(initYearOptions(sy, 100))
        setStartYear(sy)
        changeWIPTargets(initTargets(sy, endYear, amount, inflation, currency) as Array<APIt.TargetInput>)
    }

    const changeEndYear = (str: string) => {
        let ey = parseInt(str)
        setEndYear(ey)
        changeWIPTargets(initTargets(startYear, ey, amount, inflation, currency) as Array<APIt.TargetInput>)
    }

    const changeAmount = (amt: number) => {
        if (amt <= 0) return
        setAmount(amt)
        if (loan) changeWIPTargets(initLoanTargets(startYear, loanMonths, loanDPInPer, amt, loanAnnualInt, currency) as Array<APIt.TargetInput>)
        else changeWIPTargets(initTargets(startYear, endYear, amt, inflation, currency, true) as Array<APIt.TargetInput>)
    }

    const changeLoanDPInPer = (dp: number) => {
        setLoanDPInPer(dp)
        changeWIPTargets(initLoanTargets(startYear, loanMonths, dp, amount, loanAnnualInt, currency) as Array<APIt.TargetInput>)
    }

    const changeEmiMode = (emi: boolean) => {
        setLoan(emi)
        if (emi) changeWIPTargets(initLoanTargets(startYear, loanMonths, loanDPInPer, amount, loanAnnualInt, currency) as Array<APIt.TargetInput>)
        else {
            setEndYear(startYear)
            changeWIPTargets(initTargets(startYear, startYear, amount, 0, currency, true) as Array<APIt.TargetInput>)
        }
    }

    const changeLoanInt = (int: number) => {
        setLoanAnnualInt(int)
        changeWIPTargets(initLoanTargets(startYear, loanMonths, loanDPInPer, amount, int, currency) as Array<APIt.TargetInput>)
    }
    const changeLoanDur = (dur: number) => {
        setLoanMonths(dur)
        changeWIPTargets(initLoanTargets(startYear, dur, loanDPInPer, amount, loanAnnualInt, currency) as Array<APIt.TargetInput>)
    }

    const changeInflation = (infl: number) => {
        setInflation(infl)
        changeWIPTargets(initTargets(startYear, endYear, amount, infl, currency, true) as Array<APIt.TargetInput>)
    }

    const changeCurrency = (curr: string) => {
        setCurrency(curr)
        if(loan) changeWIPTargets(initLoanTargets(startYear, loanMonths, loanDPInPer, amount, loanAnnualInt, curr) as Array<APIt.TargetInput>)
        else changeWIPTargets(initTargets(startYear, endYear, amount, inflation, curr, true) as Array<APIt.TargetInput>)
    }

    return (
        <div className="ml-2 mr-2 md:ml-4 md:mr-4">
            <Input
                pre="Name"
                type="text"
                placeholder="My Goal"
                value={name}
                changeHandler={(e: React.FormEvent<HTMLInputElement>) => setName(e.currentTarget.value)}
                width="200px"
            />
            <Input
                name="currency"
                pre="Currency"
                value={currency}
                options={getCurrencyList()}
                changeHandler={(e: React.FormEvent<HTMLInputElement>) => changeCurrency(e.currentTarget.value)}
                width="200px"
            />
            <div className="flex flex-wrap items-center">
                <Input name="sy"
                    pre="Start Year"
                    value={startYear}
                    changeHandler={(e: React.FormEvent<HTMLInputElement>) => changeStartYear(e.currentTarget.value)}
                    options={syOptions}
                />
                {!loan && <Input name="ey"
                    pre="End Year"
                    value={endYear}
                    changeHandler={(e: React.FormEvent<HTMLInputElement>) => changeEndYear(e.currentTarget.value)}
                    options={eyOptions}
                />}
                <div className="flex items-end mr-4">

                    <Input
                        name="amount"
                        pre="Amount"
                        value={amount}
                        currency={currency}
                        changeHandler={(e: React.FormEvent<HTMLInputElement>) => changeAmount(e.currentTarget.valueAsNumber)}
                        width="100px"
                        min="100"
                    />
                    <Toggle text="Emi" attr={loan} setter={changeEmiMode} />
                </div>
                {!loan && endYear > startYear && <div className="ml-4 md:ml-8"><Input
                    pre="Value changes"
                    post="every year"
                    unit="%"
                    value={inflation}
                    float="0.1"
                    changeHandler={(e: React.FormEvent<HTMLInputElement>) => changeInflation(e.currentTarget.valueAsNumber)}
                    min="-20"
                    max="20"
                /></div>}
            </div>
            <div className="mt-4">
                {loan &&
                    <div className="flex flex-wrap justify-between">
                        <Input
                            pre="Down payment"
                            unit="%"
                            value={loanDPInPer}
                            changeHandler={(e: React.FormEvent<HTMLInputElement>) => changeLoanDPInPer(e.currentTarget.valueAsNumber)}
                            float="0.1"
                            min="0"
                            max="90" />

                        <Input
                            pre="Interest rate"
                            unit="%"
                            value={loanAnnualInt}
                            changeHandler={(e: React.FormEvent<HTMLInputElement>) => changeLoanInt(e.currentTarget.valueAsNumber)}
                            float="0.1"
                            min="0"
                            max="50" />

                        <Input
                            pre="Duration"
                            unit="months"
                            value={loanMonths}
                            changeHandler={(e: React.FormEvent<HTMLInputElement>) => changeLoanDur(e.currentTarget.valueAsNumber)}
                            min="6"
                            max="360" />
                    </div>
                }
            </div>

            {(loan || endYear > startYear) && <p className="font-bold mt-8">Money Needed to Meet the Goal</p>}
            <div className="flex flex-wrap">
                {(loan || endYear > startYear) && wipTargets && wipTargets.map((t, i) =>
                    <div key={"t" + i}>
                        <Input
                            pre={`${t.year}`}
                            currency={currency}
                            value={t.val}
                            changeHandler={(e: React.FormEvent<HTMLInputElement>) => changeTargetVal(e.currentTarget.valueAsNumber, i)}
                            min="0"
                            width="100px"
                        />
                    </div>)}
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
                        </li>
                        <li className="mt-4">Chart</li>
                        <li className="mt-4 ml-4">
                            {g.targets && g.targets.map((t: APIt.TargetInput, i: number) =>
                                <div key={"milestone" + i} className="flex flex-wrap flex-col">
                                    <label>{t.year}</label>
                                    <label className="mt-2">{toCurrency(t.val, t.curr)}</label>
                                </div>)}
                        </li>
                    </ul>)}
            </div>
        </div>
    )
}

export default Goals