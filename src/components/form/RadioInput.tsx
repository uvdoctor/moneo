import { Radio } from 'antd';
import React from 'react';

interface RadioInputProps {
	options?: Array<string>;
	from?: number;
	to?: number;
	increment?: number;
	value: string | number;
	changeHandler: Function;
	unit?: string;
	style?: any;
	size?: any;
}

export default function RadioInput({ options, from, to, increment, value, changeHandler, unit, style, size }: RadioInputProps) {
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
								size={size ? size : 'default'}
            >
                {radioOptions.map((option: string) => 
                    <Radio.Button value={option} style={style} key={option}>{option}</Radio.Button>
                )}
                
            </Radio.Group>
            {unit ? ` ${unit}` : ''}
        </>
	);
}
