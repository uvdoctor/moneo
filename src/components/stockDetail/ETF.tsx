import { useContext } from "react";
import { PageHeader, Tag, Descriptions, Button } from "antd";
import StockDetailContext from "./StockDetailContext";

export default function ETF() {
	/* @ts-ignore */
	const { state } = useContext(StockDetailContext);

	return (
		<PageHeader
			title={state.data.General?.Code}
			subTitle={state.data.General?.Name}
			tags={<Tag color="green">{state.data.General?.Type}</Tag>}
			extra={[
				<Button
					key="1"
					type="primary"
					href={state.data.ETF_Data?.Company_URL}
					target="_blank"
				>
					Company URL
				</Button>,
			]}
		>
			<p>{state.data.General?.Description}</p>
			<Descriptions bordered>
				{Object.keys(state.data.Technicals).map((key) => (
					<Descriptions.Item label={key.split(/(?=[A-Z])/).join(" ")}>
						{state.data.Technicals[key]}
					</Descriptions.Item>
				))}
			</Descriptions>
		</PageHeader>
	);
}
