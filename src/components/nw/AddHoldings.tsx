import React, { useState } from "react";
import { Modal, Button, Form, Select, Input } from "antd";
import { PlusOutlined } from "@ant-design/icons";

export default function AddHoldings() {
	const { Option } = Select;
	const [isModalVisible, setModalVisibility] = useState(false);

	function showModal() {
		setModalVisibility(true);
	}

	function onClose() {
		setModalVisibility(false);
	}

	return (
		<div className="text-right">
			<Button type="primary" icon={<PlusOutlined />} onClick={showModal} />
			<Modal
				title="Add Asset"
				visible={isModalVisible}
				okText="Add"
				onOk={onClose}
				onCancel={onClose}
			>
				<Form>
					<Form.Item>
						<Select placeholder="Search asset..." allowClear>
							<Option value="reliance">Reliance</Option>
							<Option value="sbin">SBIN</Option>
							<Option value="bajajfinance">BAJAJFINANCE</Option>
						</Select>
					</Form.Item>
					<Form.Item>
						<Input placeholder="Enter quantity" />
					</Form.Item>
				</Form>
			</Modal>
		</div>
	);
}
