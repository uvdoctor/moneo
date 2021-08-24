import React, { useContext, useState } from 'react';
import { Row, Col, Button, Badge, InputNumber } from 'antd';
import { DeleteOutlined, EditOutlined, ShoppingCartOutlined, SaveOutlined, CloseOutlined } from '@ant-design/icons';

import './Holding.less';
import { toReadableNumber } from '../utils';
import { HoldingInput } from '../../api/goals';
import { NWContext } from './NWContext';

interface HoldingProp {
	holding: HoldingInput;
	showPrice?: boolean;
	onDelete: Function;
	onChange?: Function;
}

export default function Holding({ holding, showPrice, onDelete, onChange }: HoldingProp) {
	const { insPrices }: any = useContext(NWContext);
	const [ isEditMode, setEditMode ] = useState(false);

	function onEdit() {
		setEditMode(true);
	}

	function onCancel() {
		setEditMode(false);
	}

	return (
		<Row className="holding" align="middle" justify="space-between" gutter={[ 5, 5 ]}>
			<Col span={24}>{holding.name}</Col>
			<Col>
				<Badge count={holding.id} />
			</Col>
			<Col>
				<Row align="middle">
					{isEditMode ? (
						<Col>
							<InputNumber
								value={holding.qty}
								size="small"
								onChange={(val) => {
									holding.qty = val as number;
									if(onChange) onChange(holding);
								}}
							/>
						</Col>
					) : (
						<Col>
							<span className="quantity">
								<ShoppingCartOutlined />{' '}
								{toReadableNumber(holding.qty, ('' + holding.qty).includes('.') ? 3 : 0)}
								{showPrice ? ` x ${toReadableNumber(insPrices[holding.id] ? insPrices[holding.id] : 0, 2)}` : ''}
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
							onClick={() => (isEditMode ? onCancel() : onDelete(holding.id))}
							danger
						/>
					</Col>
				</Row>
			</Col>
		</Row>
	);
}
