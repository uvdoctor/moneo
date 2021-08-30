import { Button, Collapse } from 'antd';
import React, { Fragment, useContext } from 'react';
import { AssetSubType, AssetType, HoldingInput } from '../../api/goals';
import { toHumanFriendlyCurrency } from '../utils';
import DynamicHoldingInput from './DynamicHoldingInput';
import { NWContext } from './NWContext';
import { PlusOutlined } from '@ant-design/icons';

export default function PMValuation() {
	const { selectedCurrency, preciousMetals, setPreciousMetals, ratesData, allFamily, loadingRates }: any = useContext(
		NWContext
	);

	return !loadingRates ? (
		<DynamicHoldingInput holdings={preciousMetals} changeHoldings={setPreciousMetals} />
	): null;
}
