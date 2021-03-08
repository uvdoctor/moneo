import React, { useState, useContext } from "react";
import { Button, Upload, Drawer } from "antd";
import { UploadOutlined, InboxOutlined } from "@ant-design/icons";
import { NWContext } from "./NWContext";
import { getUploaderSettings } from "./parseutils";

export default function UploadHoldings() {
	const { parseHoldings }: any = useContext(NWContext);
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
				<Dragger {...getUploaderSettings(parseHoldings)}>
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
