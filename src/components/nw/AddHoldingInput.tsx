import { UserOutlined } from '@ant-design/icons';
import React, { Fragment, useContext, useEffect, useState } from 'react';
import { AssetSubType, AssetType, HoldingInput } from '../../api/goals';
import NumberInput from '../form/numberinput';
import SelectInput from '../form/selectinput';
import TextInput from '../form/textinput';
import { BTC, CRYPTO_TAB, EPF_TAB, NPS_TAB, NWContext, OTHER_TAB, PM_TAB, PPF_TAB, SAV_TAB, VPF_TAB } from './NWContext';
import { getDefaultMember, getFamilyOptions } from './nwutils';
import PurchaseInput from './PurchaseInput';
import QuantityWithRate from './QuantityWithRate';

interface AddHoldingInputProps {
	setInput: Function;
	disableOk: Function;
	categoryOptions: any;
	subCategoryOptions?: any;
	purchase?: boolean;
}

export default function AddHoldingInput({
	setInput,
	disableOk,
	categoryOptions,
	subCategoryOptions,
	purchase
}: AddHoldingInputProps) {
	const { allFamily, childTab, selectedMembers, selectedCurrency, addHoldings }: any = useContext(NWContext);
	const [ subtype, setSubtype ] = useState<string>(childTab === PM_TAB ? AssetSubType.Gold : childTab === NPS_TAB ? 'L' : BTC);
	const [ name, setName ] = useState<string>('');
	const [ quantity, setQuantity ] = useState<number>(0);
	const [ memberKey, setMemberKey ] = useState<string>(getDefaultMember(allFamily, selectedMembers));
	const [ chg, setChg ] = useState<number>(0);
	const [ amount, setAmount ] = useState<number>(0);
	const [ month, setMonth ] = useState<number>(1);
	const [ year, setYear ] = useState<number>(new Date().getFullYear() - 5);

	const changeName = (val: string) => {
		setName(val);
		let rec = getNewRec();
		rec.name = val;
		setInput(rec);
	};

	const changeChg = (val: number) => {
		setChg(val);
		let rec = getNewRec();
		rec.chg = val;
		setInput(rec);
	};

	const changeQuantity = (qty: number) => {
		setQuantity(qty);
		disableOk(qty <= 0);
		let rec = getNewRec();
		rec.qty = qty;
		setInput(rec);
	};

	const getNewRec = () => {
		if (childTab === SAV_TAB) {
			let newRec: HoldingInput = {
				id: '',
				qty: quantity,
				curr: selectedCurrency,
				name: name,
				fIds: [ memberKey ]
			};
			return newRec;
		}
		if (childTab === OTHER_TAB) {
			let newRec: HoldingInput = {
				id: '',
				qty: quantity,
				subt: subtype,
				fIds: [ memberKey ],
				name: name,
				curr: selectedCurrency
			};
			return newRec;
		}
		if (childTab === PPF_TAB || childTab === EPF_TAB || childTab === VPF_TAB ) {
			let newRec: HoldingInput = {
				id: '',
				qty: quantity,
				curr: selectedCurrency,
				name: name,
				fIds: [ memberKey ],
				chg: chg,
				chgF: childTab === PPF_TAB ? 1 : 12,
				type: AssetType.F,
				subt: childTab
			};
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
		childTab === SAV_TAB ? (rec.curr = subtype) : (rec.subt = subtype);
		return rec;
	};

	const changeMember = (key: string) => {
		setMemberKey(key);
		let rec = getNewRec();
		rec.fIds = [ key ];
		setInput(rec);
	};

	useEffect(() => {
		setName(subCategoryOptions ? Object.keys(subCategoryOptions[subtype])[0] : '')
	// eslint-disable-next-line react-hooks/exhaustive-deps
	},[ addHoldings ]);

	return (
		<div style={{ textAlign: 'center' }}>
			<p>
				{categoryOptions && <SelectInput
					pre=""
					value={subtype}
					options={categoryOptions}
					changeHandler={(val: string) => changeSubtype(val)}
				/>}
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
				childTab===SAV_TAB || childTab === OTHER_TAB ?
				<><p><TextInput pre={'Name'} value={name} changeHandler={changeName} size={'middle'}/></p>
				<p><NumberInput pre={'Amount'} min={0} max={10000} value={quantity} changeHandler={changeQuantity} currency={selectedCurrency} step={1}  /></p>
				</>
				: 
				childTab === PPF_TAB || childTab === EPF_TAB || childTab === VPF_TAB ? 
				<><p><TextInput pre={'Name'} value={name} changeHandler={changeName} size={'middle'}/></p>
				<p><NumberInput pre={'Rate'} changeHandler={changeChg} post={'%'} min={0} max={50} value={chg} step={0.1}/></p>
				<p><NumberInput pre={'Amount'} min={0} max={10000} value={quantity} changeHandler={changeQuantity} currency={selectedCurrency} step={1} post={childTab === PPF_TAB ? '(Annually)' : '(Monthly)'} /></p>
				</> :
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
