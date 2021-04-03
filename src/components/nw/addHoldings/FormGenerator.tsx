import React, { useContext } from "react";
import { Form, Select, Input } from "antd";
import { Context } from "./Context";

export default function FormGenerator() {
	const { Option } = Select;
	const {
		selectedType,
		selectedFormConfig,
		getHoldingOptions,
		onHoldingTypeChange,
	}: any = useContext(Context);

	return (
		<Form>
			<Form.Item>
				<Select
					defaultValue={selectedType}
					value={selectedType}
					onChange={onHoldingTypeChange}
				>
					{getHoldingOptions().map((option: any) => (
						<Option value={option}>{option}</Option>
					))}
				</Select>
			</Form.Item>

			{selectedFormConfig.map(({ label, type }: any) => {
				switch (type) {
					case "text":
						return (
							<Form.Item>
								<Input placeholder={label} />
							</Form.Item>
						);
				}
			})}
		</Form>
	);
}
