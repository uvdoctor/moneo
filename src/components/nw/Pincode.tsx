import React from 'react';
import { PropertyInput } from '../../api/goals';
import TextInput from '../form/textinput';

interface PincodeProps {
	data?: Array<PropertyInput>;
	changeData: Function;
	record: PropertyInput;
	pre: string;
	pin?: string;
	city?: string;
	state?: string;
	setPin?: Function;
	setState?: Function;
	setCity?: Function;
	info?: string;
}

export default function Pincode({
	data,
	changeData,
	record,
	pre,
	pin,
	setPin,
	setState,
	setCity,
	city,
	state,
	info
}: PincodeProps) {
	const isListProperty: boolean = setPin ? false : true;
	const pincode = isListProperty ? record.pin : pin;
	const cityToConsider = isListProperty ? record.city : city;
	const stateToConsider = isListProperty ? record.state : state;

	const changePin = async (val: any) => {
		setPin && setPin(val);
		record.pin = Number(val);
    record.state = '';
	  record.city = '';
    setState && setState('');
		setCity && setCity('');
		if (record.curr === 'INR') {
			if (val.length === 6) {
				const response = await fetch(`https://api.postalpincode.in/pincode/${val}`);
				const resdata = await response.json();
				const state = resdata[0] && resdata[0].PostOffice && resdata[0].PostOffice[0].State;
				const city = resdata[0] && resdata[0].PostOffice && resdata[0].PostOffice[0].District;
				setState && setState(state);
				setCity && setCity(city);
				record.state = state;
				record.city = city;
				record.pin = Number(val);
			}
		}
		isListProperty && data ? changeData([ ...data ]) : changeData(record);
	};

	return (
		<TextInput
			pre={pre}
			info={info}
			value={String(pincode)}
			changeHandler={changePin}
			size={'middle'}
			style={{ width: 250 }}
			post={cityToConsider && stateToConsider && <label>{`${cityToConsider}, ${stateToConsider}`}</label>}
		/>
	);
}
