import React from 'react'
//@ts-ignore
import { AwesomeButton } from "react-awesome-button"

interface ActionButtonsProps {
    submitDisabled: boolean
    submitText: string
    cancelHandler: Function
    submitHandler: Function
}

export default function ActionButtons(props: ActionButtonsProps) {
    return (
        <div className="flex justify-center mt-8 mb-4 w-full">
        <AwesomeButton type="secondary" onPress={props.cancelHandler}>
            Cancel
        </AwesomeButton>
        <AwesomeButton className={`ml-8 ${props.submitDisabled ? 'cursor-not-allowed' : 'cursor-pointer'}`} 
        type="primary" ripple onPress={props.submitHandler} disabled={props.submitDisabled}>
            {props.submitText}
        </AwesomeButton>
    </div>
    )
}