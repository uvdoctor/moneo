import React, { useState, useEffect } from 'react'
import * as APIt from '../../api/goals'
import LineChart from './linechart'
import SVGTrash from '../svgtrash'
import SVGEdit from '../svgedit'
import ResultItem from '../calc/resultitem'
import SVGMoneyBag from '../calc/svgmoneybag'
import SVGHourGlass from '../svghourglass'
import { getGoalTypes, getImpLevels } from './goalutils'
import { findEarliestFFYear } from './cfutils'
interface SummaryProps {
    id: string
    name: string
    type: APIt.GoalType
    imp: APIt.LMH
    startYear: number
    currency: string
    cfs: Array<number>
    ffYear: number
    ffAmt: number
    ffLeftOverAmt: number
    ffGoal: APIt.CreateGoalInput
    mergedCFs: Object
    deleteCallback: Function
    editCallback: Function
}

export default function Summary(props: SummaryProps) {
    const bgColor = props.imp === APIt.LMH.H ? 'bg-blue-600' : (props.imp === APIt.LMH.M ? 'bg-orange-600' : 'bg-green-600')
    const [ffImpactYears, setFFImpactYears] = useState<number>(0)
    const [ffImpactAmt, setFFImpactAmt] = useState<number>(0)
    
    /*useEffect(() => {
        findEarliestFFYear()
    }, [props.mergedCFs])*/

    return (
        <div className="mt-4 mb-4 pr-1 max-w-sm md:max-w-md rounded shadow-lg text-lg md:text-xl w-full">
            <div className="flex justify-between items-center w-full">
                <label className={`${bgColor} text-white py-1 px-2`}>{getImpLevels()[props.imp]}</label>
                <div className="flex flex-col justify-center items-center font-semibold">
                    {props.type !== APIt.GoalType.FF && <label>{getGoalTypes()[props.type]}</label>}
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
            <p className="mt-2 text-center font-semibold">Financial Freedom Impact</p>
            <div className="flex flex-wrap justify-around w-full items-start">
                <ResultItem svg={<SVGHourGlass />} label="" unit=" years" result={ffImpactYears} />
                <ResultItem result={ffImpactAmt} svg={<SVGMoneyBag />} label=''
                    currency={props.ffGoal.ccy} />
            </div>
            <LineChart cfs={props.cfs} startYear={props.startYear} currency={props.currency} />
        </div>
    )
}