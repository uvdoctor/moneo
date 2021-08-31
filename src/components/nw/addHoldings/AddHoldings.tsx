import React, { Fragment, ReactNode, useState } from "react";
import { Modal, Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";

interface AddHoldingsProps {
	isPrimary: boolean;
	children: ReactNode;
}

export default function AddHoldings({isPrimary, children}: AddHoldingsProps) {
	const [isModalVisible, setModalVisibility] = useState(false);

	function showModal() {
		setModalVisibility(true);
	}

	function onClose() {
		setModalVisibility(false);
	}

	return (
		<Fragment>
			&nbsp;&nbsp;
			<Button type={isPrimary ? "primary" : "default"} icon={<PlusOutlined />} onClick={showModal}>
				{isPrimary? "Add" : "Add Manually"}
			</Button>
			<Modal
				title="Add Asset"
				visible={isModalVisible}
				footer={null}
				onCancel={onClose}
			>
				{/*<ContextProvider>
					<FormGenerator onClose={onClose} />
				</ContextProvider>*/}
				{children}
			</Modal>
		</Fragment>
	);
}
