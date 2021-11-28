import { PlusOutlined, DeleteOutlined, UserOutlined } from '@ant-design/icons';
import { Form, Button, Checkbox, Col, InputNumber, Row, Alert, Tooltip } from 'antd';
import React, { useContext, useEffect, useState } from 'react';
import { OwnershipInput, PropertyInput } from '../../api/goals';
import { COLORS } from '../../CONSTANTS';
import { getCompoundedIncome } from '../calc/finance';
import DatePickerInput from '../form/DatePickerInput';
import NumberInput from '../form/numberinput';
import SelectInput from '../form/selectinput';
import TextInput from '../form/textinput';
import { NWContext } from './NWContext';
import { getDefaultMember, getFamilyOptions, getRemainingDuration } from './nwutils';

interface AddPropertiesInputProps {
	setInput: Function;
	disableOk: Function;
	categoryOptions: any;
}

export default function AddPropertyInput({ setInput, disableOk, categoryOptions }: AddPropertiesInputProps) {
	const { allFamily, selectedMembers, selectedCurrency }: any = useContext(NWContext);
	const [ subtype, setSubtype ] = useState<string>('P');
	const [ own, setOwn ] = useState<Array<OwnershipInput>>([]);
	const [ pin, setPin ] = useState<any>('');
	const [ memberKey, setMemberKey ] = useState<string>(getDefaultMember(allFamily, selectedMembers));
	const [ rate, setRate ] = useState<number>(8);
	const [ amount, setAmount ] = useState<number>(0);
	const [ purchaseDate, setPurchaseDate ] = useState<string>(`Apr-${new Date().getFullYear() - 5}`);
	const [ city, setCity ] = useState<string>('');
	const [ address, setAddress ] = useState<string>('');
	const [ mv, setMv ] = useState<number>(0);
	const [ mvy, setMvy ] = useState<number>(new Date().getFullYear());
	const [ mvm, setMvm ] = useState<number>(new Date().getMonth() + 1);
	const [ state, setState ] = useState<string>('');
	const [ name, setName ] = useState<string>('');
	const [ res, setRes ] = useState<boolean>(false);
	const [ error, setError ] = useState<boolean>(false);

	const duration = () => {
		let rec = getNewRec();
		if(rec.purchase) {
			const data = getRemainingDuration(rec.purchase.year,rec.purchase.month);
			return data?.years;
		}
	}
	
	const ownerPercent = () => {
		let count = 0;
		own.map((item: any) => (count += item.per));
		return count;
	};

	useEffect(() => {
		// @ts-ignore
		setMv(Math.round(getCompoundedIncome(rate, amount, duration())));
		setMvm(new Date().getMonth() + 1);
		setMvy(new Date().getFullYear());
		let rec = getNewRec();
		rec.mv = mv;
		rec.mvm = mvm;
		rec.mvy = mvy;
		setInput(rec);
	}, [amount, rate, purchaseDate])

	const changeRate = (val: number) => {
		setRate(val);
		disableOk(val <= 0);
		// @ts-ignore
		let rec = getNewRec();
		rec.rate = val;
		setInput(rec);
	};

	const changeRes = (val: boolean) => {
		setRes(val);
		let rec = getNewRec();
		rec.res = val;
		setInput(rec);
		console.log(rec);
	};

	const changeName = (val: string) => {
		setName(val);
		let rec = getNewRec();
		rec.name = val;
		setInput(rec);
	};

	const changeState = (val: string) => {
		setState(val);
		let rec = getNewRec();
		rec.state = val;
		setInput(rec);
	};

	const changeCity = (val: string) => {
		setCity(val);
		let rec = getNewRec();
		rec.city = val;
		setInput(rec);
	};

	const changeAmount = (amt: number) => {
		setAmount(amt);
		disableOk(amt <= 0);
		let rec = getNewRec();
		rec.purchase ? (rec.purchase.amt = amt) : '';
		setInput(rec);
	};

	const changePurchaseDate = (val: any) => {
		setPurchaseDate(val);
		let rec = getNewRec();
		if (rec.purchase) {
			rec.purchase.year = Number(val.slice(0, val.indexOf('-')));
			rec.purchase.month = Number(val.slice(val.indexOf('-') + 1));
		}
		setInput(rec);
	};

	const changeAddress = (val: string) => {
		setAddress(val);
		let rec = getNewRec();
		rec.address = val;
		setInput(rec);
	};

	const changeMv = (val: number) => {
		setMv(val);
		setMvm(new Date().getMonth() + 1);
		setMvy(new Date().getFullYear());
		let rec = getNewRec();
		rec.mv = val;
		rec.mvm = mvm;
		rec.mvy = mvy;
		setInput(rec);
	};

	const changePin = async (val: any) => {
		setPin(val);
		if (selectedCurrency === 'INR') {
			if (val.length === 6) {
				const response = await fetch(`https://api.postalpincode.in/pincode/${val}`);
				const data = await response.json();
				setState(data[0].PostOffice[0].State);
				setCity(data[0].PostOffice[0].District);
				let rec = getNewRec();
				rec.state = state;
				rec.city = city;
				rec.pin = Number(pin);
				setInput(rec);
			}
		} else {
			let rec = getNewRec();
			rec.pin = Number(pin);
			setInput(rec);
		}
	};

	const getNewRec = () => {
		let newRec: PropertyInput = {
			// @ts-ignore
			type: subtype,
			pin: pin,
			purchase: {
				amt: amount,
				month: Number(purchaseDate.slice(purchaseDate.indexOf('-') + 1)),
				year: Number(purchaseDate.slice(0, purchaseDate.indexOf('-'))),
				qty: 1
			},
			address: address,
			curr: selectedCurrency,
			country: selectedCurrency === 'INR' ? 'India' : 'US',
			state: state,
			city: city,
			own: own,
			rate: rate,
			mv: mv,
			mvy: mvy,
			mvm: mvm,
			res: res,
			name: name
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
		own[i].fId = key;
		setOwn([ ...own ]);
	};

	const changePer = (i: number, val: number) => {
		own[i].per = val;
		setOwn([ ...own ]);
		const count = ownerPercent();
		if (count > 100) own[i].per = val - (count - 100);
	};

	const onAddBtnClick = () => {
		const count = ownerPercent();
		if (count < 100) {
			own.push({ fId: memberKey, per: 100 - count });
			setOwn([ ...own ]);
			let rec = getNewRec();
			rec.own = own;
			setInput(rec);
		}
	};

	useEffect(() => {
		if (!own.length) {
			own.push({ fId: memberKey, per: 100 });
			setOwn([ ...own ]);
			let rec = getNewRec();
			rec.own = own;
			setInput(rec);
		}
	}, []);

	useEffect(
		() => {
			const count = ownerPercent();
			setError(count < 100);
			disableOk(count < 100);
		},
		[ own, disableOk ]
	);

	const removeOwner = (index: number) => {
		own.splice(index, 1);
		setOwn([ ...own ]);
		let rec = getNewRec();
		rec.own = own;
		setInput(rec);
	};

	const { Item: FormItem } = Form;

	return (
		<Form layout="vertical">
			<Row gutter={[ { xs: 0, sm: 0, md: 35 }, { xs: 15, sm: 15, md: 15 } ]}>
				<Col xs={24} md={12}>
					<FormItem label="Name">
						<TextInput pre="" value={name} changeHandler={changeName} size={'middle'} />
					</FormItem>
				</Col>
				<Col xs={24} md={12}>
					<FormItem label="Type">
						<Row gutter={[ { xs: 0, sm: 0, md: 15 }, { xs: 0, sm: 0, md: 15 } ]}>
							<Col xs={24} sm={12}>
								{categoryOptions && (
									<SelectInput
										pre=""
										value={subtype}
										options={categoryOptions}
										changeHandler={(val: any) => changeSubtype(val)}
									/>
								)}
							</Col>
							<Col xs={24} md={12}>
								{subtype === 'O' || subtype === 'P' ? null : (
									<Checkbox onChange={(e) => changeRes(e.target.checked)}>Residential</Checkbox>
								)}
							</Col>
						</Row>
					</FormItem>
				</Col>
				<Col xs={24} md={12}>
					<FormItem label="Address">
						<TextInput pre="" value={address} changeHandler={changeAddress} size={'middle'} />
					</FormItem>
				</Col>
				<Col xs={24} md={12}>
					<FormItem label="City">
						<TextInput pre="" value={city} changeHandler={changeCity} size={'middle'} disabled={true} />
					</FormItem>
				</Col>
				<Col xs={24} md={12}>
					<FormItem label="State">
						<TextInput pre="" value={state} changeHandler={changeState} size={'middle'} disabled={true} />
					</FormItem>
				</Col>
				<Col xs={24} md={12}>
					<FormItem label="Pincode">
						<TextInput pre="" value={pin} changeHandler={changePin} size={'middle'} />
					</FormItem>
				</Col>
				<Col xs={24} md={12}>
					<FormItem label="Purchase Amount">
						<NumberInput
							pre=""
							min={1}
							max={1000000000}
							value={amount}
							changeHandler={changeAmount}
							currency={selectedCurrency}
							step={1}
							noSlider
						/>
					</FormItem>
				</Col>
				<Col xs={24} md={12}>
					<FormItem label="Purchase Date">
						<DatePickerInput
							title=""
							picker="month"
							changeHandler={changePurchaseDate}
							defaultVal={purchaseDate}
							size={'middle'}
						/>
					</FormItem>
				</Col>
				<Col xs={24} md={12}>
					<FormItem label="Appreciation Rate">
						<InputNumber onChange={changeRate} min={1} max={50} value={rate} step={0.1} />
					</FormItem>
				</Col>
				<Col xs={24} md={12}>
					<FormItem label="Market Value">
						<NumberInput
							pre=""
							min={1}
							max={1000000000}
							value={mv}
							changeHandler={changeMv}
							currency={selectedCurrency}
							step={1}
							noSlider
						/>
					</FormItem>
				</Col>
				{/*<Col xs={24} md={12}>*/}
				{own &&
					own[0] &&
					own.map((own: OwnershipInput, i: number) => (
						<Col key={'own' + i} xs={24} md={12}>
							<Row gutter={[ 10, 10 ]}>
								<Col key={'own' + i}>
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
								<Button type="link" onClick={() => removeOwner(i)} danger>
									<DeleteOutlined />
								</Button>
							</Row>
						</Col>
					))}
					<Col xs={24}>
						<Tooltip title='Add Owners'>
							<Button 
								shape={'circle'} 
								onClick={onAddBtnClick} 
								style={{background: COLORS.GREEN}} 
								icon={<PlusOutlined />} 
								disabled={Object.keys(allFamily).length === 1}/>
						</Tooltip>
					</Col>
				{/*</Col>*/}
			</Row>
			{error && <Alert type={'error'} message={'Owner percentage combination should equal to 100'} />}
		</Form>
	);
}
