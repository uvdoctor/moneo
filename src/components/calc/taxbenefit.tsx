import React from 'react'
import NumberInput from '../form/numberinput'
import RadialInput from '../form/radialinput'
import { toStringArr, toCurrency } from '../utils'
import Section from '../form/section'
import {GoalType} from '../../api/goals'
interface TaxBenefitProps {
    goalType: GoalType
    taxRate: number
    maxTaxDeduction: number
    totalTaxBenefit: number
    totalTaxBenefitHandler: Function
    taxRateHandler: Function
    maxTaxDeductionHandler: Function
    currency: string
}

export default function TaxBenefit(props: TaxBenefitProps) {
    return (
            <Section title="Claim Tax Benefit"
                left={
                    <RadialInput pre="Rate" label="Yearly" data={toStringArr(0, 25, 0.5)} unit="%" 
                        value={props.taxRate} step={0.5} changeHandler={props.taxRateHandler} labelBottom={true} 
                        post = {`Total ${toCurrency(props.totalTaxBenefit, props.currency)}`} />
                } right={
                    <NumberInput name="tbLimit" pre="Deduction" post="Limit" currency={props.currency} 
                        value={props.maxTaxDeduction} changeHandler={props.maxTaxDeductionHandler} max={300000} step={1000} />
                } />
    )
}