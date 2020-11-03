import React, { useEffect, useRef, useState } from 'react';
import { parseNumber, toCurrency, toReadableNumber } from '../utils';
import { Slider } from 'antd';
import { COLORS } from '../../CONSTANTS';
import { Tooltip, InputNumber, Row, Col } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
interface NumberInputProps {
	info?: string;
	pre: any;
	post?: string;
	min: number;
	max: number;
	value: number;
	currency?: string;
	rangeFactor?: number;
	unit?: string;
	changeHandler: any;
	note?: any;
	step?: number;
	feedback?: any;
}

export default function NumberInput(props: NumberInputProps) {
	const inputRef = useRef(null);
	const [ sliderBorderColor, setSliderBorderColor ] = useState<string>(COLORS.GREEN);
	const [ feedbackText, setFeedbackText ] = useState<string>('');
	const [ minNum, setMinNum ] = useState<number>(props.min * (props.rangeFactor ? props.rangeFactor : 1));
	const [ maxNum, setMaxNum ] = useState<number>(props.max * (props.rangeFactor ? props.rangeFactor : 1));
	const [ stepNum, setStepNum ] = useState<number>(
		props.step ? props.step * (props.rangeFactor ? props.rangeFactor : 1) : 1
	);
	const [ marks, setMarks ] = useState<any>({
		[minNum]: toReadableNumber(minNum),
		[maxNum]: { label: toReadableNumber(maxNum) }
	});

	useEffect(
		() => {
			let rf = props.rangeFactor ? props.rangeFactor : 1;
			let minNum = props.min * rf;
			let maxNum = props.max * rf;
			setMinNum(minNum);
			setMaxNum(maxNum);
			setStepNum((props.step as number) * rf);
			setMarks({
				[minNum]: toReadableNumber(minNum),
				[maxNum]: { label: toReadableNumber(maxNum), style: { paddingRight: props.currency ? '3rem' : '0rem' } }
			});
		},
		[ props.rangeFactor, props.min, props.max ]
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
		<div style={{ minWidth: '250px' }}>
			<Col span={24}>
				<Row justify="space-between">
					<Col>
						{props.pre}
						{props.post && ` ${props.post}`}
						{props.info && (
							<Tooltip title={props.info}>
								<span>
									<InfoCircleOutlined />
								</span>
							</Tooltip>
						)}
					</Col>
						{!props.currency && (
					<Col>
							<b>{`${toReadableNumber(
								props.value,
								props.step && props.step < 1 ? 2 : 0
							)} ${props.unit}`}</b>
					</Col>
						)}
				</Row>
			</Col>
			<Col span={24}>
					<Row justify="space-between" align="top" style={{marginBottom: '1.5rem'}}>
						{props.currency && (
							<Col span={10}>
								<InputNumber
									ref={inputRef}
									value={props.value}
									min={minNum}
									max={maxNum}
									step={stepNum}
									onChange={(val) => {
										provideFeedback(val as number);
										props.changeHandler(val as number);
									}}
									formatter={(val) => toCurrency(val as number, props.currency as string)}
									parser={(val) => parseNumber(val as string, props.currency)}
									onPressEnter={(e: any) => {
										e.preventDefault();
										//@ts-ignore
										inputRef.current.blur();
									}}
									style={{ width: '100%', marginBottom: '0px' }}
								/>
							</Col>
						)}
						<Col span={props.currency ? 12 : 24}>
							{/*@ts-ignore: JSX element class does not support attributes because it does not have a 'props' property.*/}
							<Slider
								min={minNum}
								max={maxNum}
								marks={marks}
								step={stepNum}
								value={props.value}
								onChange={(val: number) => {
									provideFeedback(val);
									props.changeHandler(val);
								}}
								handleStyle={{
									cursor: 'grab',
									borderColor: sliderBorderColor
								}}
								style={{ width: '100%', marginTop: '0px', marginBottom: '0px' }}
							/>
							{feedbackText && (
								<Col span={24} style={{ textAlign: 'center' }}>
									{feedbackText}
								</Col>
							)}
						</Col>
					</Row>
			</Col>
			{props.note && <Col span={24}>{props.note}</Col>}
		</div>
	);
}
