import { InputNumber } from 'antd';
import React, { Fragment, useContext } from 'react';
import { AppContext } from '../AppContext';
import { toCurrency } from '../utils';
import { NWContext, PM_TAB } from './NWContext';
import { getCommodityRate, getCryptoRate } from './nwutils';

interface QuantityWithRateProps {
	quantity: number;
    subtype: string;
    name: string;
	onChange: Function;
}
export default function QuantityWithRate({ quantity, subtype, name, onChange }: QuantityWithRateProps) {
	const { selectedCurrency, childTab }: any = useContext(NWContext);
    const { ratesData }: any = useContext(AppContext);
    
    const getRate = (subtype: string, name: string) =>
		!name
			? getCryptoRate(ratesData, subtype, selectedCurrency)
			: getCommodityRate(ratesData, subtype, name, selectedCurrency);

	return (
		<Fragment>
			<InputNumber
				value={quantity}
				onChange={(quantity: number) => onChange(quantity)}
				min={0}
				max={100000}
				step={0.1}
				size="small"
			/>
			{` ${childTab === PM_TAB ? ` grams` : ''} x ${toCurrency(getRate(subtype, name), selectedCurrency)} = ${toCurrency(
				quantity * getRate(subtype, name),
				selectedCurrency
			)}`}
		</Fragment>
	);
}
