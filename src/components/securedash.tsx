import React, { useState, useEffect, Fragment } from 'react'
import { withAuthenticator } from '@aws-amplify/ui-react'
import Goals from '../components/goals/goals'
import NW from './nw/nw'
import {CreateGoalInput, GoalType} from '../api/goals'
import {getGoalsList, getDuration} from './goals/goalutils'
import { calculateCFs } from './goals/cfutils'
import {removeFromArray, buildArray} from './utils'

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

    const changeViewMode = (e: any) => {
        setViewMode(e.target.innerText)
    }

    useEffect(() => {
        loadAllGoals()
    }, [])

    const loadAllGoals = async () => {
        let goals: Array<CreateGoalInput> | null = await getGoalsList()
        if (!goals) return
        let allCFs = {}
        let ffGoalId = ""
        goals?.forEach((g) => {
            if (g.type === GoalType.FF) {
                setFFGoal(g)
                ffGoalId = g.id as string
            } else {
                //@ts-ignore    
                allCFs[g.id] = calculateCFs(g, getDuration(g.sa as number, g.sy, g.ey))
            }
        })
        removeFromArray(goals, "id", ffGoalId)
        setAllCFs(allCFs)
        setAllGoals([...goals])
        setGoalsLoaded(true)
    }

    const calculateRR = () => {
        let aa: any = populateDefaultAA()
        setAA(aa)
        setRR([...populateRR(aa)])
    }

    const populateDefaultAA = () => {
        let fromYear = new Date().getFullYear() + 1
        let toYear = ffGoal?.ey as number + 1
        let aa = buildEmptyAA(fromYear, toYear)
        for(let i = 0; i < aa.cash.length; i++) {
            aa.cash[i] = 5
            aa.gold[i] = 5
            aa.property[i] = 10
            aa.deposits[i] = 10
            aa.bonds[i] = 20
            aa.stocks[i] = 50
        }
        return aa
    }

    const populateRR = (aa: any) => {
        console.log("Going to calculate rr for aa...", aa)
        const dp = getDefaultPerf()
        let rr = []
        for(let i = 0; i < aa.cash.length; i++) {
            let perf = 0
            for(const prop in aa) {
                //@ts-ignore
                perf += (dp[prop] * aa[prop][i]) / 100
            }
            rr.push(Math.round((perf + Math.random()) * 100 + Number.EPSILON) / 100)
        }
        console.log("RR...", rr)
        return rr
    }

    const getDefaultPerf = () => {
        return {
            cash: 0.5,
            deposits: 1.5,
            bonds: 3.5,
            property: 5,
            gold: 5,
            stocks: 7
        }
    }

    const buildEmptyAA = (fromYear: number, toYear: number) => {
        return {
            cash: buildArray(fromYear, toYear),
            deposits: buildArray(fromYear, toYear),
            bonds: buildArray(fromYear, toYear),
            property: buildArray(fromYear, toYear),
            gold: buildArray(fromYear, toYear),
            stocks: buildArray(fromYear, toYear)
        }
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
                    allGoals={allGoals} goalsLoaded={goalsLoaded} allGoalsHandler={setAllGoals} currency={currency} allCFs={allCFs}
                    allCFsHandler={setAllCFs} ffGoal={ffGoal} ffGoalHandler={setFFGoal} aa={aa} rr={rr} rrCalculator={calculateRR} />}
        </Fragment>
    )
}

export default withAuthenticator(SecureDash)