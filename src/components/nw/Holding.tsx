import React, { useState } from 'react';
import { Row, Col, Button, Badge, InputNumber } from 'antd';
import { DeleteOutlined, EditOutlined, ShoppingCartOutlined, SaveOutlined, CloseOutlined } from '@ant-design/icons';

import './Holding.less';
import { toReadableNumber } from '../utils';

interface HoldingProp {
	isin: string;
	data: any;
	onChange: Function;
}

export default function Holding({ isin, data, onChange }: HoldingProp) {
	const [ id, setID ] = useState<string | null>(isin);
	const [ isEditMode, setEditMode ] = useState(false);

	function onEdit() {
		setEditMode(true);
	}

	function onCancel() {
		setEditMode(false);
	}

	function onDelete() {
		delete data[isin];
		onChange(data);
		setID(null);
	}

	return (
		id ? <Row className="holding" align="middle" justify="space-between" gutter={[ 5, 5 ]}>
			<Col span={24}>{data[isin].name}</Col>
			<Col>
				<Badge count={isin} />
			</Col>
			<Col>
				<Row align="middle">
					{isEditMode ? (
						<Col>
							<InputNumber
								value={data[isin].quantity}
								size="small"
								onChange={(val) => {
									data[isin].quantity = val as number;
									onChange(data);
								}}
							/>
						</Col>
					) : (
						<Col>
							<span className="quantity">
								<ShoppingCartOutlined />{' '}
								{toReadableNumber(
									data[isin].quantity,
									('' + data[isin].quantity).includes('.') ? 3 : 0
								)}
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
		</Row> : null
	);
}
