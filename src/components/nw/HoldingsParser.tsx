import React from "react";
import { Statistic, Select } from "antd";
import HoldingTabs from "./HoldingTabs";
import HoldingsChart from "./HoldingsChart";
import HoldingsFilter from "./HoldingsFilter";
import DataSwitcher from "../DataSwitcher";

import "./nw.less";

export default function HoldingsParser() {
	const { Option } = Select;
	const { Chart, List: DataSwitcherList } = DataSwitcher;

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
					<HoldingTabs />
				</DataSwitcherList>
			</DataSwitcher>
		</div>
	);
}
