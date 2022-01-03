import React, { ReactNode } from "react";
import { Row, Col } from "antd";
interface SectionProps {
	title?: any;
	footer?: any;
	toggle?: any;
	manualInput?: any;
	manualMode?: number;
	videoSrc?: string;
	children?: ReactNode;
}

export default function Section(props: SectionProps) {
	return (
		<Row gutter={[15, 15]}>
			{props.title && (
				<Col span={24}>
					<h3 className="steps-heading">
						{typeof props.title === "string" ? `${props.title} ` : props.title}
					</h3>
				</Col>
			)}
			{props.toggle && (
				<Col xs={24} sm={24} md={12} lg={8} style={{ marginBottom: "0.5rem" }}>
					{props.toggle}
				</Col>
			)}
			{props.manualMode && props.manualMode > 0 ? (
				<Col xs={24} sm={24} md={12} lg={8}>
					{props.manualInput}
				</Col>
			) : (
				React.Children.map(props.children, (child: any, i: number) =>
					child ? (
						<Col xs={24} sm={24} md={12} lg={8} key={"section" + i}>
							{child}
						</Col>
					) : (
						<div />
					)
				)
			)}
			{props.footer && <Col span={24}>{props.footer}</Col>}
		</Row>
	);
}
