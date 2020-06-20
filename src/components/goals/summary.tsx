import React from 'react'
import * as APIt from '../../api/goals'
import LineChart from './linechart'
import SVGRemove from '../svgremove'
import * as mutations from '../../graphql/mutations'
import { API, graphqlOperation } from 'aws-amplify'

interface SummaryProps {
    goal: APIt.CreateGoalInput
    chartData: Array<Array<number>>
    deleteCallback: Function
    wipGoalCallback: Function
}

export default function Summary({ goal, chartData, deleteCallback, wipGoalCallback }: SummaryProps) {
    const deleteGoal = async (id: string) => {
        try {
            await API.graphql(graphqlOperation(mutations.deleteGoal, { input: { id: id } }))
            deleteCallback(id)
        } catch (e) {
            console.log("Error while deleting goal: ", e)
        }
    }

    return (
        <div className="flex flex-col md:flex max-w-sm shadow-xl text-lg md:text-xl items-center justify-center w-full md:w-1/2">
            <div className="flex justify-between w-full">
                <p>{goal.type}</p>
                <p>{goal.imp}</p>
                <label onClick={() => wipGoalCallback(goal)}>Edit</label>
                <SVGRemove id={goal.id as string} removeHandler={deleteGoal}/>
            </div>
            <p className="text-center mt-4 text-xl md:text-2xl font-semibold">{goal.name}</p>
            <LineChart data={chartData} xTitle="Year" title="Yearly Cash Flows" />
        </div>
    )
}