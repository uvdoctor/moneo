import { Radio } from 'antd';
import React from 'react';

interface RadioInputProps {
	options?: Array<string>;
	from?: number;
	to?: number;
	increment?: number;
	value: string | number;
	changeHandler: Function;
}

export default function RadioInput({ options, from, to, increment, value, changeHandler }: RadioInputProps) {
	const buildYearsOptions = () => {
		if (!from || !to || !increment) return [];
		let result = [];
		for (let i = from; i <= to; i += increment) result.push("" + i);
		return result;
	};

	const radioOptions: Array<string> = options ? options : buildYearsOptions();

	return (
        <>
            <Radio.Group
                defaultValue={"" + value}
                value={"" + value}
                onChange={(e) => changeHandler(options ? e.target.value : parseInt(e.target.value))}
            >
                {radioOptions.map((option: string) => 
                    <Radio.Button value={option} key={option}>{option}</Radio.Button>
                )}
                
            </Radio.Group>
            {from ? ' years' : ''}
        </>
	);
}
