import React, { useState } from "react";
import { Modal, Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";

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
			<Button type="primary" icon={<PlusOutlined />} onClick={showModal}>
				Add
			</Button>
			<Modal
				title="Add Asset"
				visible={isModalVisible}
				onOk={onClose}
				onCancel={onClose}
			>
				<p>Some contents...</p>
				<p>Some contents...</p>
				<p>Some contents...</p>
			</Modal>
		</div>
	);
}
