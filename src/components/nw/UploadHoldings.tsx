import React, { useState } from "react";
import { Button, Upload, Drawer } from "antd";
import { UploadOutlined, InboxOutlined } from "@ant-design/icons";

export default function UploadHoldings() {
	const { Dragger } = Upload;
	const [showDrawer, setDrawerVisibility] = useState(false);

	function onCloseDrawer() {
		setDrawerVisibility(false);
	}

	function onShowDrawer() {
		setDrawerVisibility(true);
	}

	return (
		<>
			<Button icon={<UploadOutlined />} onClick={onShowDrawer} />
			<Drawer
				width={310}
				title="Upload PDF Statements"
				placement="right"
				closable={false}
				onClose={onCloseDrawer}
				visible={showDrawer}
			>
				<Dragger>
					<p className="ant-upload-drag-icon">
						<InboxOutlined className="upload-icon" />
					</p>
					<p className="ant-upload-text">
						Click or drag file to this area to upload
					</p>
					<p className="ant-upload-hint">
						Supports single pdf upload. Strictly prohibit from uploading company
						data or other band files
					</p>
				</Dragger>
			</Drawer>
		</>
	);
}
