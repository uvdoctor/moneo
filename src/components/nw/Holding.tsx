import React, { Fragment, useContext, useState } from 'react';
import { Row, Col, Button, Badge, InputNumber, Tooltip } from 'antd';
import {
	DeleteOutlined,
	EditOutlined,
	ShoppingCartOutlined,
	SaveOutlined,
	CloseOutlined,
	UserOutlined,
	HourglassOutlined
} from '@ant-design/icons';

import './Holding.less';
import { toCurrency, toHumanFriendlyCurrency, toReadableNumber } from '../utils';
import { AssetType, HoldingInput } from '../../api/goals';
import { useEffect } from 'react';
import { getAssetSubTypes, getColourForAssetType } from './nwutils';
import { COLORS } from '../../CONSTANTS';
import { AppContext } from '../AppContext';
import { NWContext } from './NWContext';
import { faCoins, faHandHoldingUsd } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface HoldingProp {
	holding: HoldingInput;
	showPrice?: boolean;
	onDelete: Function;
	onChange?: Function;
}

export default function Holding({ holding, showPrice, onDelete, onChange }: HoldingProp) {
	const { insData }: any = useContext(AppContext);
	const { allFamily }: any = useContext(NWContext);
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

	const getInsTypeStr = (id: string) =>
		insData[id].itype ? `${insData[holding.id].itype} - ` : holding.id.startsWith('INF') ? 'Mutual Fund - ' : '';

	return (
		<Row className="holding" align="middle" justify="space-between" gutter={[ 5, 5 ]}>
			{showPrice && (
				<Col span={24}>
					<Row justify="space-between">
						<Col>
							{insData[holding.id] ? (
								`${getInsTypeStr(holding.id)}${assetSubTypes[insData[holding.id].subt]}`
							) : (
								<h4 style={{ color: COLORS.RED }}>Sorry, unable to find price for this one!</h4>
							)}
						</Col>
						{insData[holding.id] && (
							<Col>
								{insData[holding.id].rate && (
									<Tooltip title="Interest rate">
										&nbsp;&nbsp;
										<FontAwesomeIcon icon={faCoins} />
										{` ${insData[holding.id].rate}%`}
									</Tooltip>
								)}
								{insData[holding.id].my && (
									<Tooltip title="Maturity Year">
										&nbsp;&nbsp;
										<HourglassOutlined />
										{insData[holding.id].my}
									</Tooltip>
								)}
								{insData[holding.id].ytm && (
									<Tooltip title="Annualized return if you buy the bond today and hold it till maturity">
										&nbsp;&nbsp;
										<FontAwesomeIcon icon={faHandHoldingUsd} />
										{` ${insData[holding.id].ytm * 100}%`}
									</Tooltip>
								)}
							</Col>
						)}
						<Col>
							<UserOutlined />&nbsp;{allFamily[holding.fIds[0]].name}
						</Col>
					</Row>
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
