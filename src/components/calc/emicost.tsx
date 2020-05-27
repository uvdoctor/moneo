import React, { useState, useEffect } from 'react'
import NumberInput from '../form/numberinput'
import { getEmi, getTotalInt } from '../calc/finance'
import Toggle from '../toggle'
import { toCurrency } from '../utils'

interface EmiProps {
    borrow: boolean,
    amount: number,
    currency: string,
    emiHandler: any,
    borrowModeHandler: any
}

export default function EmiCost(props: EmiProps) {
    const [loanDPInPer, setLoanDPInPer] = useState<number>(20)
    const [loanAnnualInt, setLoanAnnualInt] = useState<number>(4)
    const [loanMonths, setLoanMonths] = useState<number>(60)
    const [borrow, setBorrow] = useState<boolean>(props.borrow)
    const [emi, setEmi] = useState<number>(0)
    const [totalIntAmt, setTotalIntAmt] = useState<number>(0)

    const calculateEmi = (total: number, dpInPer: number, annualInt: number, dur: number) => {
        if (!borrow) return
        let emi = getEmi(total, dpInPer, annualInt, dur)
        if (!emi || emi <= 0) return
        setEmi(emi)
        setTotalIntAmt(getTotalInt(props.amount, loanDPInPer, emi, loanMonths))
        props.emiHandler(emi, loanDPInPer, dur)
    }

    const changeBorrowMode = (b: boolean) => {
        console.log("Borrow mode changed: ", b)
        setBorrow(b)
        props.borrowModeHandler(b)
    }

    useEffect(
        () => calculateEmi(props.amount, loanDPInPer, loanAnnualInt, loanMonths)
        , [props, loanDPInPer, loanAnnualInt, loanMonths, borrow]
    );

    return (
        <div>
            <div className="flex items-center mt-1">
                <Toggle text="Borrow" attr={borrow} setter={changeBorrowMode} />
                {borrow &&
                    <div className="flex flex-col ml-4">
                        <label>Total Cost</label>
                        <label className="font-semibold">{toCurrency(props.amount + totalIntAmt, props.currency)}</label>
                    </div>}
            </div>
            {borrow && <div className="flex flex-col mt-4 items-center justify-center">
                <div className="flex w-full flex-wrap justify-between">
                    <div className="flex flex-col">
                        <NumberInput
                            name="dpInPer"
                            pre="Down payment"
                            unit="%"
                            value={loanDPInPer}
                            changeHandler={(e: React.FormEvent<HTMLInputElement>) => setLoanDPInPer(e.currentTarget.valueAsNumber)}
                            float="0.1"
                            min="0"
                            max="90" />
                        <label className="font-semibold text-right">{toCurrency(Math.round(props.amount * (loanDPInPer / 100)), props.currency)}</label>
                    </div>
                    <div className="flex flex-col">
                        <NumberInput
                            name="intRate"
                            pre="Interest"
                            unit="%"
                            value={loanAnnualInt}
                            changeHandler={(e: React.FormEvent<HTMLInputElement>) => setLoanAnnualInt(e.currentTarget.valueAsNumber)}
                            float="0.1"
                            min="0"
                            max="50" />
                        <div className="flex justify-between">
                            <label>Total</label>
                            <label className="font-semibold text-right">{toCurrency(totalIntAmt, props.currency)}</label>
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <NumberInput
                            name="duration"
                            pre="Duration"
                            unit="months"
                            value={loanMonths}
                            changeHandler={(e: React.FormEvent<HTMLInputElement>) => setLoanMonths(e.currentTarget.valueAsNumber)}
                            min="6"
                            max="360" />
                        <div className="flex justify-between">
                            <label>EMI</label>
                            <label className="font-semibold">{toCurrency(emi, props.currency)}</label>
                        </div>
                    </div>
                </div>
            </div>}
        </div>
    );
}
