import React from 'react';
import { Switch, Row, Col } from 'antd';
interface HSwitchProps {
	rightText?: string;
	leftText?: string;
	value: number;
	setter: any;
}

export default function HSwitch(props: HSwitchProps) {
	return (
		<Row align="middle" justify="end">
			{props.leftText && <Col>{`${props.leftText} `}</Col>}
			<Col>
				<Switch checked={props.value > 0} onChange={(checked: boolean) => props.setter(checked ? 1 : 0)} />
			</Col>
			{props.rightText && <Col>{` ${props.rightText}`}</Col>}
		</Row>
	);
}
