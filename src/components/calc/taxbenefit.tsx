import React, {useState, useEffect} from 'react'
import Toggle from '../toggle'
import NumberInput from '../form/numberinput'
import RadialInput from '../form/radialinput'
import { toStringArr, toCurrency } from '../utils'
import Section from '../form/section'
interface TaxBenefitProps {
    taxRate: number,
    maxTaxDeduction: number,
    taxBenefitIntOnly: number | null | undefined,
    rentTaxBenefit: number | null | undefined,
    taxRateHandler: Function,
    maxTaxDeductionHandler: Function,
    taxBenefitIntOnlyHandler: Function,
    rentTaxBenefitHandler: Function,
    currency: string
}

export default function TaxBenefit(props: TaxBenefitProps) {
    const [totalBenefit, setTotalBenefit] = useState<number>(0)

    useEffect(() => {

    }, [props.taxRate, props.rentTaxBenefit, props.taxBenefitIntOnly, props.maxTaxDeduction])

    return (
        <div className="flex flex-wrap items-center justify-around w-full">
            <Section title="Tax Deduction Benefit"
                left={
                    <RadialInput pre="Rate" label="Yearly" data={toStringArr(0, 25, 0.5)} unit="%" width={120}
                        value={props.taxRate} step={0.5} changeHandler={props.taxRateHandler} labelBottom={true} 
                        post = {`Total ${toCurrency(totalBenefit, props.currency)}`} />
                } right={
                    <NumberInput name="tbLimit" pre="Max" post="Limit" currency={props.currency} width="100px"
                        value={props.maxTaxDeduction} changeHandler={props.maxTaxDeductionHandler} max={300000} step={1000} />
                } />
            {props.taxBenefitIntOnly &&  
                <Section title="Claim Tax Benefit"
                left={
                    <Toggle topText="For Loan Interest Only" bottomText="For Full Amount" value={props.taxBenefitIntOnly} setter={props.taxBenefitIntOnlyHandler} />
                } right={
                    props.rentTaxBenefit && <Toggle topText="For Rent" bottomText="Not for Rent" value={props.rentTaxBenefit} setter={props.rentTaxBenefitHandler} />
                } />
            }
        </div>
    )
}