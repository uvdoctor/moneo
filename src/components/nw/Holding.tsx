import React, { Fragment, useContext, useState } from 'react';
import { Row, Col, Button, Badge, InputNumber } from 'antd';
import { DeleteOutlined, EditOutlined, ShoppingCartOutlined, SaveOutlined, CloseOutlined } from '@ant-design/icons';

import './Holding.less';
import { toCurrency, toReadableNumber } from '../utils';
import { HoldingInput } from '../../api/goals';
import { NWContext } from './NWContext';

interface HoldingProp {
	holding: HoldingInput;
	showPrice?: boolean;
	onDelete: Function;
	onChange?: Function;
}

export default function Holding({ holding, showPrice, onDelete, onChange }: HoldingProp) {
	const { insPrices, setInsPrices }: any = useContext(NWContext);
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
						<Fragment>
							<Col>
								<InputNumber
									value={holding.qty}
									size="small"
									onChange={(val) => {
										holding.qty = val as number;
										if (onChange) onChange(holding);
									}}
								/>
							</Col>
							{showPrice && (
								<Fragment>
									<Col>&nbsp;x&nbsp;</Col>
									<Col>
										<InputNumber
											value={insPrices[holding.id] ? insPrices[holding.id] : 0}
											size="small"
											onChange={(val) => {
												insPrices[holding.id] = val;
												setInsPrices(insPrices);
											}}
										/>
									</Col>
								</Fragment>
							)}
						</Fragment>
					) : (
						<Col>
							<span className="quantity">
								<ShoppingCartOutlined />{' '}
								{toReadableNumber(holding.qty, ('' + holding.qty).includes('.') ? 3 : 0)}
								{showPrice &&
									` x ${toCurrency(
										insPrices[holding.id] ? insPrices[holding.id] : 0,
										holding.curr as string
									)} 
									= ${toCurrency(holding.qty * (insPrices[holding.id] ? insPrices[holding.id] : 0), holding.curr as string)}`}
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
