import React, { useState, useContext, useEffect } from "react";
import { Button, Upload, Drawer, Tabs } from "antd";
import { UploadOutlined, InboxOutlined } from "@ant-design/icons";
import { useFullScreenBrowser } from "react-browser-hooks";
import HoldingsTable from "./HoldingsTable";
import { NWContext } from "./NWContext";
import { getUploaderSettings } from "./parseutils";
import { isMobileDevice } from "../utils";

export default function UploadHoldings() {
	const fsb = useFullScreenBrowser();
	const { TabPane } = Tabs;
	const {
		parseHoldings,
		showUpdateHoldings,
		setUpdateHoldings,
		taxId,
		allEquities: equities,
		allBonds: bonds,
		allMFs: mutualFunds,
		allETFs: etfs,
		insNames,
		hasNoHoldings,
	}: any = useContext(NWContext);
	const { Dragger } = Upload;
	const [showDrawer, setDrawerVisibility] = useState(false);

	useState(() => {
		if (hasNoHoldings()) setDrawerVisibility(true);
	}, [null]);

	useEffect(() => {
		if (showUpdateHoldings) setDrawerVisibility(false);
	}, [showUpdateHoldings]);

	function onCloseDrawer() {
		setDrawerVisibility(false);
	}

	function onShowDrawer() {
		setDrawerVisibility(true);
	}

	function onCloseUpdateHoldings() {
		setUpdateHoldings(false);
	}

	return (
		<>
			<Button icon={<UploadOutlined />} onClick={onShowDrawer} />
			<Drawer
				width={isMobileDevice(fsb) ? 320 : 550}
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
			<Drawer
				className="upload-holdings-drawer"
				width={isMobileDevice(fsb) ? 320 : 550}
				title={
					<>
						Update holdings for PAN no <strong>{taxId}</strong>
					</>
				}
				placement="right"
				closable={false}
				visible={showUpdateHoldings}
				footer={
					<div className="text-right">
						<Button onClick={onCloseUpdateHoldings} style={{ marginRight: 8 }}>
							Cancel
						</Button>
						<Button onClick={onCloseUpdateHoldings} type="primary">
							Update
						</Button>
					</div>
				}
			>
				<Tabs defaultActiveKey="E" type="card">
					<TabPane key="E" tab="Equities">
						<HoldingsTable data={equities} insNames={insNames} />
					</TabPane>
					<TabPane key="B" tab="Bonds">
						<HoldingsTable data={bonds} insNames={insNames} />
					</TabPane>
					<TabPane key="M" tab="Mutual Funds">
						<HoldingsTable data={mutualFunds} insNames={insNames} />
					</TabPane>
					<TabPane key="ETF" tab="ETFs">
						<HoldingsTable data={etfs} insNames={insNames} />
					</TabPane>
				</Tabs>
			</Drawer>
		</>
	);
}
