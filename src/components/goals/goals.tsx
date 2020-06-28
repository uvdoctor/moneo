import React, { useEffect, useState, Fragment } from 'react'
import Goal from './goal'
import { removeFromArray, initYearOptions } from '../utils'
import CFChart from './cfchart'
import * as APIt from '../../api/goals'
import { getGoalsList, createNewGoal, changeGoal, deleteGoal, getDuration, createNewGoalInput } from './goalutils'
import { calculateCFs } from './cfutils'
import SelectInput from '../form/selectinput'

export default function Goals() {
    const [allGoals, setAllGoals] = useState<Array<APIt.CreateGoalInput> | null>([])
    const [allCFs, setAllCFs] = useState<Object>({})
    const [showModal, setShowModal] = useState<boolean>(false)
    const [wipGoal, setWIPGoal] = useState<APIt.CreateGoalInput | null>(null)
    const [mustCFs, setMustCFs] = useState<any>(null)
    const [tryCFs, setTryCFs] = useState<any>(null)
    const [optCFs, setOptCFs] = useState<any>(null)
    const [lastYear, setLastYear] = useState<number>(0)
    const [fromYear, setFromYear] = useState<number>(0)
    const [toYear, setToYear] = useState<number>(0)
    const [fyOptions, setFYOptions] = useState([])
    const [tyOptions, setTYOptions] = useState([])

    useEffect(() => {
        loadAllGoals()
    }, [])

    const loadAllGoals = async () => {
        let goals: Array<APIt.CreateGoalInput> | null = await getGoalsList()
        if(!goals) return
        let allCFs = {}
        goals?.forEach((g) => 
            //@ts-ignore
            allCFs[g.id] = calculateCFs(g, getDuration(g.type, g.sa as number, g.sy, g.ey))
        )
        setAllCFs(allCFs)
        setWIPGoal(null)
        setAllGoals([...goals])
    }

    const addGoal = async (goal: APIt.CreateGoalInput, cfs: Array<number>) => {
        let g = await createNewGoal(goal)
        if (!g) return
        allGoals?.push(g as APIt.CreateGoalInput)
        //@ts-ignore
        allCFs[g.id] = cfs
        setAllCFs(allCFs)
        setWIPGoal(null)
        setShowModal(false)
        setAllGoals([...allGoals as Array<APIt.CreateGoalInput>])
    }

    const updateGoal = async (goal: APIt.UpdateGoalInput, cfs: Array<number>) => {
        let g: APIt.UpdateGoalInput | null = await changeGoal(goal)
        if (!g) return
        removeFromArray(allGoals as Array<APIt.CreateGoalInput>, 'id', goal.id)
        allGoals?.push(g as APIt.CreateGoalInput)
        //@ts-ignore
        allCFs[g.id] = cfs
        setWIPGoal(null)
        setShowModal(false)
        setAllCFs(allCFs)
        setAllGoals([...allGoals as Array<APIt.CreateGoalInput>])
    }

    const removeGoal = async (id: string) => {
        let result = await deleteGoal(id)
        if (!result) return false
        removeFromArray(allGoals as Array<APIt.CreateGoalInput>, 'id', id)
        //@ts-ignore
        delete allCFs[id]
        setAllCFs(allCFs)
        setWIPGoal(null)
        setShowModal(false)
        setAllGoals([...allGoals as Array<APIt.CreateGoalInput>])
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

    const populateData = (obj: Object, cfs: Array<number>, sy: number, firstYear: number) => {
        cfs.forEach((cf, i) => {
            //@ts-ignore
            obj.x[sy + i - firstYear] += cf
        })
    }

    const createChartData = () => {
        if (!allGoals) return
        console.log("All goals for creating chart are...", allGoals)
        let yearRange = getYearRange()
        setFromYear(yearRange.from)
        setToYear(yearRange.to)
        setLastYear(yearRange.to)
        setFYOptions(initYearOptions(yearRange.from, yearRange.to))
        setTYOptions(initYearOptions(yearRange.from, yearRange.to))
        let mustCFs = populateWithZeros(yearRange.from, yearRange.to)
        let tryCFs = populateWithZeros(yearRange.from, yearRange.to)
        let optCFs = populateWithZeros(yearRange.from, yearRange.to)
        allGoals?.forEach(g => {
            //@ts-ignore
            let cfs: Array<number> = allCFs[g.id]
            if(!cfs) return
            if (g.imp === APIt.LMH.H) populateData(mustCFs, cfs, g.sy, yearRange.from)
            else if (g.imp === APIt.LMH.M) populateData(tryCFs, cfs, g.sy, yearRange.from)
            else populateData(optCFs, cfs, g.sy, yearRange.from)
        })
        setMustCFs(mustCFs)
        setOptCFs(optCFs)
        setTryCFs(tryCFs)
    }

    useEffect(() => {
        if (allCFs && allGoals) createChartData()
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

    const createGoal = (type: APIt.GoalType) => {
        let g: APIt.CreateGoalInput = createNewGoalInput(type)
        setWIPGoal(g)
        setShowModal(true)
    }

    return (
        <Fragment>
            <div className="mt-4 flex flex-wrap justify-around">
                <button className="button" onClick={() => createGoal(APIt.GoalType.B)}>
                    Buy
			    </button>
                <button className="button" onClick={() => createGoal(APIt.GoalType.R)}>
                    Rent
			    </button>
                <button className="button" onClick={() => createGoal(APIt.GoalType.X)}>
                    Experience
			    </button>
            </div>
            {!showModal && allGoals && mustCFs && tryCFs && optCFs && fromYear > 0 && toYear > 0 && <Fragment>
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
                        <Goal goal={wipGoal as APIt.CreateGoalInput} deleteCallback={removeGoal} addCallback={addGoal} cancelCallback={cancelGoal} 
                        editCallback={editGoal} updateCallback={updateGoal} />
                    </div>
                </div>
                :
                <div className="w-screen flex flex-wrap justify-around shadow-xl rounded overflow-hidden">
                    {allGoals && allGoals.map((g: APIt.CreateGoalInput, i: number) =>
                        //@ts-ignore
                        <Goal key={"g" + i} goal={g} cashFlows={allCFs[g?.id]} addCallback={addGoal} deleteCallback={removeGoal} cancelCallback={cancelGoal} editCallback={editGoal} updateCallback={updateGoal} />)}
                </div>}
        </Fragment>
    )
}