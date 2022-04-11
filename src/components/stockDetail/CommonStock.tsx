import { useContext } from "react";
import { Tag, Collapse, Image, Row, Col, Typography, Card } from "antd";
import StockDetailContext from "./StockDetailContext";
import Results from "./Results";
import GridData from "./GridData";
import Officers from "./Officers";

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
			<iframe
				src={`/static/charting/index.html?code=${state.data.General?.Code}`}
				style={{
					width: "100%",
					height: "500px",
					border: "none",
					marginBottom: "15px",
				}}
			></iframe>
			<Collapse
				defaultActiveKey={["1", "2", "3", "4", "5", "6", "7"]}
				style={{ marginBottom: "35px" }}
			>
				<Panel key="2" header="Highlights">
					<GridData
						data={{
							Industry: state.data.General.Industry,
							Sector: state.data.General.Sector,
							...state.data.Highlights,
						}}
					/>
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
			<Card title="About">
				<Row style={{ paddingBottom: "30px" }} gutter={[10, 0]}>
					<Col xs={24} sm={6} lg={4}>
						<Image
							src={`https://eodhistoricaldata.com/${state.data.General.LogoURL}`}
						/>
					</Col>
					<Col xs={24} sm={18} lg={20}>
						{state.data.General.Description}
					</Col>
				</Row>
				<GridData
					data={{
						Address: state.data.General.Address,
						CountryISO: state.data.General.CountryISO,
						CurrencyCode: state.data.General.CurrencyCode,
						CurrencyName: state.data.General.CurrencyName,
						CurrencySymbol: state.data.General.CurrencySymbol,
						Exchange: state.data.General.Exchange,
						FullTimeEmployees: state.data.General.FullTimeEmployees,
						IPODate: state.data.General.IPODate,
						ISIN: state.data.General.ISIN,
						Phone: state.data.General.Phone,
						UpdatedAt: state.data.General.UpdatedAt,
						WebURL: state.data.General.WebURL,
					}}
				/>
				<Officers />
			</Card>
		</>
	);
}

CountryISO: "IN";
CurrencyCode: "INR";
CurrencyName: "Indian Rupee";
CurrencySymbol: "INR";
Exchange: "NSE";
FullTimeEmployees: 236334;
IPODate: null;
ISIN: "INE002A01018";
Industry: "Oil & Gas Refining & Marketing";
Phone: "91 22 3555 5000";
Sector: "Energy";
Type: "Common Stock";
UpdatedAt: "2022-03-14";
WebURL: "https://www.ril.com";
