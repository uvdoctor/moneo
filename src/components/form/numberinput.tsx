import React, { useEffect, useRef, useState } from "react";
import {
	getRangeFactor,
	parseNumber,
	toCurrency,
	toReadableNumber,
} from "../utils";
import { Slider } from "antd";
import { COLORS } from "../../CONSTANTS";
import { Tooltip, InputNumber, Row, Col } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";
interface NumberInputProps {
	info?: string;
	pre: any;
	post?: string;
	min: number;
	max: number;
	value: number;
	currency?: string;
	unit?: string;
	changeHandler: any;
	note?: any;
	step: number;
	feedback?: any;
	additionalMarks?: Array<number>;
}

export default function NumberInput(props: NumberInputProps) {
	const inputRef = useRef(null);
	const [rangeFactor, setRangeFactor] = useState<number>(
		props.currency ? getRangeFactor(props.currency) : 1
	);
	const [sliderBorderColor, setSliderBorderColor] = useState<string>(
		COLORS.GREEN
	);
	const [feedbackText, setFeedbackText] = useState<string>("");
	const [minNum, setMinNum] = useState<number>(props.min * rangeFactor);
	const [maxNum, setMaxNum] = useState<number>(props.max * rangeFactor);
	const [stepNum, setStepNum] = useState<number>(
		props.step ? props.step * rangeFactor : 1
	);

	const getSliderMarks = (min: number, max: number) => {
		let marks: any = {
			[min]: toReadableNumber(min, props.step < 1 ? 2 : 0),
		};
		if (min < 0) marks[0] = "0";
		if (props.additionalMarks)
			props.additionalMarks.forEach((val: number) => {
				marks[val] = toReadableNumber(val, props.step < 1 ? 2 : 0);
			});
		marks[max] = { label: toReadableNumber(max) };
		return marks;
	};

	const [marks, setMarks] = useState<any>(getSliderMarks(props.min, props.max));

	useEffect(() => setRangeFactor(getRangeFactor(props.currency as string)), [
		props.currency,
	]);

	useEffect(() => {
		let newMin = props.min * rangeFactor;
		let newMax = props.max * rangeFactor;
		let newStep = props.step * rangeFactor;
		setMinNum(newMin);
		setMaxNum(newMax);
		setStepNum(newStep);
		let newMarks: any = getSliderMarks(newMin, newMax);
		setMarks(newMarks);
	}, [rangeFactor, props.min, props.max]);

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
			let allSortedKeys = allKeys
				.map((k) => parseFloat(k))
				.sort((a, b) => a - b);
			let feedback: any = props.feedback[getClosestKey(val, allSortedKeys)];
			if (!feedback || !feedback.label) {
				setSliderBorderColor("white");
				setFeedbackText("");
			} else {
				setSliderBorderColor(feedback.color);
				setFeedbackText(feedback.label);
			}
		}
	};

	return (
		<div style={{ minWidth: "250px" }}>
			<Col span={24}>
				<Row justify="space-between" align="middle">
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
				<Row
					justify="space-between"
					align="top"
					style={{ marginBottom: "1.5rem" }}
				>
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
								formatter={(val) =>
									toCurrency(val as number, props.currency as string)
								}
								parser={(val) => parseNumber(val as string, props.currency)}
								onPressEnter={(e: any) => {
									e.preventDefault();
									//@ts-ignore
									inputRef.current.blur();
								}}
								onBlur={(e: any) => {
									let num = parseInt(
										parseNumber(e.currentTarget.value, props.currency)
									);
									if (!num || num < props.min) props.changeHandler(props.min);
								}}
								style={{ width: "100%", marginBottom: "0px" }}
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
								cursor: "grab",
								borderColor: sliderBorderColor,
							}}
						/>
						{feedbackText && (
							<Col span={24} style={{ textAlign: "center" }}>
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
