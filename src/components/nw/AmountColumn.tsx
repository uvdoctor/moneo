import { Row, Col } from 'antd';
import React, { useContext } from 'react';
import { HoldingInput } from '../../api/goals';
import NumberInput from '../form/numberinput';
import { NWContext, TAB } from './NWContext';
import QuantityWithRate from './QuantityWithRate';

interface AmountColumnProps {
	data: Array<HoldingInput>;
	changeData: Function;
	record: HoldingInput;
}

export default function AmountColumn({ data, changeData, record }: AmountColumnProps) {
	const { childTab }: any = useContext(NWContext);
	const { PM, CRYPTO, NPS, PF, LENT, INS } = TAB;

	const changeAmt = (amt: number) => {
		record.amt = amt;
		if (hasPF(childTab)) {
			record.sm = new Date().getMonth() + 1;
			record.sy = new Date().getFullYear();
		}
		changeData([ ...data ]);
	};

	const changeQty = (qty: number) => {
		record.qty = qty;
		if (hasPF(childTab)) {
			record.sm = new Date().getMonth() + 1;
			record.sy = new Date().getFullYear();
		}
		changeData([ ...data ]);
	};

	const changeChg = (chg: number) => {
		record.chg = chg;
		changeData([ ...data ]);
	};

	const hasQtyWithRate = (childTab: string) => [ PM, NPS, CRYPTO ].includes(childTab);

	const hasRate = (childTab: string) => [ PF, LENT ].includes(childTab);

	const hasPF = (childTab: string) => [ PF ].includes(childTab);

	return (
		<Row>
			{hasQtyWithRate(childTab) ? (
				<Col>
					<QuantityWithRate
						quantity={record.qty}
						name={record.name as string}
						subtype={record.subt as string}
						onChange={(val: number) => changeQty(val)}
					/>
				</Col>
			) : (
				<Col>
					<NumberInput
						isBasic={true}
						pre=""
						min={10}
						max={100000000}
						value={record.amt as number}
						changeHandler={(val: number) => changeAmt(val)}
						currency={record.curr as string}
						step={1}
						noSlider
					/>
				</Col>
			)}
			{(hasRate(childTab) || (childTab === INS && record.subt !== 'L')) && (
				<Col>
					<NumberInput
						isBasic={true}
						pre=""
						min={0}
						max={50}
						value={record.chg as number}
						changeHandler={(val: number) => changeChg(val)}
						step={0.1}
						noSlider
						post='%'
					/>
				</Col>
			)}
		</Row>
	);
}
