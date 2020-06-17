import React from 'react'
import Toggle from '../toggle'
import NumberInput from '../form/numberinput'
import RadialInput from '../form/radialinput'
import { toStringArr } from '../utils'

interface TaxBenefitProps {
    taxRate: number,
    maxTaxDeduction: number,
    taxBenefitIntOnly: number,
    buyTaxRate: number,
    sellTaxRate: number,
    taxRateHandler: any,
    maxTaxDeductionHandler: Function,
    taxBenefitIntOnlyHandler: Function,
    buyTaxRateHandler: Function,
    sellTaxRateHandler: Function,
    loan: boolean,
    currency: string,
    showBuySellTaxes: boolean
}

export default function TaxBenefit(props: TaxBenefitProps) {
    return (
        <div className="mt-4">
            {props.showBuySellTaxes &&
                <div className="flex flex-col items-center">
                    <label className="text-lg md:text-xl lg:text-2xl font-semibold">Taxes & Fees</label>
                    <div className="flex w-full justify-around items-center">
                        <RadialInput pre="To Buy," label="Pay" post="in Taxes & Fees" unit="%" value={props.buyTaxRate}
                            data={toStringArr(0, 15, 0.5)} step={0.5} changeHandler={props.buyTaxRateHandler} width={120} />
                        <RadialInput pre="To Sell," label="Pay" post="in Taxes & Fees" unit="%" value={props.sellTaxRate}
                            data={toStringArr(0, 15, 0.5)} step={0.5} changeHandler={props.sellTaxRateHandler} width={120} />
                    </div>
                </div>}

            <div className="flex flex-col items-center">
                <label className="text-lg md:text-xl lg:text-2xl font-semibold">Tax Deduction Allowed is</label>
                <div className="flex items-center w-full justify-around mt-4">
                    <RadialInput label="Yearly" data={toStringArr(0, 25, 0.5)} unit="%" width={120}
                        value={props.taxRate} step={0.5} changeHandler={props.taxRateHandler} labelBottom={true} />
                    <NumberInput name="tbLimit" pre="Maximum" post="Limit" currency={props.currency} width="100px"
                        value={props.maxTaxDeduction} changeHandler={props.maxTaxDeductionHandler} max={300000} step={1000} />
                    {props.loan && <Toggle topText="On Interest Only" bottomText="On Full Amount" value={props.taxBenefitIntOnly} setter={props.taxBenefitIntOnlyHandler} />}
                </div>
            </div>
        </div>
    )
}