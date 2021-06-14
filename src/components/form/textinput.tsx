import React, { ReactNode, useEffect } from 'react';
import { Input } from 'antd';
interface TextInputProps {
	pre: ReactNode;
	post?: any;
	value: string;
	changeHandler: Function;
	placeholder?: string;
	minLength?: number;
	setError?: Function;
	fieldName?: string;
	pattern?: string;
}

export default function TextInput(props: TextInputProps) {
	const validate = () => {
		if (!props.minLength || !props.setError || !props.fieldName) return;
		if (!props.value) {
			props.setError('');
			return;
		}
		if (props.value.length < props.minLength) {
			props.setError(`${props.fieldName} should at least be ${props.minLength} characters`);
		} else if (props.pattern && !props.value.match(props.pattern)) {
			props.setError(`${props.fieldName} should be in the format ${props.placeholder}`);
		} else props.setError('');
	};

	useEffect(
		() => {
			validate();
		},
		[ props.value ]
	);

	return (
		<Input
			className="input"
			type="text"
			addonBefore={props.pre}
			addonAfter={props.post}
			placeholder={props.placeholder ? props.placeholder : ''}
			value={props.value}
			onChange={(e) => props.changeHandler(e.currentTarget.value)}
			pattern={props.pattern ? props.pattern : ''}
			required
			size="large"
			onPressEnter={(e: any) => {
				e.preventDefault();
				validate();
			}}
			onBlur={(e: any) => {
				e.preventDefault();
				validate();
			}}
			maxLength={20}
		/>
	);
}
