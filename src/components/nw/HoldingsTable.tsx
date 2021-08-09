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
	const [numOfHoldings, setNumOfHoldings] = useState<number>(Object.keys(data).length);

	const deleteHolding = (id: string) => {
		delete data[id];
		onChange(data);
		setNumOfHoldings(numOfHoldings - 1);
	};

	const editHolding = (holding: HoldingInput) => {
		data[holding.id] = holding;
		onChange(data);
	};

	useEffect(() => {
		setNumOfHoldings(Object.keys(data).length);
	}, []);

	useEffect(() => {
		setNumOfHoldings(Object.keys(data).length);
	}, [Object.keys(data)]);

	return numOfHoldings ? (
		<Fragment>
			{Object.keys(data).map((key: string) => (
				data[key].qty && <Holding key={key} holding={data[key]} onChange={editHolding} onDelete={deleteHolding} />
			))}
		</Fragment>
	) : (
		<Empty description={<p>No data found.</p>} />
	);
}
