import { Button, Col, Row } from 'antd';
import React, { useContext, useEffect, useState } from 'react';
import { HoldingInput } from '../../api/goals';
import { AppContext } from '../AppContext';
import SelectInput from '../form/selectinput';
import { toHumanFriendlyCurrency } from '../utils';
import { NWContext, TAB } from './NWContext';
import { calculateValuation, getFamilyOptions, hasminimumCol } from './nwutils';
import { DeleteOutlined, UserOutlined, EditOutlined, SaveOutlined } from '@ant-design/icons';
import NumberInput from '../form/numberinput';

interface ValuationProps {
	data: Array<HoldingInput>;
	changeData: Function;
	record: HoldingInput;
	index: number;
}

export default function Valuation({ data, record, changeData, index }: ValuationProps) {
	const { childTab, npsData, selectedCurrency, allFamily }: any = useContext(NWContext);
	const { ratesData, discountRate, userInfo }: any = useContext(AppContext);
	const { SAV, OTHER, ANGEL, CREDIT } = TAB;
	const [ valuation, setValuation ] = useState<number>(0);
	const [ isEditMode, setIsEditMode ] = useState<boolean>(false);

	const changeOwner = (ownerKey: string, i: number) => {
		data[i].fId = ownerKey;
		changeData([ ...data ]);
	};

	useEffect(
		() => {
			const valuation = calculateValuation(
				childTab,
				record,
				userInfo,
				discountRate,
				ratesData,
				selectedCurrency,
				npsData
			);
			setValuation(valuation);
		},
		[ childTab, data, record, discountRate ]
	);

	const removeHolding = (i: number) => {
		data.splice(i, 1);
		changeData([ ...data ]);
	};

	const changeAmt = (amt: number) => {
		record.amt = amt;
		changeData([ ...data ]);
	};
	const hasAmountAsValuation = (childTab: string) => [ ANGEL, SAV, CREDIT, OTHER ].includes(childTab);

	return (
		<Row gutter={[ 10, 10 ]} align='middle'>
			<Col>
				<Row align="middle">
					<Col>
						{hasAmountAsValuation(childTab) && isEditMode ? (
							<NumberInput
								pre=""
								value={record.amt as number}
								changeHandler={changeAmt}
								currency={record.curr as string}
							/>
						) : (
							<label>{toHumanFriendlyCurrency(valuation, selectedCurrency)}</label>
						)}
					</Col>
					{hasAmountAsValuation(childTab) && (
						<Col>
							<Button
								type="link"
								icon={isEditMode ? <SaveOutlined /> : <EditOutlined />}
								onClick={() => (isEditMode ? setIsEditMode(false) : setIsEditMode(true))}
							/>
						</Col>
					)}
					<Col>
						<Button type="link" onClick={() => removeHolding(index)} danger icon={<DeleteOutlined />} />
					</Col>
				</Row>
			</Col>
			{hasminimumCol(childTab) && (
				<Col>
					<Row>
						<Col>
							<UserOutlined />
						</Col>
						<Col>
							{Object.keys(getFamilyOptions(allFamily)).length > 1 ? (
								<SelectInput
									pre=""
									value={record.fId ? record.fId : ''}
									options={getFamilyOptions(allFamily)}
									changeHandler={(key: string) => changeOwner(key, index)}
								/>
							) : (
								<label>{getFamilyOptions(allFamily)[record.fId]}</label>
							)}
						</Col>
					</Row>
				</Col>
			)}
		</Row>
	);
}
