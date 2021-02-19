import React from 'react';
import { Switch, Row, Col } from 'antd';
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
		<Row align="middle">
			{props.leftText && <Col style={{ marginRight: '0.5rem', color: props.disabled ? COLORS.LIGHT_GRAY : COLORS.DEFAULT}}>{props.leftText}</Col>}
			<Col>
				<Switch
					checked={props.value > 0}
					disabled={props.disabled}
					onChange={(checked: boolean) => props.setter(checked ? 1 : 0)}
				/>
			</Col>
			<Col style={{ marginLeft: '0.5rem', color: props.disabled ? COLORS.LIGHT_GRAY : COLORS.DEFAULT }}>{props.rightText}</Col>
		</Row>
	);
}
