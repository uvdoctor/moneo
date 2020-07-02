import React from 'react'
import * as APIt from '../../api/goals'
import LineChart from './linechart'
import SVGRemove from '../svgremove'
import SVGEdit from '../svgedit'
import { getGoalTypes, getImpLevels } from './goalutils'
import { API } from 'aws-amplify'
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
                <div className="mt-4 flex flex-col justify-center items-center font-semibold">
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