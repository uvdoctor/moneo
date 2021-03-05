import React, { useState } from "react";
import { Row, Col, Button, Input } from "antd";
import {
	DeleteOutlined,
	EditOutlined,
	ShoppingCartOutlined,
	SaveOutlined,
	CloseOutlined,
} from "@ant-design/icons";

import "./Holding.less";

interface HoldingProp {
	assetName?: string;
	qty?: any;
}

export default function Holding({ assetName, qty }: HoldingProp) {
	const [isEditMode, setEditMode] = useState(false);

	function onEdit() {
		setEditMode(true);
	}

	function onCancel() {
		setEditMode(false);
	}

	function onDelete() {}
	return (
		<Row className="holding" align="middle" gutter={[10, 10]}>
			<Col flex="1 1 250px">
				<p>{assetName}</p>
				{!isEditMode ? (
					<span className="quantity">
						<ShoppingCartOutlined /> {qty}
					</span>
				) : (
					<Row gutter={[5, 5]}>
						<Col flex="1 1 210px">
							<Input value={qty} placeholder="Update quantity" />
						</Col>
						<Col flex="0 1 80px">
							<Button icon={<SaveOutlined />} type="primary" />
							<Button icon={<CloseOutlined />} onClick={onCancel} danger />
						</Col>
					</Row>
				)}
			</Col>
			{!isEditMode && (
				<Col flex="0 1 35px">
					<Button icon={<EditOutlined />} onClick={onEdit} />
					<Button icon={<DeleteOutlined />} onClick={onDelete} />
				</Col>
			)}
		</Row>
	);
}
