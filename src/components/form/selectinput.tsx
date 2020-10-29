import React, { Fragment } from 'react';
import { getCurrencyList } from '../utils';
import { Tooltip, Select, Row, Col } from 'antd';
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
		<Row align="middle" justify="space-between">
			{props.pre && <Col span={12}>
				{props.pre}
				{props.info && (
					<Tooltip title={props.info}>
						<span>
							<InfoCircleOutlined />
						</span>
					</Tooltip>
				)}
			</Col>}
			<Col span={12}>
				{!props.disabled ? (
					<Fragment>
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
						</Fragment>
						) : (
							<label>{props.value}</label>
					)}
				{<label style={{marginLeft: '0.5rem'}}>{props.post}</label>}
							</Col>
		</Row>
	);
}
