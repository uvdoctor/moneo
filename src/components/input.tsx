import React, { useRef, useEffect, useState } from 'react'
import { toCurrency } from './utils'
interface InputProps {
	pre?: string,
	post?: string,
	options?: any,
	min?: string,
	max?: string,
	value?: string | number,
	width?: string,
	float?: string,
	type?: string,
	name?: string,
	currency?: string,
	unit?: string,
	placeholder?: string
	changeHandler: any,
}


export default function Input(props: InputProps) {
	const formRef = useRef<HTMLFormElement>(null);
	const [editing, setEditing] = useState<boolean>(false)

	useEffect(
		() => {
			// @ts-ignore: Object is possibly 'null'.
			formRef.current.reportValidity();
		},
		[formRef]
	);

	return (
		<form ref={formRef}>
			<div className={props.min && props.max ? "mt-4 flex items-center justify-between w-40" : "mt-4 flex flex-col w-32"}>
				<div className="flex flex-col">
					{props.pre && <label>{props.pre}</label>}
					{props.post && <label>{props.post}</label>}
				</div>
				<div className="flex">
					{props.options ?
						(
							<select name={props.name} className="input" value={props.value} onChange={props.changeHandler}>
							{Object.keys(props.options).map(key =>
									<option key={key} value={key}>
										{props.options[key]}
									</option>)}
							</select>
						) : (props.type ? (
							<input className="input" type="text" name={props.name}
								placeholder={props.placeholder} value={props.value} onChange={props.changeHandler}
								required style={{ width: `${props.width}` }} />
						) : (

								(!props.currency || (props.currency && editing)) ? 
								<input
									className="input"
									type="number"
									name={props.name}
									value={props.value}
									min={props.min}
									max={props.max}
									step={props.float ? props.float : "1"}
									onChange={props.changeHandler}
									onBlur={() => setEditing(false)}
									required
									style={{ width: `${props.width ? props.width : "30px"}` }}
								/> :
									<input className="input"
										type="text"
										name={props.name}
										value={toCurrency(props.value as number, props.currency)}
										onFocus={() => setEditing(true)}
										style={{ width: `${props.width ? props.width : "30px"}` }}
										readOnly
									/>
							)
						)
					}
					{props.unit && <label className="ml-1">{props.unit}</label>}
				</div>
			</div>
			{props.min && props.max &&
				<div className="flex flex-col mt-1">
					<input className="rounded-lg overflow-hidden appearance-none bg-gray-400 h-3 md:h-4 w-full cursor-default outline-none focus:outline-none shadow focus:shadow-lg" type="range" min={props.min} max={props.max} step={props.float ? props.float : "1"} value={`${props.value}`}
						onChange={props.changeHandler} />
					<div className="mt-1 flex justify-between w-full text-gray-400">
						<label>{props.min}</label>
						<label>{props.max}</label>
					</div>
				</div>
			}
		</form >
	);
}