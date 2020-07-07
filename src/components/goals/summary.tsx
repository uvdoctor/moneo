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
    const bgColor = imp === APIt.LMH.H ? 'bg-blue-600' : (imp === APIt.LMH.M ? 'bg-orange-600' : 'bg-green-600')
    return (
        <div className="mt-4 mb-4 pr-1 max-w-sm rounded shadow-lg text-lg md:text-xl w-full">
            <div className="flex justify-between items-center w-full">
                <label className={`${bgColor} text-white py-1 px-2`}>{getImpLevels()[imp]}</label>
                <div className="flex flex-col justify-center items-center font-semibold">
                    <label>{getGoalTypes()[type]}</label>
                    <label>{name}</label>
                </div>
                <div className="flex text-base">
                    <div className="hover:text-blue-600 cursor-pointer" onClick={() => editCallback(id)}>
                        <SVGEdit />
                        Edit
                    </div>
                    <div className="flex flex-col items-center ml-2 cursor-pointer hover:text-blue-600" onClick={() => deleteCallback(id)}>
                        <SVGRemove />
                        Delete
                    </div>
                </div>
            </div>
            <LineChart cfs={cfs} startYear={startYear} currency={currency} />
        </div>
    )
}