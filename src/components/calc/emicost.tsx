import React, { useState, useEffect, Fragment } from 'react'
import NumberInput from '../form/numberinput'
import { getEmi, getTotalInt } from '../calc/finance'
import { toCurrency, toStringArr } from '../utils'
import SelectInput from '../form/selectinput'
import RadialInput from '../form/radialinput'
import Section from '../form/section'
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
        () => calculateEmi()
        , [props]
    );

    return (
        <Fragment>
            <Section title="Borrow"
                left={
                    <RadialInput width={150} unit="%" data={toStringArr(0, 90, 5)}
                        value={props.loanPer} changeHandler={props.loanPerHandler} step={5} labelBottom={true}
                        label={`${toCurrency(Math.round((props.loanPer / 100) * props.price), props.currency)}`} />
                } right={
                    <SelectInput name="repaymentSY" options={props.repaymentSYOptions}
                        value={props.repaymentSY} pre="Repay From" changeHandler={(year: string) => props.repaymentSYHandler(parseInt(year))} />
                }
            />
            <Section title="Loan Details"
                left={
                    <NumberInput
                        name="duration"
                        pre="Term"
                        unit="months"
                        width="40px"
                        note={`EMI ${toCurrency(props.emi, props.currency)}`}
                        value={props.loanMonths}
                        changeHandler={props.loanMonthsHandler}
                        min={6}
                        max={360} step={6} />
                } right={
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
                } />

        </Fragment>
    );
}
