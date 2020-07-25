import React from 'react'
import LineChart from './linechart'
import SVGTrash from '../svgtrash'
import SVGEdit from '../svgedit'
import { getGoalTypes, getImpLevels } from './goalutils'
import GoalResult from './goalresult'
import {LMH, GoalType} from '../../api/goals'
interface SummaryProps {
    id: string
    name: string
    type: GoalType
    imp: LMH
    startYear: number
    currency: string
    cfs: Array<number>
    ffYear: number | null
    ffAmt: number
    ffLeftAmt: number
    ffGoalEndYear: number
    mergedCFs: Object
    rr: Array<number>
    savings: number
    deleteCallback: Function
    editCallback: Function
    ffImpactYearsCalculator: Function
}

export default function Summary(props: SummaryProps) {
    const bgColor = props.imp === LMH.H ? 'bg-blue-600' : (props.imp === LMH.M ? 'bg-orange-600' : 'bg-green-600')
    const nowYear = new Date().getFullYear()

    return (
        <div className="mt-4 mb-4 max-w-sm md:max-w-md rounded shadow-lg text-lg md:text-xl w-full">
            <div className="flex justify-between items-center w-full">
                <label className={`${bgColor} text-white py-1 px-2`}>{getImpLevels()[props.imp]}</label>
                <div className="flex flex-col justify-center items-center font-semibold">
                    <label>{getGoalTypes()[props.type]}</label>
                    <label>{props.name}</label>
                </div>
                <div className="flex text-base">
                    <div className="hover:text-blue-600 cursor-pointer" onClick={() => props.editCallback(props.id)}>
                        <SVGEdit />
                        Edit
                    </div>
                    <div className="flex flex-col items-center ml-2 cursor-pointer hover:text-blue-600" onClick={() => props.deleteCallback(props.id)}>
                        <SVGTrash />
                        Delete
                    </div>
                </div>
            </div>
            {props.startYear > nowYear && <GoalResult rr={props.rr} currency={props.currency} goalId={props.id}
                        ffGoalEndYear={props.ffGoalEndYear} cfs={props.cfs} startIndex={props.startYear - (nowYear + 1)}
                        startYear={props.startYear} ffYear={props.ffYear} ffAmt={props.ffAmt} ffLeftAmt={props.ffLeftAmt} 
                        mergedCFs={props.mergedCFs} ffImpactYearCalculator={props.ffImpactYearsCalculator} />}
            <p className="w-full text-center mt-4 mb-2">Yearly Cash Flows in {props.currency}</p>
            <LineChart cfs={props.cfs} startYear={props.startYear} />
        </div>
    )
}