import { useContext } from "react";
import { PageHeader, Tag } from "antd";
import StockDetailContext from "./StockDetailContext";

export default function Currency() {
	/* @ts-ignore */
	const { state } = useContext(StockDetailContext);

	return (
		<PageHeader
			title={state.data.General?.Code}
			subTitle={state.data.General?.Name}
			tags={<Tag color="green">{state.data.General?.Type}</Tag>}
		></PageHeader>
	);
}
