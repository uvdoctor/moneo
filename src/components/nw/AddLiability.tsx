import { UserOutlined } from '@ant-design/icons';
import { InputNumber } from 'antd';
import React, { useContext, useState } from 'react';
import { LiabilityInput } from '../../api/goals';
import NumberInput from '../form/numberinput';
import SelectInput from '../form/selectinput';
import TextInput from '../form/textinput';
import { NWContext } from './NWContext';
import { getDefaultMember, getFamilyOptions } from './nwutils';

interface AddLiabilityInputProps {
	setInput: Function;
	disableOk: Function;
	categoryOptions?: any;
}

export default function AddLiabilityInput({ setInput, disableOk, categoryOptions }: AddLiabilityInputProps) {
	const { allFamily, selectedMembers, selectedCurrency }: any = useContext(NWContext);
	const [ memberKey, setMemberKey ] = useState<string>(getDefaultMember(allFamily, selectedMembers));
	const [ amount, setAmount ] = useState<number>(1000);
	const [ type, setType ] = useState<string>('L');
	const [ yearly, setYearly ] = useState('true');
	const [ name, setName ] = useState<string>('');
	const [ duration, setDuration ] = useState<number>(12);

	const changeName = (val: string) => {
		setName(val);
		let rec = getNewRec();
		rec.name = val;
		setInput(rec);
	};

	const changeDuration = (val: number) => {
		setDuration(val);
		let rec = getNewRec();
		rec.dur = val;
		setInput(rec);
	};

	const changeAmount = (amt: number) => {
		setAmount(amt);
		disableOk(amt <= 0);
		let rec = getNewRec();
		rec.amt = amt;
		setInput(rec);
	};

	const getNewRec = () => {
		let newRec: LiabilityInput = {
            type: type,
			name: name,
			amt: amount,
			dur: duration,
			fId: memberKey,
			curr: selectedCurrency,
			yearly: yearly === 'true' ? true : false
		};
		return newRec;
	};

	const changeSubtype = (subtype: string) => {
		setType(subtype);
		let rec = getNewRec();
		rec.type = subtype;
		setInput(rec);
	};

	const changeYearly = (val: string) => {
		setYearly(val);
		let rec = getNewRec();
		rec.yearly = val === 'true' ? true : false;
		setInput(rec);
	};

	const changeMember = (key: string) => {
		setMemberKey(key);
		let rec = getNewRec();
		rec.fId = key;
		setInput(rec);
	};

	return (
		<div style={{ textAlign: 'center' }}>
			<p>
				{categoryOptions && (
					<SelectInput
						pre="Insurance"
						value={type}
						options={categoryOptions}
						changeHandler={(val: string) => changeSubtype(val)}
					/>
				)}
			</p>
			<p>
				<TextInput pre={'Name'} value={name} changeHandler={changeName} size={'middle'} />
			</p>
			<p>
				<SelectInput
					pre={'Installment Type'}
					value={yearly}
					options={{ true: 'Yearly', false: 'Monthly' }}
					changeHandler={changeYearly}
				/>
				&nbsp;
				<label>No. of installment</label>
				<InputNumber min={1} max={1000} value={duration} onChange={changeDuration} step={1} />
			</p>
			<p>
				<NumberInput
					pre={'Installment Amount'}
					min={10}
					max={100000}
					value={amount}
					changeHandler={changeAmount}
					currency={selectedCurrency}
					step={1}
					noSlider
				/>
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
