import { UserOutlined } from '@ant-design/icons';
import React, { Fragment, useContext, useState } from 'react';
import { AssetSubType, AssetType, HoldingInput, BalanceInput } from '../../api/goals';
import SelectInput from '../form/selectinput';
import TextInput from '../form/textinput';
import { BTC, CRYPTO_TAB, NWContext, PM_TAB } from './NWContext';
import { getDefaultMember, getFamilyOptions } from './nwutils';
import PurchaseInput from './PurchaseInput';
import QuantityWithRate from './QuantityWithRate';

interface AddHoldingInputProps {
	setInput: Function;
	disableOk: Function;
	categoryOptions: any;
	subCategoryOptions?: any;
	purchase?: boolean;
	savingAcc?: boolean;
}

export default function AddHoldingInput({
	setInput,
	disableOk,
	categoryOptions,
	subCategoryOptions,
	purchase,
	savingAcc
}: AddHoldingInputProps) {
	const { allFamily, childTab, selectedMembers, selectedCurrency }: any = useContext(NWContext);
	const [ name, setName ] = useState<string>(childTab === PM_TAB ? '24' : '');
	const [ subtype, setSubtype ] = useState<string>(childTab === PM_TAB ? AssetSubType.Gold : BTC);
	const [ quantity, setQuantity ] = useState<number>(0);
	const [ memberKey, setMemberKey ] = useState<string>(getDefaultMember(allFamily, selectedMembers));
	const [ amount, setAmount ] = useState<number>(0);
	const [ month, setMonth ] = useState<number>(1);
	const [ year, setYear ] = useState<number>(new Date().getFullYear() - 5);
	const [individualName, setIndividualName] = useState<string>('');

	const changeName = (val: string) => {
		setName(val);
		let rec = getNewRec();
		rec.name = val;
		setInput(rec);
	};

	const changeIndividualName = (val: string)=> {
		setIndividualName(val);
		let rec = getNewRec();
		rec.name= val;
		setInput(rec);
	}

	const changeQuantity = (qty: number) => {
		setQuantity(qty);
		disableOk(qty <= 0);
		let rec = getNewRec();
		// @ts-ignore
		savingAcc ? rec.amt = qty : rec.qty = qty;
		setInput(rec);
	};

	const getNewRec = () => {
		if(savingAcc){
			let newRec : BalanceInput ={
				amt : quantity,
				curr: subtype,
				fIds: [ memberKey ],
				name: individualName
			}	
		return newRec;
		}
		let newRec: HoldingInput = {
			id: '',
			type: AssetType.A,
			subt: subtype,
			fIds: [ memberKey ],
			qty: quantity,
			curr: childTab === PM_TAB || childTab === CRYPTO_TAB ? 'USD' : selectedCurrency,
			name: name
		};
		if (purchase) {
			newRec.pur = [
				{
					amt: amount,
					month: month,
					year: year,
					qty: 1
				}
			];
		}
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
		let rec = getNewRec();
		// @ts-ignore
		(savingAcc ? rec.curr = subtype : rec.subt = subtype)
		return rec;
	};

	const changeMember = (key: string) => {
		setMemberKey(key);
		let rec = getNewRec();
		rec.fIds = [ key ];
		setInput(rec);
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
				{purchase ? (
					<PurchaseInput
						amount={amount}
						setAmount={setAmount}
						month={month}
						setMonth={setMonth}
						year={year}
						setYear={setYear}
					/>
				) : 
				savingAcc?
				<><p><TextInput pre={'Name'} value={individualName} changeHandler={changeIndividualName} size={'small'}/></p>
				<p><QuantityWithRate quantity={quantity} onChange={changeQuantity} subtype={subtype} name={''} /></p></>
				:
				(
					<QuantityWithRate quantity={quantity} onChange={changeQuantity} subtype={subtype} name={name} />
				)}
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
