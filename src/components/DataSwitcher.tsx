import React, { createContext, useContext, useState, ReactNode } from "react";
import { Radio } from "antd";
import { BarChartOutlined, MenuOutlined } from "@ant-design/icons";

import "./DataSwitcher.less";

const DataContext = createContext({
	active: "chart",
});

interface ChildrenProp {
	children?: ReactNode;
}

function DataSwitcher({ children }: ChildrenProp) {
	const [active, setActive] = useState<string>("chart");

	function onChange(e: any) {
		setActive(e.target.value);
	}

	return (
		<div className="data-switcher">
			<DataContext.Provider value={{ active }}>
				<div className="text-right">
					<Radio.Group value={active} onChange={onChange}>
						<Radio.Button value="chart">
							<BarChartOutlined />
						</Radio.Button>
						<Radio.Button value="list">
							<MenuOutlined />
						</Radio.Button>
					</Radio.Group>
				</div>
				{children}
			</DataContext.Provider>
		</div>
	);
}

function Chart({ children }: ChildrenProp) {
	const { active } = useContext(DataContext);

	return (
		<div className={`container ${active === "chart" ? " active" : ""}`}>
			{children}
		</div>
	);
}

function List({ children }: ChildrenProp) {
	const { active } = useContext(DataContext);

	return (
		<div className={`container ${active === "list" ? " active" : ""}`}>
			{children}
		</div>
	);
}

DataSwitcher.Chart = Chart;
DataSwitcher.List = List;

export default DataSwitcher;
