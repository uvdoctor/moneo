import React, { Fragment } from 'react'
import Toggle from '../toggle'
import NumberInput from '../form/numberinput'

interface TaxBenefitProps {
    taxRate: number,
    taxDeductionLimit: number,
    maxTaxDeduction: number,
    taxBenefitIntOnly: number,
    taxRateHandler: any,
    taxDeductionLimitHandler: any,
    maxTaxDeductionHandler: any,
    taxBenefitIntOnlyHandler: any,
    loan: boolean,
    currency: string
}

export default function TaxBenefit(props: TaxBenefitProps) {
    return (
        <div className="flex items-center">
            <NumberInput name="taxRate" pre="Tax Benefit" unit="%" width="30px"
                value={props.taxRate} changeHandler={props.taxRateHandler} min={0.001} max={45} />
            {props.taxRate > 0 && <Fragment>
                {props.loan && props.taxRate > 0 && <Toggle topText="On Interest Only" bottomText="On Full Amount" value={props.taxBenefitIntOnly} setter={props.taxBenefitIntOnlyHandler} />}
                <Toggle bottomText="No Limit" topText="Limit Tax Deduction" value={props.taxDeductionLimit} setter={props.taxDeductionLimitHandler} />
                {props.taxDeductionLimit > 0 && <NumberInput name="tbLimit" pre="Up To" note="Yearly" currency={props.currency} width="80px"
                    value={props.maxTaxDeduction} changeHandler={props.maxTaxDeductionHandler} min={10000} max={50000} />}
            </Fragment>}
        </div>
    )
}