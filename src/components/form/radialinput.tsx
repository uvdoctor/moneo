import React, { Fragment } from 'react';
import CircularSlider from '@fseehawer/react-circular-slider';
import { COLORS } from '../../CONSTANTS';
import { Tooltip, Row, Col } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';

interface RadialInputProps {
	info?: string;
	label: string;
	data: Array<string>;
	width?: number;
	changeHandler: Function;
	unit?: string;
	labelBottom?: boolean;
	value: number;
	step: number;
	pre?: string;
	post?: any;
	colorTo?: string | null;
	colorFrom?: string | null;
}

export default function RadialInput(props: RadialInputProps) {
	const getVal = (str: string) => (props.step < 1 ? parseFloat(str) : parseInt(str));
	const width: number = props.width ? props.width : 110;

	return (
		<Fragment>
			<Row justify="center" align="middle">
				{props.pre}
				{props.info && (
						<Tooltip title={props.info}>
							<span>
								<InfoCircleOutlined />
							</span>
						</Tooltip>
				)}
			</Row>
			<Row justify="center" className="radial-input">
				<CircularSlider
					onChange={(val: string) => props.changeHandler(props.step < 1 ? parseFloat(val) : parseInt(val))}
					label={props.label}
					trackColor={COLORS.LIGHT_GRAY}
					data={props.data}
					dataIndex={(props.value - getVal(props.data[0])) / props.step}
					appendToValue={props.unit}
					width={width}
					labelColor={COLORS.DEFAULT}
					labelBottom={props.labelBottom}
					valueFontSize="1.25rem"
					labelFontSize="1.25rem"
					progressColorFrom={props.colorFrom ? props.colorFrom : COLORS.GREEN}
					progressColorTo={props.colorTo ? props.colorTo : COLORS.GREEN}
					knobColor="#cbd5e0"
				/>
			</Row>
			{props.post && <Row justify="center">{props.post}</Row>}
		</Fragment>
	);
}
