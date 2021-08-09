import React, { Fragment } from 'react';
import { Empty } from 'antd';
import Holding from './Holding';

import './HoldingsTable.less';
import { HoldingInput } from '../../api/goals';

interface HoldingsTableProp {
	data: any;
	num: number;
	onChange: Function;
	onNumChange: Function;
}

export default function HoldingsTable({ data, num, onChange, onNumChange }: HoldingsTableProp) {

	const deleteHolding = (id: string) => {
		delete data[id];
		onChange(data);
		onNumChange(num - 1);
	};

	const editHolding = (holding: HoldingInput) => {
		data[holding.id] = holding;
		onChange(data);
	};

	return num ? (
		<Fragment>
			{Object.keys(data).map((key: string) => (
				data[key].qty && <Holding key={key} holding={data[key]} onChange={editHolding} onDelete={deleteHolding} />
			))}
		</Fragment>
	) : (
		<Empty description={<p>No data found.</p>} />
	);
}
