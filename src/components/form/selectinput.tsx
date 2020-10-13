import React, { Fragment } from 'react';
import { getCurrencyList } from '../utils';
import { Tooltip, Select, Space } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';

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
			<Space align="start">
				{props.pre}
				{props.info && (
					<Tooltip title={props.info}>
						<span>
							<InfoCircleOutlined />
						</span>
					</Tooltip>
				)}
			</Space>
			{!props.disabled ? (
				<Fragment>
					<Space align="center">
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
						{props.unit && <label>{props.unit}</label>}
					</Space>
					{props.post && <label>{props.post}</label>}
				</Fragment>
			) : (
				<label>{props.value}</label>
			)}
		</div>
	);
}
