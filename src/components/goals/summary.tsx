import React from 'react'
import * as APIt from '../../api/goals'
import LineChart from './linechart'
import SVGRemove from '../svgremove'
import SVGEdit from '../svgedit'
import { getGoalTypes, getImpLevels } from './goalutils'
interface SummaryProps {
    id: string
    name: string
    type: APIt.GoalType
    imp: APIt.LMH
    startYear: number
    currency: string
    cfs: Array<number>
    deleteCallback: Function
    editCallback: Function
}

export default function Summary({ id, name, type, imp, startYear, currency, cfs, deleteCallback, editCallback }: SummaryProps) {

    return (
        <div className="mt-4 mb-4 p-4 max-w-sm rounded shadow-xl text-lg md:text-xl w-full md:w-1/2 lg:w-1/3">
            <div className="flex justify-between items-center w-full">
                <label>{getImpLevels()[imp]}</label>
                <div className="flex flex-col justify-center items-center">
                    <label>{getGoalTypes()[type]}</label>
                    <label>{name}</label>
                </div>
                <div className="flex">
                    <div className="cursor-pointer" onClick={() => editCallback(id)}>
                        <SVGEdit />
                    </div>
                    <div className="cursor-pointer" onClick={() => deleteCallback(id)}>
                        <SVGRemove />
                    </div>
                </div>
            </div>
            <LineChart cfs={cfs} startYear={startYear} currency={currency} />
        </div>
    )
}