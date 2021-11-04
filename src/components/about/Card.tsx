import React from "react";
import { Image } from "antd";

require("./Card.less");

interface CardProps {
	title: string;
	description: string;
	imageUrl: string;
}

export default function Card({ title, description, imageUrl }: CardProps) {
	return (
		<div className="about-card">
			<Image preview={false} src={imageUrl} />
			<h3>{title}</h3>
			<p>{description}</p>
		</div>
	);
}
