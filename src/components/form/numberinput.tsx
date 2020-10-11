import React, { Fragment, useEffect, useState } from 'react';
import { parseNumber, toCurrency, toReadableNumber } from '../utils';
import { Slider } from 'antd';
import { COLORS } from '../../CONSTANTS';
import { Tooltip, InputNumber, Row, Col } from 'antd';
interface NumberInputProps {
	info?: string;
	pre: string;
	post?: string;
	min: number;
	max: number;
	value: number;
	width?: string;
	name: string;
	currency?: string;
	rangeFactor?: number;
	unit?: string;
	changeHandler: any;
	note?: any;
	step?: number;
	feedback?: any;
}

export default function NumberInput(props: NumberInputProps) {
	const [ sliderBorderColor, setSliderBorderColor ] = useState<string>(COLORS.GREEN);
	const [ feedbackText, setFeedbackText ] = useState<string>('');
	const [ rangeFactor, setRangeFactor ] = useState<number>(props.rangeFactor ? props.rangeFactor : 1);

	useEffect(
		() => {
			if (props.rangeFactor) setRangeFactor(props.rangeFactor);
			else setRangeFactor(1);
		},
		[ props.rangeFactor ]
	);

	const getClosestKey = (value: number, keys: Array<number>) => {
		let result: number = keys[0];
		keys.forEach((k) => {
			if (value >= k) result = k;
			else return result;
		});
		return result;
	};

	const provideFeedback = (val: number) => {
		if (props.feedback) {
			let allKeys = Object.keys(props.feedback);
			let allSortedKeys = allKeys.map((k) => parseFloat(k)).sort((a, b) => a - b);
			let feedback: any = props.feedback[getClosestKey(val, allSortedKeys)];
			if (!feedback || !feedback.label) {
				setSliderBorderColor('white');
				setFeedbackText('');
			} else {
				setSliderBorderColor(feedback.color);
				setFeedbackText(feedback.label);
			}
		}
	};

	return (
		<div>
			{props.info && <Tooltip title={props.info} />}
			<Row>
				<Col span={10} offset={2}>
					{props.pre && (
						<Row>
							<Col>
								<label>{props.pre}</label>
							</Col>
						</Row>
					)}

					{props.post && (
						<Row>
							<Col>
								<label>{props.post}</label>
							</Col>
						</Row>
					)}
				</Col>
				<Col span={props.currency ? 12 : 6}>
					<InputNumber
						value={props.value}
						min={props.min * rangeFactor}
						max={props.max * rangeFactor}
						step={props.step ? props.currency ? props.step * rangeFactor : props.step : 1}
						onChange={(val) => {
							provideFeedback(val as number);
							props.changeHandler(val as number);
						}}
						formatter={(val) =>
							props.currency
								? toCurrency(val as number, props.currency)
								: toReadableNumber(val as number, props.step && props.step < 1 ? 2 : 0)}
						parser={(val) => parseNumber(val as string, props.currency ? props.currency : null)}
					/>
				</Col>
				{props.unit && (
					<Col>
						<label className="ml-1">{props.unit}</label>
					</Col>
				)}
			</Row>
			{props.max && (
				<Fragment>
					<Row>
						<Col span={24}>
							{/*@ts-ignore: JSX element class does not support attributes because it does not have a 'props' property.*/}
							<Slider
								min={props.min * rangeFactor}
								max={props.max * rangeFactor}
								step={(props.step as number) * rangeFactor}
								value={props.value}
								onChange={(val: number) => {
									provideFeedback(val);
									props.changeHandler(val);
								}}
								handleStyle={{
									cursor: 'grab',
									borderColor: sliderBorderColor
								}}
							/>
						</Col>
					</Row>
					<Row>
						<label className="mr-2">{toReadableNumber(props.min ? props.min * rangeFactor : 0)}</label>
						{feedbackText}
						<label>{toReadableNumber(props.max * rangeFactor)}</label>
					</Row>
				</Fragment>
			)}
			{props.note && (
				<Row>
					<label className="flex justify-center">{props.note}</label>
				</Row>
			)}
		</div>
	);
}
