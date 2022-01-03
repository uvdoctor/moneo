import React from 'react';
import { Switch } from 'antd';
import { COLORS } from '../CONSTANTS';
interface HSwitchProps {
	rightText?: string;
	leftText?: string;
	value: number;
	setter: any;
	disabled?: boolean;
}

export default function HSwitch(props: HSwitchProps) {
	return (
		<>
			{props.leftText && <label style={{ marginRight: '0.5rem', color: props.disabled ? COLORS.LIGHT_GRAY : COLORS.DEFAULT}}>{props.leftText}</label>}
				<Switch
					checked={props.value > 0}
					disabled={props.disabled}
					onChange={(checked: boolean) => props.setter(checked ? 1 : 0)}
				/>
			<label style={{ marginLeft: '0.5rem', color: props.disabled ? COLORS.LIGHT_GRAY : COLORS.DEFAULT }}>{props.rightText}</label>
		</>
	);
}
