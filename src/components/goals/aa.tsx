import React from 'react'
import AAChart from './aachart'
import {buildYearsArray} from '../utils'
interface AAProps {
    aa: any
    rr: Array<number>
    ffGoalEndYear: number
    fullScreen: boolean
}

export default function AA(props: AAProps) {
    const nowYear = new Date().getFullYear()

    return (
        <AAChart aa={props.aa} years={buildYearsArray(nowYear + 1, props.ffGoalEndYear)} rr={props.rr} fullScreen={props.fullScreen} />
    )
}