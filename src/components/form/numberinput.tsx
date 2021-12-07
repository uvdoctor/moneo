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
	noRangeFactor?: boolean;
	noSlider?: boolean;
}

export default function NumberInput(props: NumberInputProps) {
	const inputRef = useRef(null);
	const [rangeFactor, setRangeFactor] = useState<number>(
		props.currency && !props.noRangeFactor ? getRangeFactor(props.currency) : 1
	);
	const [sliderBorderColor, setSliderBorderColor] = useState<string>(
		COLORS.GREEN
	);
	const [feedbackText, setFeedbackText] = useState<string>("");
	const [minNum, setMinNum] = useState<number>(props.min * rangeFactor);
	const [maxNum, setMaxNum] = useState<number>(props.max * rangeFactor);
	const [stepNum, setStepNum] = useState<number>(props.step * rangeFactor);

	const getSliderMarks = (min: number, max: number) => {
		let marks: any = {
			[min]: toReadableNumber(min),
		};
		if (min < 0) marks[0] = toReadableNumber(0);
		if (props.additionalMarks)
			props.additionalMarks.forEach(
				(val: number) => (marks[val] = toReadableNumber(val))
			);
		marks[max] = toReadableNumber(max);
		return marks;
	};

	const [marks, setMarks] = useState<any>(getSliderMarks(props.min, props.max));

	useEffect(() => {
		let minNum = props.min * rangeFactor;
		let maxNum = props.max * rangeFactor;
		let stepNum = props.step * rangeFactor;
		setMinNum(minNum);
		setMaxNum(maxNum);
		setStepNum(stepNum);
		setMarks(getSliderMarks(minNum, maxNum));
	}, [rangeFactor, props.min, props.max]);

	useEffect(() => {
		if (!props.currency || props.noRangeFactor) return;
		let rf = getRangeFactor(props.currency as string);
		if (rf !== rangeFactor) setRangeFactor(rf);
	}, [props.currency]);

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
		<Row gutter={[10, 10]}>
			{!props.noSlider && (
				<Col flex="none">
					{props.pre}
					{props.post && ` ${props.post}`}
					{props.info && (
						<Tooltip title={props.info}>
							<span>
								<InfoCircleOutlined />
							</span>
						</Tooltip>
					)}
					{!props.currency && props.step >= 1 && (
						<b>{`${toReadableNumber(
							props.value,
							props.step && props.step < 1 ? 2 : 0
						)} ${props.unit}`}</b>
					)}
				</Col>
			)}
			<Col flex="auto">
				<Row gutter={[15, 15]}>
					{props.noSlider && <Col>{props.pre} </Col>}
					<Col className="number-input">
						{(props.currency || props.step < 1) && (
							<Row align="middle" gutter={[15, 0]}>
								<Col xs={24}>
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
											props.currency
												? toCurrency(val as number, props.currency as string)
												: toReadableNumber(val as number, 2)
										}
										parser={(val) =>
											props.currency
												? parseFloat(parseNumber(val as string, props.currency))
												: parseFloat(val as string)
										}
										onPressEnter={(e: any) => {
											e.preventDefault();
											//@ts-ignore
											inputRef.current.blur();
										}}
										onBlur={(e: any) => {
											let num = props.currency
												? parseInt(
														parseNumber(e.currentTarget.value, props.currency)
												  )
												: parseFloat(e.currentTarget.value);
											if (!num || num < props.min)
												props.changeHandler(props.min);
										}}
										style={{ minWidth: "100%" }}
									/>

									{!props.currency && <> {props.unit}</>}
								</Col>

								{props.currency && props.value >= 100000 && (
									<Col>{`~ ${toHumanFriendlyCurrency(
										props.value,
										props.currency
									)}`}</Col>
								)}
							</Row>
						)}
					</Col>
					<Col span={props.currency || props.step < 1 ? 13 : 24}>
						{!props.noSlider && (
							<>
								{/*<Col >*/}
								{/*@ts-ignore: JSX element class does not support attributes because it does not have a 'props' property.*/}
								<Slider
									min={props.min * rangeFactor}
									max={props.max * rangeFactor}
									marks={marks}
									step={props.step * rangeFactor}
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
								{feedbackText && <>{feedbackText}</>}
								{/*</Col>*/}
							</>
						)}
						{props.note && <>{props.note}</>}
					</Col>
				</Row>
			</Col>
		</Row>
	);
}
