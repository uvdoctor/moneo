import React, { Fragment, useEffect } from 'react'
import ResultItem from '../calc/resultitem'
import SVGMoneyBag from '../calc/svgmoneybag'
import SVGMoneyBagPer from '../svgmoneybagper'
import Section from '../form/section'
import RadialInput from '../form/radialinput'
import NumberInput from '../form/numberinput'
import { toStringArr } from '../utils'
import { calculateSellPrice, calculateXIRR } from './cfutils'
import { getDuration } from './goalutils'

interface SellProps {
    inputOrder: number
    currentOrder: number
    nextStepDisabled: boolean
    nextStepHandler: Function
    allInputDone: boolean
    price: number
    startYear: number
    endYear: number
    sellAfter: number
    sellPrice: number
    annualReturnPer: number
    sellPriceHandler: Function
    sellAfterHandler: Function
    annualReturnPerHandler: Function
    currency: string
    assetChgRate: number
    assetChgRateHandler: Function
    cfs: Array<number>
}

export default function Sell(props: SellProps) {
    useEffect(() => {
        let duration = getDuration(props.sellAfter, props.startYear, props.endYear)
        let sellPrice = calculateSellPrice(props.price, props.assetChgRate, duration)
        props.sellPriceHandler(sellPrice)
        props.annualReturnPerHandler(calculateXIRR(props.cfs, props.startYear, props.price, props.sellAfter, sellPrice))
    }, [props.cfs])

    return (
        <Fragment>
            {((!props.allInputDone && props.inputOrder <= props.currentOrder) || props.allInputDone) &&
                <Section title="Sell After" showOnLoad={true}
                    left={
                        <RadialInput
                            inputOrder={props.inputOrder}
                            currentOrder={props.currentOrder}
                            nextStepDisabled={false}
                            allInputDone={props.allInputDone}
                            nextStepHandler={props.nextStepHandler}
                            label="Years" labelBottom={true} data={toStringArr(1, 20)}
                            value={props.sellAfter} step={1} changeHandler={props.sellAfterHandler} />
                    } right={
                        <NumberInput name="assetChgRate"
                            inputOrder={props.inputOrder + 1}
                            currentOrder={props.currentOrder}
                            nextStepDisabled={false}
                            nextStepHandler={props.nextStepHandler}
                            allInputDone={props.allInputDone} pre="Sell Price" post="Changes" unit="%" note="Yearly"
                            min={-20} max={20} step={0.5} value={props.assetChgRate} changeHandler={props.assetChgRateHandler} />
                    }
                    bottom={
                        <div className="flex justify-around w-full items-center">
                            <ResultItem svg={<SVGMoneyBag />} label="You May Get" footer={`In ${props.startYear + props.sellAfter}`}
                                result={Math.round(props.sellPrice)} currency={props.currency} />
                            <ResultItem svg={<SVGMoneyBagPer />} label={`You May ${props.annualReturnPer > 0 ? 'Gain' : 'Lose'}`}
                                result={props.annualReturnPer} decimal={2} unit="%" footer='Yearly' />
                        </div>
                    } footer='Sell Price above excludes taxes & fees.' />}
        </Fragment>
    )
}