import { Col, Row, Select } from 'antd';
import React, { useContext, useEffect, useState } from 'react';
import { NWContext } from './NWContext';

export const ALL_FAMILY = 'All';

export default function SelectInputFamily() {
	const { allFamily, selectedMembers, setSelectedMembers }: any = useContext(NWContext);
	const { Option } = Select;
	const [ options, setOptions ] = useState<any>({ [ALL_FAMILY]: 'All Family Members' });

	useEffect(
		() => {
			if (Object.keys(allFamily).length) setOptions(Object.assign(options, allFamily));
		},
		[ allFamily ]
	);

	const selectMember = (val: string[]) => {
		if (selectedMembers.includes(val)) return;
		if (!val.length) {
			setSelectedMembers([ ...[ ALL_FAMILY ] ]);
			return;
		}
		let filteredMembers = val.filter((val: string) => val !== ALL_FAMILY);
		setSelectedMembers([ ...filteredMembers ]);
	};

	return (
		<Row align="middle">
			<Col>
				<Select
					showSearch
					mode="multiple"
					value={selectedMembers}
					onChange={(val: string[]) => selectMember(val)}
					showArrow
                    filterOption={(input, option) =>
                        option?.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                    size="middle"
                    maxTagCount={1}
				>
					{Object.keys(options).map((key) => (
						<Option key={key} value={key} disabled={key === ALL_FAMILY}>
							{options[key]}
						</Option>
					))}
				</Select>
			</Col>
		</Row>
	);
}
