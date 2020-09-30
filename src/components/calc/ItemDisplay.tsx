import React from 'react';
import { toCurrency, toReadableNumber } from '../utils';
import Tooltip from '../form/tooltip';
interface ItemDisplayProps {
	label?: string;
	svg?: any;
	result: number | string;
	noResultFormat?: boolean;
	currency?: string;
	unit?: string;
	footer?: string;
	decimal?: number;
	titleFormat?: boolean;
	info?: string;
	imp?: string;
	pl?: boolean;
	vertical?: boolean;
	calcFormat?: boolean;
}

export default function ItemDisplay(props: ItemDisplayProps) {
	return (
		<div className="flex flex-col items-center justify-center">
			{props.label && (
				<label className={props.titleFormat ? 'text-xl md:text-2xl font-semibold' : ''}>{props.label}</label>
			)}
			<div className="flex justify-between items-start font-semibold">
				<div className={`flex ${props.vertical && 'flex-col'} justify-center items-center`}>
					{props.svg}
					<div
						className={`ml-1 ${props.pl ? (props.result > 0 ? 'text-green-primary' : 'text-red-600') : ''}`}
					>
						{typeof props.result === 'string' ? props.calcFormat ? (
							<h1 className="md:text-xl lg:text-2xl font-bold">{props.result}</h1>
						) : (
							`${props.result} ${props.unit ? props.unit : ""}`
						) : props.currency ? (
							toCurrency(Math.abs(props.result), props.currency)
						) : props.noResultFormat ? (
							props.result
						) : (
							toReadableNumber(Math.abs(props.result), props.decimal ? props.decimal : 0) + props.unit
						)}
					</div>
				</div>
				{(props.imp || props.info) && (
					<div className="ml-1 flex justify-end items-start cursor-pointer">
						{props.imp && <Tooltip info={props.imp} error />}
						{props.info && <Tooltip info={props.info} error={props.pl && props.result < 0} />}
					</div>
				)}
			</div>
			{props.footer && <label>{props.footer}</label>}
		</div>
	);
}
