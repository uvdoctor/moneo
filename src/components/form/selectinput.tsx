import React, { Fragment } from 'react';
import { getCurrencyList } from '../utils';
import { Tooltip, Select } from 'antd';
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
	const { Option } = Select;

	return (
		<div>
			{props.info && <Tooltip title={props.info} />}
			{props.pre && <label className="whitespace-no-wrap">{props.pre}</label>}
			{!props.disabled ? (
				<Fragment>
					<div className="flex items-center">
						<Select
							style={{ minWidth: '40px' }}
							value={props.value}
							onChange={(value) => props.changeHandler(value)}
						>
							{Object.keys(props.currency ? getCurrencyList() : props.options).map((key) => (
								<Option key={key} value={key}>
									{props.currency ? key : props.options[key]}
								</Option>
							))}
						</Select>
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
