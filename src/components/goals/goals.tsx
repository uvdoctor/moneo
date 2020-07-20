import React, { useEffect, useState, Fragment } from 'react'
import Goal from './goal'
import FFGoal from './ffgoal'
import { removeFromArray } from '../utils'
import CFChart from './cfchart'
import * as APIt from '../../api/goals'
import { getGoalsList, createNewGoal, changeGoal, deleteGoal, getDuration, createNewGoalInput, getGoalTypes, getImpOptions } from './goalutils'
import { calculateCFs, findEarliestFFYear } from './cfutils'
import Summary from './summary'
import SelectInput from '../form/selectinput'
import HToggle from '../horizontaltoggle'
import SVGTargetPath from './svgtargetpath'
import Section from '../form/section'
//@ts-ignore
import { AwesomeButton } from 'react-awesome-button'
import NumberInput from '../form/numberinput'
import ResultItem from '../calc/resultitem'
import SVGHourGlass from '../svghourglass'
import SVGMoneyBag from '../calc/svgmoneybag'
import SVGInheritance from './svginheritance'
import SVGEdit from '../svgedit'
import { toast } from 'react-toastify'

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
    const [mergedCFs, setMergedCFs] = useState<any>({})
    const [viewMode, setViewMode] = useState<number>(0)
    const [impFilter, setImpFilter] = useState<string>("")
    const [currency, setCurrency] = useState<string>("USD")
    const [oppDR, setOppDR] = useState<number>(6)
    const [savings, setSavings] = useState<number>(100000)
    const [annualSavings, setAnnualSavings] = useState<number>(100000)
    const [savingsChgRate, setSavingsChgRate] = useState<number>(3)
    const [expense, setExpense] = useState<number>(24000)
    const [expenseChgRate, setExpenseChgRate] = useState<number>(3)
    const [ffYear, setFFYear] = useState<number>(0)
    const [ffAmt, setFFAmt] = useState<number>(0)
    const [ffGoal, setFFGoal] = useState<APIt.CreateGoalInput>()
    const [ffLeftOverAmt, setFFLeftOverAmt] = useState<number>(0)
    const [goalsLoaded, setGoalsLoaded] = useState<boolean>(false)

    useEffect(() => {
        loadAllGoals()
    }, [])

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

    useEffect(() => {
        if (!ffGoal || !goalsLoaded) return
        let yearRange = getYearRange()
        let mCFs = buildEmptyMergedCFs(yearRange.from, yearRange.to)
        if (allGoals && allGoals[0]) allGoals.forEach(g => {
            //@ts-ignore
            mergeCFs(mCFs, allCFs[g.id], g.sy)
        })
        setMergedCFs(mCFs)
        let result = findEarliestFFYear(ffGoal, oppDR, savings, mCFs,
            annualSavings, savingsChgRate, expense, expenseChgRate, null)
        setFFAmt(result.ffAmt)
        setFFYear(result.ffYear)
        //@ts-ignore
        setFFLeftOverAmt(result.leftAmt + ffGoal.sa)
    }, [ffGoal, oppDR, savings, goalsLoaded, allGoals, annualSavings, savingsChgRate,
        expense, expenseChgRate])

    useEffect(() => wipGoal ? showModalHandler(true) : showModalHandler(false), [wipGoal])

    const loadAllGoals = async () => {
        let goals: Array<APIt.CreateGoalInput> | null = await getGoalsList()
        if (!goals) return
        let allCFs = {}
        let ffGoalId = ""
        goals?.forEach((g) => {
            if (g.type === APIt.GoalType.FF) {
                setFFGoal(g)
                ffGoalId = g.id as string
            } else {
                //@ts-ignore    
                allCFs[g.id] = calculateCFs(g, getDuration(g.sa as number, g.sy, g.ey))
            }
        })
        removeFromArray(goals, "id", ffGoalId)
        setWIPGoal(null)
        setAllCFs(allCFs)
        setAllGoals([...goals])
        setGoalsLoaded(true)
    }

    const addGoal = async (goal: APIt.CreateGoalInput, cfs: Array<number> = []) => {
        let g = await createNewGoal(goal)
        if (!g) return
        setWIPGoal(null)
        toast.success(`Success! New Goal ${g.type}: ${g.name} has been Created.`)
        if (g.type === APIt.GoalType.FF) {
            setFFGoal(g)
            return
        }
        allGoals?.push(g as APIt.CreateGoalInput)
        //@ts-ignore
        allCFs[g.id] = cfs
        setAllCFs(allCFs)
        setAllGoals([...allGoals as Array<APIt.CreateGoalInput>])
    }

    const updateGoal = async (goal: APIt.UpdateGoalInput, cfs: Array<number> = []) => {
        let g: APIt.UpdateGoalInput | null = await changeGoal(goal)
        if (!g) return
        setWIPGoal(null)
        toast.success(`Success! Goal ${g.type}: ${g.name} has been Updated.`)
        if (g.type === APIt.GoalType.FF) {
            setFFGoal(g as APIt.CreateGoalInput)
            return
        }
        removeFromArray(allGoals as Array<APIt.CreateGoalInput>, 'id', goal.id)
        allGoals?.unshift(g as APIt.CreateGoalInput)
        //@ts-ignore
        allCFs[g.id] = cfs
        setAllCFs(allCFs)
        setAllGoals([...allGoals as Array<APIt.CreateGoalInput>])
    }

    const removeGoal = async (id: string) => {
        try {
            await deleteGoal(id)
        } catch (err) {
            toast.error("Sorry! Error while trying to delete this Goal: ", err)
            return false
        }
        toast.success(`Success! Goal has been Deleted.`)
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

    const createGoal = (type: APIt.GoalType) => setWIPGoal(
        createNewGoalInput(type, type === APIt.GoalType.FF ? "USD" : ffGoal?.ccy as string))

    const getYearRange = () => {
        let nowYear = new Date().getFullYear()
        if (!ffGoal) return { from: nowYear + 1, to: nowYear }
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

    useEffect(() => createChartData(), [allGoals])

    useEffect(() => setCurrency(ffGoal?.ccy as string), [ffGoal])

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
            if (g.imp === APIt.LMH.H) populateData(mustCFs, cfs, g.sy, yearRange.from)
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
                            updateCallback={updateGoal} annualSavings={annualSavings} savingsChgRate={savingsChgRate}
                            expense={expense} expenseChgRate={expenseChgRate} annualSavingsHandler={setAnnualSavings}
                            savingsChgRateHandler={setSavingsChgRate} expenseHandler={setExpense} oppDR={oppDR} oppDRHandler={setOppDR}
                            expenseChgRateHandler={setExpenseChgRate} totalSavings={savings} totalSavingsHandler={setSavings} />
                        : ffGoal && <Goal goal={wipGoal as APIt.CreateGoalInput} addCallback={addGoal} cancelCallback={cancelGoal}
                            updateCallback={updateGoal} />}
                </div>
            </div>
            :
            <Fragment>
                <div className="flex mt-4 items-center justify-center">
                    <SVGTargetPath />
                    <label className="ml-2 text-xl md:text-2xl">Define Your Dreams.</label>
                </div>
                <p className="text-center text-lg mt-1">Make Money Work Hard to Meet Them.</p>

                <div className="flex flex-wrap justify-around">
                    {Object.keys(getGoalTypes()).map(key =>
                        key !== APIt.GoalType.FF &&
                        <AwesomeButton className={`mt-4 ${!ffGoal ? 'cursor-not-allowed' : 'cursor-pointer'}`} type="primary" ripple size="medium" key={key}
                            disabled={!ffGoal} onPress={() => createGoal(key as APIt.GoalType)}>
                            {getGoalTypes()[key as APIt.GoalType]}
                        </AwesomeButton>)}
                </div>
                {ffGoal ?
                    <Fragment>
                        {ffGoal && ffYear >= ffGoal.by ? <div className="flex justify-center items-center">
                            <Section title={
                                <div className="flex justify-around">
                                    <label className="mr-2">Financial Freedom</label>
                                    <div onClick={() => setWIPGoal(ffGoal)}>
                                        <SVGEdit />
                                    </div>
                                </div>
                            } left={
                                ffAmt >= 0 && ffLeftOverAmt >= 0 ? <div className="flex flex-wrap justify-around w-full items-start">
                                    <ResultItem svg={<SVGHourGlass />} label="Achievable by" result={ffYear} noResultFormat />
                                    <ResultItem result={ffAmt} svg={<SVGMoneyBag />} label={`Savings by ${ffYear}`}
                                        currency={ffGoal.ccy} />
                                    <ResultItem result={ffLeftOverAmt} svg={<SVGInheritance />} label="Nominees Get"
                                        currency={ffGoal.ccy} footer={`Remaining In ${ffGoal.ey + 1}`} />
                                </div> : `Analyzed till ${ffYear}. Please try again with higher Savings And / Or Investment Return.`
                            } right={<div />} bottom={
                                <div className="flex flex-wrap justify-around items-center w-full">
                                    <NumberInput name="dr" inputOrder={1}
                                        currentOrder={0}
                                        nextStepDisabled
                                        allInputDone
                                        nextStepHandler={() => true}
                                        value={oppDR} unit="%" pre="Investment" min={0} max={15}
                                        post="Earns" changeHandler={setOppDR} note="After taxes & fees" step={0.1} />
                                    <NumberInput name="asChgRate"
                                        inputOrder={1}
                                        currentOrder={0}
                                        nextStepDisabled
                                        allInputDone
                                        nextStepHandler={() => true}
                                        pre="Savings" post="Increases" note='Every Year' unit="%"
                                        min={0} max={10} step={0.1} value={savingsChgRate} changeHandler={setSavingsChgRate} />
                                </div>
                            } />
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
                                <HToggle leftText="Goals" rightText="Cash Flows" value={viewMode} setter={setViewMode} />
                                {viewMode > 0 &&
                                    <SelectInput name="ccy" inputOrder={2} currentOrder={1}
                                        nextStepDisabled
                                        allInputDone
                                        nextStepHandler={() => true}
                                        pre="Currency"
                                        value={currency}
                                        changeHandler={setCurrency}
                                        currency
                                    />}
                            </div>
                            <p className="text-center text-base mt-4">Negative values imply You Pay, while Positive values imply You Receive</p>
                            {viewMode > 0 ?
                                <CFChart mustCFs={mustCFs} tryCFs={tryCFs} optCFs={optCFs} />
                                :
                                <div className="w-full flex flex-wrap justify-around shadow-xl rounded overflow-hidden">
                                    {allGoals.map((g: APIt.CreateGoalInput, i: number) =>
                                        g.id && (!impFilter || impFilter === g.imp) &&
                                        <Summary key={"g" + i} id={g.id as string} name={g.name} type={g.type} imp={g.imp} oppDR={oppDR} savings={savings}
                                            startYear={g.sy} currency={g.ccy} cfs={allCFs[g.id]} deleteCallback={removeGoal} editCallback={editGoal}
                                            ffYear={ffYear} ffGoal={ffGoal} mergedCFs={mergedCFs}
                                            annualSavings={annualSavings} savingsChgRate={savingsChgRate} expense={expense} expenseChgRate={expenseChgRate} />)}
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