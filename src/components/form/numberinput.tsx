import React, { useEffect, useRef, useState } from "react";
import {
	getRangeFactor,
	parseNumber,
	toCurrency,
	toHumanFriendlyCurrency,
	toReadableNumber,
} from "../utils";
import { COLORS } from "../../CONSTANTS";
import { Tooltip, InputNumber, Row, Col, Slider } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";
interface NumberInputProps {
	isBasic?: boolean;
	info?: string;
	pre: any;
	post?: string;
	min?: number;
	max?: number;
	value: number;
	currency?: string;
	unit?: string;
	changeHandler: any;
	note?: any;
	step?: number;
	feedback?: any;
	additionalMarks?: Array<number>;
	noRangeFactor?: boolean;
	noSlider?: boolean;
}

export default function NumberInput({
	isBasic = false,
	info,
	pre,
	post,
	min = 0,
	max = 100000000,
	value,
	currency,
	unit,
	changeHandler,
	note,
	step = 1,
	feedback,
	additionalMarks,
	noRangeFactor,
	noSlider,
}: NumberInputProps) {
	const inputRef = useRef(null);
	const [rangeFactor, setRangeFactor] = useState<number>(
		currency && !noRangeFactor ? getRangeFactor(currency) : 1
	);
	const [sliderBorderColor, setSliderBorderColor] = useState<string>(
		COLORS.GREEN
	);
	const [feedbackText, setFeedbackText] = useState<string>("");
	const [minNum, setMinNum] = useState<number>(min * rangeFactor);
	const [maxNum, setMaxNum] = useState<number>(max * rangeFactor);
	const [stepNum, setStepNum] = useState<number>(step * rangeFactor);

	const getSliderMarks = (min: number, max: number) => {
		let marks: any = {
			[min]: toReadableNumber(min),
		};
		if (min < 0) marks[0] = toReadableNumber(0);
		if (additionalMarks)
			additionalMarks.forEach(
				(val: number) => (marks[val] = toReadableNumber(val))
			);
		marks[max] = toReadableNumber(max);
		return marks;
	};

	const [marks, setMarks] = useState<any>(getSliderMarks(min, max));

	useEffect(() => {
		let minNum = min * rangeFactor;
		let maxNum = max * rangeFactor;
		let stepNum = step * rangeFactor;
		setMinNum(minNum);
		setMaxNum(maxNum);
		setStepNum(stepNum);
		setMarks(getSliderMarks(minNum, maxNum));
	}, [rangeFactor, min, max]);

	useEffect(() => {
		if (!currency || noRangeFactor) return;
		let rf = getRangeFactor(currency as string);
		if (rf !== rangeFactor) setRangeFactor(rf);
	}, [currency]);

	const getClosestKey = (value: number, keys: Array<number>) => {
		let result: number = keys[0];
		keys.forEach((k) => {
			if (value >= k) result = k;
			else return result;
		});
		return result;
	};

	const provideFeedback = (val: number) => {
		if (feedback) {
			let allKeys = Object.keys(feedback);
			let allSortedKeys = allKeys
				.map((k) => parseFloat(k))
				.sort((a, b) => a - b);
			let closestFeedback: any = feedback[getClosestKey(val, allSortedKeys)];
			if (!closestFeedback || !closestFeedback.label) {
				setSliderBorderColor("white");
				setFeedbackText("");
			} else {
				setSliderBorderColor(closestFeedback.color);
				setFeedbackText(closestFeedback.label);
			}
		}
	};

	const inputConfig = {
		ref: inputRef,
		value,
		min: minNum,
		max: maxNum,
		step: stepNum,
		onChange: (val: number) => {
			provideFeedback(val as number);
			changeHandler(val as number);
		},
		formatter: (val: number) =>
			currency
				? toCurrency(val as number, currency as string)
				: toReadableNumber(val as number, 2),
		parser: (val: string) =>
			currency
				? parseFloat(parseNumber(val as string, currency))
				: parseFloat(val as string),
		onPressEnter: (e: any) => {
			e.preventDefault();
			//@ts-ignore
			inputRef.current.blur();
		},
		onBlur: (e: any) => {
			let num = currency
				? parseInt(parseNumber(e.currentTarget.value, currency))
				: parseFloat(e.currentTarget.value);

			if (!num || num < min) changeHandler(min);
		},
		style: { minWidth: "100%" },
	};

	const convertInputToString = () => {
		return currency && value >= 100000
			? `~ ${toHumanFriendlyCurrency(value, currency)}`
			: null;
	};

	return isBasic ? (
		<>
			{/*@ts-ignore*/}
			<InputNumber {...inputConfig} />
			{convertInputToString() && <div>{convertInputToString()}</div>}
		</>
	) : (
		<Row gutter={[10, 10]}>
			{!noSlider && (
				<Col flex="none">
					{pre}
					{post && ` ${post}`}
					{info && (
						<Tooltip title={info}>
							<span>
								<InfoCircleOutlined />
							</span>
						</Tooltip>
					)}
					{!currency && step >= 1 && (
						<b>{`${toReadableNumber(
							value,
							step && step < 1 ? 2 : 0
						)} ${unit}`}</b>
					)}
				</Col>
			)}
			<Col flex="auto">
				<Row gutter={[15, 15]}>
					{noSlider && <Col>{pre} </Col>}
					<Col className="number-input">
						{(currency || step < 1) && (
							<Row align="middle" gutter={[15, 0]}>
								<Col xs={24}>
									{/*@ts-ignore*/}
									<InputNumber {...inputConfig} />
								</Col>

								{convertInputToString() && <Col>{convertInputToString()}</Col>}
							</Row>
						)}
					</Col>
					<Col span={currency || step < 1 ? 13 : 24}>
						{!noSlider && (
							<>
								{/*<Col >*/}
								{/*@ts-ignore: JSX element class does not support attributes because it does not have a 'props' property.*/}
								<Slider
									min={min * rangeFactor}
									max={max * rangeFactor}
									marks={marks}
									step={step * rangeFactor}
									value={value}
									onChange={(val: number) => {
										provideFeedback(val);
										changeHandler(val);
									}}
									handleStyle={{
										cursor: "grab",
										borderColor: sliderBorderColor,
									}}
								/>
								{feedbackText && <>{feedbackText}</>}
								{/*</Col>*/}
							</>
						)}
						{note && <>{note}</>}
					</Col>
				</Row>
			</Col>
		</Row>
	);
}
