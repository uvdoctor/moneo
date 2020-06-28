import React from 'react'
import * as APIt from '../../api/goals'
import LineChart from './linechart'
import SVGRemove from '../svgremove'
import { getGoalTypes, getImpLevels } from './goalutils'
interface SummaryProps {
    goal: APIt.CreateGoalInput
    cfs: Array<number>
    deleteCallback: Function
    editCallback: Function
}

export default function Summary({ goal, cfs, deleteCallback, editCallback }: SummaryProps) {
    
    return (
        <div className="flex flex-col mt-4 mb-4 p-4 rounded shadow-xl text-lg md:text-xl items-center justify-center w-full md:w-1/2">
            <div className="flex justify-between w-full">
                <p>{getImpLevels()[goal.imp]}</p>
                <div className="flex">
                    <label onClick={() => editCallback(goal)}>Edit</label>
                    <SVGRemove id={goal.id as string} removeHandler={deleteCallback} />
                </div>
            </div>
            <div className="mt-4 flex flex-col items-center justify-center text-xl md:text-2xl font-semibold">
                <p>{`${getGoalTypes()[goal.type]} ${goal.name}`}</p>
            </div>
            <LineChart cfs={cfs} startYear={goal.sy} xTitle="Year" title="Yearly Cash Flows" />
        </div>
    )
}