import React, { useEffect, useState, Fragment } from 'react'
import Goal from './goal'
import { removeFromArray } from '../utils'
import CFChart from './cfchart'
import * as APIt from '../../api/goals'
import { getGoalsList, createNewGoal, changeGoal, deleteGoal, getDuration, createNewGoalInput, getGoalTypes, getImpOptions } from './goalutils'
import { calculateCFs } from './cfutils'
import Summary from './summary'
import RangeInput from '../form/rangeinput'
import SelectInput from '../form/selectinput'
import HToggle from '../horizontaltoggle'
//@ts-ignore
import { AwesomeButton } from 'react-awesome-button'
import CurrencyInput from '../form/currencyinput'

export default function Goals() {
    const [allGoals, setAllGoals] = useState<Array<APIt.CreateGoalInput> | null>([])
    const [allCFs, setAllCFs] = useState<Object>({})
    const [wipGoal, setWIPGoal] = useState<APIt.CreateGoalInput | null>(null)
    const [firstYear, setFirstYear] = useState<number>(0)
    const [lastYear, setLastYear] = useState<number>(0)
    const [fromYear, setFromYear] = useState<number>(0)
    const [toYear, setToYear] = useState<number>(0)
    const [mustCFs, setMustCFs] = useState<Object>({})
    const [tryCFs, setTryCFs] = useState<Object>({})
    const [optCFs, setOptCFs] = useState<Object>({})
    const [viewMode, setViewMode] = useState<number>(0)
    const [impFilter, setImpFilter] = useState<string>("")
    const [currency, setCurrency] = useState<string>("USD")

    useEffect(() => {
        loadAllGoals()
    }, [])

    const loadAllGoals = async () => {
        let goals: Array<APIt.CreateGoalInput> | null = await getGoalsList()
        if (!goals) return
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
        setAllGoals([...allGoals as Array<APIt.CreateGoalInput>])
    }

    const cancelGoal = () => setWIPGoal(null)

    const editGoal = (id: string) => {
        if (!allGoals) return
        let g: Array<APIt.CreateGoalInput> = allGoals.filter(g => g.id === id)
        if (g && g.length === 1) {
            setWIPGoal(g[0])
        }
    }

    const createGoal = (type: APIt.GoalType) => setWIPGoal(createNewGoalInput(type))

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
            cfList.x.push(year)
            //@ts-ignore
            cfList.y.push(0)
        }
        return cfList
    }

    const populateData = (obj: Object, cfs: Array<number>, sy: number, firstYear: number) => {
        cfs.forEach((cf, i) => {
            //@ts-ignore
            obj.y[sy + i - firstYear] += cf
        })
    }

    const createChartData = () => {
        if (!allGoals) return
        let yearRange = getYearRange()
        setFirstYear(yearRange.from)
        setFromYear(yearRange.from)
        setToYear(yearRange.to)
        setLastYear(yearRange.to)
        let mustCFs = populateWithZeros(yearRange.from, yearRange.to)
        let tryCFs = populateWithZeros(yearRange.from, yearRange.to)
        let optCFs = populateWithZeros(yearRange.from, yearRange.to)
        allGoals?.forEach(g => {
            //@ts-ignore
            let cfs: Array<number> = allCFs[g.id]
            if (!cfs) return
            if (g.imp === APIt.LMH.H) populateData(mustCFs, cfs, g.sy, yearRange.from)
            else if (g.imp === APIt.LMH.M) populateData(tryCFs, cfs, g.sy, yearRange.from)
            else populateData(optCFs, cfs, g.sy, yearRange.from)
        })
        setMustCFs(mustCFs)
        setOptCFs(optCFs)
        setTryCFs(tryCFs)
    }

    useEffect(() => createChartData(), [allGoals])

    const changeYears = (val: Array<number>) => {
        setFromYear(val[0])
        setToYear(val[1])
    }

    return (
        <Fragment>
            {!wipGoal && <div className="flex flex-wrap justify-around">
                {Object.keys(getGoalTypes()).map(key =>
                    <AwesomeButton className="mt-4" type="primary" ripple size="medium" key={key} onPress={() => createGoal(key as APIt.GoalType)}>
                        {getGoalTypes()[key as APIt.GoalType]}
                    </AwesomeButton>)}
            </div>}
            {wipGoal ?
                <div className="overflow-x-hidden overflow-y-auto fixed inset-0 outline-none focus:outline-none">
                    <div className="relative bg-white border-0">
                        <Goal goal={wipGoal as APIt.CreateGoalInput} addCallback={addGoal} cancelCallback={cancelGoal}
                            updateCallback={updateGoal} />
                    </div>
                </div>
                :
                allGoals && allCFs && <Fragment>
                    {firstYear > 0 && lastYear > 0 &&
                        <div className="mt-4 mb-2 md:mt-8 flex justify-center items-baseline text-base md:text-lg">
                            <div className="flex flex-col items-center justify-center mr-8 md:mr-12">
                                <HToggle leftText="Goals" rightText="Cash Flows" value={viewMode} setter={setViewMode} />
                                <div className={`flex w-full ${viewMode < 1 ? 'justify-start' : 'justify-between'} items-center`}>
                                    <SelectInput name="typeFilter" pre="" options={getImpOptions()} value={impFilter as string} changeHandler={setImpFilter} />
                                    {viewMode > 0 && <CurrencyInput name="currInput" value={currency} changeHandler={setCurrency} />}
                                </div>
                            </div>
                            <RangeInput value={[fromYear, toYear]} min={firstYear} max={lastYear} allowCross={false} changeHandler={changeYears} />
                        </div>}
                    {viewMode > 0 ? <CFChart mustCFs={mustCFs} tryCFs={tryCFs} optCFs={optCFs} fromYear={fromYear} toYear={toYear} impFilter={impFilter} />
                        : fromYear > 0 && toYear > 0 && <Fragment>
                            <div className="w-full flex flex-wrap justify-around shadow-xl rounded overflow-hidden">
                                {allGoals.map((g: APIt.CreateGoalInput, i: number) =>
                                    //@ts-ignore
                                    g.ey >= fromYear && g.ey <= toYear && (!impFilter || impFilter === g.imp as string) && <Summary key={"g" + i} id={g.id} name={g.name} type={g.type} imp={g.imp} startYear={g.sy} currency={g.ccy} cfs={allCFs[g?.id]} deleteCallback={removeGoal} editCallback={editGoal} />)}
                            </div>
                        </Fragment>}
                </Fragment>
            }
        </Fragment >
    )
}
