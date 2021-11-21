import { InputNumber } from 'antd';
import React, { Fragment, useContext } from 'react';
import { AppContext } from '../AppContext';
import { toCurrency } from '../utils';
import { NPS_TAB, NWContext, PM_TAB } from './NWContext';
import { getCommodityRate, getCryptoRate } from './nwutils';

interface QuantityWithRateProps {
	quantity: number;
    subtype: string;
    name: string;
	onChange: Function;
}
export default function QuantityWithRate({ quantity, subtype, name, onChange }: QuantityWithRateProps) {
	const { selectedCurrency, childTab, npsData }: any = useContext(NWContext);
    const { ratesData }: any = useContext(AppContext);
    
    const getRate = (subtype: string, name: string) => {
		if(childTab===NPS_TAB) {
			const price = npsData.find((item:any) => item.id === name);
			if(price) return price.price;
			}
		if(!name) return getCryptoRate(ratesData, subtype, selectedCurrency);
		return getCommodityRate(ratesData, subtype, name, selectedCurrency);
	}
	
	return (
		<Fragment>
			<InputNumber
				value={quantity}
				onChange={(quantity: number) => onChange(quantity)}
				min={0}
				max={100000}
				step={0.1}
				size='small'
			/>
			{` ${childTab === PM_TAB ? ` grams` : ''} x ${toCurrency(getRate(subtype, name), selectedCurrency)} = ${toCurrency(
				quantity * getRate(subtype, name),
				selectedCurrency
			)}`}
		</Fragment>
	);
}
