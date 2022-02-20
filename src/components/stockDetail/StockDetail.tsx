import { useContext } from "react";
import { PageHeader, Skeleton, Alert } from "antd";
import StockDetailContext from "./StockDetailContext";
import Results from "./Results";
import {
	incomeStatementParticulars,
	balanceSheetParticulars,
	cashFlowParticulars,
} from "./particulars.config";

require("./StockDetail.less");

export default function StockDetail() {
	/* @ts-ignore */
	const { state } = useContext(StockDetailContext);

	return (
		<div className="stock-detail">
			{state.isLoading ? (
				<>
					<Skeleton />
					<Skeleton />
				</>
			) : state.error ? (
				<Alert
					message={state.error.title}
					description={state.error.text}
					type="error"
					showIcon
				/>
			) : (
				state.data && (
					<PageHeader
						title={state.data.General?.Code}
						subTitle={state.data.General?.Name}
					>
						<Results
							title="Quarterly Result"
							resultsData={state.data.Financials.Income_Statement.quarterly}
							particulars={incomeStatementParticulars}
						/>
						<Results
							title="Profit & Loss"
							resultsData={state.data.Financials.Income_Statement.yearly}
							particulars={incomeStatementParticulars}
						/>
						<Results
							title="Balance Sheet"
							resultsData={state.data.Financials.Balance_Sheet.yearly}
							particulars={balanceSheetParticulars}
						/>
						<Results
							title="Cash Flow"
							resultsData={state.data.Financials.Cash_Flow.yearly}
							particulars={cashFlowParticulars}
						/>
						{state.data.General?.Description}
					</PageHeader>
				)
			)}
		</div>
	);
}
