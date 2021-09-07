import { UserOutlined } from '@ant-design/icons';
import { InputNumber } from 'antd';
import React, { useContext, useState } from 'react';
import { AssetSubType, HoldingInput } from '../../api/goals';
import { AppContext } from '../AppContext';
import SelectInput from '../form/selectinput';
import { initOptions, toCurrency } from '../utils';
import { NWContext, PALLADIUM, PLATINUM, SILVER } from './NWContext';
import { getCommodityRate, getFamilyOptions } from './nwutils';

interface AddHoldingInputProps {
	input: HoldingInput;
    disableOk: Function;
}

export default function AddHoldingInput({ input, disableOk }: AddHoldingInputProps) {
	const { ratesData }: any = useContext(AppContext);
	const { selectedCurrency, allFamily }: any = useContext(NWContext);
	const [ name, setName ] = useState<string>(input.name as string);
	const [ subtype, setSubtype ] = useState<string>(input.subt as string);
	const [ quantity, setQuantity ] = useState<number>(input.qty);
	const [ memberKey, setMemberKey ] = useState<string>(input.fIds[0]);
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

	const changeName = (val: string) => {
		setName(val);
		input.name = val;
	};

	const changeQuantity = (qty: number) => {
		setQuantity(qty);
		input.qty = qty;
        disableOk(qty <= 0);
	};

	const changeSubtype = (subtype: string) => {
        input.subt = subtype;
		setSubtype(subtype);
        let opts = options[subtype];
		if (!opts[name]) {
            let defaultVal: string = Object.keys(opts)[0];
            setName(defaultVal);
            input.name = defaultVal;
        }
	};

	const changeMember = (key: string) => {
		setMemberKey(key);
		input.fIds[0] = key;
	};

	return (
		<div style={{textAlign: "center"}}>
			<p>
				<SelectInput
					pre=""
					value={input.subt as string}
					options={{
						[AssetSubType.Gold]: 'Gold',
						[SILVER]: 'Silver',
						[PLATINUM]: 'Platinum',
						[PALLADIUM]: 'Palladium'
					}}
					changeHandler={(val: string) => changeSubtype(val)}
				/>
				&nbsp;
				<SelectInput
					pre=""
					value={input.name as string}
					options={options[subtype as string]}
					changeHandler={(val: string) => changeName(val)}
					post={subtype === AssetSubType.Gold ? 'karat' : ''}
				/>
			</p>
			<p>
				<InputNumber
					value={quantity}
					onChange={(quantity: number) => changeQuantity(quantity)}
					min={0}
					max={1000}
					step={0.1}
					size="small"
				/>
				{` grams x ${toCurrency(
					getCommodityRate(ratesData, subtype as string, name as string, selectedCurrency),
					selectedCurrency
				)} = ${toCurrency(
					quantity * getCommodityRate(ratesData, subtype as string, name as string, selectedCurrency),
					selectedCurrency
				)}`}
			</p>
			<p>
				<SelectInput
					pre={<UserOutlined />}
					value={memberKey}
					options={getFamilyOptions(allFamily)}
					changeHandler={(key: string) => changeMember(key)}
				/>
			</p>
		</div>
	);
}
