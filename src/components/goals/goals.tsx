import React, { useEffect, useState, Fragment } from 'react'
import Goal from './goal'
import FFGoal from './ffgoal'
import { removeFromArray } from '../utils'
import CFChart from './cfchart'
import * as APIt from '../../api/goals'
import { getGoalsList, createNewGoal, changeGoal, deleteGoal, getDuration, createNewGoalInput, getGoalTypes, getImpOptions } from './goalutils'
import { calculateCFs, calculateFFCFs } from './cfutils'
import Summary from './summary'
import SelectInput from '../form/selectinput'
import HToggle from '../horizontaltoggle'
import SVGTargetPath from './svgtargetpath'

//@ts-ignore
import { AwesomeButton } from 'react-awesome-button'
import CurrencyInput from '../form/currencyinput'

interface GoalsProps {
    showModalHandler: Function
}

export default function Goals({ showModalHandler }: GoalsProps) {
    const [allGoals, setAllGoals] = useState<Array<APIt.CreateGoalInput> | null>([])
    const [allCFs, setAllCFs] = useState<any>({})
    const [wipGoal, setWIPGoal] = useState<APIt.CreateGoalInput | null>(null)
    const [mustCFs, setMustCFs] = useState<Object>({})
    const [tryCFs, setTryCFs] = useState<Object>({})
    const [optCFs, setOptCFs] = useState<Object>({})
    const [viewMode, setViewMode] = useState<number>(0)
    const [impFilter, setImpFilter] = useState<string>("")
    const [currency, setCurrency] = useState<string>("USD")

    useEffect(() => {
        loadAllGoals()
    }, [])

    useEffect(() => wipGoal ? showModalHandler(true) : showModalHandler(false), [wipGoal])

    const loadAllGoals = async () => {
        let goals: Array<APIt.CreateGoalInput> | null = await getGoalsList()
        if (!goals) return
        let allCFs = {}
        goals?.forEach((g) =>
            //@ts-ignore    
            allCFs[g.id] = g.type === APIt.GoalType.FF ? calculateFFCFs(g)
                //@ts-ignore
                : calculateCFs(g, getDuration(g.sa as number, g.sy, g.ey))
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
        if (!allGoals || !allGoals[0]) return { from: 0, to: 0 }
        let fromYear = allGoals[0].by
        let toYear = allGoals[0].ey + 2
        allGoals.forEach((g) => {
            if(g.by < fromYear) fromYear = g.by
            if(g.ey > toYear) toYear = g.ey + 2
        })
        return { from: fromYear, to: toYear }
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

    useEffect(() => createChartData(), [allGoals])

    const createChartData = () => {
        if (!allGoals || !allGoals[0]) return
        let yearRange = getYearRange()
        let mustCFs = populateWithZeros(yearRange.from, yearRange.to)
        let tryCFs = populateWithZeros(yearRange.from, yearRange.to)
        let optCFs = populateWithZeros(yearRange.from, yearRange.to)
        allGoals?.forEach(g => {
            //@ts-ignore
            let cfs: Array<number> = allCFs[g.id]
            if (!cfs) return
            if (g.imp === APIt.LMH.H) populateData(mustCFs, cfs, g.type === APIt.GoalType.FF ? g.by : g.sy, yearRange.from)
            else if (g.imp === APIt.LMH.M) populateData(tryCFs, cfs, g.sy, yearRange.from)
            else populateData(optCFs, cfs, g.sy, yearRange.from)
        })
        setMustCFs(mustCFs)
        setOptCFs(optCFs)
        setTryCFs(tryCFs)
    }

    return (
        wipGoal ?
            <div className="overflow-x-hidden overflow-y-auto fixed inset-0 outline-none focus:outline-none">
                <div className="relative bg-white border-0">
                    {wipGoal.type === APIt.GoalType.FF ?
                        <FFGoal goal={wipGoal as APIt.CreateGoalInput} addCallback={addGoal} cancelCallback={cancelGoal}
                            updateCallback={updateGoal} />
                        : <Goal goal={wipGoal as APIt.CreateGoalInput} addCallback={addGoal} cancelCallback={cancelGoal}
                            updateCallback={updateGoal} />}
                </div>
            </div>
            :
            <Fragment>
                <div className="flex mt-4 items-center justify-center">
                    <SVGTargetPath />
                    <label className="ml-2 text-xl md:text-2xl">Define Your Goals.</label>
                </div>
                <p className="text-center text-lg mt-1">Make Money Work Hard to Meet Them.</p>
                <div className="flex flex-wrap justify-around">
                    {Object.keys(getGoalTypes()).map(key =>
                        <AwesomeButton className="mt-4" type="primary" ripple size="medium" key={key}
                            onPress={() => createGoal(key as APIt.GoalType)}>
                            {getGoalTypes()[key as APIt.GoalType]}
                        </AwesomeButton>)}
                </div>
                <Fragment>
                    {allGoals && allGoals.length > 0 && allCFs &&
                        <Fragment>
                            <div className="mt-4 md:mt-8 flex justify-center">
                                {viewMode < 1 && <div className="mr-2"><SelectInput name="typeFilter" pre="" options={getImpOptions()} value={impFilter as string}
                                    changeHandler={setImpFilter} /></div>}
                                <HToggle leftText="Goals" rightText="Cash Flows" value={viewMode} setter={setViewMode} />
                                {viewMode > 0 &&
                                    <div className="flex">
                                        <label className="ml-1 mr-2">in</label>
                                        <CurrencyInput name="currInput" value={currency} changeHandler={setCurrency} />
                                    </div>}
                            </div>
                            <p className="text-center text-base mt-4">Negative values imply You Pay, while Positive values imply You Receive</p>
                            {viewMode > 0 ?
                                <CFChart mustCFs={mustCFs} tryCFs={tryCFs} optCFs={optCFs} />
                                :
                                <div className="w-full flex flex-wrap justify-around shadow-xl rounded overflow-hidden">
                                    {allGoals.map((g: APIt.CreateGoalInput, i: number) =>
                                        g.id && (!impFilter || impFilter === g.imp) &&
                                        <Summary key={"g" + i} id={g.id as string} name={g.name} type={g.type} imp={g.imp} 
                                        startYear={g.type === APIt.GoalType.FF ? g.by : g.sy}
                                            currency={g.ccy} cfs={allCFs[g.id]} deleteCallback={removeGoal} editCallback={editGoal} />)}
                                </div>}
                        </Fragment>}
                </Fragment>
            </Fragment>
    )
}