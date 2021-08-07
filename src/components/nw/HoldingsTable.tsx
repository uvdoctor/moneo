import React, { Fragment, useEffect, useState } from 'react';
import { Empty } from 'antd';
import Holding from './Holding';

import './HoldingsTable.less';
import { HoldingInput } from '../../api/goals';

interface HoldingsTableProp {
	data: any;
	onChange: Function;
}

export default function HoldingsTable({ data, onChange }: HoldingsTableProp) {
	const [ids, setIds] = useState<Array<string>>(Object.keys(data));

	const deleteHolding = (id: string) => {
		delete data[id];
		setIds([...Object.keys(data)]);
		onChange(data);
	};

	const editHolding = (holding: HoldingInput) => {
		data[holding.id] = holding;
		onChange(data);
	};

	return ids.length ? (
		<Fragment>
			{Object.keys(data).map((key: string) => (
				data[key].qty && <Holding key={key} holding={data[key]} onChange={editHolding} onDelete={deleteHolding} />
			))}
		</Fragment>
	) : (
		<Empty description={<p>No data found.</p>} />
	);
}
