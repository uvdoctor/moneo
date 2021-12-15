import React, { Fragment, useContext, useState } from 'react';
import { Row, Col, Button, Badge, InputNumber, Tooltip, Rate } from 'antd';
import {
	DeleteOutlined,
	EditOutlined,
	ShoppingCartOutlined,
	SaveOutlined,
	CloseOutlined,
	UserOutlined,
	HourglassOutlined
} from '@ant-design/icons';

require('./Holding.less');
import { toCurrency, toHumanFriendlyCurrency, toReadableNumber } from '../utils';
import { AssetType, InstrumentInput } from '../../api/goals';
import { useEffect } from 'react';
import { getColourForAssetType } from './nwutils';
import { COLORS } from '../../CONSTANTS';
import { LOCAL_INS_DATA_KEY } from '../AppContext';
import { NWContext } from './NWContext';
import { faCoins, faHandHoldingUsd } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import simpleStorage from 'simplestorage.js';

interface HoldingProp {
	holding: InstrumentInput;
	onDelete: Function;
	onChange?: Function;
}

export default function Holding({ holding, onDelete, onChange }: HoldingProp) {
	const insData = simpleStorage.get(LOCAL_INS_DATA_KEY);
	const { allFamily }: any = useContext(NWContext);
	const [
		price,
		setPrice
	] = useState<number>(insData[holding.id] ? insData[holding.id].price : 0);
	const [
		total,
		setTotal
	] = useState<number>(holding.qty * price);
	const [
		isEditMode,
		setEditMode
	] = useState(false);

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
		[
			price,
			holding.qty
		]
	);

	return (
		<Row
			className="holding"
			align="middle"
			justify="space-between"
			gutter={[
				5,
				5
			]}>
			<Col span={24}>
				<Row justify="space-between">
					<Col>
						{!insData[holding.id] && (
							<h4 style={{ color: COLORS.RED }}>Sorry, unable to find price for this one!</h4>
						)}
					</Col>
					{insData[holding.id] &&
					allFamily[holding.fId] &&
					insData[holding.id].type !== AssetType.H && (
						<Col>
							{insData[holding.id].rate &&
							insData[holding.id].rate !== -1 && (
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
								<Tooltip title="Annual rate of return of this bond if it is bought today and held till maturity">
									&nbsp;&nbsp;
									<FontAwesomeIcon icon={faHandHoldingUsd} />
									{` ${insData[holding.id].ytm * 100}%`}
								</Tooltip>
							)}
							{insData[holding.id].cr && (
								<Tooltip title="Credit rating">
									&nbsp;&nbsp;
									<Rate value={4} />
									{insData[holding.id].crstr}
								</Tooltip>
							)}
						</Col>
					)}
					{allFamily[holding.fId] && (
						<Col>
							<UserOutlined />&nbsp;{allFamily[holding.fId].name}
						</Col>
					)}
				</Row>
			</Col>
			<Col span={24}>
				<Row justify="space-between">
					<Col>{insData[holding.id] ? insData[holding.id].name : holding.id}</Col>
					<Col className="quantity">
						<strong>{toHumanFriendlyCurrency(total, holding.curr as string)}</strong>
					</Col>
				</Row>
			</Col>
			<Col>
				<Badge
					count={holding.id}
					style={{
						color: COLORS.WHITE,
						backgroundColor: getColourForAssetType(
							insData[holding.id] ? insData[holding.id].type : '' as AssetType
						)
					}}
				/>
			</Col>
			<Col>
				<Row align="middle">
					{isEditMode ? (
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
								{toCurrency(price, holding.curr as string, true)}
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
