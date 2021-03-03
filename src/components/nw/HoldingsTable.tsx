import React from "react";
import { Empty, Collapse, Input, Row, Col, Button, Tooltip, Space } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { useFullScreenBrowser } from "react-browser-hooks";
import { isMobileDevice } from "../utils";
import { toReadableNumber } from "../utils";

import "./HoldingsTable.less";

export default function HoldingsTable({ data, insNames }) {
	const fsb = useFullScreenBrowser();
	const { Panel } = Collapse;

	return Object.keys(data)?.length ? (
		<Collapse className="holdings-container" expandIconPosition="right">
			{Object.keys(data)?.map((key: string, i: number) => {
				const qty = toReadableNumber(
					data[key],
					("" + data[key]).includes(".") ? 3 : 0
				);

				return (
					<Panel
						key={i}
						header={
							isMobileDevice(fsb) ? (
								<>
									{insNames[key]}
									<div className="amount">₹ 150000</div>
									<div>{qty}</div>
								</>
							) : (
								insNames[key]
							)
						}
						extra={
							!isMobileDevice(fsb) && (
								<>
									<div className="amount">₹ 150000</div>
									<div>{qty}</div>
								</>
							)
						}
					>
						<Row
							gutter={[
								{ xs: 5, sm: 5, md: 10 },
								{ xs: 5, sm: 5, md: 10 },
							]}
						>
							<Col xs={24} sm={24} md={24}>
								{key}
							</Col>
							<Col xs={12} sm={12} md={8}>
								<Input value={qty} />
							</Col>
							<Col xs={12} sm={12} md={8}>
								<Input value={qty} />
							</Col>
							<Col xs={24} sm={24} md={8}>
								<Space>
									<Button type="primary">Save</Button>
									<Button type="primary" icon={<DeleteOutlined />} danger>
										Delete
									</Button>
								</Space>
							</Col>
						</Row>
					</Panel>
				);
			})}
		</Collapse>
	) : (
		<Empty description={<p>No data found.</p>} />
	);
}
