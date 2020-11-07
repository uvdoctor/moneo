import React, { useEffect, useRef } from 'react';

interface TextInputProps {
	pre: string;
	post?: string;
	value: string;
	width?: string;
	name: string;
	placeholder?: string;
	changeHandler: Function;
}

export default function TextInput(props: TextInputProps) {
	const formRef = useRef<HTMLFormElement>(null);

	useEffect(
		() => {
			// @ts-ignore: Object is possibly 'null'.
			if (formRef) formRef.current.reportValidity();
		},
		[ formRef ]
	);

	const handleKeyDown = (e: any) => {
		if (e.key === 'Enter') {
			e.preventDefault();
		}
	};

	return (
		<form ref={formRef}>
			{props.pre && <label>{props.pre}</label>}
			<input
				className="input"
				type="text"
				name={props.name}
				placeholder={props.placeholder}
				value={props.value}
				onChange={(e) => props.changeHandler(e.currentTarget.value)}
				required
				style={{ width: `${props.width}` }}
				onKeyDown={handleKeyDown}
			/>
			{props.post && <label>{props.post}</label>}
		</form>
	);
}
