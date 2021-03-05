import React, { Fragment, useState } from 'react';
import { Row, Col, Button, Input, Badge } from 'antd';
import { DeleteOutlined, EditOutlined, ShoppingCartOutlined, SaveOutlined, CloseOutlined } from '@ant-design/icons';

import './Holding.less';

interface HoldingProp {
	assetName?: string;
	qty?: any;
	isin?: any;
}

export default function Holding({ assetName, qty, isin }: HoldingProp) {
	const [ isEditMode, setEditMode ] = useState(false);

	function onEdit() {
		setEditMode(true);
	}

	function onCancel() {
		setEditMode(false);
	}

	function onDelete() {}
	return (
		<Fragment>
			{/*<Row className="holding" align="middle" gutter={[10, 10]}>
			<Col flex="1 1 200px">
				<Row
					align="middle"
					gutter={[
						{ xs: 0, sm: 0, md: 15 },
						{ xs: 0, sm: 0, md: 15 },
					]}
				>
					<Col xs={24} sm={24} md={12}>
						<p>{assetName}</p>
						<Badge count={isin} />
					</Col>
					<Col xs={24} sm={24} md={12}>
						{!isEditMode ? (
							<Row gutter={[10, 10]}>
								<Col xs={24} sm={24} md={12}>
									<span className="quantity">
										<ShoppingCartOutlined /> {qty}
									</span>
								</Col>
								<Col xs={24} sm={24} md={12}>
									<p>₹ 150000</p>
								</Col>
							</Row>
						) : (
							<Row className="edit-qty-container" gutter={[5, 5]}>
								<Col flex="1 1 176px">
									<Input
										type="number"
										value={qty}
										placeholder="Update quantity"
									/>
								</Col>
								<Col flex="0 1 80px">
									<Button type="link" icon={<SaveOutlined />} />
									<Button
										type="link"
										icon={<CloseOutlined />}
										onClick={onCancel}
										danger
									/>
								</Col>
							</Row>
						)}
					</Col>
				</Row>
			</Col>
			{!isEditMode && (
				<Col flex="0 1 35px">
					<Button type="link" icon={<EditOutlined />} onClick={onEdit} />
					<Button
						type="link"
						icon={<DeleteOutlined />}
						onClick={onDelete}
						danger
					/>
				</Col>
			)}
			</Row>*/}
			<Row gutter={[ 10, 10 ]}>
				{assetName}
			</Row>
			<Row className="holding" align="middle" justify="space-between">
				<Col>
					<Badge count={isin} />
				</Col>
				<Col>
					{isEditMode ? (
						<Input type="number" value={qty} size="small" />
					) : (
						<span className="quantity">
							<ShoppingCartOutlined /> {qty}
						</span>
					)}
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
		</Fragment>
	);
}
