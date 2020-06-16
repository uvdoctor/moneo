import React, { useState, useEffect, Fragment } from 'react'
import NumberInput from '../form/numberinput'
import Toggle from '../toggle'
import { getNPV } from '../calc/finance'
import { BRCompChart } from '../goals/brcompchart'
import { toCurrency } from '../utils'
import SVGBalance from './svgbalance'

interface BRComparisonProps {
    price: number,
    priceChgRate: number,
    taxRate: number,
    currency: string,
    sellAfter: number,
    setRentAns: Function,
    initAllBuyCFsForComparison: Function
}

export default function BRComparison(props: BRComparisonProps) {
    const [rentAmt, setRentAmt] = useState(Math.round(props.price * 0.05))
    const [rentChgPer, setRentChgPer] = useState(5)
    const [taxBenefit, setTaxBenefit] = useState(0)
    const [compData, setCompData] = useState<Array<any>>([])
    const [discountRate, setDiscountRate] = useState<number>(6)
    const [answer, setAnswer] = useState<string>('')
    const analyzeFor = 30

    const getNextTaxAdjRentAmt = (val: number) => {
        return (val * (1 + (rentChgPer / 100))) * (taxBenefit > 0 ? (1 - (props.taxRate / 100)) : 1)
    }

    const initAllRentCFs = (allBuyCFs: Array<Array<number>>) => {
        if (rentAmt <= 0) return []
        let taxAdjustedRentAmt = rentAmt * (1 - (props.taxRate / 100))
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
                    if (inv > 0) inv += inv * (discountRate / 100)
                    cfs.push(buyAmt < rentAmt ? buyAmt : rentAmt)
                }
                cfs[cfs.length - 1] += inv
            }
            if (cfs.length > 0) {
                let initialAmt = cfs[0]
                if (cfs.length > 1) cfs.splice(0, 1)
                x.push(i + 1)
                y.push(i === 0 ? Math.round(initialAmt) : Math.round(getNPV(discountRate, initialAmt, cfs)))
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
                y.push(i === 0 ? Math.round(year0amt) : Math.round(getNPV(discountRate, year0amt, cfs)))
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
            if (buyValues[props.sellAfter - 1] < rentValues[props.sellAfter - 1]) {
                let diff = rentValues[props.sellAfter - 1] - buyValues[props.sellAfter - 1]
                props.setRentAns(`Save ~ ${toCurrency(diff, props.currency)} by Renting instead.`)
                return
            }
        }
        props.setRentAns('')
    }

    const findAnswer = (data: Array<any>) => {
        let answer = ''
        let condition = ''
        let buyValues = data[0].values.y
        let rentValues = data[1].values.y
        if (buyValues[0] < rentValues[0]) {
            answer += 'Renting is better than Buying'
        } else if (buyValues[0] > rentValues[0]) answer += 'Buying is better than Renting'
        else if (buyValues[0] === rentValues[0]) answer += 'Both are suitable options'
        for (let i = 1; i < buyValues.length; i++) {
            let alternative = ''
            if (buyValues[i] < rentValues[i]) alternative += 'Renting'
            else if (buyValues[i] > rentValues[i]) alternative += 'Buying'
            else if (buyValues[i] === rentValues[i]) alternative += 'Both'
            if (!answer.startsWith(alternative)) {
                condition = ` till ${i} ${i === 1 ? 'year' : 'years'}.\n${alternative} is better after that.`
                break
            }
        }
        return answer + (condition ? condition : '.')
    }

    useEffect(() => {
        if (rentAmt > 0) {
            let data = buildComparisonData()
            console.log("Chart data is ", data)
            if (data && data.length == 2) {
                setCompData(data)
                setAnswer(findAnswer(data))
                provideRentAns(data)
            }
        }
    }, [props.priceChgRate, props.taxRate, props.currency, rentAmt, rentChgPer, taxBenefit, discountRate])

    return (
        <Fragment>
            <div className="flex flex-wrap justify-between items-center w-full">
                <NumberInput name="rentAmt" pre="Yearly" post="Rent" value={rentAmt} changeHandler={setRentAmt}
                    min={1000} max={999999} width="150px" currency={props.currency} note="Including Taxes & Fees" />
                <NumberInput name="rentChg" pre="Changes" value={rentChgPer} changeHandler={setRentChgPer}
                    min={-10} max={10} step={0.5} unit="%" note="Every Year" width="50px" />
                <Toggle topText="Claim Tax Benefit" bottomText="No Tax Benefit" value={taxBenefit} setter={setTaxBenefit} />
                <NumberInput name="oppDR" pre="Investment" post="Earns" value={discountRate} changeHandler={setDiscountRate}
                    min={0} max={10} unit="%" note="Yearly after taxes" width="30px" />
            </div>
            {answer && <div className="mt-4 md:mt-8 w-full flex justify-center items-center">
                <SVGBalance />
                <p className="ml-4">
                    <label>Assuming that Money saved by not buying is Invested,</label>
                    <label>{answer}</label>
                </p>
            </div>}
            {compData && compData.length === 2 && <BRCompChart data={compData} xTitle="Number of Years" />}
        </Fragment>
    )
}