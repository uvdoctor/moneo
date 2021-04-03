import React, { useState } from "react";
import { Modal, Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { ContextProvider } from "./Context";
import FormGenerator from "./FormGenerator";

export default function AddHoldings() {
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
				<ContextProvider>
					<FormGenerator />
				</ContextProvider>
			</Modal>
		</div>
	);
}
