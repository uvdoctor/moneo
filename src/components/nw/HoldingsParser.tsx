import React, { useContext, useEffect } from 'react';
import HoldingTabs from './HoldingTabs';
import HoldingsChart from './HoldingsChart';
import SearchFilter from './SearchFilter';
import DataSwitcher from '../DataSwitcher';

import './nw.less';
import { NWContext } from './NWContext';
import HoldingsResult from './HoldingsResult';

export default function HoldingsParser() {
	const { holdingsResult, setHoldingsResult }: any = useContext(NWContext);
	const { Chart, List: DataSwitcherList } = DataSwitcher;

	useEffect(() => {
		setHoldingsResult(<HoldingsResult />);
	}, []);
	
	return (
		<div className="nw-container">
			{holdingsResult}
			<DataSwitcher title={<h3>Holdings details</h3>}>
				<Chart>
					<HoldingsChart />
				</Chart>
				<DataSwitcherList>
					<SearchFilter />
					<HoldingTabs />
				</DataSwitcherList>
			</DataSwitcher>
		</div>
	);
}
