import React, { ReactNode } from 'react';
import { Row, Col } from 'antd';
interface SectionProps {
	title?: any;
	footer?: any;
	toggle?: any;
	children?: ReactNode;
}

export default function Section(props: SectionProps) {
	return (
		<Row
			gutter={[
				15,
				15
			]}>
			{props.title && (
				<Col span={24}>
					<h3 className="steps-heading">
						<Row align="middle">
							{props.title}
							{props.toggle && (
								<span>
									&nbsp;
									{props.toggle}
								</span>
							)}
						</Row>
					</h3>
				</Col>
			)}
			<Col span={24}>
				<Row>
					{React.Children.map(
						props.children,
						(child: any, i: number) =>
							child ? (
								<Col xs={24} md={12} lg={8} xl={8} key={'section' + i}>
									{child}
								</Col>
							) : (
								<div />
							)
					)}
				</Row>
			</Col>
			{props.footer && <Col span={24}>{props.footer}</Col>}
		</Row>
	);
}
