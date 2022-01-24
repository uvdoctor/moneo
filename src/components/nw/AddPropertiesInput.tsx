import { Col, Row, Alert } from "antd";
import React, { useContext, useEffect, useState } from "react";
import { OwnershipInput, PropertyInput, PropertyType } from "../../api/goals";
import { getCompoundedIncome } from "../calc/finance";
import ItemDisplay from "../calc/ItemDisplay";
import NumberInput from "../form/numberinput";
import TextInput from "../form/textinput";
import HSwitch from "../HSwitch";
import ResultCarousel from "../ResultCarousel";
import { presentMonth, presentYear } from "../utils";
import Amount from "./Amount";
import Category from "./Category";
import DateColumn from "./DateColumn";
import { NWContext } from "./NWContext";
import { getFamilyOptions } from "./nwutils";
import Owner from "./Owner";
import Rate from "./Rate";
import { calculateDifferenceInYears, calculateProperty } from "./valuationutils";

interface AddPropertiesInputProps {
	setInput: Function;
	disableOk: Function;
	categoryOptions: any;
	fields: any;
}

export default function AddPropertyInput({
	setInput,
	disableOk,
	categoryOptions,
	fields
}: AddPropertiesInputProps) {
	const { allFamily, selectedCurrency }: any = useContext(
		NWContext
	);
	const [subtype, setSubtype] = useState<PropertyType>(PropertyType.P);
	const [own, setOwn] = useState<Array<OwnershipInput>>([]);
	const [pin, setPin] = useState<any>("");
	const [rate, setRate] = useState<number>(8);
	const [amount, setAmount] = useState<number>(0);
	const [city, setCity] = useState<string>("");
	const [address, setAddress] = useState<string>("");
	const [mv, setMv] = useState<number>(0);
	const [mvy, setMvy] = useState<number>(presentYear);
	const [mvm, setMvm] = useState<number>(presentMonth);
	const [state, setState] = useState<string>("");
	const [name, setName] = useState<string>("");
	const [res, setRes] = useState<boolean>(false);
	const [error, setError] = useState<boolean>(false);
	const [ sm, setSm ] = useState<number>(4);
	const [ sy, setSy ] = useState<number>(presentYear - 5);
	const [valuation, setValuation] = useState<number>(0);

	const duration = () => {
		let rec = getNewRec();
		if (rec.purchase) {
			return calculateDifferenceInYears(presentMonth, presentYear, rec.purchase.month, rec.purchase.year);
		}
	};

	const ownerPercent = () => {
		let count = 0;
		own.map((item: any) => (count += item.per));
		return count;
	};
	
	const changeRes = (val: boolean) => {
		setRes(val)
		let rec = getNewRec();
		rec.res = val;
		setInput(rec);
	};

	const changeName = (val: string) => {
		setName(val);
		let rec = getNewRec();
		rec.name = val;
		setInput(rec);
	};

	const changeAddress = (val: string) => {
		setAddress(val);
		let rec = getNewRec();
		rec.address = val;
		setInput(rec);
	};

	const changePin = async (val: any) => {
		setPin(val);
		if (selectedCurrency === "INR") {
			if (val.length === 6) {
				const response = await fetch(
					`https://api.postalpincode.in/pincode/${val}`
				);
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
			type: subtype,
			pin: pin,
			purchase: {
				amt: amount,
				month: sm,
				year: sy,
				qty: 1,
			},
			address: address,
			curr: selectedCurrency,
			country: selectedCurrency === "INR" ? "India" : "US",
			state: state,
			city: city,
			own: Object.keys(getFamilyOptions(allFamily)).length === 1 
					? [ {fId: Object.keys(getFamilyOptions(allFamily))[0], per: 100 }]
					: own,
			rate: rate,
			mv: mv,
			mvy: mvy,
			mvm: mvm,
			res: res,
			name: name,
		};
		return newRec;
	};

	useEffect(() => {
		if (!own.length) {
			own.push({ fId: Object.keys(getFamilyOptions(allFamily))[0], per: 100 });
			setOwn([...own]);
			let rec = getNewRec();
			rec.own = own;
			setInput(rec);
		}
	}, []);

	useEffect(() => {
		const count = ownerPercent();
		setError(count < 100);
		disableOk(count < 100);
	}, [own, disableOk]);

	useEffect(() => {
		changeMv();
	}, [amount, rate, sm, sy]);

	useEffect(
		() => {
			const valuation = calculateProperty(getNewRec());
			setValuation(valuation);
		},
		[ amount, mv, mvm, mvy, sm, sy, rate ]
	);

	const changeMv = (val?: number) => {
		let mv = val;
		if (val) {
			setMv(val)
		} else {
			const value = getCompoundedIncome(rate, amount, duration() as number);
			setMv(value)
			mv = value;
		}
		setMvm(presentMonth);
		setMvy(presentYear);
		let rec = getNewRec();
		rec.mv = mv;
		rec.mvm = presentMonth;
		rec.mvy = presentYear;
		setInput(rec);
	};

	return (
		<Row gutter={[ 0, 10 ]}>
			<Col xs={24}>
				<Row justify="center">
					<Col xs={24} sm={24}>
					<ResultCarousel
						results={[
						<ItemDisplay
							key="valuation"
							label="Current Valuation"
							result={valuation}
							currency={selectedCurrency}
							pl
						/>]}/>
					</Col>
					</Row>
				</Col>
				<Col xs={24}>
				<Row
				gutter={[
					{ xs: 0, sm: 0, md: 35 },
					{ xs: 15, sm: 15, md: 15 },
				]}
			>
				<Col xs={24} md={12}>
						<Row align="bottom"
							gutter={[
								{ xs: 0, sm: 0, md: 15 },
								{ xs: 0, sm: 0, md: 15 },
							]}
						>
							<Col xs={24} md={12}>
								{categoryOptions && (
									<Category 
										categoryOptions={categoryOptions} 
										record={getNewRec()} 
										changeData={setInput} 
										category={subtype} 
										setCategory={setSubtype} 
										pre={fields.type}/>
								)}
							</Col>
							<Col xs={24} md={12}>
							{!(subtype === PropertyType.COMM || subtype === PropertyType.P ) &&
							// @ts-ignore
									<HSwitch value={res} setter={(val: boolean)=>changeRes(val)} rightText="I live here"/>
							}
							</Col>
						</Row>
				</Col>
				<Col xs={24} md={12}>
					<Amount 
						changeData={setInput} 
						record={getNewRec()} 
						fields={fields} 
						amt={amount} 
						setAmt={setAmount}
					/>
				</Col>
				<Col xs={24} md={12}>
					<DateColumn 
						changeData={setInput} 
						record={getNewRec()} 
						pre={fields.date} 
						sm={sm} 
						sy={sy} 
						setSm={setSm} 
						setSy={setSy}/>
				</Col>
				<Col xs={24} md={12}>
					<Rate 
						changeData={setInput} 
						record={getNewRec()} 
						pre={fields.rate} 
						rate={rate} 
						setRate={setRate}/>
				</Col>
				<Col xs={24} md={12}>
						<NumberInput
							pre={fields.mv}
							min={1}
							value={mv}
							changeHandler={changeMv}
							currency={selectedCurrency}
						/>
				</Col>
				<Col xs={24} md={12}>
						<TextInput
							pre={fields.pin}
							value={pin}
							changeHandler={changePin}
							size={"middle"}
							style={{ width : 250 }}
							post={city && state && (
									<label>{`${city}, ${state}`}</label>)}
						/>
				</Col>
				<Col xs={24} md={12}>
						<TextInput
							pre={fields.address}
							value={address}
							changeHandler={changeAddress}
							size={"middle"}
						/>
				</Col>
				<Col xs={24} md={12}>
						<TextInput
							pre={fields.name}
							value={name}
							changeHandler={changeName}
							size={"middle"}
						/>
				</Col>
				{Object.keys(getFamilyOptions(allFamily)).length > 1  && own && own[0] && (
					<>
						<Col xs={24}>
							{fields.owner}
							{error && (
								<Alert
									type={"error"}
									message={"Owner percentage combination should equal to 100"}
								/>
							)}
						</Col>
						<Owner changeData={setInput} record={getNewRec()} owner={own} setOwner={setOwn}/>
					</>
				)}
			</Row>
				</Col>
			</Row>
	);
}
