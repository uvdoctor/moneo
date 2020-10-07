import React, { Fragment, useRef } from 'react';
import { getCurrencyList } from '../utils';
import Tooltip from './tooltip';
interface SelectInputProps {
	disabled?: boolean;
	info?: string;
	pre: string;
	post?: string;
	options?: any;
	value: string | number;
	name: string;
	unit?: string;
	changeHandler: any;
	currency?: boolean;
}

export default function SelectInput(props: SelectInputProps) {
	const selectRef = useRef<HTMLSelectElement>(null);

	const handleKeyDown = (e: any) => {
		if (e.key === 'Enter') {
			e.preventDefault();
		}
	};

	return (
		<div>
			{props.info && <Tooltip info={props.info} />}
			{props.pre && <label className="whitespace-no-wrap">{props.pre}</label>}
			{!props.disabled ? (
				<Fragment>
					<div className="flex items-center">
						<select
							ref={selectRef}
							name={props.name}
							className="input"
							style={{ minWidth: '40px' }}
							value={props.value}
							onKeyDown={handleKeyDown}
							onChange={(e) => props.changeHandler(e.currentTarget.value)}
						>
							{Object.keys(props.currency ? getCurrencyList() : props.options).map((key) => (
								<option key={key} value={key}>
									{props.currency ? key : props.options[key]}
								</option>
							))}
						</select>
						{props.unit && <label className="ml-1">{props.unit}</label>}
					</div>
					{props.post && <label>{props.post}</label>}
				</Fragment>
			) : (
				<label>{props.value}</label>
			)}
		</div>
	);
}
