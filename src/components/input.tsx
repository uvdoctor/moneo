import React, { useRef, useEffect } from 'react';

interface InputProps {
    pre?: string,
    post?: string,
    options?: Array<any>,
    min?: string,
    max?: string,
    value?: string,
    width?: string,
    float?: string,
    changeHandler: any,
}

export default function Input(props: InputProps) {
	const formRef = useRef<HTMLFormElement>(null);

	useEffect(
		() => {
            // @ts-ignore: Object is possibly 'null'.
			formRef.current.reportValidity();
		},
		[ formRef ]
	);

	return (
		<form ref={formRef} className="mt-4">
			<label>{props.pre}</label>
			{props.pre !== '' && <label className="mr-2"> </label>}
			{!props.options ? (
				<input
					className="inner-block px-2 font-bold appearance-none border border-2 focus:border-indigo-800"
					type="number"
					value={props.value}
					min={props.min}
					max={props.max}
					step={props.float ? props.float : "1"}
					onChange={props.changeHandler}
					required
					style={{ width: `${props.width}` }}
				/>
			) : (
				<select value={props.value} onChange={props.changeHandler}>
					{props.options.map((option, i) => (
						<option key={i} value={option.value}>
							{option.label}
						</option>
					))}
				</select>
			)}
			<label className="inner-block ml-2">{props.post}</label>
		</form>
	);
}
