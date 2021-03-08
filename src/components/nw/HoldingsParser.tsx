import React, { useContext } from "react";
import { Upload, Empty, Drawer, Button, Statistic, Select } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import { useFullScreenBrowser } from "react-browser-hooks";
import { NWContext } from "./NWContext";
import HoldingTabs from "./HoldingTabs";
import HoldingsChart from "./HoldingsChart";
import HoldingsFilter from "./HoldingsFilter";
import DataSwitcher from "../DataSwitcher";
import { isMobileDevice } from "../utils";

import "./nw.less";

export default function HoldingsParser() {
	const fsb = useFullScreenBrowser();
	const { Option } = Select;
	const { Chart, List: DataSwitcherList } = DataSwitcher;
	const {
		allEquities,
		allBonds,
		allMFs,
		allETFs,
		showUpdateHoldings,
		setUpdateHoldings,
		insNames,
		taxId,
		hasNoHoldings,
	}: any = useContext(NWContext);

	const { Dragger } = Upload;

	function onCloseUpdateHoldings() {
		setUpdateHoldings(false);
	}

	return (
		<div className="nw-container">
			<div className="dd-stat">
				<Statistic
					title="Total Portfolio Value"
					value={213454654}
					prefix={
						<Select className="currency-selector" defaultValue="₹">
							<Option value="₹">₹</Option>
							<Option value="$">$</Option>
							<Option value="€">€</Option>
						</Select>
					}
				/>
			</div>
			<DataSwitcher title={<h3>Holdings details</h3>}>
				<Chart>
					<HoldingsChart />
				</Chart>
				<DataSwitcherList>
					<HoldingsFilter />
					<HoldingTabs
						equities={allEquities}
						bonds={allBonds}
						mutualFunds={allMFs}
						insNames={insNames}
					/>
				</DataSwitcherList>
			</DataSwitcher>
			{!hasNoHoldings() ? (
				<>
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
								<Button
									onClick={onCloseUpdateHoldings}
									style={{ marginRight: 8 }}
								>
									Cancel
								</Button>
								<Button onClick={onCloseUpdateHoldings} type="primary">
									Update
								</Button>
							</div>
						}
					>
						<HoldingTabs
							equities={allEquities}
							bonds={allBonds}
							mutualFunds={allMFs}
							etfs={allETFs}
							insNames={insNames}
						/>
					</Drawer>
					<DataSwitcher title={<strong>Holdings details</strong>}>
						<Chart>
							<HoldingsChart />
						</Chart>
						<DataSwitcherList>
							<HoldingsFilter />
							<HoldingTabs
								equities={allEquities}
								bonds={allBonds}
								mutualFunds={allMFs}
								etfs={allETFs}
								insNames={insNames}
							/>
						</DataSwitcherList>
					</DataSwitcher>
				</>
			) : (
				<Empty description={<p>No investment data.</p>} />
			)}
		</div>
	);
}
