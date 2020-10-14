import React from 'react';
import { Switch, Space } from 'antd';
interface HSwitchProps {
	rightText?: string;
	leftText?: string;
	value: number;
	setter: any;
}

export default function HSwitch(props: HSwitchProps) {
	return (
		<Space align="center">
			{props.leftText}
			<Switch checked={props.value > 0} onChange={(checked: boolean) => props.setter(checked ? 1 : 0)} />
			{props.rightText}
		</Space>
	);
}
