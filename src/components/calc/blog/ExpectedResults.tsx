import React from "react";
import { List } from "antd";
import { BlogInputProps } from "../Layout";

export default function ExpectedResults({ elements }: BlogInputProps) {
	return (
		<List
			size="small"
			bordered
			dataSource={elements}
			renderItem={(item) => item ? <List.Item>{item}</List.Item> : null}
		/>
	);
}
