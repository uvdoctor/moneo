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
    goalNotSaved: boolean
}

export default function FFImpact(props: FFImpactProps) {
    const [ffImpactYears, setFFImpactYears] = useState<number | null>(null)

    useEffect(() => {
        if (!props.ffYear) {
            setFFImpactYears(null)
            return
        }
        let mCFs = Object.assign({}, props.mergedCFs)
        props.cfs.forEach((cf, i) => {
            //@ts-ignore
            if (mCFs[props.startYear + i] !== 'undefined') {
                //@ts-ignore
                mCFs[props.startYear + i] += props.goalNotSaved ? cf : -cf
            }
        })
        let years = props.ffImpactYearCalculator(mCFs)
        setFFImpactYears(!props.goalNotSaved || !years ? years : -years)
    }, [props.ffYear, props.ffAmt, props.ffLeftAmt, props.startYear, props.cfs])

    return (
        <Fragment>
            {ffImpactYears !== null ?
                (ffImpactYears === 0 ? <ResultItem label="Financial Freedom Impact" result="No Delay"
                    info="This Goal does not delay Your Financial Freedom Year." />
                    : <ResultItem svg={<SVGHourGlass />} label="Financial Freedom Impact" pl
                        unit={`${Math.abs(ffImpactYears) > 1 ? ' Years ' : ' Year '}${ffImpactYears > 0 ? 'Earlier' : 'Delay'}`}
                        result={ffImpactYears} info="Estimate of how this Goal impacts Financial Freedom" />)
                : props.ffYear ? <ResultItem label="Financial Freedom Impact" result={`> ${props.ffGoalEndYear - props.ffYear}`} pl unit="Years Delay"
                    info={`Analyzed till ${props.ffGoalEndYear}. You May NOT be able to achieve Financial Freedom because of this Goal.`} />
                    : <ResultItem label="Financial Freedom Impact" result="Unable to Determine"
                        info={`Analyzed till ${props.ffGoalEndYear}. You may try again by changing this Goal, Financial Freedom Target, or other Goals.`} />}
        </Fragment>
    )
}