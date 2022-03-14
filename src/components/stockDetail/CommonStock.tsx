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

	// Address: "Maker Chambers IV, Mumbai, India, 400021"
	// CountryISO: "IN"
	// CountryName: "India"
	// CurrencyCode: "INR"
	// CurrencyName: "Indian Rupee"
	// Description: "Reliance Industries Limited engages in hydrocarbon exploration and production, petroleum refining and marketing, petrochemicals, textile, retail, digital, and financial services businesses worldwide. The company produces and markets petroleum products, such as liquefied petroleum gas, propylene, naphtha, gasoline, jet/aviation turbine fuel, kerosene oil, diesel, Sulphur, and petroleum coke. It also provides petrochemicals, including high-density and low-density polyethylene (PE), linear low density PE, polyester fibers and yarns, polypropylene, polyvinyl chloride, polyester yarn, purified terephthalic acid, ethylene glycols and oxide, paraxylene, ortho xylene, benzene, linear alkyl benzene and paraffin, poly butadiene rubber, styrene butadiene rubber, butyl rubber, and polyethylene terephthalate. In addition, the company manufactures and markets yarns, fabrics, apparel, and auto furnishings; explores, develops, and produces crude oil and natural gas; and operates various stores comprising neighborhood, supermarket, hypermarket, wholesale cash and carry, specialty, online, pharmacy, and grocery stores, as well as stores that offer apparel, beauty and cosmetics, accessories, footwear, consumer electronics, connectivity products, and others. As of March 31, 2021, it operated 12,711 retail stores. Further, it provides range of digital services under the Jio brand name; and non-banking financial and insurance broking services. Further, it operates news and entertainment platforms, finance portals, fashion and lifestyle portals, and online ticket booking platforms, as well as Network18 and television channels; publishes magazines; and offers highway hospitality and fleet management services. The company was incorporated in 1973 and is based in Mumbai, India."
	// Exchange: "NSE"
	// FiscalYearEnd: "March"
	// FullTimeEmployees: 236334
	// IPODate: null
	// ISIN: "INE002A01018"
	// Industry: "Oil & Gas Refining & Marketing"
	// LogoURL: "/img/logos/NSE/RELIANCE.png"
	// Name: "Reliance Industries Limited"
	// Phone: "91 22 3555 5000"
	// Sector: "Energy"
	// Type: "Common Stock"
	// UpdatedAt: "2022-03-14"
	// WebURL: "https://www.ril.com"

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
