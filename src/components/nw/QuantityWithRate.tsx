import { InputNumber } from 'antd';
import React, { Fragment, useContext, useEffect, useState } from 'react';
import LabelWithTooltip from '../form/LabelWithTooltip';
import { toCurrency } from '../utils';
import { TAB, NWContext } from './NWContext';
import { getCommodityRate, getCryptoRate } from './nwutils';

interface QuantityWithRateProps {
	quantity: number;
	subtype: string;
	name: string;
	onChange: Function;
	pre?: string;
	info?: string;
}
export default function QuantityWithRate({ quantity, subtype, name, onChange, pre, info }: QuantityWithRateProps) {
	const { selectedCurrency, childTab, npsData, fxRates }: any = useContext(NWContext);
	const [ rate, setRate ] = useState<number>(0);

	const getRate = async (subtype: string, name: string) => {
		if (childTab === TAB.NPS) {
			const price = npsData.find((item: any) => item.id === name);
			if (price) return price.price;
		}
		if (childTab === TAB.CRYPTO) {
			return await getCryptoRate(name, selectedCurrency);
		}
		return await getCommodityRate(subtype, name, selectedCurrency, fxRates);
	};

	useEffect(
		() => {
			if (!name || !subtype) {
				setRate(0);
				return;
			}
			getRate(subtype, name).then((rate) => setRate(rate)).catch(() => 0);
		},
		[ name, subtype ]
	);

	return (
		<Fragment>
			{pre && <LabelWithTooltip label={pre} info={info} />}
			<InputNumber
				value={quantity}
				onChange={(quantity: number) => onChange(quantity)}
				min={0}
				max={100000}
				step={0.1}
				size="middle"
			/>
			{` ${childTab === TAB.PM ? ` grams` : ''} x ${toCurrency(rate, selectedCurrency)} `}
		</Fragment>
	);
}
