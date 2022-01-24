import React from 'react';
import { PropertyInput } from '../../api/goals';
import TextInput from '../form/textinput';

interface AddressProps {
	data?: Array<PropertyInput>;
	add?: string;
	changeData: Function;
	record: PropertyInput;
	setAdd?: Function;
	pre: string;
}

export default function Address({ data, changeData, record, pre, add, setAdd }: AddressProps) {
	const isListProperty: boolean = setAdd ? false : true;
	const address = isListProperty ? record.address : add;

	const changeAddress = (val: string) => {
		setAdd && setAdd(val);
		record.address = val;
		isListProperty && data ? changeData([ ...data ]) : changeData(record);
	};

	return <TextInput pre={pre} value={address as string} changeHandler={changeAddress} size="middle" />;
}
