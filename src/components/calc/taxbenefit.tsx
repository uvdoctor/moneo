import React, {Fragment} from 'react'
import NumberInput from '../form/numberinput'
import RadialInput from '../form/radialinput'
import { toStringArr, toCurrency } from '../utils'
import Section from '../form/section'
import { GoalType } from '../../api/goals'
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
    totalTaxBenefit: number
    totalTaxBenefitHandler: Function
    taxRateHandler: Function
    maxTaxDeductionHandler: Function
    currency: string
    rangeFactor: number
}

export default function TaxBenefit(props: TaxBenefitProps) {
    return (
        <Fragment>
            {((!props.allInputDone && props.inputOrder <= props.currentOrder) || props.allInputDone) &&
                <Section title="Claim Tax Benefit" showOnLoad={true}
                    left={
                        <RadialInput
                            inputOrder={props.inputOrder}
                            currentOrder={props.currentOrder}
                            nextStepDisabled={false}
                            nextStepHandler={props.nextStepHandler}
                            allInputDone={props.allInputDone}
                            pre="Rate" label="Yearly" data={toStringArr(0, 25, 0.5)} unit="%"
                            value={props.taxRate} step={0.5} changeHandler={props.taxRateHandler} labelBottom={true} />
                    } right={
                        <NumberInput
                            inputOrder={props.inputOrder + 1}
                            currentOrder={props.currentOrder}
                            nextStepDisabled={false}
                            nextStepHandler={props.nextStepHandler}
                            allInputDone={props.allInputDone} name="tbLimit" pre="Max Yearly" post="Deduction" currency={props.currency}
                            value={props.maxTaxDeduction} changeHandler={props.maxTaxDeductionHandler} min={0} max={300000} step={1000}
                            note={`Total ${toCurrency(props.totalTaxBenefit, props.currency)}`} rangeFactor={props.rangeFactor} />
                    } />}
        </Fragment>
    )
}