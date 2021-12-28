import React, { useEffect, useRef, useState } from "react";
import {
	getRangeFactor,
	parseNumber,
	toCurrency,
	toHumanFriendlyCurrency,
	toReadableNumber,
} from "../utils";
import { Tooltip, InputNumber } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";
interface NumberInputProps {
	info?: string;
	pre: any;
	post?: any;
	min?: number;
	max?: number;
	value: number;
	currency?: string;
	unit?: string;
	changeHandler: any;
	step?: number;
	noRangeFactor?: boolean;
}

export default function NumberInput({
	info,
	pre,
	post,
	min = 0,
	max = 100000000,
	value,
	currency,
	unit,
	changeHandler,
	step = 1,
	noRangeFactor
}: NumberInputProps) {
	const inputRef = useRef(null);
	const [rangeFactor, setRangeFactor] = useState<number>(
		currency && !noRangeFactor ? getRangeFactor(currency) : 1
	);
	const [minNum, setMinNum] = useState<number>(min * rangeFactor);
	const [maxNum, setMaxNum] = useState<number>(max * rangeFactor);
	const [stepNum, setStepNum] = useState<number>(step * rangeFactor);

	useEffect(() => {
		let minNum = min * rangeFactor;
		let maxNum = max * rangeFactor;
		let stepNum = step * rangeFactor;
		setMinNum(minNum);
		setMaxNum(maxNum);
		setStepNum(stepNum);
	}, [rangeFactor, min, max]);

	const createPre = () => 
		<>
			{pre}
			{info && <Tooltip title={info}>
				<InfoCircleOutlined />
			</Tooltip>}
		</>

	useEffect(() => {
		if (!currency || noRangeFactor) return;
		let rf = getRangeFactor(currency as string);
		if (rf !== rangeFactor) setRangeFactor(rf);
	}, [currency]);

	const inputConfig = {
		ref: inputRef,
		value,
		min: minNum,
		max: maxNum,
		step: stepNum,
		addOnBefore: createPre(),
		addOnAfter: unit,
		onChange: (val: number) => changeHandler(val as number),
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

	return (
		<>
			{/*@ts-ignore*/}
			<InputNumber {...inputConfig} />
			{post}
			{convertInputToString() && <div>{convertInputToString()}</div>}
		</>
	);
}