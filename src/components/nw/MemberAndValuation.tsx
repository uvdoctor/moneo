import { Button, Col, Row } from "antd";
import React, { useContext, useEffect, useState } from "react";
import { HoldingInput } from "../../api/goals";
import { AppContext } from "../AppContext";
import SelectInput from "../form/selectinput";
import { toHumanFriendlyCurrency } from "../utils";
import { NWContext, TAB } from "./NWContext";
import { getFamilyOptions } from "./nwutils";
import { DeleteOutlined, UserOutlined } from "@ant-design/icons";
import {
	calculateCompundingIncome,
	calculateCrypto,
	calculateNPS,
	calculateInsurance,
	calculatePM,
	calculateProvidentFund,
	calculateVehicle,
	calculateLoan,
} from "./valuationutils";

interface MemberAndValuationProps {
	data: Array<HoldingInput>;
	changeData: Function;
	record: HoldingInput;
	index: number;
}

export default function MemberAndValuation({
	data,
	record,
	changeData,
	index,
}: MemberAndValuationProps) {
	const { childTab, npsData, selectedCurrency, allFamily }: any = useContext(
		NWContext
	);
	const { ratesData, discountRate, userInfo, user }: any = useContext(AppContext);
	const { PM, CRYPTO, LENT, NPS, PF, VEHICLE, LOAN, INS } = TAB;
	const [valuation, setValuation] = useState<number>(0);

	const changeOwner = (ownerKey: string, i: number) => {
		data[i].fId = ownerKey;
		changeData([...data]);
	};

	const calculateValuation = (childTab: string) => {
		let value = 0;
		switch (childTab) {
			case INS:
				value = calculateInsurance(record, discountRate, userInfo?.le, userInfo?.dob);
				break;
			case LOAN:
				value = calculateLoan(record);
				break;
			case CRYPTO:
				value = calculateCrypto(record, ratesData, selectedCurrency);
				break;
			case PM:
				value = calculatePM(record, ratesData, selectedCurrency);
				break;
			case LENT:
				value = calculateCompundingIncome(record);
				break;
			case NPS:
				const result = calculateNPS(record, npsData);
				value = result.value;
				break;
			case VEHICLE:
				value = calculateVehicle(record);
				break;
			case PF:
				value = calculateProvidentFund(record);
			default:
				value = record.amt as number;
				break;
		}
		return value;
	};

	useEffect(() => {
		setValuation(calculateValuation(childTab));
	}, [childTab, data, record, discountRate]);

	const removeHolding = (i: number) => {
		data.splice(i, 1);
		changeData([...data]);
	};

	return (
		<Row align="middle" gutter={[10, 10]}>
			<Col>
				<UserOutlined />
			</Col>
			<Col>
				<SelectInput
					pre=""
					value={record.fId ? record.fId : ""}
					options={getFamilyOptions(allFamily)}
					changeHandler={(key: string) => changeOwner(key, index)}
				/>
			</Col>
			<Col>
				<label>{toHumanFriendlyCurrency(valuation, selectedCurrency)}</label>
			</Col>
			<Col>
				<Button type="link" onClick={() => removeHolding(index)} danger>
					<DeleteOutlined />
				</Button>
			</Col>
		</Row>
	);
}
