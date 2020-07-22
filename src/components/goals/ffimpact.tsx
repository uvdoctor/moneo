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
}

export default function FFImpact(props: FFImpactProps) {
    const [ffImpactYears, setFFImpactYears] = useState<number | null>(null)

    useEffect(() => {
        if(!props.ffYear) {
            setFFImpactYears(null)
            return
        }
        let mCFs = Object.assign({}, props.mergedCFs)
        props.cfs.forEach((cf, i) => {
            //@ts-ignore
            if(mCFs[props.startYear + i] !== 'undefined') mCFs[props.startYear + i] -= cf
        })
        setFFImpactYears(props.ffImpactYearCalculator(mCFs))
    }, [props.ffYear, props.ffAmt, props.ffLeftAmt, props.cfs])

    return (
        <Fragment>
            {ffImpactYears !== null ? <ResultItem svg={<SVGHourGlass />} label="Financial Freedom Impact" pl
                unit={`${Math.abs(ffImpactYears) > 1 ? ' Years ' : ' Year '}${ffImpactYears > 0 ? 'Earlier' : 'Delay'}`}
                result={ffImpactYears === 0 ? '< 1' : ffImpactYears} info="Estimate of how this Goal impacts Financial Freedom" />
                : <ResultItem label="Financial Freedom Impact" result="Unable to Determine" info={`Analyzed till ${props.ffGoalEndYear}. You may try again by changing this Goal, Financial Freedom Target, or other Goals.`} />}
        </Fragment>
    )
}