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
		<Col span={24}>
			<Row align="middle" justify="end">
				{props.leftText && <Col style={{ marginRight: '0.5rem' }}>{props.leftText}</Col>}
				<Col>
					<Switch checked={props.value > 0} onChange={(checked: boolean) => props.setter(checked ? 1 : 0)} />
				</Col>
				<Col style={{ marginLeft: '0.5rem' }}>{props.rightText}</Col>
			</Row>
		</Col>
	);
}
