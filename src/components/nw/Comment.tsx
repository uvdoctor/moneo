import React from 'react';
import TextInput from '../form/textinput';

interface CommentProps {
	data?: Array<any>;
	name?: string;
	changeData: Function;
	record: any;
	setName?: Function;
	pre: string;
}

export default function Comment({ data, changeData, record, pre, name, setName }: CommentProps) {
	const isListView: boolean = setName ? false : true;
	const comment = isListView ? record.name : name;

	const changeComment = (val: string) => {
		setName && setName(val);
		record.name = val;
		isListView && data ? changeData([ ...data ]) : changeData(record);
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
