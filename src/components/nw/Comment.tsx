import React from 'react';
import { PropertyInput } from '../../api/goals';
import TextInput from '../form/textinput';

interface CommentProps {
	data?: Array<PropertyInput>;
	name?: string;
	changeData: Function;
	record: PropertyInput;
	setName?: Function;
	pre: string;
}

export default function Comment({ data, changeData, record, pre, name, setName }: CommentProps) {
	const isListProperty: boolean = setName ? false : true;
	const comment = isListProperty ? record.name : name;

	const changeComment = (val: string) => {
		setName && setName(val);
		record.name = val;
		isListProperty && data ? changeData([ ...data ]) : changeData(record);
	};

	return (
		<TextInput
			pre={pre}
			value={comment as string}
			changeHandler={changeComment}
			size="middle"
			info="Please add any comment you would like to add for your reference"
		/>
	);
}
