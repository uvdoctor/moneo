import React, { useEffect, useState, Fragment } from 'react'
import Goal from './goal'
import FFGoal from './ffgoal'
import { removeFromArray } from '../utils'
import CFChart from './cfchart'
import * as APIt from '../../api/goals'
import { createNewGoal, changeGoal, deleteGoal, createNewGoalInput, getGoalTypes, getImpOptions } from './goalutils'
import { findEarliestFFYear } from './cfutils'
import Summary from './summary'
import SelectInput from '../form/selectinput'
import HToggle from '../horizontaltoggle'
import SVGTargetPath from './svgtargetpath'
import Section from '../form/section'
//@ts-ignore
import { AwesomeButton } from 'react-awesome-button'
import NumberInput from '../form/numberinput'
import FFResult from './ffresult'
import SVGEdit from '../svgedit'
import { toast } from 'react-toastify'

interface GoalsProps {
    showModalHandler: Function
    savings: number
    annualSavings: number
    currency: string
    allGoals: Array<APIt.CreateGoalInput> | null
    allCFs: Object
    goalsLoaded: boolean
    ffGoal: APIt.CreateGoalInput | null
    allGoalsHandler: Function
    allCFsHandler: Function
    ffGoalHandler: Function
}

export default function Goals({ showModalHandler, savings, annualSavings, currency, allGoals, allCFs,
    goalsLoaded, ffGoal, allGoalsHandler, allCFsHandler, ffGoalHandler }: GoalsProps) {
    const [wipGoal, setWIPGoal] = useState<APIt.CreateGoalInput | null>(null)
    const [mustCFs, setMustCFs] = useState<Object>({})
    const [tryCFs, setTryCFs] = useState<Object>({})
    const [optCFs, setOptCFs] = useState<Object>({})
    const [mergedCFs, setMergedCFs] = useState<any>({})
    const [viewMode, setViewMode] = useState<number>(0)
    const [impFilter, setImpFilter] = useState<string>("")
    const [oppDR, setOppDR] = useState<number>(6)
    //const [rrFallDuration, setRRFallDuration] = useState<number>(5)
    const rrFallDuration = 5
    const [savingsChgRate, setSavingsChgRate] = useState<number>(3)
    const [ffYear, setFFYear] = useState<number | null>(0)
    const [ffAmt, setFFAmt] = useState<number>(0)
    const [ffLeftOverAmt, setFFLeftOverAmt] = useState<number>(0)
    const [ffCfs, setFFCfs] = useState<any>({})
    const [cfsUpdated, setCfsUpdated] = useState<boolean>(false)

    const buildEmptyMergedCFs = (fromYear: number, toYear: number) => {
        if (!ffGoal) return {}
        let mCFs = {}
        let ffToYear = ffGoal.ey + 1
        if (toYear < ffToYear) toYear = ffToYear
        for (let year = fromYear; year <= toYear; year++)
            //@ts-ignore
            mCFs[year] = 0
        return mCFs
    }

    const calculateFFYear = () => {
        if (!ffGoal) return
        let result = findEarliestFFYear(ffGoal, oppDR, rrFallDuration, savings, mergedCFs,
            annualSavings, savingsChgRate, null)
        if (result.ffYear < 0) setFFYear(null)
        else setFFYear(result.ffYear)
        setFFAmt(result.ffAmt)
        //@ts-ignore
        setFFLeftOverAmt(result.leftAmt)
        setFFCfs(result.ffCfs)
    }

    useEffect(() => {
        calculateFFYear()
    }, [oppDR, savings, annualSavings, savingsChgRate])

    useEffect(() => {
        if (!cfsUpdated) return
        calculateFFYear()
        setCfsUpdated(false)
    }, [cfsUpdated])

    useEffect(() => {
        if (!goalsLoaded) return
        let yearRange = getYearRange()
        let mustCFs = populateWithZeros(yearRange.from, yearRange.to)
        let tryCFs = populateWithZeros(yearRange.from, yearRange.to)
        let optCFs = populateWithZeros(yearRange.from, yearRange.to)
        let mCFs = buildEmptyMergedCFs(yearRange.from, yearRange.to)
        allGoals?.forEach(g => {
            //@ts-ignore
            let cfs: Array<number> = allCFs[g.id]
            if (!cfs) return
            if (g.imp === APIt.LMH.H) populateData(mustCFs, cfs, g.sy, yearRange.from)
            else if (g.imp === APIt.LMH.M) populateData(tryCFs, cfs, g.sy, yearRange.from)
            else populateData(optCFs, cfs, g.sy, yearRange.from)
            //@ts-ignore
            mergeCFs(mCFs, allCFs[g.id], g.sy)
        })
        setMustCFs(mustCFs)
        setOptCFs(optCFs)
        setTryCFs(tryCFs)
        setMergedCFs(mCFs)
        setCfsUpdated(true)
    }, [allGoals, goalsLoaded])

    useEffect(() => wipGoal ? showModalHandler(true) : showModalHandler(false), [wipGoal])


    const addGoal = async (goal: APIt.CreateGoalInput, cfs: Array<number> = []) => {
        let g = await createNewGoal(goal)
        if (!g) return
        setWIPGoal(null)
        if (g.type === APIt.GoalType.FF) {
            ffGoalHandler(g)
            return
        }
        toast.success(`Success! New Goal ${g.name} has been Created.`, { autoClose: 3000 })
        allGoals?.push(g as APIt.CreateGoalInput)
        //@ts-ignore
        allCFs[g.id] = cfs
        allCFsHandler(allCFs)
        allGoalsHandler([...allGoals as Array<APIt.CreateGoalInput>])
    }

    const updateGoal = async (goal: APIt.UpdateGoalInput, cfs: Array<number> = []) => {
        let g: APIt.UpdateGoalInput | null = await changeGoal(goal)
        if (!g) return
        setWIPGoal(null)
        if (g.type === APIt.GoalType.FF) {
            toast.success('Success! Your Financial Freedom Target has been Updated.', { autoClose: 3000 })
            ffGoalHandler(g as APIt.CreateGoalInput)
            return
        }
        toast.success(`Success! Goal ${g.name} has been Updated.`)
        removeFromArray(allGoals as Array<APIt.CreateGoalInput>, 'id', goal.id)
        allGoals?.unshift(g as APIt.CreateGoalInput)
        //@ts-ignore
        allCFs[g.id] = cfs
        allCFsHandler(allCFs)
        allGoalsHandler([...allGoals as Array<APIt.CreateGoalInput>])
    }

    const removeGoal = async (id: string) => {
        try {
            await deleteGoal(id)
        } catch (err) {
            toast.error("Sorry! Unable to delete this Goal: " + err, { autoClose: 7000 })
            return false
        }
        toast.success(`Success! Goal has been Deleted.`, { autoClose: 3000 })
        removeFromArray(allGoals as Array<APIt.CreateGoalInput>, 'id', id)
        //@ts-ignore
        delete allCFs[id]
        allCFsHandler(allCFs)
        setWIPGoal(null)
        allGoalsHandler([...allGoals as Array<APIt.CreateGoalInput>])
    }

    const cancelGoal = () => setWIPGoal(null)

    const editGoal = (id: string) => {
        if (!allGoals) return
        let g: Array<APIt.CreateGoalInput> = allGoals.filter(g => g.id === id)
        if (g && g.length === 1) {
            setWIPGoal(g[0])
        }
    }

    const createGoal = (type: APIt.GoalType) => setWIPGoal(
        createNewGoalInput(type, type === APIt.GoalType.FF ? currency : ffGoal?.ccy as string))

    const getYearRange = () => {
        let nowYear = new Date().getFullYear()
        if (!ffGoal) return { from: nowYear + 1, to: nowYear + 1 }
        if (!allGoals || !allGoals[0]) return { from: nowYear + 1, to: ffGoal.ey + 1 }
        //@ts-ignore
        let toYear = nowYear
        allGoals.forEach((g) => {
            //@ts-ignore
            let endYear = g.sy + allCFs[g.id].length
            if (endYear > toYear) toYear = endYear
        })
        return { from: nowYear + 1, to: toYear }
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
            let year = sy + i
            //@ts-ignore
            if (obj.y[year - firstYear] !== 'undefined') obj.y[year - firstYear] += cf
        })
    }

    const mergeCFs = (obj: Object, cfs: Array<number>, sy: number) => {
        cfs.forEach((cf, i) => {
            let year = sy + i
            //@ts-ignore
            if (obj[year] !== 'undefined') obj[year] += cf
        })
    }

    const calculateFFImpactYear = (mCFs: Object) => {
        if (!ffGoal) return
        if (!ffYear) return null
        let result = findEarliestFFYear(ffGoal, oppDR, rrFallDuration, savings, mCFs,
            annualSavings, savingsChgRate, ffYear)
        console.log("Result is ", result)
        console.log("FF Year is ", ffYear)
        return result.ffYear < 0 || result.ffAmt <= 0 || result.leftAmt < 0 ? null : (result.ffYear - ffYear as number)
    }

    return (
        wipGoal ?
            <div className="overflow-x-hidden overflow-y-auto fixed inset-0 outline-none focus:outline-none">
                <div className="relative bg-white border-0">
                    {wipGoal.type === APIt.GoalType.FF ?
                        <FFGoal goal={wipGoal as APIt.CreateGoalInput} addCallback={addGoal} cancelCallback={cancelGoal}
                            updateCallback={updateGoal} annualSavings={annualSavings} savingsChgRate={savingsChgRate}
                            savingsChgRateHandler={setSavingsChgRate} oppDR={oppDR} oppDRHandler={setOppDR} totalSavings={savings}
                            ffYear={ffYear} ffAmt={ffAmt} ffLeftOverAmt={ffLeftOverAmt} ffCfs={ffCfs} mergedCfs={mergedCFs}
                            ffYearHandler={setFFYear} ffAmtHandler={setFFAmt} ffLeftOverAmtHandler={setFFLeftOverAmt}
                            ffCfsHandler={setFFCfs} rrFallDuration={rrFallDuration} />
                        : ffGoal && <Goal goal={wipGoal as APIt.CreateGoalInput} addCallback={addGoal} cancelCallback={cancelGoal}
                            updateCallback={updateGoal} mergedCFs={mergedCFs} ffImpactYearsHandler={calculateFFImpactYear} ffGoalEndYear={ffGoal.ey}
                            oppDR={oppDR} rrFallDuration={rrFallDuration} ffYear={ffYear} ffAmt={ffAmt} ffLeftAmt={ffLeftOverAmt} />}
                </div>
            </div>
            :
            <Fragment>
                <div className="flex mt-4 items-center justify-center">
                    <SVGTargetPath />
                    <label className="ml-2 text-xl md:text-2xl">Define Your Dreams.</label>
                </div>
                <p className="text-center text-lg mt-1">Make Money Work Hard to Meet Them.</p>

                <div className="flex flex-wrap justify-around mb-4">
                    {Object.keys(getGoalTypes()).map(key =>
                        key !== APIt.GoalType.FF &&
                        <AwesomeButton className={`mt-4 ${!ffGoal ? 'cursor-not-allowed' : 'cursor-pointer'}`} type="primary" ripple size="medium" key={key}
                            disabled={!ffGoal} onPress={() => createGoal(key as APIt.GoalType)}>
                            {getGoalTypes()[key as APIt.GoalType]}
                        </AwesomeButton>)}
                </div>
                {ffGoal ?
                    <Fragment>
                        {ffGoal ? <div className="flex justify-center items-center">
                            <Section title={
                                <div className="flex justify-around">
                                    <label className="mr-2">Financial Freedom</label>
                                    <div onClick={() => setWIPGoal(ffGoal)}>
                                        <SVGEdit />
                                    </div>
                                </div>
                            } left={
                                <FFResult endYear={ffGoal.ey} ffAmt={ffAmt} ffLeftOverAmt={ffLeftOverAmt} ffYear={ffYear} currency={ffGoal.ccy} />
                            } bottom={
                                <div className="flex flex-wrap justify-around items-center w-full">
                                    <NumberInput name="dr" inputOrder={1}
                                        currentOrder={0}
                                        nextStepDisabled
                                        allInputDone
                                        nextStepHandler={() => true}
                                        value={oppDR} unit="%" pre="Investment" min={0} max={10}
                                        post="Earns" changeHandler={setOppDR} note="After taxes & fees" step={0.1} />
                                    <NumberInput name="asChgRate"
                                        inputOrder={1}
                                        currentOrder={0}
                                        nextStepDisabled
                                        allInputDone
                                        nextStepHandler={() => true}
                                        pre="Savings" post="Increases" note='Every Year' unit="%"
                                        min={0} max={20} step={0.1} value={savingsChgRate} changeHandler={setSavingsChgRate} />
                                </div>
                            } hasResult />
                        </div> : <div />}
                        {ffGoal && allGoals && allGoals.length > 0 && <Fragment>
                            <div className="mt-4 md:mt-8 flex justify-center">
                                {viewMode < 1 && <div className="mr-2"><SelectInput
                                    inputOrder={1}
                                    currentOrder={0}
                                    nextStepDisabled={true}
                                    allInputDone={true}
                                    nextStepHandler={() => true}
                                    name="typeFilter" pre="" options={getImpOptions()} value={impFilter as string}
                                    changeHandler={setImpFilter} /></div>}
                                <HToggle leftText="Goals" rightText={`Cash Flows in ${currency}`} value={viewMode} setter={setViewMode} />
                            </div>
                            <p className="text-center text-base mt-4">Negative values imply You Pay, while Positive values imply You Receive</p>
                            {viewMode > 0 ?
                                <CFChart mustCFs={mustCFs} tryCFs={tryCFs} optCFs={optCFs} />
                                :
                                <div className="w-full flex flex-wrap justify-around shadow-xl rounded overflow-hidden">
                                    {allGoals.map((g: APIt.CreateGoalInput, i: number) =>
                                        g.id && (!impFilter || impFilter === g.imp) &&
                                        <Summary key={"g" + i} id={g.id as string} name={g.name} type={g.type} imp={g.imp} oppDR={oppDR} savings={savings}
                                            //@ts-ignore
                                            startYear={g.sy} currency={g.ccy} cfs={allCFs[g.id]} deleteCallback={removeGoal} editCallback={editGoal}
                                            ffYear={ffYear} ffGoalEndYear={ffGoal.ey} mergedCFs={mergedCFs} rrFallDuration={rrFallDuration} ffAmt={ffAmt} ffLeftAmt={ffLeftOverAmt}
                                            ffImpactYearsCalculator={calculateFFImpactYear} />)}
                                </div>}
                        </Fragment>}
                    </Fragment>
                    : goalsLoaded && <div className="text-center align-center">
                        <p className="mt-8 md:mt-12 lg:mt-16">First Things First.</p>
                        <p className="mb-2">Set Up Financial Freedom Target.</p>
                        <AwesomeButton ripple type="primary" onPress={() => createGoal(APIt.GoalType.FF)}>
                            GET STARTED
                        </AwesomeButton>
                    </div>}
            </Fragment>
    )
}