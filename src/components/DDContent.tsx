import React from "react";
import { Layout } from "antd";

interface DDContentProps {
	className?: string;
	whiteBg?: boolean;
	children: any;
}

export default function DDContent({
	className = "",
	whiteBg = false,
	children,
}: DDContentProps) {
	const { Content } = Layout;

	return (
		<div className={`${whiteBg ? "bg-white" : ""} ${className}`}>
			<Content className="dd-content">{children}</Content>
		</div>
	);
}
