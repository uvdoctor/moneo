import { useContext } from "react";
import { PageHeader, Tag } from "antd";
import StockDetailContext from "./StockDetailContext";

export default function Fund() {
	/* @ts-ignore */
	const { state } = useContext(StockDetailContext);

	return (
		<PageHeader
			title={state.data.General?.Code}
			subTitle={state.data.General?.Name}
			tags={<Tag color="green">{state.data.General?.Type}</Tag>}
		>
			<p>{state.data.General?.Fund_Summary}</p>
		</PageHeader>
	);
}
