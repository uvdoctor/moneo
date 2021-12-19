import { Row, Col } from "antd";
import React, { Fragment, useContext } from "react";
import { AssetSubType, HoldingInput } from "../../api/goals";
import DatePickerInput from "../form/DatePickerInput";
import NumberInput from "../form/numberinput";
import SelectInput from "../form/selectinput";
import TextInput from "../form/textinput";
import { getMonthIndex, getMonthName } from "../utils";
import Duration from "./addHoldings/Duration";
import { NWContext, TAB } from "./NWContext";
import QuantityWithRate from "./QuantityWithRate";

interface ViewHoldingInputProps {
	data: Array<HoldingInput>;
	changeData: Function;
	categoryOptions: any;
	subCategoryOptions: any;
	record: HoldingInput;
}

export default function ViewHoldingInput({
	data,
	changeData,
	categoryOptions,
	subCategoryOptions,
	record,
}: ViewHoldingInputProps) {
	const { childTab }: any = useContext(NWContext);
	const { PM, CRYPTO, LENT, NPS, PF, VEHICLE, LOAN, INS } = TAB;

	const changeDuration = (val: any) => {
		if (record.pur) record.pur.qty = val;
		changeData([...data]);
	};

	const changeName = (val: any) => {
		record.name = val;
		changeData([...data]);
	};

	const changeQty = (quantity: number) => {
		if (record.pur) {
			record.pur.amt = quantity;
			if (hasPF(childTab)) {
				record.pur.month = new Date().getMonth() + 1;
				record.pur.year = new Date().getFullYear();
			}
		} else record.qty = quantity;
		changeData([...data]);
	};

	const changeChg = (chg: number) => {
		record.chg = chg;
		changeData([...data]);
	};

	const changeCategory = (subtype: string) => {
		record.subt = subtype;
		if (subCategoryOptions) {
			let opts = subCategoryOptions[subtype];
			if (!opts) return changeData([...data]);
			if (childTab === LENT) {
				if (!opts[record.chgF as number])
					record.chgF = Number(Object.keys(opts)[0]);
			} else {
				if (!opts[record.name as string]) record.name = Object.keys(opts)[0];
			}
		}
		changeData([...data]);
	};

	const changeSubCategory = (val: string) => {
		childTab === LENT || childTab === INS
			? (record.chgF = Number(val))
			: (record.name = val);
		changeData([...data]);
	};

	const changePurchaseDate = (val: string) => {
		if (record.pur) {
			record.pur.year = Number(val.substring(val.length - 4));
			record.pur.month = getMonthIndex(val.substring(0, 3));
			changeData([...data]);
		}
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

	return (
		<Fragment>
			{categoryOptions && (
				<Col xs={24} sm={12} md={8} lg={6} xl={6} xxl={4}>
					<SelectInput
						pre=""
						value={record.subt as string}
						options={categoryOptions}
						changeHandler={(val: string) => changeCategory(val)}
					/>
					{subCategoryOptions
						? subCategoryOptions[record.subt as string] && (
								<SelectInput
									pre=""
									value={
										childTab === LENT
											? (record.chgF as number)
											: (record.name as string)
									}
									options={subCategoryOptions[record.subt as string]}
									changeHandler={(val: string) => changeSubCategory(val)}
									post={record.subt === AssetSubType.Gold ? "karat" : ""}
								/>
						  )
						: null}
					{childTab === INS && (
						<SelectInput
							pre={""}
							options={{ 1: "Yearly", 12: "Monthly" }}
							value={record.chgF as number}
							changeHandler={(val: string) => changeSubCategory(val)}
						/>
					)}
				</Col>
			)}
			{hasName(childTab) && (
				<Col xs={24} sm={12} md={8} lg={6} xl={6} xxl={3}>
					<Row align="middle" gutter={[5, 0]}>
						<Col>Name</Col>
						<Col>
							<TextInput
								pre=""
								changeHandler={(val: string) => changeName(val)}
								value={record.name as string}
								size={"middle"}
								width={200}
							/>
						</Col>
					</Row>
				</Col>
			)}
			{hasQtyWithRate(childTab) ? (
				<Col xs={24} sm={12} md={8} lg={6} xl={6} xxl={3}>
					<QuantityWithRate
						quantity={record.qty}
						name={record.name as string}
						subtype={record.subt as string}
						onChange={(val: number) => changeQty(val)}
					/>
				</Col>
			) : (
				<Col xs={24} sm={12} md={8} lg={6} xl={6} xxl={3}>
					<Row align="middle" gutter={[5, 0]}>
						<Col>{hasPF(childTab) ? "Contribution per year" : "Amount"}</Col>
						<Col>
							<NumberInput
								isBasic={true}
								pre=""
								min={10}
								max={100000000}
								value={record.pur ? record.pur.amt : record.qty}
								changeHandler={(val: number) => changeQty(val)}
								currency={record.curr as string}
								step={1}
								noSlider
							/>
						</Col>
					</Row>
				</Col>
			)}
			{hasRate(childTab) && (
				<Col xs={24} sm={12} md={8} lg={6} xl={6} xxl={3}>
					<NumberInput
						pre={"Rate"}
						min={1}
						max={50}
						value={record.chg as number}
						changeHandler={changeChg}
						step={0.1}
						noSlider
						unit="%"
					/>
				</Col>
			)}
			{hasDate(childTab) && record.pur && (
				<>
					<Col xs={24} sm={12} md={8} lg={6} xl={6} xxl={3}>
						<DatePickerInput
							picker="month"
							title="Date "
							changeHandler={(val: string) => changePurchaseDate(val)}
							defaultVal={`${getMonthName(record.pur.month, true)}-${
								record.pur.year
							}`}
							size={"middle"}
						/>
					</Col>
					{hasDuration(childTab) && (
						<Col xs={24} sm={12} md={8} lg={6} xl={6} xxl={3}>
							<Row align="middle" gutter={[5, 0]}>
								<Col>Duration</Col>
								<Col>
									<Duration
										value={record.pur.qty as number}
										changeHandler={changeDuration}
										option={
											record.subt === "NSE"
												? { 5: "Five Years", 10: "Ten Years" }
												: null
										}
									/>
								</Col>
							</Row>
						</Col>
					)}
				</>
			)}
		</Fragment>
	);
}
