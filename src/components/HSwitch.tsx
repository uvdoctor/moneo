import React from 'react'
import { Switch } from 'antd'
interface HSwitchProps {
    rightText?: string,
    leftText?: string,
    value: number,
    setter: any,
}

const HSwitch = (props: HSwitchProps) => {
    return (
        <div className="flex items-center">
            {props.leftText && <label className="mr-4">{props.leftText}</label>}
            <Switch checked={props.value > 0}
                onChange={(checked: boolean) => props.setter(checked ? 1 : 0)} />
            {props.rightText && <label className="ml-4">{props.rightText}</label>}
        </div>
    )
}

export default HSwitch