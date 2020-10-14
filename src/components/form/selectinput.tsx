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
	unit?: string;
	changeHandler: any;
	currency?: boolean;
}

export default function SelectInput(props: SelectInputProps) {
	const { Option } = Select;

	return (
		<Space align="center" direction="vertical" size="small">
			{props.pre && <Space align="start">
				{props.pre}
				{props.info && (
					<Tooltip title={props.info}>
						<span>
							<InfoCircleOutlined />
						</span>
					</Tooltip>
				)}
			</Space>}
			{!props.disabled ? (
				<Fragment>
					<Space align="center">
						<Select
							showSearch
							optionFilterProp="children"
							style={{ minWidth: '80px' }}
							value={props.value}
							onChange={(value) => props.changeHandler(value)}
							filterOption={(input, option) =>
								option?.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
							}
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
		</Space>
	);
}
