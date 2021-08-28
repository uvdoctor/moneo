import { Button, Col, Row } from 'antd';
import React, { useContext, useEffect, useState } from 'react';
import { AssetType, HoldingInput } from '../../api/goals';
import NumberInput from '../form/numberinput';
import SelectInput from '../form/selectinput';
import { NWContext } from './NWContext';
import { getFamilyOptions } from './nwutils';
import { DeleteOutlined } from '@ant-design/icons';

interface DynamicHoldingInputProps {
    holding: HoldingInput;
	holdings: Array<HoldingInput>;
	subType: string;
	changeHoldings: Function;
	rate?: number;
}

export default function DynamicHoldingInput({
    holding,
	holdings,
	subType,
	changeHoldings,
	rate
}: DynamicHoldingInputProps) {
	const { allFamily }: any = useContext(NWContext);
	const [ quantity, setQuantity ] = useState<number>(holding ? holding.qty : 0);
	const [ value, setValue ] = useState<number>(rate ? quantity * rate : 0);
	const [ memberKey, setMemberKey ] = useState<string>(holding ? holding.fIds[0] : Object.keys(allFamily)[0]);

    const findMatchingHolding = () => holdings.filter(
        (holding: HoldingInput) =>
            holding.fIds[0] === memberKey && holding.type === AssetType.A && holding.subt === subType
    )[0];

	useEffect(
		() => {
			let existingEntry = findMatchingHolding();
			if (existingEntry && existingEntry.qty !== quantity) {
				existingEntry.qty = quantity;
			} /*else {
                holdings.push({
                    id: AssetType.A+"-"+subType+"-"+memberKey,
                    type: AssetType.A,
                    subt: subType as AssetSubType,
                    fIds: [memberKey],
                    qty: quantity
                })
            }*/
			//changeHoldings([ ...holdings ]);
		},
		[ quantity, memberKey ]
	);

	useEffect(
		() => {
			if (rate) setValue(quantity * rate);
		},
		[ quantity ]
	);

    const removeHolding = () => {
        for(let i = 0; i < holdings.length; i++) {
            let holding = holdings[i];
            if(holding.type === AssetType.A && holding.subt === subType && holding.fIds[0] === memberKey) {
                holdings.splice(i, 1);
                changeHoldings([...holdings]);
            }
        }
    }

	return (
		<Row justify="space-around">
			<Col>
				<NumberInput
					pre="Quantity"
					value={quantity}
					changeHandler={setQuantity}
					min={0}
					max={1000}
					step={0.1}
					unit="grams"
				/>
			</Col>
			<Col>
				<SelectInput
					pre="Owned by"
					value={memberKey}
					options={getFamilyOptions(allFamily)}
					changeHandler={setMemberKey}
                    post={
                        <Button type="link" onClick={() => removeHolding()} danger>
                            <DeleteOutlined />
                        </Button>
                    }
				/>
			</Col>
		</Row>
	);
}
