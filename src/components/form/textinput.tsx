import React, { ReactNode, useEffect } from "react";
import { Input } from "antd";
import { SizeType } from "antd/lib/config-provider/SizeContext";
interface TextInputProps {
	pre: ReactNode;
	prefix?: ReactNode;
	post?: any;
	value: string;
	changeHandler: Function;
	placeholder?: string;
	minLength?: number;
	maxLength?: number;
	setError?: Function;
	fieldName?: string;
	pattern?: string;
	size?: SizeType;
	password?: boolean;
	disabled?: boolean;
	width?: number | string;
}

export default function TextInput(props: TextInputProps) {
	const validate = () => {
		if (!props.setError || !props.fieldName) return;
		if (!props.value) {
			props.setError("");
			return;
		}
		if (props.minLength && props.value.length < props.minLength) {
			props.setError(
				`${props.fieldName} should at least be ${props.minLength} characters`
			);
		} else if (props.pattern && !props.value.match(props.pattern)) {
			props.setError(
				`${props.fieldName} should be in the format ${props.placeholder}`
			);
		} else props.setError("");
	};

	useEffect(() => {
		validate();
	}, [props.value]);

	return (
		<Input
			className="input"
			type={props.password ? "password" : "text"}
			addonBefore={props.pre}
			addonAfter={props.post}
			prefix={props.prefix}
			size={props.size ? props.size : "large"}
			//style={{ width: props.width ? props.width : 260 }}
			placeholder={props.placeholder ? props.placeholder : ""}
			value={props.value}
			onChange={(e) => props.changeHandler(e.currentTarget.value)}
			pattern={props.pattern ? props.pattern : ""}
			required
			onPressEnter={(e: any) => {
				e.preventDefault();
				validate();
			}}
			onBlur={(e: any) => {
				e.preventDefault();
				validate();
			}}
			maxLength={props.maxLength ? props.maxLength : 50}
			disabled={props.disabled}
		/>
	);
}
