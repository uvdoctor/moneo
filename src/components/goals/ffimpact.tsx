import React, { Fragment, useEffect, useState } from 'react'
import SVGHourGlass from '../svghourglass'
import ResultItem from '../calc/resultitem'

interface FFImpactProps {
    ffYear: number | null
    ffAmt: number
    ffLeftAmt: number
    cfs: Array<number>
    mergedCFs: Object
    ffGoalEndYear: number
    startYear: number
    ffImpactYearCalculator: Function
    goalId: string | null | undefined
}

export default function FFImpact(props: FFImpactProps) {
    const [ffImpactYears, setFFImpactYears] = useState<number | null>(null)

    useEffect(() => {
        setFFImpactYears(props.ffImpactYearCalculator(props.startYear, props.cfs, props.goalId))
    }, [props.ffYear, props.ffAmt, props.ffLeftAmt, props.startYear, props.cfs, props.goalId])

    return (
        <Fragment>
            {ffImpactYears !== null ?
                (ffImpactYears === 0 ? <ResultItem label="Financial Freedom Impact" result="No Delay"
                    info="This Goal does not delay Your Financial Freedom Year." />
                    : <ResultItem svg={<SVGHourGlass />} label="Financial Freedom Impact" pl
                        unit={`${Math.abs(ffImpactYears) > 1 ? ' Years ' : ' Year '}${ffImpactYears > 0 ? 'Earlier' : 'Delay'}`}
                        result={ffImpactYears} info="Estimate of how this Goal impacts Financial Freedom. Also, this Goal has impact on other Goals too. 
                        For instance, if You Delete this Goal, You May Observe that not only has Financial Freedom Year changed, but Financial Freedom impact of other Goals also changes.
                        This happens because Money Needed for this Goal can be Invested instead." />)
                : <ResultItem label="Financial Freedom Impact" result="Unable to Determine"
                        info={`Analyzed till ${props.ffGoalEndYear - 20}. Please try again with different inputs / goals.`} />}
        </Fragment>
    )
}