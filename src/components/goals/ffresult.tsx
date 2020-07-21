import React from 'react'
import ResultItem from '../calc/resultitem'
import SVGHourGlass from '../svghourglass'
import SVGInheritance from './svginheritance'
import SVGMoneyBag from '../calc/svgmoneybag'

interface FFResultProps {
    endYear: number
    ffYear: number
    ffAmt: number
    ffLeftOverAmt: number
    currency: string
}

export default function FFResult({ endYear, ffYear, ffAmt, ffLeftOverAmt, currency }: FFResultProps) {
    return (
        <div className="w-full">
            {ffAmt > 0 && ffLeftOverAmt >= 0 ?
                <div className="py-2 flex flex-wrap justify-around w-full items-start bg-green-100 border-t border-b border-green-200">
                    <ResultItem svg={<SVGHourGlass />} label="Achievable in" result={ffYear} noResultFormat
                        info={`${ffYear} may be the Earliest You can Achieve Financial Freedom.`} />
                    <ResultItem result={ffAmt} svg={<SVGMoneyBag />} label={`Savings by ${ffYear - 1}`}
                        currency={currency} info={`You can Withdraw from this Savings for Your expenses from ${ffYear} onwards`} />
                    <ResultItem result={ffLeftOverAmt} svg={<SVGInheritance />} label="Nominees Get"
                        currency={currency} footer={`Remaining In ${endYear + 1}`}
                        info={`This is the savings amount remaining by end of ${endYear}, when Your Plan ends. Hence this may be inherited by Your Nominees.`} />
                </div>
                : <p className="text-center bg-red-100 font-semibold py-2">{`Analyzed till ${ffYear}, but unable to determine.`}</p>}
        </div>
    )
}