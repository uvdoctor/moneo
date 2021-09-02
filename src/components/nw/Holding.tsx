import React, { Fragment, useContext, useState } from 'react';
import { Row, Col, Button, Badge, InputNumber } from 'antd';
import { DeleteOutlined, EditOutlined, ShoppingCartOutlined, SaveOutlined, CloseOutlined } from '@ant-design/icons';

import './Holding.less';
import { toCurrency, toHumanFriendlyCurrency, toReadableNumber } from '../utils';
import { AssetType, HoldingInput } from '../../api/goals';
import { useEffect } from 'react';
import { getAssetSubTypes, getColourForAssetType } from './nwutils';
import { COLORS } from '../../CONSTANTS';
import { AppContext } from '../AppContext';

interface HoldingProp {
	holding: HoldingInput;
	showPrice?: boolean;
	onDelete: Function;
	onChange?: Function;
}

export default function Holding({ holding, showPrice, onDelete, onChange }: HoldingProp) {
	const { insData }: any = useContext(AppContext);
	const [ price, setPrice ] = useState<number>(insData[holding.id] ? insData[holding.id].price : 0);
	const [ total, setTotal ] = useState<number>(holding.qty * price);
	const [ isEditMode, setEditMode ] = useState(false);
	const assetSubTypes: any = getAssetSubTypes();

	function onEdit() {
		setEditMode(true);
	}

	function onCancel() {
		setEditMode(false);
	}

	useEffect(
		() => {
			setTotal(holding.qty * price);
		},
		[ price ]
	);

	return (
		<Row className="holding" align="middle" justify="space-between" gutter={[ 5, 5 ]}>
			{showPrice &&
			insData[holding.id] && (
				<Col>
					{insData[holding.id].itype ? (
						`${insData[holding.id].itype} - `
					) : holding.id.startsWith('INF') ? (
						'Mutual Fund - '
					) : (
						''
					)}
					{assetSubTypes[insData[holding.id].subt]}
				</Col>
			)}
			<Col span={24}>
				<Row justify="space-between">
					<Col>{holding.name}</Col>
					{showPrice && (
						<Col className="quantity">
							<strong>{toHumanFriendlyCurrency(total, holding.curr as string)}</strong>
						</Col>
					)}
				</Row>
			</Col>
			<Col>
				<Badge
					count={holding.id}
					style={
						showPrice ? (
							{ color: COLORS.WHITE, backgroundColor: getColourForAssetType(holding.type as AssetType) }
						) : (
							{}
						)
					}
				/>
			</Col>
			<Col>
				<Row align="middle">
					{isEditMode ? (
						<Fragment>
							{showPrice && (
								<Fragment>
									<Col>
										<InputNumber
											value={price}
											size="small"
											onChange={(val) => {
												setPrice(val);
											}}
										/>
									</Col>
									<Col>&nbsp;</Col>
									<ShoppingCartOutlined />{' '}
								</Fragment>
							)}
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
						</Fragment>
					) : (
						<Col>
							<span className="quantity">
								{showPrice && `${toCurrency(price, holding.curr as string, true)} `}
								<ShoppingCartOutlined />{' '}
								{toReadableNumber(holding.qty, ('' + holding.qty).includes('.') ? 3 : 0)}
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
