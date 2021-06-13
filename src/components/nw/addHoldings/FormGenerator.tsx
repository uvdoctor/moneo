import React, { useContext } from "react";
import { Form, Select, Input, Space, Button } from "antd";
import { Context } from "./Context";

interface FormGeneratorProp {
	onClose?: any;
}

export default function FormGenerator({ onClose }: FormGeneratorProp) {
	const { Option } = Select;
	const {
		selectedType,
		selectedFormConfig,
		getHoldingOptions,
		onHoldingTypeChange,
		formState,
		dispatch,
		addHoldings,
	}: any = useContext(Context);

	function onAddHoldings() {
		addHoldings();
		onClose();
	}

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
			{(selectedFormConfig.formConfig || []).map(
				({ label, name, type }: any) => {
					switch (type) {
						case "text":
							return (
								<Form.Item>
									<Input
										name={name}
										value={formState[name].value}
										placeholder={label}
										onChange={(e) =>
											//@ts-ignore
											dispatch({
												type: "fieldUpdate",
												name,
												value: e.target.value,
											})
										}
									/>
								</Form.Item>
							);
					}
				}
			)}
			<Form.Item>
				<Space>
					<Button type="primary" onClick={onAddHoldings}>
						Add
					</Button>
					<Button onClick={onClose}>Cancel</Button>
				</Space>
			</Form.Item>
		</Form>
	);
}
