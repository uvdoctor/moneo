import { Col, Collapse, Row } from "antd";
import React, { Fragment } from "react";
import Image from "next/image";
import { BlogInputProps } from "../Layout";

export default function ExpectedResults({ elements }: BlogInputProps) {
	const { Panel } = Collapse;

	return (
		<Fragment>
			{elements.map((result: any, i: number) =>
				result ? (
					<Collapse defaultActiveKey={["0"]}>
						<Panel header={result.title} key={"" + i}>
							<Row gutter={[20, 20]}>
								<Col xs={24} sm={12} md={10} lg={8} xl={6} xxl={5}>
									<Image
										src={result.imgSrc}
										width={result.imgWidth}
										height={result.imgHeight}
										alt={result.imgAlt}
									/>
								</Col>
								<Col xs={24} sm={12} md={14} lg={16} xl={18} xxl={19}>
									<p>{result.content}</p>
								</Col>
							</Row>
						</Panel>
					</Collapse>
				) : null
			)}
		</Fragment>
	);
}
