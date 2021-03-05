import React, { useState } from "react";
import { Row, Col, Button, Input, Badge } from "antd";
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
	isin?: any;
}

export default function Holding({ assetName, qty, isin }: HoldingProp) {
	const [isEditMode, setEditMode] = useState(false);

	function onEdit() {
		setEditMode(true);
	}

	function onCancel() {
		setEditMode(false);
	}

	function onDelete() {}
	return (
		<Row
			className="holding"
			align="middle"
			justify="space-between"
			gutter={[5, 5]}
		>
			<Col span={24}>{assetName}</Col>
			<Col>
				<Badge count={isin} />
			</Col>
			<Col>
				<Row align="middle">
					{isEditMode ? (
						<Col>
							<Input type="number" value={qty} size="small" />
						</Col>
					) : (
						<Col>
							<span className="quantity">
								<ShoppingCartOutlined /> {qty}
							</span>
						</Col>
					)}
					<Col>
						<Button
							type="link"
							icon={isEditMode ? <SaveOutlined /> : <EditOutlined />}
							onClick={isEditMode ? onCancel : onEdit}
						/>
						<Button
							type="link"
							icon={isEditMode ? <CloseOutlined /> : <DeleteOutlined />}
							onClick={isEditMode ? onCancel : onDelete}
							danger
						/>
					</Col>
				</Row>
			</Col>
		</Row>
	);
}
