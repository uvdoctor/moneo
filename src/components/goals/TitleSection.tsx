import React, { useContext } from 'react';
import { Button, Space } from 'antd';
import { CaretLeftOutlined } from '@ant-design/icons';
import SelectInput from '../form/selectinput';
import { getRangeFactor } from '../utils';
import { CalcContext } from '../calc/CalcContext';

export default function TitleSection() {
	const { title, currency, setCurrency, rangeFactor, setRangeFactor, cancelCalc }: any = useContext(CalcContext);

	const changeCurrency = (curr: string) => {
		setRangeFactor(Math.round(getRangeFactor(curr) / rangeFactor));
		setCurrency(curr);
	};

	return (
		<Space align="center" size="large">
			<Button type="link" onClick={cancelCalc} icon={<CaretLeftOutlined />}>
				Back
			</Button>
			<h1>{title}</h1>
			<SelectInput pre="" value={currency} changeHandler={changeCurrency} currency />
		</Space>
	);
}
