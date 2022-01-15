import { Select } from 'antd';
import React from 'react';

interface InterestProps {
	value: string;
  onChange: Function;
}

export default function Interest({ value, onChange }: InterestProps) {
  const { Option, OptGroup } = Select;
	

	return (
		<Select
			defaultValue={value}
			style={{ width: 150 }}
			onChange={(val)=>onChange(val)}
		>
			<Option value="0">Interest paid out</Option>
			<OptGroup label="Interest accumulates every">
				<Option value="4">3 months</Option>
				<Option value="2">6 months</Option>
				<Option value="1">Year</Option>
			</OptGroup>
		</Select>
	);
}
