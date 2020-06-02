import React, { useState, useEffect, Fragment } from 'react'
import NumberInput from '../form/numberinput'
import { getEmi, getTotalInt } from '../calc/finance'
import Toggle from '../toggle'
import { toCurrency } from '../utils'
import SelectInput from '../form/selectinput'

interface EmiProps {
    borrow: number,
    currency: string,
    startYear: number,
    repaymentSY: number,
    repaymentSYOptions: any,
    loanMonths: number,
    loanDP: number,
    loanAnnualInt: number,
    emi: number,
    borrowAmt: number,
    emiHandler: any,
    borrowModeHandler: any,
    repaymentSYHandler: any,
    loanMonthsHandler: any,
    loanDPHandler: any,
    borrowAmtHandler: any,
    loanAnnualIntHandler: any
}

export default function EmiCost(props: EmiProps) {
    const [totalIntAmt, setTotalIntAmt] = useState<number>(0)

    const calculateEmi = () => {
        let emi = Math.round(getEmi(props.borrowAmt, props.loanAnnualInt, props.loanMonths) as number)
        props.emiHandler(emi)
        setTotalIntAmt(Math.round(getTotalInt(props.borrowAmt, emi, props.loanMonths)))
    }

    const changeBorrowMode = (val: number) => {
        props.borrowModeHandler(val)
    }

    useEffect(
        () =>
            {if(props.borrow > 0) calculateEmi()}
        , [props]
    );

    return (
        <div className="flex flex-wrap items-center">
            <Toggle topText="Borrow" bottomText="Self" value={props.borrow} setter={changeBorrowMode} />
            {props.borrow > 0 && <Fragment>
                <NumberInput
                    name="borrowAmt"
                    pre="Loan Amount"
                    width="100px"
                    currency={props.currency}
                    value={props.borrowAmt}
                    changeHandler={props.borrowAmtHandler}
                    min={500} />
                <NumberInput
                    name="dp"
                    pre="Down Payment"
                    width="90px"
                    currency={props.currency}
                    value={props.loanDP}
                    changeHandler={props.loanDPHandler}
                    />
                <SelectInput name="repaymentSY" options={props.repaymentSYOptions}
                    value={props.repaymentSY} pre="Repayment Starts" changeHandler={(year: string) => props.repaymentSYHandler(parseInt(year))} />
                <div className="flex flex-col">
                    <NumberInput
                        name="intRate"
                        pre="Interest"
                        unit="%"
                        width="50px"
                        value={props.loanAnnualInt}
                        changeHandler={props.loanAnnualIntHandler}
                        min={1.0}
                        max={30.0}
                        step={0.1} />
                    <div className="flex justify-between mr-4">
                        <label>Total</label>
                        <label className="font-semibold text-right">{toCurrency(totalIntAmt, props.currency)}</label>
                    </div>
                </div>
                <div className="flex flex-col">
                    <NumberInput
                        name="duration"
                        pre="Term"
                        unit="months"
                        width="40px"
                        value={props.loanMonths}
                        changeHandler={props.loanMonthsHandler}
                        min={6}
                        max={360} />
                    <div className="flex justify-between mr-4">
                        <label>EMI</label>
                        <label className="font-semibold">{toCurrency(props.emi, props.currency)}</label>
                    </div>
                </div>
            </Fragment>}
        </div >
    );
}
