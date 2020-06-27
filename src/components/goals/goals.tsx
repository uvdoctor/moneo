import React, { useEffect, useState, Fragment } from 'react'
import Goal from './goal'
import { removeFromArray, initYearOptions } from '../utils'
import CFChart from './cfchart'
import * as APIt from '../../api/goals'
import { getGoalsList, createNewGoal, changeGoal, deleteGoal, getDuration } from './goalutils'
import { calculateCFs } from './cfutils'
import SelectInput from '../form/selectinput'

export default function Goals() {
    const [allGoals, setAllGoals] = useState<Array<APIt.CreateGoalInput> | null>([])
    const [showModal, setShowModal] = useState<boolean>(false)
    const [wipGoal, setWIPGoal] = useState<APIt.CreateGoalInput | null>(null)
    const [mustCFs, setMustCFs] = useState<any>(null)
    const [tryCFs, setTryCFs] = useState<any>(null)
    const [optCFs, setOptCFs] = useState<any>(null)
    const [firstYear, setFirstYear] = useState<number>(0)
    const [lastYear, setLastYear] = useState<number>(0)
    const [fromYear, setFromYear] = useState<number>(0)
    const [toYear, setToYear] = useState<number>(0)
    const [fyOptions, setFYOptions] = useState([])
    const [tyOptions, setTYOptions] = useState([])

    useEffect(() => {
        loadAllGoals()
    }, [])

    const loadAllGoals = async () => {
        let goals = await getGoalsList()
        setAllGoals(goals)
        setWIPGoal(null)
    }

    const addGoal = async (goal: APIt.CreateGoalInput) => {
        console.log('Going to add goal...')
        let newGoal = await createNewGoal(goal)
        if (!newGoal) return
        allGoals?.push(newGoal as APIt.CreateGoalInput)
        setAllGoals([...allGoals as Array<APIt.CreateGoalInput>])
        setWIPGoal(null)
        setShowModal(false)
        console.log("Goal added...")
    }

    const updateGoal = async (goal: APIt.CreateGoalInput) => {
        let g: APIt.CreateGoalInput | null = await changeGoal(goal)
        if (!g) return
        removeFromArray(allGoals as Array<APIt.CreateGoalInput>, 'id', goal.id)
        allGoals?.push(g as APIt.CreateGoalInput)
        setWIPGoal(null)
        setShowModal(false)
        setAllGoals([...allGoals as Array<APIt.CreateGoalInput>])
    }

    const removeGoal = async (id: string) => {
        console.log("Going to remove goal...")
        let result = await deleteGoal(id)
        if (!result) return false
        removeFromArray(allGoals as Array<APIt.CreateGoalInput>, 'id', id)
        setAllGoals([...allGoals as Array<APIt.CreateGoalInput>])
        setWIPGoal(null)
        setShowModal(false)
    }

    const cancelGoal = () => {
        setWIPGoal(null)
        setShowModal(false)
    }

    const editGoal = (goal: APIt.CreateGoalInput) => {
        setWIPGoal(goal)
        setShowModal(true)
    }

    const getYearRange = () => {
        let firstYear: number = 0
        let lastYear: number = 0
        allGoals?.forEach((g, i) => {
            if (i === 0) firstYear = g.sy
            else if (g.sy < firstYear) firstYear = g.sy
            let duration = getDuration(g.type, g.sa as number, g.sy, g.ey)
            if (i === 0) lastYear = g.sy + duration
            else if (g.sy + duration > lastYear) lastYear = g.sy + duration
        })
        return { from: firstYear, to: lastYear }
    }

    const populateWithZeros = (firstYear: number, lastYear: number) => {
        let cfList: any = { x: [], y: [] }
        for (let year = firstYear; year <= lastYear; year++) {
            //@ts-ignore
            cfList.y.push(year)
            //@ts-ignore
            cfList.x.push(0)
        }
        return cfList
    }

    const createChartData = () => {
        if (!allGoals) return
        console.log("All goals are...", allGoals)
        let yearRange = getYearRange()
        setFromYear(yearRange.from)
        setFirstYear(yearRange.from)
        setToYear(yearRange.to)
        setLastYear(yearRange.to)
        setFYOptions(initYearOptions(yearRange.from, yearRange.to))
        setTYOptions(initYearOptions(yearRange.from, yearRange.to))
        let mustCFs = populateWithZeros(yearRange.from, yearRange.to)
        let tryCFs = populateWithZeros(yearRange.from, yearRange.to)
        let optCFs = populateWithZeros(yearRange.from, yearRange.to)
        allGoals?.forEach(g => {
            let duration = getDuration(g.type, g.sa as number, g.sy, g.ey)
            let cfs: Array<number> = calculateCFs(g, duration)
            if (g.imp === APIt.LMH.H) {
                cfs.forEach((cf, i) => {
                    //@ts-ignore
                    mustCFs.x[g.sy + i - yearRange.from] += cf
                })
            } else if (g.imp === APIt.LMH.M) {
                cfs.forEach((cf, i) => {
                    //@ts-ignore
                    tryCFs.x[g.sy + i - yearRange.from] += cf
                })
            } else {
                cfs.forEach((cf, i) => {
                    //@ts-ignore
                    optCFs.x[g.sy + i - yearRange.from] += cf
                })
            }
        })
        setMustCFs(mustCFs)
        setOptCFs(optCFs)
        setTryCFs(tryCFs)
    }

    useEffect(() => {
        if (allGoals) createChartData()
    }, [allGoals])

    const changeFromYear = (str: string) => {
        setFromYear(parseInt(str))
    }
    const changeToYear = (str: string) => {
        setToYear(parseInt(str))
    }

    useEffect(() => {
        setTYOptions(initYearOptions(fromYear, lastYear))
        if(toYear < fromYear) setToYear(fromYear)
    }, [fromYear])

    return (
        <Fragment>
            <div className="mt-4 flex justify-center">
                <button className="button" onClick={() => setShowModal(true)}>
                    Create Goal
			    </button>
            </div>
            {!showModal && allGoals && mustCFs && tryCFs && optCFs && <Fragment>
                <div className="mt-4 flex justify-around">
                    <SelectInput name="fy"
                        pre="From"
                        value={fromYear}
                        changeHandler={changeFromYear}
                        options={fyOptions}
                    />
                    <SelectInput name="ty"
                        pre="To"
                        value={toYear}
                        changeHandler={changeToYear}
                        options={tyOptions}
                    />
                </div>
                <CFChart mustCFs={mustCFs} tryCFs={tryCFs} optCFs={optCFs} fromYear={fromYear} toYear={toYear} title="Cash Flow Requirements" />
            </Fragment>}
            {showModal ?
                <div className="overflow-x-hidden overflow-y-auto fixed inset-0 outline-none focus:outline-none">
                    <div className="relative bg-white border-0">
                        <Goal goal={wipGoal} summary={false} deleteCallback={removeGoal} addCallback={addGoal} cancelCallback={cancelGoal} editCallback={editGoal} updateCallback={updateGoal} />
                    </div>
                </div>
                :
                <div className="w-screen flex flex-wrap justify-around shadow-xl rounded overflow-hidden">
                    {allGoals && allGoals.map((g: APIt.CreateGoalInput, i: number) =>
                        <Goal key={"g" + i} goal={g} summary={true} addCallback={addGoal} deleteCallback={removeGoal} cancelCallback={cancelGoal} editCallback={editGoal} updateCallback={updateGoal} />)}
                </div>}
        </Fragment>
    )
}