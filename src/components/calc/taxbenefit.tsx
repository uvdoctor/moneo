import React, { Fragment } from 'react'
import Toggle from '../toggle'
import NumberInput from '../form/numberinput'

interface TaxBenefitProps {
    taxRate: number,
    maxTaxDeduction: number,
    taxBenefitIntOnly: number,
    taxRateHandler: any,
    maxTaxDeductionHandler: any,
    taxBenefitIntOnlyHandler: any,
    loan: boolean,
    currency: string
}

export default function TaxBenefit(props: TaxBenefitProps) {
    return (
        <div className="flex items-center">
            <NumberInput name="taxRate" pre="Tax" post="Benefit" unit="%" width="30px"
                value={props.taxRate} changeHandler={props.taxRateHandler} max={45} />
            {props.taxRate > 0 && <Fragment>
                {props.loan && props.taxRate > 0 && <Toggle topText="On Interest Only" bottomText="On Full Amount" value={props.taxBenefitIntOnly} setter={props.taxBenefitIntOnlyHandler} />}
                {props.taxRate > 0 && <NumberInput name="tbLimit" pre="Tax Deduction" post="Yearly Limit" currency={props.currency} width="80px"
                    value={props.maxTaxDeduction} changeHandler={props.maxTaxDeductionHandler} max={300000} step={1000} />}
            </Fragment>}
        </div>
    )
}