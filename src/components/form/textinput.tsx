import React, { useEffect } from 'react';
import { Input } from 'antd';
interface TextInputProps {
	pre: string;
	post?: any;
	value: string;
	name: string;
	changeHandler: Function;
	placeholder?: string;
	minLength?: number;
	setError?: Function;
	fieldName?: string;
}

export default function TextInput(props: TextInputProps) {
	const validate = () => {
		if (!props.minLength || !props.setError || !props.fieldName) return;
		if (props.value.length < props.minLength) {
			props.setError(`${props.fieldName} should at least be ${props.minLength} characters.`);
		} else {
			props.setError('');
		}
	};

	useEffect(() => {
		validate();
	}, [props.value]);

	return (
		<Input
			className="input"
			type="text"
			addonBefore={props.pre}
			addonAfter={props.post}
			name={props.name}
			placeholder={props.placeholder}
			value={props.value}
			onChange={(e) => props.changeHandler(e.currentTarget.value)}
			required
			size='large'
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
