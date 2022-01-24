import { Col, Row, Alert } from "antd";
import React, { useContext, useEffect, useState } from "react";
import { OwnershipInput, PropertyInput, PropertyType } from "../../api/goals";
import { getCompoundedIncome } from "../calc/finance";
import ItemDisplay from "../calc/ItemDisplay";
import HSwitch from "../HSwitch";
import ResultCarousel from "../ResultCarousel";
import { presentMonth, presentYear } from "../utils";
import Address from "./Address";
import Amount from "./Amount";
import Category from "./Category";
import Comment from "./Comment";
import DateColumn from "./DateColumn";
import MarketValue from "./MarketValue";
import { NWContext } from "./NWContext";
import { getFamilyOptions } from "./nwutils";
import Owner from "./Owner";
import Pincode from "./Pincode";
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
	const [pin, setPin] = useState<string>("");
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

	const getNewRec = () => {
		let newRec: PropertyInput = {
			type: subtype,
			pin: Number(pin),
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
		const duration = calculateDifferenceInYears(presentMonth, presentYear, sm, sy);
		const value = getCompoundedIncome(rate, amount, duration);
		setMv(value)
		setMvm(presentMonth);
		setMvy(presentYear);
		let rec = getNewRec();
		rec.mv = mv;
		rec.mvm = presentMonth;
		rec.mvy = presentYear;
		setInput(rec);
	}, [amount, rate, sm, sy]);

	useEffect(
		() => {
			const valuation = calculateProperty(getNewRec());
			setValuation(valuation);
		},
		[ amount, mv, mvm, mvy, sm, sy, rate ]
	);


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
					<MarketValue 
						changeData={setInput} 
						record={getNewRec()} 
						pre={fields.mv} 
						mv={mv} 
						setMv={setMv} 
						setMvm={setMvm} 
						setMvy={setMvy}/>
				</Col>
				<Col xs={24} md={12}>
						<Pincode 
							changeData={setInput} 
							record={getNewRec()} 
							pre={fields.pin} 
							pin={pin} 
							setPin={setPin} 
							setState={setState} 
							setCity={setCity}
							state={state}
							city={city}
							/>
				</Col>
				<Col xs={24} md={12}>
					<Address changeData={setInput} record={getNewRec()} pre={fields.address} setAdd={setAddress} add={address} />
				</Col>
				<Col xs={24} md={12}>
					<Comment changeData={setInput} record={getNewRec()} pre={fields.name} setName={setName} name={name}/>
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
