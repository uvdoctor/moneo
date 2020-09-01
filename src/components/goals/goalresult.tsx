import React from 'react'
import OppCost from '../calc/oppcost'
import FFImpact from './ffimpact'

interface GoalResultProps {
    cfs: Array<number>
    ffOOM: Array<number> | null
    ffImpactYears: number | null
    currency: string
    startYear: number
    ffGoalEndYear: number
    rr: Array<number>
    buyGoal: boolean
}

export default function GoalResult(props: GoalResultProps) {
    
    return (
        <div className="w-full py-1 flex justify-around w-full items-start bg-green-100 shadow-lg lg:shadow-xl">
            <FFImpact ffGoalEndYear={props.ffGoalEndYear} ffOOM={props.ffOOM} 
                ffImpactYears={props.ffImpactYears} />
            <OppCost discountRate={props.rr} cfs={props.cfs} currency={props.currency} startYear={props.startYear}
                buyGoal={props.buyGoal} ffGoalEndYear={props.ffGoalEndYear} />
        </div>
    )
}