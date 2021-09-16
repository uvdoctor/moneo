import React from "react";
import { Avatar, Row, Col } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { faQuoteLeft, faQuoteRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import "./testimonials.less";

interface TestimonialTemplateProps {
	title: string;
	content: string;
	name: string;
	location: string;
	imageLocation: string;
}

export default function TestimonialTemplate(props: TestimonialTemplateProps) {
	return (
		<div className="client-testimonial">
			<div className="client-details">
				<Avatar size={120} src={props.imageLocation} icon={<UserOutlined />} />
				<hgroup>
					<h3>{props.name}</h3>
					<h4>{props.location}</h4>
				</hgroup>
			</div>
			{/*<h3>{props.title}</h3>*/}

			<p>
				<FontAwesomeIcon icon={faQuoteLeft} />
				{props.content}
				<FontAwesomeIcon icon={faQuoteRight} />
			</p>

			{/*<Row align="middle">
				<Col xs={9} lg={5}>
					<Avatar size={80} src={props.imageLocation} icon={<UserOutlined />} />
				</Col>
				<Col xs={15} lg={19}>
					<hgroup>
						<h3>{props.name}</h3>
						<h4>{props.location}</h4>
					</hgroup>
				</Col>
			</Row>*/}
		</div>
	);
}
