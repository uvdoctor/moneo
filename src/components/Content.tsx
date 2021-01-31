import React from "react";
import { Layout } from "antd";

interface ContentProps {
	className?: string;
	whiteBg?: boolean;
	children: any;
}

export default function Content({
	className = "",
	whiteBg = false,
	children,
}: ContentProps) {
	const { Content } = Layout;

	return (
		<div className={`${whiteBg ? "bg-white" : ""} ${className}`}>
			<Content className="dd-content">{children}</Content>
		</div>
	);
}
