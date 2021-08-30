import { Button, Col, InputNumber, Row } from 'antd';
import React, { useContext } from 'react';
import { AssetSubType, AssetType, HoldingInput } from '../../api/goals';
import SelectInput from '../form/selectinput';
import { NWContext, PALLADIUM, SILVER, PLATINUM } from './NWContext';
import { getFamilyOptions } from './nwutils';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';

interface DynamicHoldingInputProps {
	holdings: Array<HoldingInput>;
	changeHoldings: Function;
}

export default function DynamicHoldingInput({ holdings, changeHoldings }: DynamicHoldingInputProps) {
	const { allFamily }: any = useContext(NWContext);

	const newRec = () => {
		return {
			id: '',
			type: AssetType.A,
			subt: AssetSubType.Gold,
			fIds: [ Object.keys(allFamily)[0] ],
			qty: 0,
			curr: 'USD'
		};
	};

	const changeQty = (quantity: number, i: number) => {
		holdings[i].qty = quantity;
		changeHoldings([ ...holdings ]);
	};

	const changeSubtype = (subtype: string, i: number) => {
		holdings[i].subt = subtype;
		changeHoldings([ ...holdings ]);
	};

	const changeOwner = (ownerKey: string, i: number) => {
		holdings[i].fIds[0] = ownerKey;
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

	return (
		<Row justify="space-around">
			{holdings &&
				holdings[0] &&
				holdings.map((holding: HoldingInput, i: number) => (
					<Col span={24}>
						<Row justify="space-around">
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
							</Col>
							<Col>
								<InputNumber
									value={holding.qty}
									onChange={(quantity: number) => changeQty(quantity, i)}
									min={0}
									max={1000}
									step={0.1}
								/>
								{` grams`}
							</Col>
							<Col>
								<SelectInput
									pre="Owner"
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
						<Col span={24} className="fields-divider" />
					</Col>
				))}
			<Row justify="center">
				<Col>
					<Button shape="circle" type="primary" onClick={() => addHolding()} icon={<PlusOutlined />} />
				</Col>
			</Row>
		</Row>
	);
}
