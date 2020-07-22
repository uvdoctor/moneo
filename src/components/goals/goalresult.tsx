import React from 'react'
import ResultItem from '../calc/resultitem'
import SVGHourGlass from '../svghourglass'
import TimeCost from '../calc/timecost'
import OppCost from '../calc/oppcost'

interface ResultProps {
    cfs: Array<number>
    startYear: number
    duration: number
    totalCost: number
    annualSavings: number
    ffImpactYears: number
    ffYear: number | null
    currency: string
    ffGoalEndYear: number
    discountRate: number
    rrFallDuration: number
}

export default function FFResult(props: ResultProps) {
    return (
        <div className="w-full py-2 flex flex-wrap justify-around w-full items-start bg-green-100 border-t border-b border-green-200">
            {props.ffImpactYears !== null ? <ResultItem svg={<SVGHourGlass />} label="Financial Freedom Impact"
                unit={`${Math.abs(props.ffImpactYears) > 1 ? ' Years ' : ' Year '}${props.ffImpactYears >= 0 ? 'Delay' : 'Earlier'}`}
                result={props.ffImpactYears === 0 ? '< 1' : Math.abs(props.ffImpactYears)} info="Estimate of how this Goal impacts Financial Freedom" />
                : <ResultItem label="Financial Freedom Impact" result="Unable to Determine" info={`Analyzed till ${props.ffGoalEndYear}. You may try again by changing this Goal, Financial Freedom Target, or other Goals.`} />}
            <TimeCost amount={props.totalCost} annualSavings={props.annualSavings} currency={props.currency} />
            <OppCost discountRate={props.discountRate} cfs={props.cfs} currency={props.currency} rrFallDuration={props.rrFallDuration}
                startYear={props.startYear} ffEndYear={props.ffGoalEndYear} ffYear={props.ffYear} />
        </div>
    )
}