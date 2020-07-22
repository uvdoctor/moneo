import React from 'react'
import OppCost from '../calc/oppcost'
import FFImpact from './ffimpact'

interface GoalResultProps {
    cfs: Array<number>
    startYear: number
    ffYear: number | null
    ffAmt: number
    ffLeftAmt: number
    mergedCFs: Object
    currency: string
    ffGoalEndYear: number
    discountRate: number
    rrFallDuration: number
    ffImpactYearCalculator: Function
}

export default function GoalResult(props: GoalResultProps) {
    return (
        <div className="w-full py-2 flex flex-wrap justify-around w-full items-start bg-green-100 border-t border-b border-green-200">
            <FFImpact ffGoalEndYear={props.ffGoalEndYear} cfs={props.cfs} ffYear={props.ffYear}
                mergedCFs={props.mergedCFs} ffAmt={props.ffAmt} ffLeftAmt={props.ffLeftAmt}
                ffImpactYearCalculator={props.ffImpactYearCalculator} startYear={props.startYear} />
            <OppCost discountRate={props.discountRate} cfs={props.cfs} currency={props.currency} rrFallDuration={props.rrFallDuration}
                startYear={props.startYear} ffEndYear={props.ffGoalEndYear} ffYear={props.ffYear} />
        </div>
    )
}