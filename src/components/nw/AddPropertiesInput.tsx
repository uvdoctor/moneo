import DeleteOutlined from '@ant-design/icons/lib/icons/DeleteOutlined';
import UserAddOutlined from '@ant-design/icons/lib/icons/UserAddOutlined';
import UserOutlined from '@ant-design/icons/lib/icons/UserOutlined';
import { Button, Col, Input, InputNumber, Row } from 'antd';
import React, { Fragment, useContext, useState } from 'react';
import { Ownership, PropertyInput } from '../../api/goals';
import NumberInput from '../form/numberinput';
import SelectInput from '../form/selectinput';
import TextInput from '../form/textinput';
import { NWContext } from './NWContext';
import { getDefaultMember, getFamilyOptions } from './nwutils';

interface AddPropertiesInputProps {
	setInput: Function;
	disableOk: Function;
	categoryOptions: any;
}

export default function AddPropertyInput({ setInput, disableOk, categoryOptions }: AddPropertiesInputProps) {
	const { allFamily, selectedMembers, selectedCurrency }: any = useContext(NWContext);
	const [ subtype, setSubtype ] = useState<string>('P');
	const [ own, setOwn ] = useState([]);
	const [ pin, setPin ] = useState<any>('');
	const [ memberKey, setMemberKey ] = useState<string>(getDefaultMember(allFamily, selectedMembers));
	const [ rate, setRate ] = useState<number>(0);
	const [ amount, setAmount ] = useState<number>(0);
	const [ month, setMonth ] = useState<number>(1);
	const [ year, setYear ] = useState<number>(new Date().getFullYear() - 5);
	const [ city, setCity ] = useState<string>('');
	const [ address, setAddress ] = useState<string>('');
	const [ mv, setMv ] = useState<number>(0);
	const [ mvy, setMvy ] = useState<number>(new Date().getFullYear() - 5);
	const [ mvm, setMvm ] = useState<number>(1);
	const [ district, setDistrict ] = useState<string>('');
	const [ state, setState ] = useState<string>('');

	const changeRate = (val: number) => {
		setRate(val);
		let rec = getNewRec();
		rec.rate = val;
		setInput(rec);
	};

	const changeAmount = (amt: number) => {
		setAmount(amt);
		disableOk(amt <= 0);
		let rec = getNewRec();
		// @ts-ignore
		rec.purchase.amt = amt;
		setInput(rec);
	};

	const changeMonth = (month: number) => {
		setMonth(month);
		disableOk(month <= 0);
		let rec = getNewRec();
		// @ts-ignore
		rec.purchase.month = month;
		setInput(rec);
	};

	const changeYear = (year: number) => {
		setYear(year);
		disableOk(year <= 0);
		let rec = getNewRec();
		// @ts-ignore
		rec.purchase.year = year;
		setInput(rec);
	};

	const changeAddress = (e: any) => {
		setAddress(e.target.value);
		let rec = getNewRec();
		rec.address = address;
		setInput(rec);
	};

	const changeMv = (val: number) => {
		setMv(val);
		setMvm(new Date().getMonth() + 1);
		setMvy(new Date().getFullYear());
		let rec = getNewRec();
		rec.mv = mv;
		rec.mvm = mvm;
		rec.mvy = mvy;
		setInput(rec);
	};

	const changePin = async (e: any) => {
		setPin(e.target.value);
		if (selectedCurrency === 'INR') {
			if (e.target.value.length === 6) {
				const response = await fetch(`https://api.postalpincode.in/pincode/${e.target.value}`);
				const data = await response.json();
				setState(data[0].PostOffice[0].State);
				setCity(data[0].PostOffice[0].Block);
				setDistrict(data[0].PostOffice[0].District);
				let rec = getNewRec();
				rec.state = state;
				rec.city = city;
				rec.district = district;
				rec.pin = pin;
				setInput(rec);
			}
		} else {
			let rec = getNewRec();
			rec.pin = pin;
			setInput(rec);
		}
	};

	const getNewRec = () => {
		let newRec: PropertyInput = {
			// @ts-ignore
			type: subtype,
			pin: pin,
			purchase: { amt: amount, month: month, year: year, qty: 1 },
			address: address,
			curr: selectedCurrency,
			country: selectedCurrency === 'INR' ? 'India' : 'US',
			district: district,
			state: state,
			city: city,
			own: own,
			rate: rate,
			mv: mv,
			mvy: mvy,
			mvm: mvm
		};
		return newRec;
	};

	const changeSubtype = (subtype: any) => {
		setSubtype(subtype);
		let rec = getNewRec();
		rec.type = subtype;
		setInput(rec);
	};

	const changeMember = (i: number, key: string) => {
		setMemberKey(key);
		// @ts-ignore
		own[i].fId = key;
		setOwn([ ...own ]);
	};

	const changePer = (i: number, val: number) => {
		// @ts-ignore
		own[i].per = val;
		setOwn([ ...own ]);
	};

	const onAddBtnClick = () => {
		let count = 0;
		own.map((item: any) => (count += item.per));
		if (count < 100) {
			// @ts-ignore
			own.push({ fId: memberKey, per: 100 - count });
			setOwn([ ...own ]);
			let rec = getNewRec();
			rec.own = own;
			setInput(rec);
		}
	};

	const removeTgt = (index: number) => {
		own.splice(index, 1);
		setOwn([ ...own ]);
		let rec = getNewRec();
		rec.own = own;
		setInput(rec);
	};

	return (
		<div style={{ textAlign: 'center' }}>
			<p>
				<SelectInput
					pre=""
					value={subtype}
					options={categoryOptions}
					changeHandler={(val: any) => changeSubtype(val)}
				/>
			</p>
			<p>
				<Row justify={'space-around'}>
					<Col>
						<Input addonBefore={'Pincode'} value={pin} onChange={changePin} />
					</Col>
					<Col>
						<TextInput pre={'District'} value={district} changeHandler={setDistrict} size={'middle'} />
					</Col>
				</Row>
				<p />
				<Row justify={'space-around'}>
					<Col>
						<TextInput pre={'City'} value={city} changeHandler={setCity} size={'middle'} />
					</Col>
					<Col>
						<TextInput pre={'State'} value={state} changeHandler={setState} size={'middle'} />
					</Col>
				</Row>
			</p>

			<p>
				<Input addonBefore={'Address'} value={address} onChange={changeAddress} />
			</p>
			<p>
				<NumberInput
					pre={'Purchase Amount'}
					min={10}
					max={100000}
					value={amount}
					changeHandler={changeAmount}
					currency={selectedCurrency}
					step={1}
					noSlider
				/>
				<label>Purchase Month</label>
				<InputNumber onChange={changeMonth} min={1} max={12} value={month} />&nbsp;&nbsp;
				<label>Purchase Year</label>
				<InputNumber onChange={changeYear} min={1900} max={new Date().getFullYear()} value={year} />&nbsp;&nbsp;
			</p>
			<p>
				<Row justify={'center'}>
					<NumberInput
						pre={'Rate'}
						changeHandler={changeRate}
						post={'%'}
						min={0}
						max={50}
						value={rate}
						step={0.1}
						noSlider
					/>
					<NumberInput
						pre={'Market Value'}
						min={10}
						max={100000}
						value={mv}
						changeHandler={changeMv}
						currency={selectedCurrency}
						step={1}
						noSlider
					/>
				</Row>
			</p>
			<p>
				<Col>
					{own &&
						own[0] &&
						own.map((own: Ownership, i: number) => (
							<Fragment key={'own' + i}>
								<Row justify="center">
									<Col>
										<SelectInput
											pre={<UserOutlined />}
											value={own.fId as string}
											options={getFamilyOptions(allFamily)}
											changeHandler={(key: string) => changeMember(i, key)}
										/>
									</Col>
									<Col>
										<InputNumber
											placeholder="Percentage"
											min={1}
											max={100}
											value={own.per}
											onChange={(val: number) => changePer(i, val)}
										/>
									</Col>
									<Button type="link" onClick={() => removeTgt(i)} danger>
										<DeleteOutlined />
									</Button>
								</Row>
							</Fragment>
						))}
					<Row justify="center">
						<Button onClick={onAddBtnClick}>
							Add Owners<UserAddOutlined />
						</Button>
					</Row>
				</Col>
			</p>
		</div>
	);
}
