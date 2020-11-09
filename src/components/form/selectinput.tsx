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
						value={props.value}
						onChange={(value) => props.changeHandler(value)}
						filterOption={(input, option) =>
							option?.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
						}
						disabled={props.disabled}
					>
						{Object.keys(
							props.currency ? getCurrencyList() : props.options
						).map((key) => (
							<Option key={key} value={key}>
								{props.currency ? key : props.options[key]}
							</Option>
						))}
					</Select>
					{props.unit}
					<Col span={24}>{props.post}</Col>
				</Row>
			</Col>
		</Row>
	);
}
