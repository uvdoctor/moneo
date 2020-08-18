import React, {Fragment, useEffect, useState} from 'react'
import NumberInput from '../form/numberinput'
import Section from '../form/section'
import { GoalType } from '../../api/goals'
import ResultItem from './resultitem'
import {calculateTotalTaxBenefit, calculatePrincipalTaxBenefit} from '../goals/cfutils'
interface TaxBenefitProps {
    inputOrder: number
    currentOrder: number
    nextStepDisabled: boolean
    nextStepHandler: Function
    allInputDone: boolean
    actionCount?: number
    goalType: GoalType
    taxRate: number
    maxTaxDeduction: number
    taxRateHandler: Function
    maxTaxDeductionHandler: Function
    currency: string
    rangeFactor: number
    startYear: number
    endYear: number
    duration: number
    price: number
    priceChgRate?: number
    loanPer?: number | null
    loanRate?: number | null
    loanDur?: number | null
    loanRY?: number | null
    manualMode: number
}

export default function TaxBenefit(props: TaxBenefitProps) {
    const [taxBenefit, setTaxBenefit] = useState<number>(0)

    useEffect(() => {
        if (props.loanPer && props.loanRate && props.loanDur && props.loanRY && props.manualMode < 1) {
            setTaxBenefit(calculatePrincipalTaxBenefit(props.goalType, props.price, props.priceChgRate as number, props.manualMode, 
                props.loanPer, props.loanRate, props.loanDur, props.loanRY, props.startYear, props.endYear, props.duration, 
                props.taxRate, props.maxTaxDeduction))
        } else {
            setTaxBenefit(calculateTotalTaxBenefit(props.goalType, props.price, props.manualMode, 
                props.duration, props.taxRate, props.maxTaxDeduction, props.priceChgRate))
        }
    }, [props])

    return (
        <Fragment>
            {((!props.allInputDone && props.inputOrder <= props.currentOrder) || props.allInputDone) &&
                <Section title="Claim Tax Deduction" insideForm
                    left={
                        <NumberInput name="tr"
                            inputOrder={props.inputOrder}
                            currentOrder={props.currentOrder}
                            nextStepDisabled={false}
                            nextStepHandler={props.nextStepHandler}
                            allInputDone={props.allInputDone}
                            info="Income Tax slab based on Your Income"
                            pre="Tax" post="Rate" min={0} max={50} step={0.1} unit="%"
                            value={props.taxRate} changeHandler={props.taxRateHandler} />
                    } right={
                        props.taxRate ? <NumberInput
                            inputOrder={props.inputOrder + 1}
                            currentOrder={props.currentOrder}
                            nextStepDisabled={false}
                            nextStepHandler={props.nextStepHandler}
                            allInputDone={props.allInputDone} 
                            info="Maximum Yearly Income Tax Deduction Allowed"
                            name="tbLimit" pre="Max Yearly" post="Deduction" currency={props.currency}
                            value={props.maxTaxDeduction} changeHandler={props.maxTaxDeductionHandler} min={0} max={50000} step={1000}
                            note={<ResultItem label='Total Tax Benefit' result={taxBenefit} currency={props.currency} />} 
                            rangeFactor={props.rangeFactor} width="100px" />
                        : !props.allInputDone && props.currentOrder === props.inputOrder + 1 && props.nextStepHandler()
                    } />}
        </Fragment>
    )
}