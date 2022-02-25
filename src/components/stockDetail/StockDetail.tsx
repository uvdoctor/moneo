import { useContext } from "react";
import { PageHeader, Skeleton, Alert } from "antd";
import StockDetailContext from "./StockDetailContext";
import RenderDetails from "./RenderDetails";

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
				state.data && <RenderDetails />
			)}
		</div>
	);
}
