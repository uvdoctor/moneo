import React from 'react'
//@ts-ignore
import { AwesomeButton } from "react-awesome-button"

interface ActionButtonsProps {
    submitDisabled: boolean
    cancelDisabled: boolean
    submitText: string
    cancelHandler: Function
    submitHandler: Function
}

export default function ActionButtons(props: ActionButtonsProps) {
    return (
        <footer className="w-full py-2 flex justify-center">
            <AwesomeButton type="secondary" disabled={props.cancelDisabled} onPress={props.cancelHandler}>
                CANCEL
            </AwesomeButton>

            <AwesomeButton className={`ml-8 ${props.submitDisabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                type="primary" ripple onPress={props.submitHandler} disabled={props.submitDisabled}>
                {props.submitText}
            </AwesomeButton>
        </footer>
    )
}