import React from "react";
import { Image } from "antd";

import "./Card.less";

export default function Card({ title, description, imageUrl }) {
	return (
		<div className="about-card">
			<Image preview={false} src={imageUrl} />
			<h3>{title}</h3>
			<p>{description}</p>
		</div>
	);
}
