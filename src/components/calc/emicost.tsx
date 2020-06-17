import React, { useState, useEffect } from 'react'
import NumberInput from '../form/numberinput'
import { getEmi, getTotalInt } from '../calc/finance'
import { toCurrency } from '../utils'
import SelectInput from '../form/selectinput'

interface EmiProps {
    price: number,
    currency: string,
    startYear: number,
    repaymentSY: number,
    repaymentSYOptions: any,
    loanMonths: number,
    loanAnnualInt: number,
    emi: number,
    loanPer: number,
    emiHandler: any,
    repaymentSYHandler: any,
    loanMonthsHandler: any,
    loanPerHandler: any,
    loanAnnualIntHandler: any
}

export default function EmiCost(props: EmiProps) {
    const [totalIntAmt, setTotalIntAmt] = useState<number>(0)

    const calculateEmi = () => {
        let loanBorrowAmt = Math.round(props.price * (props.loanPer / 100))
        let emi = Math.round(getEmi(loanBorrowAmt, props.loanAnnualInt, props.loanMonths) as number)
        props.emiHandler(emi)
        setTotalIntAmt(Math.round(getTotalInt(loanBorrowAmt, emi, props.loanMonths)))
    }

    useEffect(
        () => { if (props.loanPer > 0) calculateEmi() }
        , [props]
    );

    return (

        <div className="flex flex-col md:flex-row md:justify-center">
            <div className="mt-4 md:mt-8 flex justify-around items-center w-full md:w-1/2 lg:w-1/3">
                <NumberInput
                    name="loanPer"
                    pre="Borrow"
                    width="30px"
                    note={`${toCurrency(Math.round((props.loanPer / 100) * props.price), props.currency)}`}
                    unit="%"
                    value={props.loanPer}
                    changeHandler={props.loanPerHandler}
                    min={0} max={90} />
                <NumberInput
                    name="intRate"
                    pre="Interest"
                    unit="%"
                    width="40px"
                    note={`Total ${toCurrency(totalIntAmt, props.currency)}`}
                    value={props.loanAnnualInt}
                    changeHandler={props.loanAnnualIntHandler}
                    min={0.0}
                    max={30.0}
                    step={0.1} />
            </div>
            {props.loanPer > 0 && <div className="mt-4 md:mt-8 flex flex-wrap items-center justify-around w-full md:w-1/2 lg:w-1/3">
                <NumberInput
                    name="duration"
                    pre="Term"
                    unit="months"
                    width="40px"
                    note={`EMI ${toCurrency(props.emi, props.currency)}`}
                    value={props.loanMonths}
                    changeHandler={props.loanMonthsHandler}
                    min={6}
                    max={360} step={3} />
                <SelectInput name="repaymentSY" options={props.repaymentSYOptions}
                    value={props.repaymentSY} pre="Repay From" changeHandler={(year: string) => props.repaymentSYHandler(parseInt(year))} />
            </div>}
        </div>
    );
}
