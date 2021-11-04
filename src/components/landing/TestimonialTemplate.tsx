import React from "react";
import { Avatar } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { faQuoteLeft, faQuoteRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

require("./testimonials.less");

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
		</div>
	);
}
