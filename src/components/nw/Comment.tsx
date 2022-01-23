import React from 'react';
import { HoldingInput } from '../../api/goals';
import TextInput from '../form/textinput';

interface CommentProps {
	data?: Array<HoldingInput>;
	name?: string;
	changeData: Function;
	record: HoldingInput;
	setName?: Function;
	pre: string;
}

export default function Comment({ data, changeData, record, pre, name, setName }: CommentProps) {
	const isListHolding: boolean = setName ? false : true;
	const comment = isListHolding ? record.name : name;

	const changeComment = (val: string) => {
		setName && setName(val);
		record.name = val;
		isListHolding && data ? changeData([ ...data ]) : changeData(record);
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
