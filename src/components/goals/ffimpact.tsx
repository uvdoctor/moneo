import React, { Fragment } from 'react'
import SVGHourGlass from '../svghourglass'
import ResultItem from '../calc/resultitem'

interface FFImpactProps {
    ffImpactYears: number | null
    ffOOM: Array<number> | null
    ffGoalEndYear: number
    hideResultLabel: boolean
}

export default function FFImpact(props: FFImpactProps) {
    return (
        <Fragment>
            {props.ffImpactYears !== null ?
                (props.ffImpactYears === 0 ? <ResultItem label="Financial Freedom Impact" result="No Delay"
                    info="This Goal does not delay Your Financial Freedom Year." hideLabel={props.hideResultLabel} />
                    : <ResultItem svg={<SVGHourGlass />} label="Financial Freedom Impact" pl hideLabel={props.hideResultLabel}
                        unit={`${Math.abs(props.ffImpactYears) > 1 ? ' Years ' : ' Year '}${props.ffImpactYears > 0 ? 'Earlier' : 'Delay'}`}
                        result={props.ffImpactYears} info="Estimate of how this Goal impacts Financial Freedom. Also, this Goal has impact on other Goals too. 
                        For instance, if You Delete this Goal, You May Observe that not only has Financial Freedom Year changed, but Financial Freedom impact of other Goals also changes.
                        This happens because Money Needed for this Goal can be Invested instead." />)
                : <ResultItem label="Financial Freedom Impact" result="Unable to Determine" hideLabel={props.hideResultLabel}
                        info={`Analyzed till ${props.ffGoalEndYear - 20}. You May Not have Enough Savings in Years ${props.ffOOM}`} />}
        </Fragment>
    )
}