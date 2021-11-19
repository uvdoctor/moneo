import { UserOutlined } from '@ant-design/icons';
import { InputNumber, Row } from 'antd';
import React, { Fragment, useContext, useState } from 'react';
import { DepositInput } from '../../api/goals';
import DatePickerInput from '../form/DatePickerInput';
import NumberInput from '../form/numberinput';
import SelectInput from '../form/selectinput';
import { NWContext } from './NWContext';
import { getDefaultMember, getFamilyOptions } from './nwutils';

interface AddDepositInputProps {
	setInput: Function;
	disableOk: Function;
	categoryOptions: any;
	subCategoryOptions?: any;
}

export default function AddDepositInput({
	setInput,
	disableOk,
	categoryOptions,
	subCategoryOptions,
}: AddDepositInputProps) {
	const { allFamily, selectedMembers, selectedCurrency }: any = useContext(NWContext);
	const [ cum, setCum ] = useState<string>('true');
	const [ cumf, setCumf ] = useState<string>('1');
	const [ memberKey, setMemberKey ] = useState<string>(getDefaultMember(allFamily, selectedMembers));
	const [ chg, setChg ] = useState<number>(0);
	const [ amount, setAmount ] = useState<number>(0);
	const [ startDate, setStartDate ] = useState<string>('1900-4');
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

	const getNewRec = () => {
        let newRec: DepositInput = {
            amt: amount,
			sm: Number(startDate.slice(startDate.indexOf('-') + 1)),  
			sy: Number(startDate.slice(0, startDate.indexOf('-'))),
            months: duration,
            rate: chg,
            fId: memberKey,
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
		rec.fId = key;
		setInput(rec);
	};

	const changeStartDate = (val: any) => {
		setStartDate(val);
		let rec = getNewRec();
		rec.sy = Number(val.slice(0, val.indexOf('-')));
		rec.sm = Number(val.slice(val.indexOf('-') + 1));
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
				<DatePickerInput
					picker="month"
					title={'Start Date'}
					changeHandler={changeStartDate}
					defaultVal={startDate}
					size={'middle'}
				/>&nbsp;&nbsp;
				<label>Duration</label><InputNumber onChange={changeDuration} value={duration}/>
			</p>
			<p> 
				<Row justify='center'>
					<NumberInput pre={'Rate'} changeHandler={changeChg} min={0} max={50} value={chg} step={0.1} noSlider/>
					<NumberInput pre={'Amount'} min={10} max={100000} value={amount} changeHandler={changeAmount} currency={selectedCurrency} step={1} noSlider/>
				</Row>
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
