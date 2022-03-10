import { useContext } from "react";
import { PageHeader, Tag } from "antd";
import StockDetailContext from "./StockDetailContext";
import Results from "./Results";

import {
	incomeStatementParticulars,
	balanceSheetParticulars,
	cashFlowParticulars,
} from "./particulars.config";

export default function CommonStock() {
	/* @ts-ignore */
	const { state } = useContext(StockDetailContext);

	return (
		<PageHeader
			title={state.data.General?.Code}
			subTitle={state.data.General?.Name}
			tags={<Tag color="green">Stock</Tag>}
		>
			<Results
				title="Quarterly Result"
				resultsData={state.data.Financials.Income_Statement.quarterly}
				particulars={incomeStatementParticulars}
				chartOptions={{
					bars: ["totalRevenue", "netIncome"],
					lines: ["incomeBeforeTax"],
				}}
			/>
			<Results
				title="Profit & Loss"
				resultsData={state.data.Financials.Income_Statement.yearly}
				particulars={incomeStatementParticulars}
				chartOptions={{
					bars: ["totalRevenue"],
					lines: ["netIncome"],
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
			{state.data.General?.Description}
		</PageHeader>
	);
}
