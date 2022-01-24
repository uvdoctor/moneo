import React from 'react';
import { PropertyInput } from '../../api/goals';
import HSwitch from '../HSwitch';

interface ResidentialProps {
	data?: Array<PropertyInput>;
	res?: boolean;
	changeData: Function;
	record: PropertyInput;
	setRes?: Function;
}

export default function Residential({ data, changeData, record, res, setRes }: ResidentialProps) {
	const isListProperty: boolean = setRes ? false : true;
	const residential = isListProperty ? record.res : res;

	const changeRes = (val: boolean) => {
		setRes && setRes(val);
		record.res = val;
		isListProperty && data ? changeData([ ...data ]) : changeData(record);
	};

	return (
		// @ts-ignore
		<HSwitch value={residential} setter={changeRes} rightText="I live here" />
	);
}
