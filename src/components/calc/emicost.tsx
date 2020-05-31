import React, { useState, useEffect, Fragment } from 'react'
import NumberInput from '../form/numberinput'
import { getEmi, getTotalInt } from '../calc/finance'
import Toggle from '../toggle'
import { toCurrency } from '../utils'

interface EmiProps {
    borrow: number,
    amount: number,
    currency: string,
    emiHandler: any,
    borrowModeHandler: any,
    customEditHandler: any
}

export default function EmiCost(props: EmiProps) {
    const [loanDPInPer, setLoanDPInPer] = useState<number>(20)
    const [loanAnnualInt, setLoanAnnualInt] = useState<number>(4)
    const [loanMonths, setLoanMonths] = useState<number>(60)
    const [borrow, setBorrow] = useState<number>(props.borrow)
    const [customEdit, setCustomEdit] = useState<number>(0)
    const [emi, setEmi] = useState<number>(0)
    const [totalIntAmt, setTotalIntAmt] = useState<number>(0)

    const calculateEmi = (total: number, dpInPer: number, annualInt: number, dur: number) => {
        if (borrow < 1) return
        if (customEdit > 0) return
        let emi = getEmi(total, dpInPer, annualInt, dur) as number
        if (!emi || emi <= 0) {
            setEmi(0)
            props.emiHandler(0, dpInPer, dur)
            return
        }
        emi = Math.round(emi)
        setEmi(emi)
        let totalInt = getTotalInt(props.amount, dpInPer, emi, loanMonths)
        setTotalIntAmt(Math.round(totalInt))
        props.emiHandler(emi, dpInPer, dur, loanAnnualInt)
    }

    const changeBorrowMode = (val: number) => {
        setBorrow(val)
        props.borrowModeHandler(val)
    }

    const changeCustomEdit = (val: number) => {
        setCustomEdit(val)
        props.customEditHandler(val)
    }

    useEffect(
        () => calculateEmi(props.amount, loanDPInPer, loanAnnualInt, loanMonths)
        , [props, loanDPInPer, loanAnnualInt, loanMonths, borrow]
    );

    return (
        <div className="flex flex-wrap items-center">
                <Toggle topText="Borrow" bottomText="Self" value={borrow} setter={changeBorrowMode} />
                {borrow > 0 && <Toggle topText="Custom" bottomText="EMI" value={customEdit} setter={changeCustomEdit} />}
                {borrow > 0 && customEdit < 1 && <Fragment>
                    <div className="flex flex-col mt-4 ml-4">
                        <NumberInput
                            name="dpInPer"
                            pre="Down Payment"
                            unit="%"
                            width="30px"
                            value={loanDPInPer}
                            changeHandler={setLoanDPInPer}
                            min={10}
                            max={90} />
                        <div className="flex justify-between mr-4">
                            <label>Amount</label>
                            <label className="font-semibold text-right">{toCurrency(Math.round(props.amount * (loanDPInPer / 100)), props.currency)}</label>
                        </div>
                    </div>
                    <div className="flex flex-col mt-4 ml-8">
                        <NumberInput
                            name="intRate"
                            pre="Interest"
                            unit="%"
                            width="50px"
                            value={loanAnnualInt}
                            changeHandler={setLoanAnnualInt}
                            min={1}
                            max={30}
                            step={0.1} />
                        <div className="flex justify-between mr-4">
                            <label>Total</label>
                            <label className="font-semibold text-right">{toCurrency(totalIntAmt, props.currency)}</label>
                        </div>
                    </div>
                    <div className="flex flex-col mt-4 ml-8">
                        <NumberInput
                            name="duration"
                            pre="Term"
                            unit="months"
                            width="40px"
                            value={loanMonths}
                            changeHandler={setLoanMonths}
                            min={6}
                            max={360} />
                        <div className="flex justify-between mr-4">
                            <label>EMI</label>
                            <label className="font-semibold">{toCurrency(emi, props.currency)}</label>
                        </div>
                    </div>
                </Fragment>}
        </div>
    );
}
