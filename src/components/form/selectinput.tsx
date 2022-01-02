import React, { ReactNode, Fragment } from "react";
import { getCurrencyList } from "../utils";
import { Tooltip, Select } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";

interface SelectInputProps {
	disabled?: boolean;
	info?: string;
	pre: string | ReactNode;
	post?: ReactNode;
	options?: any;
	value: string | number;
	unit?: string;
	changeHandler: any;
	currency?: boolean;
	loading?: boolean;
}

export default function SelectInput(props: SelectInputProps) {
	const { Option } = Select;
	const selectOptions = props.currency ? getCurrencyList() : props.options;

	return (
		<Fragment>
			{props.pre && (
				<Fragment>
					{props.pre}
					{props.info && (
						<Tooltip title={props.info}>
							<InfoCircleOutlined />
						</Tooltip>
					)}
				</Fragment>
			)}{" "}
			<Select
				showSearch
				optionFilterProp="children"
				value={props.currency ? props.value : selectOptions[props.value]}
				onChange={(value: string) => props.changeHandler(value)}
				filterOption={(input, option) =>
					//@ts-ignore
					option?.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
				}
				disabled={props.disabled ? props.disabled : false}
				defaultValue={selectOptions[props.value]}
				loading={props.loading ? props.loading : false}
			>
				{Object.keys(selectOptions).map((key) => (
					<Option key={key} value={key}>
						{props.currency ? key : selectOptions[key]}
					</Option>
				))}
			</Select>{" "}
			{props.unit}
			{props.post}
		</Fragment>
	);
}
