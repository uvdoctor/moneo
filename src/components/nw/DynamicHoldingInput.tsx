import { Button, Col, InputNumber, Row } from 'antd';
import React, { Fragment, useContext, useEffect } from 'react';
import { AssetSubType, AssetType, HoldingInput } from '../../api/goals';
import SelectInput from '../form/selectinput';
import { NWContext, PALLADIUM, SILVER, PLATINUM } from './NWContext';
import { getCommodityRate, getFamilyOptions } from './nwutils';
import { PlusOutlined, DeleteOutlined, UserOutlined } from '@ant-design/icons';
import { initOptions, toCurrency } from '../utils';
import { stringType } from 'aws-sdk/clients/iam';
import { AppContext } from '../AppContext';

interface DynamicHoldingInputProps {
	holdings: Array<HoldingInput>;
	changeHoldings: Function;
}

export default function DynamicHoldingInput({ holdings, changeHoldings }: DynamicHoldingInputProps) {
	const { ratesData }: any = useContext(AppContext);
	const { allFamily, selectedCurrency }: any = useContext(NWContext);
	const options: any = {
		[AssetSubType.Gold]: initOptions(8, 16),
		[SILVER]: {
			'100': 'Pure',
			'95.8': 'Brittania (95.8%)',
			'92.5': 'Sterling (92.5%)',
			'90': 'Coin (90%)',
			'80': 'Jewellery (80%)'
		},
		[PLATINUM]: {
			'100': 'Pure',
			'95': '95%',
			'90': '90%',
			'85': '85%',
			'80': '80%',
			'50': '50%'
		},
		[PALLADIUM]: {
			'100': 'Pure',
			'95': '95%',
			'90%': '90%',
			'85': '85%',
			'80': '80%',
			'50': '50%'
		}
	};

	const newRec = () => {
		return {
			id: '',
			type: AssetType.A,
			subt: AssetSubType.Gold,
			fIds: [ Object.keys(allFamily)[0] ],
			qty: 0,
			curr: 'USD',
			name: '24'
		};
	};

	const changeQty = (quantity: number, i: number) => {
		holdings[i].qty = quantity;
		changeHoldings([ ...holdings ]);
	};

	const changeSubtype = (subtype: string, i: number) => {
		holdings[i].subt = subtype;
		let opts = options[subtype];
		if (!opts[holdings[i].name as string]) holdings[i].name = Object.keys(opts)[0];
		changeHoldings([ ...holdings ]);
	};

	const changeOwner = (ownerKey: string, i: number) => {
		holdings[i].fIds[0] = ownerKey;
		changeHoldings([ ...holdings ]);
	};

	const changePurity = (purity: string, i: number) => {
		holdings[i].name = purity;
		changeHoldings([ ...holdings ]);
	};

	const addHolding = () => {
		holdings.push(newRec());
		changeHoldings([ ...holdings ]);
	};

	const removeHolding = (i: number) => {
		holdings.splice(i, 1);
		changeHoldings([ ...holdings ]);
	};

	useEffect(
		() => {
			
		},
		[ holdings ]
	);

	return (
		<Fragment>
			{holdings &&
				holdings[0] &&
				holdings.map((holding: HoldingInput, i: number) => (
					<Row>
						<Col span={24}>
							<Row justify="space-between">
								<Col>
									<SelectInput
										pre=""
										value={holding.subt as string}
										options={{
											[AssetSubType.Gold]: 'Gold',
											[SILVER]: 'Silver',
											[PLATINUM]: 'Platinum',
											[PALLADIUM]: 'Palladium'
										}}
										changeHandler={(val: string) => changeSubtype(val, i)}
									/>
									&nbsp;
									<SelectInput
										pre=""
										value={holding.name as string}
										options={options[holding.subt as string]}
										changeHandler={(val: string) => changePurity(val, i)}
										post={holding.subt === AssetSubType.Gold ? 'karat' : ''}
									/>
								</Col>
								<Col>
									<InputNumber
										value={holding.qty}
										onChange={(quantity: number) => changeQty(quantity, i)}
										min={0}
										max={1000}
										step={0.1}
										size="small"
									/>
									{` grams x ${toCurrency(
										getCommodityRate(
											ratesData,
											holdings[i].subt as stringType,
											holdings[i].name as string,
											selectedCurrency
										),
										selectedCurrency
									)} = ${toCurrency(
										holdings[i].qty *
											getCommodityRate(
												ratesData,
												holdings[i].subt as stringType,
												holdings[i].name as string,
												selectedCurrency
											),
										selectedCurrency
									)}`}
								</Col>
								<Col>
									<SelectInput
										pre={<UserOutlined />}
										value={holding.fIds[0]}
										options={getFamilyOptions(allFamily)}
										changeHandler={(key: string) => changeOwner(key, i)}
										post={
											<Button type="link" onClick={() => removeHolding(i)} danger>
												<DeleteOutlined />
											</Button>
										}
									/>
								</Col>
							</Row>
						</Col>
						<Col span={24} className="fields-divider" />
					</Row>
				))}
			<Row justify="center">
				<Col>
					<Button shape="circle" type="primary" onClick={() => addHolding()} icon={<PlusOutlined />} />
				</Col>
			</Row>
		</Fragment>
	);
}
