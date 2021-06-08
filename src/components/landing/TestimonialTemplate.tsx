import React from "react";
import { Avatar, Row, Col } from "antd";
import { UserOutlined } from "@ant-design/icons";

import "./testimonials.less";

interface TestimonialTemplateProps {
	title: string;
	content: string;
	name: string;
	location: string;
	imageLocation?: string;
}

export default function TestimonialTemplate(props: TestimonialTemplateProps) {
	return (
		<div className="client-testimonial">
			<h3>{props.title}</h3>
			<p>{props.content}</p>
			<Row align="middle">
				<Col span={5}>
					<Avatar size={80} src={props.imageLocation} icon={<UserOutlined />} />
				</Col>
				<Col span={19}>
					<hgroup>
						<h3>{props.name}</h3>
						<h4>{props.location}</h4>
					</hgroup>
				</Col>
			</Row>
		</div>
	);
}
