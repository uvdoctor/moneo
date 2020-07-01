import React from 'react'
import Toggle from '../toggle'
import NumberInput from '../form/numberinput'
import RadialInput from '../form/radialinput'
import { toStringArr, toCurrency } from '../utils'
import Section from '../form/section'
import {GoalType} from '../../api/goals'
interface TaxBenefitProps {
    goalType: GoalType
    taxRate: number
    maxTaxDeduction: number
    taxBenefitInt: number | null | undefined
    maxTaxDeductionInt: number | null | undefined
    rentTaxBenefit: number | null | undefined
    totalTaxBenefit: number
    totalIntTaxBenefit: number | null | undefined
    totalIntTaxBenefitHandler: Function
    totalTaxBenefitHandler: Function
    taxRateHandler: Function
    maxTaxDeductionHandler: Function
    taxBenefitIntHandler: Function
    rentTaxBenefitHandler: Function
    maxTaxDeductionIntHandler: Function
    currency: string
}

export default function TaxBenefit(props: TaxBenefitProps) {
    return (
        <div className="flex flex-wrap items-center justify-around w-full">
            <Section title="Claim Tax Benefit"
                left={
                    <RadialInput pre="Rate" label="Yearly" data={toStringArr(0, 25, 0.5)} unit="%" width={120}
                        value={props.taxRate} step={0.5} changeHandler={props.taxRateHandler} labelBottom={true} 
                        post = {`Total ${toCurrency(props.totalTaxBenefit, props.currency)}`} />
                } right={
                    <NumberInput name="tbLimit" pre="Max" post="Limit" currency={props.currency} width="100px"
                        value={props.maxTaxDeduction} changeHandler={props.maxTaxDeductionHandler} max={300000} step={1000} />
                } />
            {(props.goalType === GoalType.B || props.goalType === GoalType.L) &&  
                <Section title="Tax Benefit For Interest"
                left={
                    <Toggle topText="Claim Benefit" bottomText="No Benefit" value={props.taxBenefitInt as number} setter={props.taxBenefitIntHandler} />
                } right={
                    <NumberInput name="tbLimit" pre="Max" post="Limit" currency={props.currency} width="100px"
                        value={props.maxTaxDeductionInt as number} changeHandler={props.maxTaxDeductionIntHandler} max={300000} step={1000}
                        note = {`Total ${toCurrency(props.totalIntTaxBenefit as number, props.currency)}`} />
                } />
            }
        </div>
    )
}