import React from 'react'
import ResultItem from '../calc/resultitem'
import SVGHourGlass from '../svghourglass'
import SVGInheritance from './svginheritance'
import SVGPiggy from '../svgpiggy'

interface FFResultProps {
    endYear: number
    ffYear: number | null
    ffAmt: number
    ffLeftOverAmt: number
    ffMinReq: number
    ffNomineeAmt: number
    ffOOM: Array<number> | null
    currency: string
}

export default function FFResult({ endYear, ffYear, ffAmt, ffLeftOverAmt, ffMinReq, ffNomineeAmt, ffOOM, currency }: FFResultProps) {
    return (
        <div className="w-full">
            {ffYear && ffLeftOverAmt >= ffNomineeAmt && ffAmt >= ffMinReq ?
                <div className="py-2 flex flex-wrap justify-around w-full items-start bg-green-100 border-t border-b border-green-200">
                    <ResultItem svg={<SVGHourGlass />} label="Achievable from" result={ffYear} noResultFormat
                        info={`${ffYear} may be the Earliest You can Achieve Financial Freedom.`}
                        imp={ffOOM ? `You May Not Have Enough Savings in Years ${ffOOM.map(year => ` ${year}`)}` : ''} />
                    <ResultItem result={ffAmt} svg={<SVGPiggy />} label={`Savings by ${ffYear - 1}`}
                        currency={currency} info={`You can Withdraw from this Savings for Your expenses from ${ffYear} onwards`} />
                    <ResultItem result={ffLeftOverAmt} svg={<SVGInheritance />} label={`Nominees Get`}
                        currency={currency}
                        info={`This is the savings amount left over in ${endYear + 1}. 
                        As Your Plan ends in ${endYear}, this may be inherited by Your Nominees. 
                        This includes the Inheritance Amount for Nominees as per the Plan.`} />
                </div>
                : <p className="text-center bg-red-100 font-semibold py-2">
                    {ffYear === endYear - 20 ? `Analyzed till ${ffYear}` : `You May Not have Enough Savings in ${ffYear}`}
                    {`. Please try again with different inputs / goals.`}
                </p>}
        </div>
    )
}