import React, { useEffect, useState } from 'react'
import * as APIt from '../../api/goals'
import * as queries from '../../graphql/queries'
import { API, graphqlOperation } from 'aws-amplify'
import Goal from './goal'

export default function Goals() {
    const [allGoals, setAllGoals] = useState<Array<APIt.CreateGoalInput> | null>([])
    const [showModal, setShowModal] = useState<boolean>(false)
    const [wipGoal, setWIPGoal] = useState<APIt.CreateGoalInput | null>(null)
    
    useEffect(() => {
        getAllGoals()
    }, [])

    const getAllGoals = async () => {
        try {
            const { data: { listGoals } } = (await API.graphql(graphqlOperation(queries.listGoals))) as {
                data: APIt.ListGoalsQuery
            }
            let goals: Array<APIt.CreateGoalInput> | null = listGoals ? listGoals.items as Array<APIt.CreateGoalInput> : null
            console.log("Got all goals from db....", goals)
            setAllGoals(goals)
            setWIPGoal(null)
        } catch (e) {
            console.log("Error while getting list of goals: ", e)
        }
    }

    const removeGoal = (id: string) => {
        allGoals?.forEach((goal, i) => goal.id === id ? allGoals.splice(i, 1) : console.log("No need to delete id: ", goal.id))
        setAllGoals([...allGoals as Array<APIt.CreateGoalInput>])
        setWIPGoal(null)
    }

    const addGoal = (goal: APIt.CreateGoalInput) => {
        allGoals?.push(goal)
        setAllGoals([...allGoals as Array<APIt.CreateGoalInput>])
        setWIPGoal(null)
    }

    const changeModalState = (state: boolean) => {
        setShowModal(state)
        if(!state) setWIPGoal(null)
    }

    return (
        <>
            <div className="mt-4 flex justify-center">
                <button className="button" onClick={() => setShowModal(true)}>
                    Create Goal
			    </button>
            </div>
            {showModal ?
                <div className="overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                    <div className="relative w-screen h-screen z-50">
                        <div className="z-50 border-0 shadow-lg relative flex flex-col w-full h-full bg-white outline-none focus:outline-none">
                            <Goal goal={wipGoal} summary={false} deleteCallback={removeGoal} addCallback={addGoal} modalCallback={changeModalState} wipGoalCallback={setWIPGoal} />
                        </div>
                    </div>
                </div>
            :
                <div className="w-screen flex flex-wrap justify-around shadow-xl rounded overflow-hidden">
                    {allGoals && allGoals.map((g: any) =>
                        <Goal goal={g} summary={true} deleteCallback={removeGoal} modalCallback={setShowModal} wipGoalCallback={setWIPGoal} />)}
                </div>}
        </ >
    )
}