import { Form, Row, Col } from 'antd';
import React, { useContext, useEffect, useState } from 'react';
import { AssetSubType, AssetType, HoldingInput } from '../../api/goals';
import { AppContext } from '../AppContext';
import ItemDisplay from '../calc/ItemDisplay';
import NumberInput from '../form/numberinput';
import TextInput from '../form/textinput';
import ResultCarousel from '../ResultCarousel';
import { presentMonth, presentYear } from '../utils';
import Amount from './Amount';
import Category from './Category';
import DateColumn from './DateColumn';
import { LIABILITIES_TAB, NATIONAL_SAVINGS_CERTIFICATE, NWContext, TAB } from './NWContext';
import { hasDate, hasName, hasPF, hasRate, hasOnlyCategory, calculateValuation } from './nwutils';
import Rate from './Rate';
import { calculateAddYears, calculateCompundingIncome } from './valuationutils';
interface AddHoldingInputProps {
	setInput: Function;
	disableOk: Function;
	categoryOptions: any;
	fields: any;
	defaultRate: number;
}
export default function AddHoldingInput({
	setInput,
	disableOk,
	categoryOptions,
	fields,
	defaultRate
}: AddHoldingInputProps) {
	const { childTab, selectedCurrency, npsData, activeTab }: any = useContext(NWContext);
	const { userInfo, discountRate, ratesData }: any = useContext(AppContext);
	const { PM, CRYPTO, LENT, NPS, PF, VEHICLE, LOAN, INS, OTHER, P2P, LTDEP } = TAB;
	const [ category, setCategory ] = useState<string>(
		categoryOptions ? categoryOptions.length && categoryOptions[0].value : ''
	);
	const [ subCat, setSubCat ] = useState<string>(
		categoryOptions && !hasOnlyCategory(childTab)
			? categoryOptions.length && categoryOptions[0].children[0].value
			: category === 'NBD' || childTab === P2P ? '0' : ''
	);
	const [ name, setName ] = useState<string>('');
	const [ qty, setQty ] = useState<number>(0);
	const [ rate, setRate ] = useState<number>(defaultRate);
	const [ sm, setSm ] = useState<number>(presentMonth);
	const [ em, setEm ] = useState<number>(presentMonth);
	const [ sy, setSy ] = useState<number>(childTab === VEHICLE ? presentYear - 5 : presentYear);
	const [ ey, setEy ] = useState<number>(presentYear + 2);
	const [ amt, setAmt ] = useState<number>(0);
	const [ valuation, setValuation ] = useState<number>(0);
	const [ maturityAmt, setMaturityAmt ] = useState<number>(0);

	const getNewRec = () => {
		let newRec: HoldingInput = {
			id: '',
			qty: 0,
			fId: '',
			curr: selectedCurrency
		};
		switch (childTab) {
			case INS:
				newRec.chg = category !== 'L' ? rate : 0;
				newRec.chgF = Number(subCat);
				newRec.subt = category;
				newRec.sm = presentMonth;
				newRec.sy = presentYear;
				newRec.em = category !== 'H' ? sm : 0;
				newRec.ey = category !== 'H' ? sy : 0;
				break;
			case LOAN:
				newRec.chg = rate;
				newRec.chgF = 12;
				newRec.name = name;
				newRec.sm = presentMonth;
				newRec.sy = presentYear;
				newRec.em = sm;
				newRec.ey = sy;
				break;
			case LENT:
				newRec.type = AssetType.F;
				newRec.subt = category;
				newRec.chg = rate;
				newRec.chgF = Number(subCat);
				newRec.name = name;
				newRec.sm = sm;
				newRec.sy = sy;
				newRec.em = em;
				newRec.ey = ey;
				break;
			case LTDEP:
				const { year, month } = calculateAddYears(sm, sy, 5);
				newRec.type = AssetType.F;
				newRec.subt = category;
				newRec.chg = rate;
				newRec.chgF = 1;
				newRec.name = name;
				newRec.sm = sm;
				newRec.sy = sy;
				newRec.em = category === NATIONAL_SAVINGS_CERTIFICATE ? month : em;
				newRec.ey = category === NATIONAL_SAVINGS_CERTIFICATE ? year : ey;
				break;
			case P2P:
				newRec.type = AssetType.F;
				newRec.subt = AssetSubType.P2P;
				newRec.chg = rate;
				newRec.chgF = Number(category);
				newRec.name = name;
				newRec.sm = sm;
				newRec.sy = sy;
				newRec.em = em;
				newRec.ey = ey;
				break;
			case NPS:
				newRec.subt = category;
				newRec.name = subCat;
				break;
			case PF:
				newRec.subt = category;
				newRec.chg = rate;
				newRec.chgF = 1;
				newRec.type = AssetType.F;
				newRec.sm = presentMonth;
				newRec.sy = presentYear;
				break;
			case VEHICLE:
				newRec.chg = 15;
				newRec.chgF = 1;
				newRec.type = AssetType.A;
				newRec.subt = category;
				newRec.sm = sm;
				newRec.sy = sy;
				newRec.name = name;
				break;
			case PM:
				newRec.type = AssetType.A;
				newRec.subt = category;
				newRec.name = subCat;
				break;
			case CRYPTO:
				newRec.type = AssetType.A;
				newRec.subt = AssetSubType.C;
				newRec.name = category;
				break;
			case OTHER:
				newRec.type = AssetType.A;
				newRec.subt = category;
				newRec.name = name;
				break;
			default:
				newRec.name = name;
				break;
		}
		if (childTab === PM || childTab === CRYPTO) {
			newRec.curr = 'USD';
		}
		newRec.amt = amt;
		newRec.qty = qty;
		return newRec;
	};
	const changeName = (val: string) => {
		setName(val);
		let rec = getNewRec();
		rec.name = val;
		setInput(rec);
	};

	const changeQty = (qty: number) => {
		setQty(qty);
		disableOk(qty <= 0);
		let rec = getNewRec();
		rec.qty = qty;
		setInput(rec);
	};

	useEffect(
		() => {
			const valuation = calculateValuation(
				childTab,
				getNewRec(),
				userInfo,
				discountRate,
				ratesData,
				selectedCurrency,
				npsData
			);
			setValuation(valuation);
			const maturityAmt = calculateCompundingIncome(getNewRec()).maturityAmt;
			setMaturityAmt(maturityAmt);
		},
		[
			amt,
			category,
			sm,
			sy,
			em,
			ey,
			rate,
			subCat,
			childTab,
			userInfo,
			discountRate,
			ratesData,
			selectedCurrency,
			npsData,
			qty
		]
	);

	const { Item: FormItem } = Form;

	return (
		<Form layout="vertical">
			<Row justify="center">
				<Col xs={24} sm={24}>
					<ResultCarousel
						results={
							childTab === P2P || childTab === LENT || childTab === LTDEP ? (
								[
									<ItemDisplay
										key="valuation"
										label="Current Value"
										result={valuation}
										currency={selectedCurrency}
										pl
									/>,
									<ItemDisplay
										label="Maturity Amount"
										key="maturity"
										result={maturityAmt}
										currency={selectedCurrency}
										pl
									/>
								]
							) : (
								[
									<ItemDisplay
										key="valuation"
										label="Current Value"
										result={activeTab === LIABILITIES_TAB ? -valuation : valuation}
										currency={selectedCurrency}
										pl
									/>
								]
							)
						}
					/>
				</Col>
			</Row>
			<Row gutter={[ { xs: 0, sm: 0, md: 35 }, { xs: 15, sm: 15, md: 15 } ]}>
				{categoryOptions && (
					<Col xs={24} md={12}>
						<FormItem label={fields.type}>
							<Category
								categoryOptions={categoryOptions}
								category={category}
								subCategory={subCat}
								record={getNewRec()}
								changeData={setInput}
								setRate={setRate}
								setCategory={setCategory}
								setSubCat={setSubCat}
							/>
						</FormItem>
					</Col>
				)}
				<Col xs={24} md={12}>
					<Amount
						qty={qty}
						amt={amt}
						setAmt={setAmt}
						setQty={setQty}
						changeData={setInput}
						record={getNewRec()}
						fields={fields}
					/>
				</Col>
				{hasPF(childTab) && (
					<Col xs={24} md={12}>
						<FormItem label={fields.qty}>
							<NumberInput
								min={1}
								pre=""
								value={qty}
								changeHandler={changeQty}
								currency={selectedCurrency}
							/>
						</FormItem>
					</Col>
				)}
				{hasDate(childTab, category) && (
					<Col xs={24} md={12}>
						<DateColumn
							changeData={setInput}
							record={getNewRec()}
							pre={fields.date}
							sm={sm}
							sy={sy}
							ey={ey}
							em={em}
							setEm={setEm}
							setEy={setEy}
							setSm={setSm}
							setSy={setSy}
						/>
					</Col>
				)}
				{(hasRate(childTab) || (category !== 'L' && childTab === INS)) && (
					<Col xs={24} md={12}>
						<Rate
							changeData={setInput}
							record={getNewRec()}
							pre={fields.rate}
							rate={rate}
							setRate={setRate}
						/>
					</Col>
				)}
				{hasName(childTab) && (
					<Col xs={24} md={12}>
						<Row>
							<Col>
								<TextInput
									pre="Comments"
									value={name}
									changeHandler={changeName}
									size="middle"
									info="Please add any comment you would like to add for your reference"
								/>
							</Col>
						</Row>
					</Col>
				)}
			</Row>
		</Form>
	);
}
