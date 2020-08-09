import React, { useState, useEffect, Fragment } from 'react'
import { withAuthenticator } from '@aws-amplify/ui-react'
import Goals from '../components/goals/goals'
import NW from './nw/nw'
import { CreateGoalInput, GoalType } from '../api/goals'
import { getGoalsList, getDuration } from './goals/goalutils'
import { calculateCFs } from './goals/cfutils'
import { removeFromArray } from './utils'

const SecureDash = () => {
    const netWorthLabel = "Net Worth"
    const goalsLabel = "Plan"
    const saveLabel = "Save"
    const investLabel = "Invest"
    const viewItems = [netWorthLabel, goalsLabel, saveLabel, investLabel]
    const [viewMode, setViewMode] = useState(netWorthLabel)
    const [showModal, setShowModal] = useState<boolean>(false)
    const [savings, setSavings] = useState<number>(0)
    const [annualSavings, setAnnualSavings] = useState<number>(0)
    const [currency, setCurrency] = useState<string>("USD")
    const [allGoals, setAllGoals] = useState<Array<CreateGoalInput> | null>([])
    const [goalsLoaded, setGoalsLoaded] = useState<boolean>(false)
    const [ffGoal, setFFGoal] = useState<CreateGoalInput | null>(null)
    const [allCFs, setAllCFs] = useState<Object>({})
    const [aa, setAA] = useState<Object>({})
    const [rr, setRR] = useState<Array<number>>([])
    const avgAnnualExpense = 24000
    const expChgRate = 3

    const changeViewMode = (e: any) => {
        setViewMode(e.target.innerText)
    }

    const pp = {
        savings: 0.5,
        deposits: 1.5,
        sbonds: 2,
        mbonds: 3,
        mtebonds: 3.5,
        dreit: 5,
        ireit: 5,
        gold: 3,
        largecapstocks: 5,
        multicapstocks: 6,
        divstocks: 5,
        istocks: 7,
        digitalcurrency: 10
    }

    useEffect(() => {
        loadAllGoals()
    }, [])

    const loadAllGoals = async () => {
        let goals: Array<CreateGoalInput> | null = await getGoalsList()
        if (!goals || goals.length === 0) {
            setGoalsLoaded(true)
            return
        }
        let allCFs = {}
        let ffGoalId = ""
        goals?.forEach((g) => {
            if (g.type === GoalType.FF) {
                setFFGoal(g)
                ffGoalId = g.id as string
            } else {
                //@ts-ignore    
                allCFs[g.id] = calculateCFs(null, g, getDuration(g.sa as number, g.sy, g.ey))
            }
        })
        removeFromArray(goals, "id", ffGoalId)
        setAllCFs(allCFs)
        setAllGoals([...goals])
        setGoalsLoaded(true)
    }

    return (
        <Fragment>
            {!showModal && <ul className="flex mt-12 bg-black w-screen">
                {viewItems.map((item, i) => (
                    <li key={"viewItem" + i} className="ml-2">
                        <button onClick={changeViewMode} style={{ color: viewMode === item ? "green" : "white", backgroundColor: viewMode === item ? "white" : "transparent" }} className="dashmi md:mt-4 md:px-4 hover:bg-white hover:border-t hover:text-green-600 focus:outline-none">{item}</button>
                    </li>))}
            </ul>}
            {viewMode === netWorthLabel && <NW totalSavings={savings} annualSavings={annualSavings} viewModeHandler={setViewMode}
                totalSavingsHandler={setSavings} annualSavingsHandler={setAnnualSavings} currency={currency} currencyHandler={setCurrency} />}
            {viewMode === goalsLabel && <Goals showModalHandler={setShowModal} savings={savings} annualSavings={annualSavings} 
                allGoals={allGoals} goalsLoaded={goalsLoaded} allGoalsHandler={setAllGoals} currency={currency} allCFs={allCFs} aa={aa} aaHandler={setAA}
                allCFsHandler={setAllCFs} ffGoal={ffGoal} ffGoalHandler={setFFGoal} rr={rr} rrHandler={setRR} pp={pp} avgAnnualExpense={avgAnnualExpense} expChgRate={expChgRate} />}
        </Fragment>
    )
}

export default withAuthenticator(SecureDash)