import React, { useState, Fragment, useEffect } from 'react'
import { change, changeVal } from '../utils'
import Input from '../input'
import SVGRemove from '../svgremove'
import { API, graphqlOperation } from 'aws-amplify'
import * as mutations from '../../graphql/mutations'
import * as queries from '../../graphql/queries';
import * as APIt from '../../api/goals'

const Goals = () => {
    const minStartYear = new Date().getFullYear()
    const [startYear, setStartYear] = useState(minStartYear + 1)
    const [endYear, setEndYear] = useState(startYear + 10)
    const [val, setVal] = useState(0)
    const [name, setName] = useState("")
    const [wipTargets, setWIPTargets] = useState<Array<APIt.TargetInput>>([])
    const [allGoals, setAllGoals] = useState<Array<APIt.CreateGoalInput> | null>(null)
    const [inflation, setInflation] = useState(3)

    const initTargets = (startYear: number, endYear: number, val: number, inflation: number, curr: string = "USD") => {
        console.log("Init targets invoked...")
        if (val <= 0 || startYear < minStartYear || endYear < startYear || val <= 0) return
        let targets: Array<APIt.TargetInput> = []
        for (let year = startYear, value = val; year <= endYear; year++, value *= (1 + (inflation / 100))) {
            targets.push({
                year: year,
                val: Math.round(value),
                curr: curr,
            })
        }
        setWIPTargets([...targets])
    }

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
        console.log("Array after deleting goals: ", allGoals)
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

    const showChart = () => {
        initTargets(startYear, endYear, val, inflation)
    }

    const createNewGoal = async () => {
        let goal: APIt.CreateGoalInput = {
            name: name,
            targets: wipTargets,
            imp: APIt.LMH.H
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

    const changeTargetVal = (val: string, i: number) => {
        let value: number = changeVal(val) as number
        wipTargets[i].val = value
        setWIPTargets([...wipTargets])
    }

    return (
        <Fragment>
            <div className="flex flex-col justify-center mt-4">
                <div>
                    Name
                    <input className="ml-2 inner-block px-2 font-bold appearance-none border border-2 focus:border-indigo-800" type="text" name="name"
                        placeholder="My Goal" value={name} onChange={(e: React.FormEvent<HTMLInputElement>) => setName(e.currentTarget.value)}
                        width="200px" required />
                </div>
                <Input
                    pre="Start Year"
                    value={`${startYear}`}
                    changeHandler={(e: React.FormEvent<HTMLInputElement>) => change(e, setStartYear)}
                    width="100px"
                    min="0"
                />
                <Input
                    pre="Value"
                    value={`${val}`}
                    changeHandler={(e: React.FormEvent<HTMLInputElement>) => change(e, setVal)}
                    width="100px"
                    min="0"
                />
                <Input
                    pre="End Year"
                    value={`${endYear}`}
                    changeHandler={(e: React.FormEvent<HTMLInputElement>) => change(e, setEndYear)}
                    width="100px"
                    min="0"
                />
                <Input
                    pre="Value increases"
                    post="% every year"
                    value={`${inflation}`}
                    float="0.1"
                    changeHandler={(e: React.FormEvent<HTMLInputElement>) => change(e, setInflation)}
                    width="70px"
                    min="0"
                />
                <div className="flex flex-wrap mt-4">
                    {wipTargets && wipTargets.map((t, i) =>
                        <div key={"t" + i} className="ml-4 mt-4 flex flex-col items-center justify-center">
                            <label>{t.year}</label>
                            <Input
                                value={`${t.val}`}
                                changeHandler={(e: React.FormEvent<HTMLInputElement>) => changeTargetVal(e.currentTarget.value, i)}
                                width="100px"
                                min="0"
                            />
                        </div>)}
                </div>
            </div>
            <div className="flex justify-center mt-4 mb-4">
                <button className="mt-4 button" onClick={showChart}>
                    Show Chart
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
                                    <label className="mt-2">{t.curr + t.val}</label>
                                </div>)}
                        </li>
                    </ul>)}
            </div>
        </Fragment>
    )
}

export default Goals