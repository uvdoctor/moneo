import { UserOutlined } from '@ant-design/icons';
import React, { Fragment, useContext, useState } from 'react';
import { AssetSubType, AssetType } from '../../api/goals';
import SelectInput from '../form/selectinput';
import { BTC, NWContext, PM_TAB } from './NWContext';
import { getDefaultMember, getFamilyOptions } from './nwutils';
import QuantityWithRate from './QuantityWithRate';

interface AddHoldingInputProps {
	setInput: Function;
	disableOk: Function;
	categoryOptions: any;
	subCategoryOptions?: any;
}

export default function AddHoldingInput({
	setInput,
	disableOk,
	categoryOptions,
	subCategoryOptions
}: AddHoldingInputProps) {
	
	const { allFamily, childTab, selectedMembers }: any = useContext(NWContext);
	const [ name, setName ] = useState<string>(childTab === PM_TAB ? '24' : '');
	const [ subtype, setSubtype ] = useState<string>(childTab === PM_TAB ? AssetSubType.Gold : BTC);
	const [ quantity, setQuantity ] = useState<number>(0);
	const [ memberKey, setMemberKey ] = useState<string>(getDefaultMember(allFamily, selectedMembers));

	const changeName = (val: string) => {
		setName(val);
		setInput(getNewRec(subtype, memberKey, quantity, val));
	};

	const changeQuantity = (qty: number) => {
		setQuantity(qty);
		disableOk(qty <= 0);
		setInput(getNewRec(subtype, memberKey, qty, name));
	};

	const getNewRec = (subtype: string, member: string, quantity: number, name: string) => {
		let newRec = {
			id: '',
			type: AssetType.A,
			subt: subtype,
			fIds: [ member ],
			qty: quantity,
			curr: 'USD',
			name: name
		};
		return newRec;
	};

	const changeSubtype = (subtype: string) => {
		setSubtype(subtype);
		if (subCategoryOptions) {
			let opts = subCategoryOptions[subtype];
			if (opts && Object.keys(opts).length && !opts[name]) {
				let defaultVal: string = Object.keys(opts)[0];
				setName(defaultVal);
			}
		}
		setInput(getNewRec(subtype, memberKey, quantity, name));
	};

	const changeMember = (key: string) => {
		setMemberKey(key);
		setInput(getNewRec(subtype, key, quantity, name));
	};

	return (
		<div style={{ textAlign: 'center' }}>
			<p>
				<SelectInput
					pre=""
					value={subtype}
					options={categoryOptions}
					changeHandler={(val: string) => changeSubtype(val)}
				/>
				{subCategoryOptions && (
					<Fragment>
						&nbsp;
						<SelectInput
							pre=""
							value={name as string}
							options={subCategoryOptions[subtype as string]}
							changeHandler={(val: string) => changeName(val)}
							post={subtype === AssetSubType.Gold ? 'karat' : ''}
						/>
					</Fragment>
				)}
			</p>
			<p>
				<QuantityWithRate quantity={quantity} onChange={changeQuantity} subtype={subtype} name={name} />
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
