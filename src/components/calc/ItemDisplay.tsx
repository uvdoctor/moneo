import React, { Fragment } from 'react';
import { toCurrency, toReadableNumber } from '../utils';
import { Tooltip, Statistic, Col } from 'antd';
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
		<Col span={24}>
			<Col span={24} style={{ textAlign: 'center' }}>
				<Statistic
					title={
						<Col span={24} style={{ textAlign: "center" }}>
							{props.label}
							{(props.imp || props.info) && (
								<Fragment>
									{props.imp && (
										<Tooltip title={props.imp} color="red">
											<InfoCircleOutlined />
										</Tooltip>
									)}
									{props.info && (
										<Tooltip
											title={props.info}
											color={`${props.pl && props.result < 0 ? 'red' : COLORS.DEFAULT}`}
										>
											<InfoCircleOutlined />
										</Tooltip>
									)}
								</Fragment>
							)}
						</Col>
					}
					value={props.result}
					prefix={props.svg}
					suffix={props.unit ? props.unit : ''}
					formatter={() =>
						typeof props.result === 'number' && !props.noResultFormat
							? props.currency
								? toCurrency(Math.abs(props.result), props.currency)
								: toReadableNumber(Math.abs(props.result), props.decimal ? props.decimal : 0)
							: props.result}
					valueStyle={{ color: props.pl ? (props.result <= 0 ? COLORS.RED : COLORS.GREEN) : COLORS.DEFAULT }}
				/>
			</Col>
			{props.footer && (
				<Col span={24} style={{ textAlign: 'center' }}>
					{props.footer}
				</Col>
			)}
		</Col>
	);
}
