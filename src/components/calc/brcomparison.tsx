import React, { useState, useEffect, Fragment } from 'react'
import { getNPV } from '../calc/finance'
import { BRCompChart } from '../goals/brcompchart'
import { toCurrency } from '../utils'
import SVGBalance from '../calc/svgbalance'
import ExpandCollapse from '../form/expandcollapse'

interface BRComparisonProps {
    taxRate: number
    currency: string
    sellAfter: number
    discountRate: number
    discountRateHandler: Function
    rentAmt: number
    rentAmtHandler: Function
    rentChgPer: number
    rentChgPerHandler: Function
    rentTaxBenefit: number
    rentTaxBenefitHandler: Function
    answer: string
    answerHandler: Function
    rentAns: string
    rentAnsHandler: Function
    allBuyCFs: Array<Array<number>>
}

export default function BRComparison(props: BRComparisonProps) {
    const [showRentChart, setShowRentChart] = useState<boolean>(true)
    const [compData, setCompData] = useState<Array<any>>([])
    const analyzeFor = 20

    const getNextTaxAdjRentAmt = (val: number) => {
        return (val * (1 + (props.rentChgPer / 100))) * (props.rentTaxBenefit > 0 ? (1 - (props.taxRate / 100)) : 1)
    }

    const initAllRentCFs = (allBuyCFs: Array<Array<number>>) => {
        if (props.rentAmt <= 0) return []
        let taxAdjustedRentAmt = props.rentAmt * (1 - (props.taxRate / 100))
        if (!allBuyCFs || allBuyCFs.length < 1) return []
        let x: Array<number> = []
        let y: Array<number> = []
        for (let i = 0; i < analyzeFor; i++) {
            let cfs = []
            let buyCFs = allBuyCFs[i]
            if (buyCFs && buyCFs.length > 0) {
                let inv = 0
                for (let j = 0, value = taxAdjustedRentAmt; j <= i; j++, value = getNextTaxAdjRentAmt(value)) {
                    let buyAmt = buyCFs[j]
                    let rentAmt = -1 * value
                    let diff = buyAmt - rentAmt
                    inv -= diff
                    if (inv > 0) inv += inv * (props.discountRate / 100)
                    cfs.push(buyAmt < rentAmt ? buyAmt : rentAmt)
                }
                cfs[cfs.length - 1] += inv
            }
            if (cfs.length > 0) {
                let initialAmt = cfs[0]
                if (cfs.length > 1) cfs.splice(0, 1)
                x.push(i + 1)
                y.push(i === 0 ? Math.round(initialAmt) : Math.round(getNPV(props.discountRate, initialAmt, cfs)))
            }

        }
        return { x: x, y: y }
    }

    const initAllBuyCFs = (allBuyCFs: Array<Array<number>>) => {
        let x: Array<number> = []
        let y: Array<number> = []
        for (let i = 0; i < analyzeFor; i++) {
            let buyCFs = allBuyCFs[i]
            if (buyCFs && buyCFs.length > 0) {
                let year0amt = buyCFs[0]
                let cfs = []
                for (let j = 1; j <= i; j++) {
                    cfs.push(buyCFs[j])
                }
                x.push(i + 1)
                y.push(i === 0 ? Math.round(year0amt) : Math.round(getNPV(props.discountRate, year0amt, cfs)))
            }
        }
        return { x: x, y: y }
    }

    const buildComparisonData = () => {
        let results: Array<any> = []
        if (props.allBuyCFs && props.allBuyCFs.length > 0) {
            results.push({
                name: 'Buy',
                values: initAllBuyCFs(props.allBuyCFs)
            })
            results.push({
                name: 'Rent',
                values: initAllRentCFs(props.allBuyCFs)
            })
        }
        console.log("Results are: ", results)
        return results
    }

    const provideRentAns = (data: Array<any>) => {
        let buyValues = data[0].values.y
        let rentValues = data[1].values.y
        if (buyValues.length >= props.sellAfter) {
            let diff = rentValues[props.sellAfter - 1] - buyValues[props.sellAfter - 1]
            let rentAns = `Over ${props.sellAfter} ${props.sellAfter === 1 ? 'year' : 'years'}, `
            if (diff === 0) rentAns += `Renting costs similar to Buying.`
            else rentAns += `Rent is ${diff > 0 ? 'cheaper' : 'costlier'} by ${toCurrency(Math.abs(diff), props.currency)}`
            props.rentAnsHandler(rentAns)
            return
        }
        props.rentAnsHandler('')
    }

    const findAnswer = (data: Array<any>) => {
        let answer = ''
        let condition = ''
        let buyValues = data[0].values.y
        let rentValues = data[1].values.y
        if (buyValues[0] < rentValues[0]) {
            answer += 'Renting costs lesser'
        } else if (buyValues[0] > rentValues[0]) answer += 'Buying costs lesser'
        else if (buyValues[0] === rentValues[0]) answer += 'Both options cost similar'
        for (let i = 1; i < buyValues.length; i++) {
            let alternative = ''
            if (buyValues[i] < rentValues[i]) alternative += 'Renting'
            else if (buyValues[i] > rentValues[i]) alternative += 'Buying'
            else if (buyValues[i] === rentValues[i]) alternative += 'Both'
            if (!answer.startsWith(alternative)) {
                condition = ` till ${i} ${i === 1 ? 'year' : 'years'}`
                break
            }
        }
        return answer + condition
    }

    useEffect(() => {
        if (compData && compData.length === 2) {
            props.answerHandler(findAnswer(compData))
            provideRentAns(compData)
        } else {
            props.answerHandler("")
            props.rentAnsHandler("")
        }
    }, [compData, props.sellAfter])

    useEffect(() => {
        if (props.rentAmt > 0) {
            let data = buildComparisonData()
            console.log("Chart data is ", data)
            if (data && data.length == 2) setCompData([...data])
        } else setCompData([...[]])
    }, [props.taxRate, props.discountRate, props.rentAmt, props.rentChgPer, props.rentTaxBenefit, props.allBuyCFs])

    return (
        <div className="mt-4 mb-4">
            <ExpandCollapse title="Buy v/s Rent for 20 Years" value={showRentChart}
                handler={setShowRentChart} svg={<SVGBalance />} />
            {showRentChart && compData && compData.length === 2 && compData[1].values.y[props.sellAfter - 1] &&
            <Fragment>
                <p className="text-center text-base mt-4">Negative values indicate Loss, while Positive values indicate Gain</p>
                <BRCompChart data={compData} xTitle="Number of Years" rentAns={props.rentAns}
                    sellAfter={props.sellAfter} title={props.answer} />
            </Fragment>}
        </div>
    )
}