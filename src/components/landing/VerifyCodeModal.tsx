import React, { useContext } from "react";
import { Input, Modal, Button } from "antd";
import { RedoOutlined } from "@ant-design/icons";
import { JoinContext } from "./JoinContext";

export default function VerifyCodeModal() {
	const {
		email,
		isLoading,
		onSecurityCode,
		showVerifyModal,
		setShowVerifyModal,
	}: any = useContext(JoinContext);

	return (
		<Modal
			className="security-code-modal"
			title="Verify Email"
			okText="Verify"
			visible={showVerifyModal}
			onOk={() => onSecurityCode()}
			onCancel={() => setShowVerifyModal(false)}
			confirmLoading={isLoading}
			centered
			maskClosable
		>
			<p>
				Please verify the secutiry code sent to you at <strong>{email}</strong>
			</p>
			<div className="security-code-container">
				<Input placeholder="Enter Code" size="large" />
				<Button type="link" shape="round" icon={<RedoOutlined />} size="small">
					Resend security code
				</Button>
			</div>
		</Modal>
	);
}
