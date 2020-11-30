import React, { ReactNode } from "react";
import { getCurrencyList } from "../utils";
import { Tooltip, Select, Row, Col } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";

interface SelectInputProps {
	disabled?: boolean;
	info?: string;
	pre: string;
	post?: ReactNode;
	options?: any;
	value: string | number;
	unit?: string;
	changeHandler: any;
	currency?: boolean;
}

export default function SelectInput(props: SelectInputProps) {
	const { Option } = Select;
	const selectOptions = props.currency ? getCurrencyList() : props.options;

	return (
		<Row align="middle" justify="space-between">
			{props.pre && (
				<Col>
					{props.pre}
					{props.info && (
						<Tooltip title={props.info}>
							<InfoCircleOutlined />
						</Tooltip>
					)}
				</Col>
			)}
			<Col>
				<Row align="middle">
					<Select
						showSearch
						optionFilterProp="children"
						value={props.currency ? props.value : selectOptions[props.value]}
						onChange={(value: string) => props.changeHandler(value)}
						filterOption={(input, option) =>
							option?.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
						}
						disabled={props.disabled}
						defaultValue={selectOptions[props.value]}
						style={{minWidth: '60px'}}
					>
						{Object.keys(selectOptions).map((key) => (
							<Option key={key} value={key}>
								{props.currency ? key : selectOptions[key]}
							</Option>
						))}
					</Select>
					{props.unit}
					<Row>{props.post}</Row>
				</Row>
			</Col>
		</Row>
	);
}
