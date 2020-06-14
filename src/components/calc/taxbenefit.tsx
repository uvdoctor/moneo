import React, { Fragment } from 'react'
import Toggle from '../toggle'
import NumberInput from '../form/numberinput'
import RadialInput from '../form/radialinput'
import { toStringArr } from '../utils'

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
        <div className="flex flex-col items-center">
            <label className="font-semibold">Tax Deduction Allowed is</label>
            <div className="flex items-center">
                <RadialInput label="Yearly" data={toStringArr(0, 25, 0.5)} unit="%" width={120}
                    dataIndex={0} changeHandler={props.taxRateHandler} labelBottom={true} />
                <Fragment>
                    <div className="ml-8 mr-4">
                        <NumberInput name="tbLimit" pre="Up to" currency={props.currency} width="100px"
                            value={props.maxTaxDeduction} changeHandler={props.maxTaxDeductionHandler} max={300000} step={1000} />
                    </div>
                    {props.loan && <Toggle topText="On Interest Only" bottomText="On Full Amount" value={props.taxBenefitIntOnly} setter={props.taxBenefitIntOnlyHandler} />}
                </Fragment>
            </div>
        </div>
    )
}