import React, { Fragment } from 'react';
import { toCurrency, toReadableNumber } from '../utils';
import { Tooltip, Statistic, Space } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import { COLORS } from '../../CONSTANTS';
interface ItemDisplayProps {
	label?: string;
	svg?: any;
	result: number | string;
	noResultFormat?: boolean;
	currency?: string;
	unit?: any;
	footer?: string;
	decimal?: number;
	info?: string;
	imp?: string;
	pl?: boolean;
}

export default function ItemDisplay(props: ItemDisplayProps) {
	return (
		<Fragment>
			<Statistic
				title={
					<Space align="start">
						{props.label}
						{props.imp && (
							<Tooltip title={props.imp} color="red">
								<InfoCircleOutlined />
							</Tooltip>
						)}
						{props.info && (
							<Tooltip title={props.info} color={`${props.pl && props.result < 0 ? 'red' : 'white'}`}>
								<InfoCircleOutlined />
							</Tooltip>
						)}
					</Space>
				}
				value={props.result}
				prefix={props.svg}
				suffix={props.unit ? props.unit : ''}
				formatter={() => (
						typeof props.result === 'number' && !props.noResultFormat ? props.currency ? (
							toCurrency(Math.abs(props.result), props.currency)
						) : (
							toReadableNumber(Math.abs(props.result), props.decimal ? props.decimal : 0)
						) : (
							props.result
						)
				)}
				valueStyle={{ color: props.pl ? (props.result <= 0 ? COLORS.RED : COLORS.GREEN) : COLORS.DEFAULT }}
			/>
			{props.footer && <p>{props.footer}</p>}
		</Fragment>
	);
}
