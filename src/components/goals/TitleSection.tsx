import React from 'react';
import { Button, Space } from 'antd';
import { CaretLeftOutlined } from '@ant-design/icons';
import SelectInput from '../form/selectinput';
import { getRangeFactor } from '../utils';

interface StickyHeaderProps {
	title: string;
	cancelCallback: Function;
	currency: string;
	currencyHandler: Function;
	rangeFactorHandler: Function;
}

export default function TitleSection({
	title,
	cancelCallback,
	currency,
	currencyHandler,
	rangeFactorHandler
}: StickyHeaderProps) {
	const changeCurrency = (curr: string) => {
		rangeFactorHandler(Math.round(getRangeFactor(curr) / getRangeFactor(currency)));
		currencyHandler(curr);
	};

	return (
		<Space align="center" size="large">
			<Button type="link" onClick={() => cancelCallback()} icon={<CaretLeftOutlined />}>
				Back
			</Button>
			<h1>{title}</h1>
			<SelectInput pre="" value={currency} changeHandler={changeCurrency} currency />
		</Space>
	);
}
