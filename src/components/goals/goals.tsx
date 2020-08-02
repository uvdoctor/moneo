import React, { useEffect, useState, Fragment } from 'react'
import Goal from './goal'
import FFGoal from './ffgoal'
import { buildYearsArray, removeFromArray, toCurrency } from '../utils'
import CFChart from './cfchart'
import AAChart from './aachart'
import * as APIt from '../../api/goals'
import { createNewGoal, changeGoal, deleteGoal, createNewGoalInput, getGoalTypes, getImpOptions } from './goalutils'
import { findEarliestFFYear } from './cfutils'
import Summary from './summary'
import SelectInput from '../form/selectinput'
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
    savingsChgRate: number
    currency: string
    allGoals: Array<APIt.CreateGoalInput> | null
    allCFs: Object
    goalsLoaded: boolean
    ffGoal: APIt.CreateGoalInput | null
    aa: Object
    rr: Array<number>
    pp: Object
    aaHandler: Function
    rrHandler: Function
    allGoalsHandler: Function
    allCFsHandler: Function
    ffGoalHandler: Function
    savingsChgRateHandler: Function
}

export default function Goals({ showModalHandler, savings, annualSavings, savingsChgRate, currency, allGoals, allCFs,
    goalsLoaded, ffGoal, aa, rr, pp, aaHandler, rrHandler, allGoalsHandler, allCFsHandler, ffGoalHandler, savingsChgRateHandler }: GoalsProps) {
    const [wipGoal, setWIPGoal] = useState<APIt.CreateGoalInput | null>(null)
    const [mustCFs, setMustCFs] = useState<Array<number>>([])
    const [tryCFs, setTryCFs] = useState<Array<number>>([])
    const [optCFs, setOptCFs] = useState<Array<number>>([])
    const [mergedCFs, setMergedCFs] = useState<any>({})
    const [impFilter, setImpFilter] = useState<string>("")
    const [ffYear, setFFYear] = useState<number | null>(0)
    const [ffAmt, setFFAmt] = useState<number>(0)
    const [ffLeftOverAmt, setFFLeftOverAmt] = useState<number>(0)
    const [ffCfs, setFFCfs] = useState<any>({})
    const goalsLabel = "Goals"
    const cfLabel = "Cash Flows"
    const aaLabel = "Asset Allocation"
    const viewItems = [goalsLabel, cfLabel, aaLabel]
    const [viewMode, setViewMode] = useState(goalsLabel)
    const nowYear = new Date().getFullYear()

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
        let result = findEarliestFFYear(ffGoal, savings, mergedCFs,
            annualSavings, savingsChgRate, null, mustCFs, tryCFs, 50000, 3, pp)
        if (result.ffYear < 0) setFFYear(null)
        else setFFYear(result.ffYear)
        setFFAmt(result.ffAmt)
        //@ts-ignore
        setFFLeftOverAmt(result.leftAmt + ffGoal.sa)
        setFFCfs(result.ffCfs)
        aaHandler(result.aa)
        rrHandler([...result.rr])
    }

    useEffect(() => {
        calculateFFYear()
    }, [savings, annualSavings, savingsChgRate, mustCFs])

    useEffect(() => {
        if (!allGoals || allGoals.length === 0) return
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
        setMustCFs([...mustCFs])
        setOptCFs([...optCFs])
        setTryCFs([...tryCFs])
        setMergedCFs(mCFs)
    }, [allGoals])

    useEffect(() => wipGoal ? showModalHandler(true) : showModalHandler(false), [wipGoal])

    const addGoal = async (goal: APIt.CreateGoalInput, cfs: Array<number> = []) => {
        let g = null
        try {
            g = await createNewGoal(goal)
        } catch (err) {
            toast.error("Sorry! Unable to create this Goal: " + err, { autoClose: 7000 })
            return false
        }
        if (!g) return false
        setWIPGoal(null)
        if (g.type === APIt.GoalType.FF) {
            ffGoalHandler(g)
            return true
        }
        toast.success(`Success! New Goal ${g.name} has been Created.`, { autoClose: 3000 })
        allGoals?.push(g as APIt.CreateGoalInput)
        //@ts-ignore
        allCFs[g.id] = cfs
        allCFsHandler(allCFs)
        allGoalsHandler([...allGoals as Array<APIt.CreateGoalInput>])
    }

    const updateGoal = async (goal: APIt.UpdateGoalInput, cfs: Array<number> = []) => {
        let g: APIt.UpdateGoalInput | null = null
        try {
            g = await changeGoal(goal)
        } catch (err) {
            toast.error("Sorry! Unable to update this Goal: " + err, { autoClose: 7000 })
            return false
        }
        if (!g) return false
        setWIPGoal(null)
        if (g.type === APIt.GoalType.FF) {
            toast.success('Success! Your Financial Freedom Target has been Updated.', { autoClose: 3000 })
            ffGoalHandler(g as APIt.CreateGoalInput)
            return true
        }
        toast.success(`Success! Goal ${g.name} has been Updated.`)
        removeFromArray(allGoals as Array<APIt.CreateGoalInput>, 'id', goal.id)
        allGoals?.unshift(g as APIt.CreateGoalInput)
        //@ts-ignore
        allCFs[g.id] = cfs
        allCFsHandler(allCFs)
        allGoalsHandler([...allGoals as Array<APIt.CreateGoalInput>])
        return true
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
        let fromYear = nowYear + 1
        if (!ffGoal) return { from: fromYear, to: fromYear }
        let toYear = nowYear + 1
        if (!allGoals || !allGoals[0]) return { from: fromYear, to: toYear }
        allGoals.forEach((g) => {
            //@ts-ignore
            let endYear = g.sy + allCFs[g.id].length
            if (endYear > toYear) toYear = endYear
        })
        if (toYear > ffGoal.ey + 1) toYear = ffGoal.ey + 1
        return { from: fromYear, to: toYear }
    }

    const populateWithZeros = (firstYear: number, lastYear: number) => {
        let cfs: Array<number> = []
        for (let year = firstYear; year <= lastYear; year++) {
            cfs.push(0)
        }
        return cfs
    }

    const populateData = (totalCfs: Array<number>, cfs: Array<number>, sy: number, firstYear: number) => {
        let firstIndex = sy - firstYear
        cfs.forEach((cf, i) => {
            if (firstIndex + i >= 0) totalCfs[firstIndex + i] += cf
        })
    }

    const mergeCFs = (obj: Object, cfs: Array<number>, sy: number) => {
        cfs.forEach((cf, i) => {
            let year = sy + i
            //@ts-ignore
            if (obj[year] !== 'undefined') obj[year] += cf
        })
    }

    const calculateFFImpactYear = (startYear: number, cfs: Array<number>, goalId: string) => {
        if (!ffGoal || !ffYear) return null
        let mCFs = Object.assign({}, mergedCFs)
        if (goalId) {
            //@ts-ignore
            let existingCFs = allCFs[goalId]
            existingCFs.forEach((cf: number, i: number) => {
                //@ts-ignore
                if (mCFs[startYear + i] !== 'undefined') {
                    //@ts-ignore
                    mCFs[startYear + i] -= cf
                }
            })
        }
        let resultWithoutGoal = findEarliestFFYear(ffGoal, savings, mCFs,
            annualSavings, savingsChgRate, ffYear, mustCFs, tryCFs, 50000, 3, pp)
        if (resultWithoutGoal.ffYear < 0 ||
            resultWithoutGoal.ffAmt < resultWithoutGoal.minReq ||
            resultWithoutGoal.leftAmt < 0) return null
        cfs.forEach((cf, i) => {
            //@ts-ignore
            if (mCFs[startYear + i] !== 'undefined') {
                //@ts-ignore
                mCFs[startYear + i] += cf
            }
        })
        let resultWithGoal = findEarliestFFYear(ffGoal, savings, mCFs,
            annualSavings, savingsChgRate, resultWithoutGoal.ffYear, mustCFs, tryCFs,
            50000, 3, pp)
        if (resultWithGoal.ffYear < 0 || resultWithGoal.ffAmt < resultWithGoal.minReq
            || resultWithGoal.leftAmt < 0) return null
        return (resultWithoutGoal.ffYear - resultWithGoal.ffYear)
    }

    const changeViewMode = (e: any) => {
        setViewMode(e.target.innerText)
    }

    return (
        wipGoal ?
            <div className="overflow-x-hidden overflow-y-auto fixed inset-0 outline-none focus:outline-none">
                <div className="relative bg-white border-0">
                    {wipGoal.type === APIt.GoalType.FF ?
                        <FFGoal goal={wipGoal as APIt.CreateGoalInput} addCallback={addGoal} cancelCallback={cancelGoal}
                            updateCallback={updateGoal} annualSavings={annualSavings} savingsChgRate={savingsChgRate} totalSavings={savings}
                            ffYear={ffYear} ffAmt={ffAmt} ffLeftOverAmt={ffLeftOverAmt} ffCfs={ffCfs} mergedCfs={mergedCFs}
                            ffYearHandler={setFFYear} ffAmtHandler={setFFAmt} ffLeftOverAmtHandler={setFFLeftOverAmt}
                            ffCfsHandler={setFFCfs} rr={rr} />
                        : ffGoal && <Goal goal={wipGoal as APIt.CreateGoalInput} addCallback={addGoal} cancelCallback={cancelGoal}
                            updateCallback={updateGoal} mergedCFs={mergedCFs} ffImpactYearsHandler={calculateFFImpactYear} ffGoalEndYear={ffGoal.ey}
                            ffYear={ffYear} ffAmt={ffAmt} ffLeftAmt={ffLeftOverAmt} rr={rr} />}
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
                            } bottomLeft="Savings" bottomRight={
                                <AwesomeButton type="primary" ripple>
                                    SET TARGET
                                </AwesomeButton>
                            } bottom={
                                <NumberInput name="asChgRate"
                                    inputOrder={1}
                                    currentOrder={0}
                                    nextStepDisabled
                                    allInputDone
                                    nextStepHandler={() => true}
                                    pre="Increases" post="Every Month" unit="%" note={`${toCurrency(Math.round(annualSavings * (savingsChgRate / 100)), currency)} Monthly in ${nowYear + 1}`}
                                    min={0} max={5} step={0.1} value={savingsChgRate} changeHandler={savingsChgRateHandler}
                                    info={`Given Annual Savings of ${toCurrency(annualSavings, currency)} by end of ${nowYear}, 
                                        ${savingsChgRate}% increase in savings comes to about 
                                        ${toCurrency(Math.round(annualSavings * (savingsChgRate / 100)), currency)} per month. Due to the power of compounding, 
                                        even small regular increase in savings can make a significant impact in the long term.`}
                                    infoDurationInMs={7000} />
                            } hasResult />
                        </div> : <div />}
                        {ffGoal && <ul className="flex flex-wrap justify-center items-center border-b mt-4 md:mt-8 w-screen">
                            {viewItems.map((item, i) => (
                                <li key={"viewItem" + i} className="cursor-pointer py-1 bg-gray-200">
                                    <a onClick={changeViewMode} style={{ color: viewMode === item ? "white" : "gray", backgroundColor: viewMode === item ? "black" : "transparent" }} className="px-4 py-2">{item}</a>
                                </li>))}
                        </ul>}
                        {ffGoal && allGoals && allGoals.length > 0 && <Fragment>
                            {viewMode === goalsLabel && <div className="mt-4 flex justify-center">
                                <SelectInput
                                    inputOrder={1}
                                    currentOrder={0}
                                    nextStepDisabled={true}
                                    allInputDone={true}
                                    nextStepHandler={() => true}
                                    name="typeFilter" pre="" options={getImpOptions()} value={impFilter as string}
                                    changeHandler={setImpFilter} />
                            </div>}
                            {viewMode !== aaLabel && <p className="text-center text-base mt-4">Negative values imply You Pay, while Positive values imply You Receive</p>}
                            {viewMode === cfLabel ?
                                <CFChart mustCFs={mustCFs} tryCFs={tryCFs} optCFs={optCFs} from={nowYear + 1} to={ffGoal.ey} />
                                :
                                viewMode === goalsLabel ? <div className="w-full flex flex-wrap justify-around shadow-xl rounded overflow-hidden">
                                    {allGoals.map((g: APIt.CreateGoalInput, i: number) =>
                                        g.id && (!impFilter || impFilter === g.imp) &&
                                        <Summary key={"g" + i} id={g.id as string} name={g.name} type={g.type} imp={g.imp} rr={rr} savings={savings}
                                            //@ts-ignore
                                            startYear={g.sy} currency={g.ccy} cfs={allCFs[g.id]} deleteCallback={removeGoal} editCallback={editGoal}
                                            ffYear={ffYear} ffGoalEndYear={ffGoal.ey} mergedCFs={mergedCFs} ffAmt={ffAmt} ffLeftAmt={ffLeftOverAmt}
                                            ffImpactYearsCalculator={calculateFFImpactYear} />)}
                                </div> : <div>
                                        <AAChart aa={aa} years={buildYearsArray(nowYear + 1, ffGoal.ey + 1)} rr={rr} />
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