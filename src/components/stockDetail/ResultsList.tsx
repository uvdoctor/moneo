import { Table, Typography, Row, Col, Card } from "antd";
import { useFullScreenBrowser } from "react-browser-hooks";
import { isMobileDevice } from "../utils";

export default function ResultsList({ data, columns }: any) {
	const fsb = useFullScreenBrowser();
	const { Text } = Typography;

	return isMobileDevice(fsb) ? (
		<Card>
			{/* @ts-ignore */}
			{data.map(({ particulars, ...rest }: any) => (
				<div style={{ paddingBottom: "15px" }}>
					<Text strong>{particulars}</Text>
					{Object.keys(rest)
						.slice(0, 5)
						.map((key) => {
							return (
								<Row gutter={[10, 10]}>
									<Col xs={12} sm={6}>
										<Text>{key}</Text>
									</Col>
									<Col style={{ textAlign: "right" }} xs={12} sm={6}>
										<Text>{rest[key]}</Text>
									</Col>
								</Row>
							);
						})}
				</div>
			))}
		</Card>
	) : (
		<Table dataSource={data} columns={columns} pagination={false} />
	);
}
