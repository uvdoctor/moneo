import React, { useState, useEffect } from 'react'
import TextInput from '../form/textinput'
import SelectInput from '../form/selectinput'
import NumberInput from '../form/numberinput'
import SVGRemove from '../svgremove'
import { API, graphqlOperation } from 'aws-amplify'
import * as mutations from '../../graphql/mutations'
import * as queries from '../../graphql/queries';
import * as APIt from '../../api/goals'
import { getCriticalityOptions, getRAOptions } from '../utils'
import { toCurrency } from '../utils'
import TimeCost from '../calc/timecost'
import EmiCost from '../calc/emicost'
import { getTotalInt } from '../calc/finance'

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

    const initLoanTargets = (emi: number, startYear: number, months: number, dpInPer: number, total: number, curr: string) => {
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

    const [startYear, setStartYear] = useState(minStartYear + 1)
    const [endYear, setEndYear] = useState(startYear)
    const [syOptions] = useState(initYearOptions(startYear, 50))
    const [eyOptions, setEYOptions] = useState(initYearOptions(startYear, 100))
    const [amount, setAmount] = useState(100000)
    const [name, setName] = useState("")
    const [inflation, setInflation] = useState(3)
    const [loan, setLoan] = useState(false)
    const [emi, setEmi] = useState(0)
    const [loanMonths, setLoanMonths] = useState(0)
    const [loanDPInPer, setLoanDPInPer] = useState(0)
    const [currency, setCurrency] = useState("USD")
    const [criticality, setCriticality] = useState(APIt.LMH.H)
    const [ra, setRA] = useState(APIt.LMH.L)
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
            imp: criticality,
            ra: ra
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

    const emiChanged = (emi: number, loanDPInPer: number, loanMonths: number) => {
        setEmi(emi)
        setLoanMonths(loanMonths)
        setLoanDPInPer(loanDPInPer)
    }

    useEffect(() => {
        if(loan) changeWIPTargets(initLoanTargets(emi, startYear, loanMonths, loanDPInPer, amount, currency) as Array<APIt.TargetInput>)
    }, [emi, loanMonths, loanDPInPer, loan, currency, startYear])

    useEffect(() => {
        if (!loan) changeWIPTargets(initTargets(startYear, endYear, amount, inflation, currency, true) as Array<APIt.TargetInput>)
    }, [startYear, endYear, amount, inflation, currency, loan])

    const changeEmiMode = (emi: boolean) => {
        setLoan(emi)
        if (!emi) {
            setEndYear(startYear)
        }
    }

    return (
        <div className="ml-2 mr-2 md:ml-4 md:mr-4">
            <div className="flex justify-between items-center">
                <TextInput
                    name="name"
                    pre="Goal Name"
                    placeholder="My Goal"
                    value={name}
                    changeHandler={(e: React.FormEvent<HTMLInputElement>) => setName(e.currentTarget.value)}
                    width="200px"
                />
                <SelectInput name="criticality"
                    pre="Criticality"
                    value={criticality}
                    changeHandler={(e: React.FormEvent<HTMLSelectElement>) => setCriticality(e.currentTarget.value as APIt.LMH)}
                    options={getCriticalityOptions()}
                />
                <SelectInput name="ra"
                    pre="Investment Loss Appetite"
                    value={ra}
                    changeHandler={(e: React.FormEvent<HTMLSelectElement>) => setRA(e.currentTarget.value as APIt.LMH)}
                    options={getRAOptions()}
                />
            </div>
            <div className="flex items-center">
                <NumberInput
                    name="amount"
                    pre="Amount"
                    value={amount}
                    currency={currency}
                    changeHandler={(e: React.FormEvent<HTMLInputElement>) => setAmount(e.currentTarget.valueAsNumber)}
                    currencyHandler={(e: React.FormEvent<HTMLSelectElement>) => setCurrency(e.currentTarget.value)}
                    width="100px"
                    min="100"
                    max="10000000"
                />
            </div>
            <div className="mt-4">
                <EmiCost amount={amount} currency={currency} emiHandler={emiChanged} borrow={false} borrowModeHandler={changeEmiMode} />
            </div>
            <div className="flex justify-center mt-4">
                <TimeCost amount={!loan ? amount : amount + getTotalInt(amount, loanDPInPer, emi, loanMonths)} currency={currency} workHoursPerWeek={60} annualWorkWeeks={47} />
            </div>
            <div className="flex flex-wrap items-center justify-center">
                <SelectInput name="sy"
                    pre="Start Year"
                    value={startYear}
                    changeHandler={(e: React.FormEvent<HTMLSelectElement>) => changeStartYear(e.currentTarget.value)}
                    options={syOptions}
                />

                {!loan && <SelectInput name="ey"
                    pre="End Year"
                    value={endYear}
                    changeHandler={(e: React.FormEvent<HTMLSelectElement>) => changeEndYear(e.currentTarget.value)}
                    options={eyOptions}
                />}
                {!loan && endYear > startYear && <NumberInput
                    name="inflation"
                    pre="Auto change"
                    post="every year"
                    unit="%"
                    value={inflation}
                    float="0.1"
                    changeHandler={(e: React.FormEvent<HTMLInputElement>) => setInflation(e.currentTarget.valueAsNumber)}
                    min="-20"
                    max="20"
                />}
            </div>
            

            {(loan || endYear > startYear) && <p className="font-bold mt-8">Money Needed to Meet the Goal</p>}
            <div className="flex flex-wrap">
                {(loan || endYear > startYear) && wipTargets && wipTargets.map((t, i) =>
                    <div key={"t" + i}>
                        <NumberInput
                            name="year"
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