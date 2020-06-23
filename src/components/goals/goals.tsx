import React, { useEffect, useState, Fragment } from 'react'
import * as APIt from '../../api/goals'
import * as queries from '../../graphql/queries'
import { API, graphqlOperation } from 'aws-amplify'
import Goal from './goal'
import {removeFromArray} from '../utils'

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

    const cancelGoal = () => {
        setWIPGoal(null)
        setShowModal(false)
    }

    const removeGoal = (id: string) => {
        removeFromArray(allGoals as Array<APIt.CreateGoalInput>, 'id', id)
        setAllGoals([...allGoals as Array<APIt.CreateGoalInput>])
        setWIPGoal(null)
        setShowModal(false)
    }

    const addGoal = (goal: APIt.CreateGoalInput) => {
        allGoals?.push(goal)
        setAllGoals([...allGoals as Array<APIt.CreateGoalInput>])
        setWIPGoal(null)
        setShowModal(false)
    }

    const editGoal = (goal: APIt.CreateGoalInput) => {
        setWIPGoal(goal)
        setShowModal(true)
    }

    const updateGoal = (oldGoalId: string, newGoal: APIt.CreateGoalInput) => {
        removeFromArray(allGoals as Array<APIt.CreateGoalInput>, 'id', oldGoalId)
        allGoals?.push(newGoal)
        setWIPGoal(null)
        setShowModal(false)
        setAllGoals([...allGoals as Array<APIt.CreateGoalInput>])
    }

    return (
        <Fragment>
            <div className="mt-4 flex justify-center">
                <button className="button" onClick={() => setShowModal(true)}>
                    Create Goal
			    </button>
            </div>
            {showModal ?
                <div className="overflow-x-hidden overflow-y-auto fixed inset-0 outline-none focus:outline-none">
                    <div className="relative bg-white border-0">
                            <Goal goal={wipGoal} summary={false} deleteCallback={removeGoal} addCallback={addGoal} cancelCallback={cancelGoal} editCallback={editGoal} updateCallback={updateGoal} />
                    </div>
                </div>
            :
                <div className="w-screen flex flex-wrap justify-around shadow-xl rounded overflow-hidden">
                    {allGoals && allGoals.map((g: any) =>
                        <Goal goal={g} summary={true} addCallback={addGoal} deleteCallback={removeGoal} cancelCallback={cancelGoal} editCallback={editGoal} updateCallback={updateGoal} />)}
                </div>}
        </Fragment>
    )
}