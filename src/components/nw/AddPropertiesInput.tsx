import { Col, Row, Alert } from 'antd';
import React, { Fragment, useContext, useEffect, useState } from 'react';
import { OwnershipInput, PropertyInput, PropertyType } from '../../api/goals';
import { getCompoundedIncome } from '../calc/finance';
import ItemDisplay from '../calc/ItemDisplay';
import ResultCarousel from '../ResultCarousel';
import { presentMonth, presentYear } from '../utils';
import Address from './Address';
import Amount from './Amount';
import Category from './Category';
import Comment from './Comment';
import DateColumn from './DateColumn';
import MarketValue from './MarketValue';
import { NWContext } from './NWContext';
import Owner from './Owner';
import Pincode from './Pincode';
import Rate from './Rate';
import Residential from './Residential';
import { calculateDifferenceInYears, calculateProperty } from './valuationutils';

interface AddPropertiesInputProps {
	setInput: Function;
	categoryOptions: any;
	fields: any;
	info: any
}

export default function AddPropertyInput({ setInput, categoryOptions, fields, info }: AddPropertiesInputProps) {
	const { selectedCurrency, familyOptions, selectedMembers }: any = useContext(NWContext);
	const [ subtype, setSubtype ] = useState<PropertyType>(PropertyType.P);
	const [ own, setOwn ] = useState<Array<OwnershipInput>>([]);
	const [ pin, setPin ] = useState<string>('');
	const [ rate, setRate ] = useState<number>(8);
	const [ amount, setAmount ] = useState<number>(0);
	const [ city, setCity ] = useState<string>('');
	const [ address, setAddress ] = useState<string>('');
	const [ mv, setMv ] = useState<number>(0);
	const [ mvy, setMvy ] = useState<number>(presentYear);
	const [ mvm, setMvm ] = useState<number>(presentMonth);
	const [ state, setState ] = useState<string>('');
	const [ name, setName ] = useState<string>('');
	const [ res, setRes ] = useState<boolean>(false);
	const [ error, setError ] = useState<boolean>(false);
	const [ sm, setSm ] = useState<number>(4);
	const [ sy, setSy ] = useState<number>(presentYear - 5);
	const [ valuation, setValuation ] = useState<number>(0);

	const ownerPercent = () => {
		let count = 0;
		own.map((item: any) => (count += item.per));
		return count;
	};

	const getNewRec = () => {
		let newRec: PropertyInput = {
			type: subtype,
			pin: Number(pin),
			purchase: { amt: amount, month: sm, year: sy, qty: 1 },
			address: address,
			curr: selectedCurrency,
			country: selectedCurrency === 'INR' ? 'India' : 'US',
			state: state,
			city: city,
			own:
				Object.keys(familyOptions).length === 1
					? [ { fId: Object.keys(familyOptions)[0], per: 100 } ]
					: own,
			rate: rate,
			mv: mv,
			mvy: mvy,
			mvm: mvm,
			res: res,
			name: name
		};
		return newRec;
	};

	useEffect(() => {
		if (!own.length) {
			own.push({ fId: Object.keys(familyOptions)[0], per: 100 });
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
		},
		[ own ]
	);

	useEffect(
		() => {
			const duration = calculateDifferenceInYears(presentMonth, presentYear, sm, sy);
			const value = getCompoundedIncome(rate, amount, duration);
			setMv(value);
			setMvm(presentMonth);
			setMvy(presentYear);
			let rec = getNewRec();
			rec.mv = mv;
			rec.mvm = presentMonth;
			rec.mvy = presentYear;
			setInput(rec);
		},
		[ amount, rate, sm, sy ]
	);

	useEffect(
		() => {
			const valuation = calculateProperty(getNewRec(), selectedMembers);
			setValuation(valuation.total);
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
								/>
							]}
						/>
					</Col>
				</Row>
			</Col>
			<Col xs={24}>
				<Row gutter={[ { xs: 0, sm: 0, md: 35 }, { xs: 15, sm: 15, md: 15 } ]}>
					<Col xs={24} md={12}>
						<Row align="bottom" gutter={[ { xs: 0, sm: 0, md: 15 }, { xs: 0, sm: 0, md: 15 } ]}>
							<Col xs={24} md={12}>
								{categoryOptions && (
									<Category
										categoryOptions={categoryOptions}
										record={getNewRec()}
										changeData={setInput}
										category={subtype}
										setCategory={setSubtype}
										pre={fields.type}
										info={info.type}
									/>
								)}
							</Col>
							{!(subtype === PropertyType.COMM || subtype === PropertyType.P) && (
								<Col xs={24} md={12}>
									<Residential changeData={setInput} record={getNewRec()} res={res} setRes={setRes} />
								</Col>
							)}
						</Row>
					</Col>
					<Col xs={24} md={12}>
						<Amount
							changeData={setInput}
							record={getNewRec()}
							fields={fields}
							info={info}
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
							setSy={setSy}
							info={info.date}
						/>
					</Col>
					<Col xs={24} md={12}>
						<Rate
							changeData={setInput}
							record={getNewRec()}
							pre={fields.rate}
							rate={rate}
							setRate={setRate}
							info={info.rate}
						/>
					</Col>
					<Col xs={24} md={12}>
						<MarketValue
							changeData={setInput}
							record={getNewRec()}
							pre={fields.mv}
							mv={mv}
							setMv={setMv}
							setMvm={setMvm}
							setMvy={setMvy}
							info={fields.mv}
						/>
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
							info={info.pin}
						/>
					</Col>
					<Col xs={24} md={12}>
						<Address
							changeData={setInput}
							record={getNewRec()}
							pre={fields.address}
							info={info.address}
							setAdd={setAddress}
							add={address}
						/>
					</Col>
					<Col xs={24} md={12}>
						<Comment
							changeData={setInput}
							record={getNewRec()}
							pre={fields.name}
							setName={setName}
							name={name}
						/>
					</Col>
					{Object.keys(familyOptions).length > 1 &&
					own &&
					own[0] && (
						<Fragment>
							<Col xs={24}>
								{fields.owner}
								{error && (
									<Alert
										type={'error'}
										message={'Owner percentage combination should equal to 100'}
									/>
								)}
							</Col>
							<Owner changeData={setInput} record={getNewRec()} owner={own} setOwner={setOwn}/>
						</Fragment>
					)}
				</Row>
			</Col>
		</Row>
	);
}
