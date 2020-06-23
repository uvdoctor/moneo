import React from 'react'
import * as APIt from '../../api/goals'
import LineChart from './linechart'
import SVGRemove from '../svgremove'
import * as mutations from '../../graphql/mutations'
import { API, graphqlOperation } from 'aws-amplify'
import { getGoalTypes, getCriticalityOptions } from '../utils'
interface SummaryProps {
    goal: APIt.CreateGoalInput
    chartData: Array<Array<number>>
    deleteCallback: Function
    editCallback: Function
}

export default function Summary({ goal, chartData, deleteCallback, editCallback }: SummaryProps) {
    const deleteGoal = async (id: string) => {
        try {
            await API.graphql(graphqlOperation(mutations.deleteGoal, { input: { id: id } }))
            deleteCallback(id)
        } catch (e) {
            console.log("Error while deleting goal: ", e)
        }
    }

    return (
        <div className="flex flex-col mt-4 mb-4 p-4 rounded shadow-xl text-lg md:text-xl items-center justify-center w-full md:w-1/2">
            <div className="flex justify-between w-full">
                <p>{getCriticalityOptions()[goal.imp]}</p>
                <div className="flex">
                    <label onClick={() => editCallback(goal)}>Edit</label>
                    <SVGRemove id={goal.id as string} removeHandler={deleteGoal} />
                </div>
            </div>
            <div className="mt-4 flex flex-col items-center justify-center text-xl md:text-2xl font-semibold">
                <p>{`${getGoalTypes()[goal.type]} ${goal.name}`}</p>
            </div>
            <LineChart data={chartData} xTitle="Year" title="Yearly Cash Flows" />
        </div>
    )
}