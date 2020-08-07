import React, { useCallback, useEffect, useState } from 'react'
import { usePlaidLink } from "react-plaid-link"
//@ts-ignore
import { AwesomeButton } from 'react-awesome-button'
//import { CreateItemInput } from '../../api/goals'
import NumberInput from '../form/numberinput'
import Section from '../form/section'
import { getRangeFactor } from '../utils'
import SelectInput from '../form/selectinput'
interface NWProps {
    totalSavings: number
    annualSavings: number
    currency: string
    totalSavingsHandler: Function
    annualSavingsHandler: Function
    currencyHandler: Function
    viewModeHandler: Function
}

export default function NW(props: NWProps) {
    const onSuccess = useCallback((token, metadata) => {
        // send token to server
        /*let item: CreateItemInput = {
            pt: token,
            pid: '',
            pinstid: metadata.institution.institution_id,
            status: 'success',
        }*/
        console.log("Token is ", token)
        console.log("Metadata is ", metadata)
        //console.log("Item is ", item)
    }, []);

    const config = {
        clientName: 'DollarDarwin',
        env: 'sandbox',
        product: ['auth', 'transactions'],
        publicKey: '7596dc790fd92c79e1d6176b755148',
        onSuccess,
        // ...
    };

    const { open, ready, error, exit } = usePlaidLink(config);
    const nowYear = new Date().getFullYear()
    const [rangeFactor, setRangeFactor] = useState<number>(getRangeFactor(props.currency))

    useEffect(() => {
        return function cleanup() {
            exit()
        }
    })

    const changeCurrency = (curr: string) => {
        setRangeFactor(Math.round(getRangeFactor(curr) / getRangeFactor(props.currency)))
        props.currencyHandler(curr)
    }

    return (
        <div className="mt-8">
            <div className="flex justify-center">
                <AwesomeButton type="primary" ripple onPress={() => open()} disabled={ready}>
                    LINK ACCOUNT
            </AwesomeButton>
            </div>
            {error && <div className="text-red">
                {error}
            </div>
            }
            <div className="mt-8 flex w-full justify-center">
                <Section title={`How Much Can You Save by End of ${nowYear}?`}
                    titleInfo={`Your Total Savings & Annual Savings will be used in order to help You Plan for Financial Freedom.`}
                    left={
                        <NumberInput
                            name="ts" inputOrder={1} currentOrder={2}
                            nextStepDisabled
                            allInputDone
                            nextStepHandler={() => true}
                            info={`Total Savings by end of ${nowYear} across cash, deposits, gold, stocks, bonds, retirement accounts, etc.`}
                            value={props.totalSavings} pre="Total" min={-100000} max={900000}
                            post='Savings' changeHandler={props.totalSavingsHandler} step={1000} currency={props.currency}
                            rangeFactor={rangeFactor} />
                    } right={
                        <NumberInput
                            name="as" inputOrder={2} currentOrder={1}
                            nextStepDisabled allInputDone
                            nextStepHandler={() => true} infoDurationInMs={10000}
                            info={`Amount You can Save by end of ${nowYear} after paying all taxes & expenses. 
                        Include Your Retirement Contributions as a part of Your Savings. 
                        You Can Put Negative Value if Your Expenses are Expected to be More than Income. 
                        This will be used to forecast Your Future Savings.`}
                            value={props.annualSavings} pre="Annual" min={-50000} max={200000}
                            post='Savings' changeHandler={props.annualSavingsHandler} step={1000} currency={props.currency}
                            rangeFactor={rangeFactor} />
                    } bottom={
                        <SelectInput name="ccy" inputOrder={2} currentOrder={1}
                            nextStepDisabled allInputDone
                            nextStepHandler={() => true}
                            pre="Currency"
                            value={props.currency}
                            changeHandler={changeCurrency}
                            currency />
                    } insideForm />
            </div>
            <div className="mt-2 mb-2 flex justify-center">
                <AwesomeButton type="link" size="medium" disabled={props.annualSavings === 0 || props.totalSavings === 0} ripple onPress={() => props.viewModeHandler("Plan")}>
                    PLAN
            </AwesomeButton>
            </div>
        </div >
    )
}