import React, { useState, useEffect, Fragment } from 'react'
import NumberInput from '../form/numberinput'
import { getEmi, getTotalInt } from '../calc/finance'
import { toCurrency, toStringArr, initYearOptions } from '../utils'
import SelectInput from '../form/selectinput'
import RadialInput from '../form/radialinput'
import Section from '../form/section'
import { getLoanPaidForMonths, getTaxBenefit } from '../goals/cfutils'
import HToggle from '../horizontaltoggle'

interface EmiProps {
    price: number
    currency: string
    startYear: number
    endYear: number
    repaymentSY: number
    loanYears: number
    loanAnnualInt: number
    loanPer: number
    loanBorrowAmt: number
    taxBenefitInt: number
    maxTaxDeductionInt: number
    taxRate: number
    repaymentSYHandler: Function
    loanMonthsHandler: Function
    loanPerHandler: Function
    loanAnnualIntHandler: Function
    taxBenefitIntHandler: Function
    maxTaxDeductionIntHandler: Function
}

export default function EmiCost(props: EmiProps) {
    const [totalIntAmt, setTotalIntAmt] = useState<number>(0)
    const [totalIntTaxBenefit, setTotalIntTaxBenefit] = useState<number>(0)
    const [ryOptions, setRYOptions] = useState(initYearOptions(props.startYear, 10))
    const [emi, setEMI] = useState<number>(0)

    const calculateEmi = () => {
        let emi = Math.round(getEmi(props.loanBorrowAmt, props.loanAnnualInt, props.loanYears * 12) as number)
        setEMI(emi)
        let loanPaidForMonths = getLoanPaidForMonths(props.endYear, props.repaymentSY, props.loanYears)
        let totalIntAmt = getTotalInt(props.loanBorrowAmt, emi, props.loanAnnualInt, loanPaidForMonths)
        setTotalIntAmt(Math.round(totalIntAmt))
        setTotalIntTaxBenefit(Math.round(getTaxBenefit(totalIntAmt, props.taxRate, props.maxTaxDeductionInt)))
    }

    useEffect(
        () => calculateEmi()
        , [props]
    );

    useEffect(() => {
        setRYOptions(initYearOptions(props.startYear, 10))
    }, [props.startYear])

    return (
        <Fragment>
            <Section title="Borrow"
                left={
                    <RadialInput width={120} unit="%" data={toStringArr(0, 90, 5)}
                        value={props.loanPer} changeHandler={props.loanPerHandler}
                        step={5} labelBottom={true} label="of Price"
                        post={`${toCurrency(props.loanBorrowAmt, props.currency)}`} />
                } right={
                    <SelectInput name="repaymentSY" options={ryOptions}
                        value={props.repaymentSY} pre="Repay From" changeHandler={(year: string) => props.repaymentSYHandler(parseInt(year))} />
                }
            />
            <Section title="Loan Details"
                toggle={
                    <HToggle rightText="Claim Interest Tax Benefit" value={props.taxBenefitInt} setter={props.taxBenefitIntHandler} />
                }
                left={
                    <NumberInput
                        name="duration"
                        pre="Term"
                        unit="years"
                        note={`EMI ${toCurrency(emi, props.currency)}`}
                        value={props.loanYears}
                        changeHandler={props.loanMonthsHandler}
                        min={0.5}
                        max={30} step={0.5} />
                } right={
                    <NumberInput
                        name="intRate"
                        pre="Interest"
                        unit="%"
                        note={`Total ${toCurrency(totalIntAmt, props.currency)}`}
                        value={props.loanAnnualInt}
                        changeHandler={props.loanAnnualIntHandler}
                        min={0.0}
                        max={30.0}
                        step={0.1} />
                }
                bottomLeft={props.taxBenefitInt && "Deduction"}
                bottomRight={props.taxBenefitInt && "In a Year"}
                bottom={props.taxBenefitInt &&
                    <NumberInput name="maxTaxDeductionInt" pre="Limited" post="Up to" value={props.maxTaxDeductionInt}
                        changeHandler={props.maxTaxDeductionIntHandler} min={0} max={150000} step={1000} 
                        note={`Total ${toCurrency(totalIntTaxBenefit, props.currency)}`} />
                } />

        </Fragment>
    );
}
