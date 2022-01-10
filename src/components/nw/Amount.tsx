import { Row, Col } from 'antd';
import React, { useContext } from 'react';
import { HoldingInput } from '../../api/goals';
import NumberInput from '../form/numberinput';
import { NWContext, TAB } from './NWContext';
import QuantityWithRate from './QuantityWithRate';

interface AmountProps {
	data: Array<HoldingInput>;
	changeData: Function;
	record: HoldingInput;
}

export default function Amount({ data, changeData, record }: AmountProps) {
	const { childTab }: any = useContext(NWContext);
	const { PM, CRYPTO, NPS, PF } = TAB;

	const hasPF = (childTab: string) => [ PF ].includes(childTab);

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

	const hasQtyWithRate = (childTab: string) => [ PM, NPS, CRYPTO ].includes(childTab);

	return (
		<Row align="top" gutter={[ 10, 10 ]}>
			{hasQtyWithRate(childTab) ? (
				<Col>
					<QuantityWithRate
						quantity={record.qty}
						name={record.name as string}
						subtype={childTab === CRYPTO ? record.name as string : record.subt as string}
						onChange={(val: number) => changeQty(val)}
					/>
				</Col>
			) : (
				<Col>
					<NumberInput
						pre=""
						value={record.amt as number}
						changeHandler={(val: number) => changeAmt(val)}
						currency={record.curr as string}
					/>
				</Col>
			)}
		</Row>
	);
}
