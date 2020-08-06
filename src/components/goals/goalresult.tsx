import React from 'react'
import OppCost from '../calc/oppcost'
import FFImpact from './ffimpact'

interface GoalResultProps {
    cfs: Array<number>
    ffOOM: Array<number> | null
    ffImpactYears: number | null
    currency: string
    ffGoalEndYear: number
    rr: Array<number>
    startIndex: number
    buyGoal: boolean
}

export default function GoalResult(props: GoalResultProps) {
    
    return (
        <div className="w-full py-2 flex flex-wrap justify-around w-full items-start bg-green-100 border-t border-b border-green-200">
            <FFImpact ffGoalEndYear={props.ffGoalEndYear} ffOOM={props.ffOOM} 
                ffImpactYears={props.ffImpactYears} />
            <OppCost discountRate={props.rr} cfs={props.cfs} currency={props.currency}
                startIndex={props.startIndex} buyGoal={props.buyGoal} />
        </div>
    )
}