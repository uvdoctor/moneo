import { useContext } from "react";
import { Tag, Collapse, Image, Row, Col, Typography } from "antd";
import StockDetailContext from "./StockDetailContext";
import Results from "./Results";
import GridData from "./GridData";

import {
	incomeStatementParticulars,
	balanceSheetParticulars,
	cashFlowParticulars,
} from "./particulars.config";

export default function CommonStock() {
	/* @ts-ignore */
	const { state } = useContext(StockDetailContext);
	const { Title, Text } = Typography;
	const { Panel } = Collapse;

	return (
		<>
			<Row align="middle" gutter={[10, 0]} style={{ marginBottom: "15px" }}>
				<Col>
					<Title style={{ marginBottom: 0 }} level={4}>
						{state.data.General?.Code}
					</Title>
				</Col>
				<Col>
					<Text>{state.data.General?.Name}</Text>
				</Col>
				<Col>
					<Tag color="green">Stock</Tag>
				</Col>
			</Row>
			<Collapse
				defaultActiveKey={["1", "2", "3", "4", "5", "6", "7"]}
				style={{ marginBottom: "35px" }}
			>
				<Panel key="1" header="About">
					<Row gutter={[10, 0]}>
						<Col xs={24} sm={6} lg={4}>
							<Image
								src={`https://eodhistoricaldata.com/${state.data.General.LogoURL}`}
							/>
						</Col>
						<Col xs={24} sm={18} lg={20}>
							{state.data.General.Description}
						</Col>
					</Row>
				</Panel>
				<Panel key="2" header="Highlights">
					<GridData data={state.data.Highlights} />
				</Panel>
				<Panel key="3" header="Valuation">
					<GridData data={state.data.Valuation} />
				</Panel>
				<Panel key="4" header="Technicals">
					<GridData data={state.data.Technicals} />
				</Panel>
				<Panel key="5" header="Splits & Dividends">
					<GridData data={state.data.SplitsDividends} />
				</Panel>
			</Collapse>
			<Results
				title="Quarterly Result"
				resultsData={state.data.Financials.Income_Statement.quarterly}
				particulars={incomeStatementParticulars}
				chartOptions={{
					bars: ["totalRevenue", "totalOperatingExpenses"],
					lines: ["incomeBeforeTax", "netIncome"],
				}}
			/>
			<Results
				title="Profit & Loss"
				resultsData={state.data.Financials.Income_Statement.yearly}
				particulars={incomeStatementParticulars}
				chartOptions={{
					bars: ["totalRevenue", "totalOperatingExpenses"],
					lines: ["incomeBeforeTax", "netIncome"],
				}}
			/>
			<Results
				title="Balance Sheet"
				resultsData={state.data.Financials.Balance_Sheet.yearly}
				particulars={balanceSheetParticulars}
				chartOptions={{
					bars: ["cash"],
					lines: ["inventory"],
				}}
			/>
			<Results
				title="Cash Flow"
				resultsData={state.data.Financials.Cash_Flow.yearly}
				particulars={cashFlowParticulars}
				chartOptions={{
					bars: ["changeInCash"],
					lines: ["depreciation"],
				}}
			/>
		</>
	);
}
