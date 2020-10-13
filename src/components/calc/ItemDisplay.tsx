import React, { Fragment } from 'react';
import { toCurrency, toReadableNumber } from '../utils';
import { Tooltip, Statistic } from 'antd';
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
			{(props.imp || props.info) && (
				<p style={{ cursor: 'pointer', textAlign: 'end' }}>
					{props.imp && <Tooltip title={props.imp} color="red" />}
					{props.info && (
						<Tooltip title={props.info} color={`${props.pl && props.result < 0 ? 'red' : 'white'}`} />
					)}
				</p>
			)}
			<Statistic
				title={props.label}
				value={props.result}
				prefix={props.svg}
				suffix={props.unit ? props.unit : ''}
				formatter={() => (
					<label>
						{typeof props.result === 'number' && !props.noResultFormat ? props.currency ? (
							toCurrency(Math.abs(props.result), props.currency)
						) : (
							toReadableNumber(Math.abs(props.result), props.decimal ? props.decimal : 0)
						) : (
							props.result
						)}
					</label>
				)}
				valueStyle={{ color: props.pl ? (props.result < 0 ? COLORS.RED : COLORS.GREEN) : COLORS.DEFAULT }}
			/>
			{props.footer && <p style={{ textAlign: 'center' }}>{props.footer}</p>}
		</Fragment>
	);
}
