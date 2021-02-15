import React from 'react';
import { Input } from 'antd';
interface TextInputProps {
	pre: string;
	post?: string;
	value: string;
	name: string;
	placeholder?: string;
	changeHandler: Function;
}

export default function TextInput(props: TextInputProps) {
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
			onPressEnter={(e: any) => e.preventDefault()}
		/>
	);
}
