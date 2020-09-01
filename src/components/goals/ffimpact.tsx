import React, { Fragment } from 'react'
import SVGHourGlass from '../svghourglass'
import ResultItem from '../calc/resultitem'

interface FFImpactProps {
    ffImpactYears: number | null
    ffOOM: Array<number> | null
    ffGoalEndYear: number
}

export default function FFImpact(props: FFImpactProps) {
    const getUnit = () => Math.abs(props.ffImpactYears as number) > 1 ? ' Years ' : ' Year '

    const getImpactText = () => props.ffImpactYears as number > 0 ? 'Earlier' : 'Later'
    
    return (
        <Fragment>
            {props.ffImpactYears !== null ?
                (props.ffImpactYears === 0 ? <ResultItem label="Impact" result="No Delay"
                    info="This Goal does not delay Your Financial Freedom Year." />
                    : <ResultItem svg={<SVGHourGlass />} label="Impact" pl 
                        unit={`${getUnit()}`}
                        result={props.ffImpactYears} info={`You May Achieve Financial Freedom ${Math.abs(props.ffImpactYears)} ${getUnit()} 
                        ${getImpactText()} due to this Goal. This Goal has impact on other Goals too. 
                        For instance, if You Delete this Goal, You May Observe that not only has Financial Freedom Year changed, 
                        but Financial Freedom impact of other Goals also changes.
                        This happens because Money Needed for this Goal can be Invested instead.`} />)
                : <ResultItem label="Financial Freedom Impact" result="Unable to Determine" info={`Analyzed till ${props.ffGoalEndYear - 20}. You May Not have Enough Savings in Years ${props.ffOOM}`} />}
        </Fragment>
    )
}