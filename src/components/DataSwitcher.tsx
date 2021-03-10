import React, { createContext, useContext, useState, ReactNode } from "react";
import { Radio, Row, Col } from "antd";
import { AreaChartOutlined, MenuOutlined } from "@ant-design/icons";

import "./DataSwitcher.less";

const DataContext = createContext({
	active: "chart",
});

interface DataSwitcherProp {
	children?: ReactNode;
	header?: ReactNode;
	title?: string | ReactNode;
	icons?: ReactNode;
}

interface ChildrenProp {
	children?: ReactNode;
}

function DataSwitcher({ children, header, title, icons }: DataSwitcherProp) {
	const [active, setActive] = useState<string>("chart");

	function onChange(e: any) {
		setActive(e.target.value);
	}

	return (
		<div className="data-switcher">
			<DataContext.Provider value={{ active }}>
				<Row className="header">
					<Col span={16}>
						<h4>{title}</h4>
					</Col>
					<Col span={8} className="switcher">
						{icons}
						<Radio.Group value={active} onChange={onChange}>
							<Radio.Button value="chart">
								<AreaChartOutlined />
							</Radio.Button>
							<Radio.Button value="list">
								<MenuOutlined />
							</Radio.Button>
						</Radio.Group>
					</Col>
				</Row>
				<Row>
					<Col span={24}>{header}</Col>
					<Col xs={{ order: 3 }} span={24}>
						{children}
					</Col>
				</Row>
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
