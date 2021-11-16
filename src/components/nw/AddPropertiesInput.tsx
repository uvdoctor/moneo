import { UserOutlined } from '@ant-design/icons';
import { InputNumber } from 'antd';
import React, { Fragment, useContext, useState } from 'react';
import { DepositInput } from '../../api/goals';
import NumberInput from '../form/numberinput';
import SelectInput from '../form/selectinput';
import { NWContext } from './NWContext';
import { getDefaultMember, getFamilyOptions } from './nwutils';

interface AddHoldingInputProps {
	setInput: Function;
	disableOk: Function;
	categoryOptions?: any;
	subCategoryOptions?: any;
}

export default function AddHoldingInput({
	setInput,
	disableOk,
	categoryOptions,
	subCategoryOptions,
}: AddHoldingInputProps) {
	const { allFamily, selectedMembers, selectedCurrency }: any = useContext(NWContext);
	const [ cum, setCum ] = useState<string>('true');
	const [ cumf, setCumf ] = useState<string>('1');
	const [ memberKey, setMemberKey ] = useState<string>(getDefaultMember(allFamily, selectedMembers));
	const [ chg, setChg ] = useState<number>(0);
	const [ amount, setAmount ] = useState<number>(0);
	const [ month, setMonth ] = useState<number>(1);
	const [ year, setYear ] = useState<number>(new Date().getFullYear() - 5);
	const [ duration, setDuration ] = useState<number>(12);

	const changeName = (val: string) => {
		setCumf(val);
		let rec = getNewRec();
		rec.cumf = Number(val);
		setInput(rec);
	};

	const changeDuration = (val: number) => {
		setDuration(val);
		let rec = getNewRec();
		rec.months = val;
		setInput(rec);
	};

	const changeChg = (val: number) => {
		setChg(val);
		let rec = getNewRec();
		rec.rate = val;
		setInput(rec);
	};

	const changeAmount = (amt: number) => {
		setAmount(amt);
		disableOk(amt <= 0);
		let rec = getNewRec();
		rec.amt = amt;
		setInput(rec);
	};

	const changeMonth = (month: number) => {
		setMonth(month);
		disableOk(month <= 0);
		let rec = getNewRec();
		rec.sm = month;
		setInput(rec);
	};

	const changeYear = (year: number) => {
		setYear(year);
		disableOk(year <= 0);
		let rec = getNewRec();
		rec.sy = year;
		setInput(rec);
	};

	const getNewRec = () => {
        let newRec: DepositInput = {
            amt: amount,
            sm: month,
            sy: year,
            months: duration,
            rate: chg,
            fIds: [ memberKey ],
            curr: selectedCurrency,
            cum: cum === 'true' ? true : false ,
            cumf: Number(cumf)
        };
        return newRec;
    }

	const changeSubtype = (subtype: string) => {
		setCum(subtype);
		if (subCategoryOptions) {  
			let opts = subCategoryOptions[subtype];
			if (opts && Object.keys(opts).length && !opts[cumf]) {
				let defaultVal: any = Object.keys(opts)[0];
				setCumf(defaultVal);
			}
		}
		let rec = getNewRec();
		rec.cum = subtype === 'true' ? true : false;
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
				{categoryOptions && <SelectInput
					pre="Cummulative"
					value={cum}
					options={categoryOptions}
					changeHandler={(val: string) => changeSubtype(val)}
				/>}
				{subCategoryOptions ? subCategoryOptions[cum as string] && (	
					<Fragment>
						&nbsp;
						<SelectInput
							pre=""
							value={cumf as string}
							options={subCategoryOptions[cum as string]}
							changeHandler={(val: string) => changeName(val)}
							post={'Frequency'}
						/>
					</Fragment>
				) : null}
			</p>
            <p>
				<label>Start Month</label><InputNumber onChange={changeMonth} value={month}/>&nbsp;&nbsp;
				<label>Start Year</label><InputNumber onChange={changeYear} value={year}/>&nbsp;&nbsp;
				<label>Duration</label><InputNumber onChange={changeDuration} value={duration}/>
			</p>
			<p><NumberInput pre={'Rate'} changeHandler={changeChg} post={'%'} min={0} max={50} value={chg} step={0.1} noSlider/></p>
			<p><NumberInput pre={'Amount'} min={10} max={100000} value={amount} changeHandler={changeAmount} currency={selectedCurrency} step={1} noSlider/></p>
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
