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
						{props.title}
						{props.toggle ? 
							<>
								&nbsp;
								{props.toggle}
							</>
						: null}
					</h3>
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
