import { useContext } from "react";
import { PageHeader, Tag, Descriptions, Button } from "antd";
import StockDetailContext from "./StockDetailContext";

export default function Crypto() {
	/* @ts-ignore */
	const { state } = useContext(StockDetailContext);

	return (
		<PageHeader
			title={state.data.General?.Name}
			subTitle={state.data.General?.Type}
			tags={<Tag color="green">{state.data.General?.Type}</Tag>}
			extra={[
				<Button
					key="1"
					type="primary"
					href={state.data.General?.WebURL}
					target="_blank"
				>
					Web URL
				</Button>,
			]}
		>
			<Descriptions bordered>
				{Object.keys(state.data.Statistics).map((key) => {
					const value = state.data.Statistics[key];

					return (
						// eslint-disable-next-line react/jsx-key
						<Descriptions.Item label={key.split(/(?=[A-Z])/).join(" ")}>
							{key === "Explorer" ? (
								<Button type="link" href={value} target="_blank">
									{value}
								</Button>
							) : (
								<>{value}</>
							)}
						</Descriptions.Item>
					);
				})}
			</Descriptions>
		</PageHeader>
	);
}
