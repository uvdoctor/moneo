import React from 'react'
import Toggle from '../toggle'
import NumberInput from '../form/numberinput'
import RadialInput from '../form/radialinput'
import { toStringArr } from '../utils'
import Section from '../form/section'
interface TaxBenefitProps {
    taxRate: number,
    maxTaxDeduction: number,
    taxBenefitIntOnly: number,
    buyTaxRate: number,
    sellTaxRate: number,
    rentTaxBenefit: number,
    taxRateHandler: Function,
    maxTaxDeductionHandler: Function,
    taxBenefitIntOnlyHandler: Function,
    buyTaxRateHandler: Function,
    sellTaxRateHandler: Function,
    rentTaxBenefitHandler: Function,
    loan: boolean,
    currency: string,
    showBuySellTaxes: boolean
}

export default function TaxBenefit(props: TaxBenefitProps) {
    return (
        <div className="flex flex-wrap items-center justify-around w-full">
            {props.showBuySellTaxes &&
                <Section title="Taxes & Fees"
                    left={
                        <RadialInput label="Buy" unit="%" value={props.buyTaxRate}
                            data={toStringArr(0, 15, 0.5)} step={0.5} changeHandler={props.buyTaxRateHandler} width={120} />
                    } right={
                        <RadialInput label="Sell" unit="%" value={props.sellTaxRate}
                            data={toStringArr(0, 15, 0.5)} step={0.5} changeHandler={props.sellTaxRateHandler} width={120} />
                    } />}
            <Section title="Tax Deduction Benefit"
                left={
                    <RadialInput pre="Rate" label="Yearly" data={toStringArr(0, 25, 0.5)} unit="%" width={120}
                        value={props.taxRate} step={0.5} changeHandler={props.taxRateHandler} labelBottom={true} />
                } right={
                    <NumberInput name="tbLimit" pre="Max" post="Limit" currency={props.currency} width="100px"
                        value={props.maxTaxDeduction} changeHandler={props.maxTaxDeductionHandler} max={300000} step={1000} />
                } />
            <Section title="Claim Tax Benefit"
                left={
                    <Toggle topText="For Loan Interest Only" bottomText="For Full Amount" value={props.taxBenefitIntOnly} setter={props.taxBenefitIntOnlyHandler} />
                } right={
                    <Toggle topText="For Rent" bottomText="Not for Rent" value={props.rentTaxBenefit} setter={props.rentTaxBenefitHandler} />
                } />
        </div>
    )
}