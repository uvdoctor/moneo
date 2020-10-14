import React, { useState, useEffect } from 'react';
import Section from '../form/section';
import RadialInput from '../form/radialinput';
import SelectInput from '../form/selectinput';
import { toStringArr, toCurrency, initYearOptions } from '../utils';
import { calculateTotalAmt } from './cfutils';
import { COLORS } from '../../CONSTANTS';
interface AnnualAmtProps {
	startYear: number;
	percentage: number;
	percentageHandler: Function;
	annualSY: number;
	annualSYHandler: Function;
	currency: string;
	title: string;
	price: number;
	duration: number;
	chgRate: number;
	footer?: string;
	colorTo?: boolean;
}

export default function AnnualAmt(props: AnnualAmtProps) {
	const [ syOptions, setSYOptions ] = useState<object>(initYearOptions(props.startYear, 10));
	const [ totalAmt, setTotalAmt ] = useState<number>(0);

	useEffect(() => setSYOptions(initYearOptions(props.startYear, 10)), [ props.startYear ]);

	useEffect(
		() =>
			setTotalAmt(
				calculateTotalAmt(
					props.startYear,
					props.percentage,
					props.annualSY,
					props.price,
					props.chgRate,
					props.duration
				)
			),
		[ props.startYear, props.percentage, props.annualSY, props.price, props.chgRate, props.duration ]
	);

	return (
		<Section
			title={props.title}
			insideForm
			left={
				<RadialInput
					colorTo={props.colorTo ? COLORS.RED : null}
					data={toStringArr(0, 10, 0.2)}
					changeHandler={props.percentageHandler}
					width={120}
					unit="%"
					labelBottom={true}
					label="of Amount"
					post={`Total ${toCurrency(totalAmt, props.currency)}`}
					value={props.percentage}
					step={0.2}
				/>
			}
			right={
				props.percentage && (
					<SelectInput
						pre="From Year"
						post="Onwards"
						options={syOptions}
						value={props.annualSY}
						changeHandler={props.annualSYHandler}
					/>
				)
			}
			footer={props.footer}
		/>
	);
}
