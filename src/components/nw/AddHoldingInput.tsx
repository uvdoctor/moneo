import { UserOutlined } from "@ant-design/icons";
import { Form, Row, Col } from "antd";
import React, { useContext, useState } from "react";
import { AssetSubType, AssetType, HoldingInput } from "../../api/goals";
import DatePickerInput from "../form/DatePickerInput";
import NumberInput from "../form/numberinput";
import SelectInput from "../form/selectinput";
import TextInput from "../form/textinput";
import { getMonthIndex } from "../utils";
import Duration from "./addHoldings/Duration";
import { NWContext, TAB } from "./NWContext";
import { getDefaultMember, getFamilyOptions } from "./nwutils";
import QuantityWithRate from "./QuantityWithRate";

interface AddHoldingInputProps {
	setInput: Function;
	disableOk: Function;
	categoryOptions: any;
	subCategoryOptions?: any;
}

export default function AddHoldingInput({
	setInput,
	disableOk,
	categoryOptions,
	subCategoryOptions,
}: AddHoldingInputProps) {
	const {
		allFamily,
		childTab,
		selectedMembers,
		selectedCurrency,
	}: any = useContext(NWContext);
	const { PM, CRYPTO, LENT, NPS, PF, VEHICLE, LOAN, INS, OTHER } = TAB;
	const [category, setCategory] = useState<string>(
		categoryOptions ? Object.keys(categoryOptions)[0] : ""
	);
	const [subCat, setSubCat] = useState<string>(
		subCategoryOptions && subCategoryOptions[category]
			? Object.keys(subCategoryOptions[category])[0]
			: ""
	);
	const [name, setName] = useState<string>("");
	const [qty, setQty] = useState<number>(0);
	const [memberKey, setMemberKey] = useState<string>(
		getDefaultMember(allFamily, selectedMembers)
	);
	const [rate, setRate] = useState<number>(0);
	const [date, setDate] = useState<string>(
		`Apr-${new Date().getFullYear() - 5}`
	);
	const [duration, setDuration] = useState<number>(5);

	const getNewRec = () => {
		let newRec: HoldingInput = { id: "", qty: 0, fId: "", curr: "" };
		const today = new Date();
		const pur = {
			amt: qty,
			month: getMonthIndex(date.substring(0, 3)),
			year: Number(date.substring(date.length - 4)),
			qty: childTab === VEHICLE ? 1 : duration,
		};

		switch (childTab) {
			case INS:
				newRec.chg = 10;
				newRec.chgF = Number(subCat);
				newRec.pur = pur;
				break;
			case LOAN:
				newRec.chg = rate;
				newRec.chgF = 12;
				newRec.pur = pur;
				newRec.name = name;
				break;
			case LENT:
				newRec.subt = category;
				newRec.chg = rate;
				newRec.chgF = Number(subCat);
				newRec.pur = pur;
				newRec.name = name;
				break;
			case NPS:
				newRec.qty = qty;
				newRec.subt = category;
				newRec.name = subCat;
				break;
			case PF:
				newRec.subt = category;
				newRec.chg = rate;
				newRec.chgF = 1;
				newRec.type = AssetType.F;
				newRec.name = name;
				newRec.pur = {
					amt: qty,
					month: today.getMonth() + 1,
					year: today.getFullYear(),
					qty: 1,
				};
				break;
			case VEHICLE:
				newRec.chg = 15;
				newRec.chgF = 1;
				newRec.type = AssetType.A;
				newRec.subt = category;
				newRec.pur = pur;
				newRec.name = name;
				break;
			case PM:
			case CRYPTO:
				newRec.qty = qty;
				newRec.type = AssetType.A;
				newRec.subt = category;
				newRec.name = subCat;
				break;
			case OTHER:
				newRec.subt = category;
				newRec.name = name;
				newRec.qty = qty;
			default:
				newRec.name = name;
				newRec.qty = qty;
				break;
		}
		if (childTab === INS) newRec.subt = category;
		childTab === PM || childTab === CRYPTO
			? (newRec.curr = "USD")
			: (newRec.curr = selectedCurrency);
		newRec.fId = memberKey;
		return newRec;
	};

	const changeDate = (val: any) => {
		setDate(val);
		let rec = getNewRec();
		const month = getMonthIndex(val.substring(0, 3));
		if (rec.pur) {
			rec.pur.year = Number(val.substring(val.length - 4));
			rec.pur.month = month;
		}
		setInput(rec);
	};

	const changeDuration = (val: number) => {
		setDuration(val);
		disableOk(val <= 0);
		let rec = getNewRec();
		if (rec.pur) rec.pur.qty = val;
		setInput(rec);
	};

	const changeName = (val: string) => {
		setName(val);
		let rec = getNewRec();
		rec.name = val;
		setInput(rec);
	};

	const changeSubCat = (val: string) => {
		setSubCat(val);
		let rec = getNewRec();
		childTab === LENT || childTab === INS
			? (rec.chgF = Number(subCat))
			: (rec.name = val);
		setInput(rec);
	};

	const changeRate = (val: number) => {
		setRate(val);
		disableOk(val <= 0);
		let rec = getNewRec();
		rec.chg = val;
		setInput(rec);
	};

	const changeQty = (qty: number) => {
		setQty(qty);
		disableOk(qty <= 0);
		let rec = getNewRec();
		rec.qty = qty;
		setInput(rec);
	};

	const changeCategory = (subtype: string) => {
		setCategory(subtype);
		if (subCategoryOptions) {
			let opts = subCategoryOptions[subtype];
			if (opts && Object.keys(opts).length && !opts[subCat]) {
				let defaultVal: string = Object.keys(opts)[0];
				setSubCat(defaultVal);
			}
		}
		let rec = getNewRec();
		rec.subt = subtype;
		return rec;
	};

	const changeMember = (key: string) => {
		setMemberKey(key);
		let rec = getNewRec();
		rec.fId = key;
		setInput(rec);
	};

	const hasRate = (childTab: string) => [PF, LENT, LOAN].includes(childTab);

	const hasName = (childTab: string) =>
		![PM, NPS, CRYPTO, INS].includes(childTab);

	const hasQtyWithRate = (childTab: string) =>
		[PM, NPS, CRYPTO].includes(childTab);

	const hasDuration = (childTab: string) =>
		[LENT, LOAN, INS].includes(childTab);

	const hasDate = (childTab: string) =>
		[LENT, VEHICLE, LOAN, INS].includes(childTab);

	const hasPF = (childTab: string) => [PF].includes(childTab);

	const { Item: FormItem } = Form;

	return (
		<Form layout="vertical">
			<Row
				gutter={[
					{ xs: 0, sm: 0, md: 35 },
					{ xs: 15, sm: 15, md: 15 },
				]}
			>
				{categoryOptions && (
					<Col xs={24} md={12}>
						<FormItem label="Type">
							<Row gutter={[10, 0]}>
								<Col>
									{categoryOptions && (
										<SelectInput
											pre=""
											value={category}
											options={categoryOptions}
											changeHandler={(val: string) => changeCategory(val)}
										/>
									)}
								</Col>
								<Col>
									{subCategoryOptions &&
										subCategoryOptions[category as string] && (
											<SelectInput
												pre=""
												value={subCat as string}
												options={subCategoryOptions[category as string]}
												changeHandler={(val: string) => changeSubCat(val)}
												post={category === AssetSubType.Gold ? "karat" : ""}
											/>
										)}
								</Col>
								<Col>
									{childTab === INS && (
										<SelectInput
											pre={""}
											options={{ 1: "Yearly", 12: "Monthly" }}
											value={subCat as string}
											changeHandler={(val: string) => changeSubCat(val)}
										/>
									)}
								</Col>
							</Row>
						</FormItem>
					</Col>
				)}
				{hasName(childTab) && (
					<Col xs={24} md={12}>
						<FormItem label="Name">
							<TextInput
								pre=""
								value={name}
								changeHandler={changeName}
								size={"middle"}
								width={250}
							/>
						</FormItem>
					</Col>
				)}
				{hasQtyWithRate(childTab) ? (
					<Col xs={24} md={12}>
						<FormItem label="Qty">
							<QuantityWithRate
								quantity={qty}
								onChange={changeQty}
								subtype={category}
								name={subCat}
							/>
						</FormItem>
					</Col>
				) : (
					<Col xs={24} md={12}>
						<FormItem
							label={hasPF(childTab) ? "Contribution per year" : "Amount"}
						>
							<NumberInput
								isBasic={true}
								pre=""
								min={0}
								max={10000}
								value={qty}
								changeHandler={changeQty}
								currency={selectedCurrency}
								step={1}
								noSlider
							/>
						</FormItem>
					</Col>
				)}

				{hasDate(childTab) && (
					<Col xs={24} md={12}>
						<FormItem
							label={`Date & ${hasDuration(childTab) ? "Duration" : ""}`}
						>
							<Row gutter={[10, 0]}>
								<Col>
									<DatePickerInput
										picker="month"
										title=""
										changeHandler={changeDate}
										defaultVal={date}
										size={"middle"}
									/>
								</Col>
								{hasDuration(childTab) && (
									<Duration
										value={duration}
										changeHandler={changeDuration}
										option={
											category === "NSE"
												? {
														5: "Five Years",
														10: "Ten Years",
												  }
												: null
										}
									/>
								)}
							</Row>
						</FormItem>
					</Col>
				)}
				{hasRate(childTab) && (
					<Col xs={24} md={12}>
						<FormItem label="Rate">
							<NumberInput
								isBasic={true}
								pre={""}
								min={1}
								max={50}
								value={rate}
								changeHandler={changeRate}
								step={0.1}
								noSlider
								unit="%"
							/>
						</FormItem>
					</Col>
				)}
				<Col xs={24} md={12}>
					<FormItem label="">
						<SelectInput
							pre={<UserOutlined />}
							value={memberKey}
							options={getFamilyOptions(allFamily)}
							changeHandler={(key: string) => changeMember(key)}
						/>
					</FormItem>
				</Col>
			</Row>
		</Form>
	);
}
