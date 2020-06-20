import React, { useState, useEffect, Fragment } from 'react'
import NumberInput from '../form/numberinput'
import { getNPV } from '../calc/finance'
import { BRCompChart } from '../goals/brcompchart'
import { toCurrency } from '../utils'
interface BRComparisonProps {
    price: number,
    taxRate: number,
    currency: string,
    sellAfter: number,
    discountRate: number,
    rentAmt: number,
    rentAmtHandler: Function,
    rentChgPer: number,
    rentChgPerHandler: Function,
    rentTaxBenefit: number,
    rentTaxBenefitHandler: Function,
    initAllBuyCFsForComparison: Function
}

export default function BRComparison(props: BRComparisonProps) {
    const [compData, setCompData] = useState<Array<any>>([])
    const [answer, setAnswer] = useState<string>('')
    const [rentAns, setRentAns] = useState<string>('')
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
        let allBuyCFs: Array<Array<number>> = props.initAllBuyCFsForComparison()
        if (allBuyCFs && allBuyCFs.length > 0) {
            results.push({
                name: 'Buy',
                values: initAllBuyCFs(allBuyCFs)
            })
            results.push({
                name: 'Rent',
                values: initAllRentCFs(allBuyCFs)
            })
        }
        return results
    }

    const provideRentAns = (data: Array<any>) => {
        let buyValues = data[0].values.y
        let rentValues = data[1].values.y
        if (buyValues.length >= props.sellAfter) {
            let diff = rentValues[props.sellAfter - 1] - buyValues[props.sellAfter - 1]
            if (diff === 0) setRentAns(`Renting costs similar to Buying for ${props.sellAfter} ${props.sellAfter === 1 ? 'year' : 'years'}.`)
            else setRentAns(`Renting costs ${diff > 0 ? 'lesser' : 'more'} by ${toCurrency(Math.abs(diff), props.currency)}`)
            return
        }
        setRentAns('')
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
        if (props.rentAmt > 0) {
            let data = buildComparisonData()
            console.log("Chart data is ", data)
            if (data && data.length == 2) {
                setCompData(data)
                setAnswer(findAnswer(data))
                provideRentAns(data)
            }
        } else {
            setCompData([])
            setAnswer("")
            setRentAns("")
        }
    }, [props])

    return (
        <Fragment>
            <div className="mt-4 w-full flex justify-around items-center">
                <NumberInput name="rentAmt" pre="Yearly" post="Rent" value={props.rentAmt} changeHandler={props.rentAmtHandler}
                    min={1000} max={200000} step={500} width="120px" currency={props.currency} note="Including Taxes & Fees" />
                <NumberInput name="rentChg" pre="Changes" value={props.rentChgPer} changeHandler={props.rentChgPerHandler}
                    min={-10} max={10} step={0.5} unit="%" note="Every Year" width="50px" />
            </div>
            {props.price > 0 && props.rentAmt > 0 && compData && compData.length === 2 && compData[1].values.y[props.sellAfter - 1] &&
                <BRCompChart data={compData} xTitle="Number of Years" rentAns={rentAns}
                    sellAfter={props.sellAfter} title={answer} />}
            <p className="mt-2 w-full text-center text-base">Assumes that Money Saved by Not Buying is Invested to Earn {props.discountRate}% Yearly after taxes & fees.</p>
        </Fragment>
    )
}