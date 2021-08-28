import { Button, Collapse } from 'antd';
import React, { Fragment, useContext } from 'react';
import { AssetSubType, AssetType, HoldingInput } from '../../api/goals';
import { toHumanFriendlyCurrency } from '../utils';
import DynamicHoldingInput from './DynamicHoldingInput';
import { NWContext } from './NWContext';
import { PlusOutlined } from '@ant-design/icons';

export default function PMValuation() {
	const { Panel } = Collapse;
	const { selectedCurrency, preciousMetals, setPreciousMetals, ratesData, allFamily, loadingRates }: any = useContext(
		NWContext
	);
	const GOLD = 'GC';
	/*const SILVER = 'SI';
	const PLATINUM = 'PL';
	const PALLADIUM = 'PA';*/

	const addHolding = (subType: string) => {
		const defaultMember = Object.keys(allFamily)[0];
		preciousMetals.push({
			id: AssetType.A + '-' + subType + '-' + defaultMember,
			type: AssetType.A,
			subt: subType as AssetSubType,
			fIds: [ defaultMember ],
			qty: 0
		});
		setPreciousMetals([ ...preciousMetals ]);
	};

	return !loadingRates ? (
		<Fragment>
			<Collapse>
				<Panel
					key="gold"
					header={`Gold - ${toHumanFriendlyCurrency(0, selectedCurrency)}`}
					extra={
						<Button type="link" onClick={() => addHolding(AssetSubType.Gold)}>
							<PlusOutlined />
						</Button>
					}
				>
					{(preciousMetals
						.filter((holding: HoldingInput) => holding.subt === AssetSubType.Gold))
						?.map((holding: HoldingInput, i: number) => (
							<DynamicHoldingInput
                                key={"h"+i}
								holding={holding}
								holdings={preciousMetals}
								subType={AssetSubType.Gold}
								changeHoldings={setPreciousMetals}
								rate={ratesData[GOLD]}
							/>
						))}
				</Panel>
			</Collapse>
			<Collapse>
				<Panel key="silver" header={`Silver - ${toHumanFriendlyCurrency(0, selectedCurrency)}`} />
			</Collapse>
			<Collapse>
				<Panel key="platinum" header={`Platinum - ${toHumanFriendlyCurrency(0, selectedCurrency)}`} />
			</Collapse>
			<Collapse>
				<Panel key="palladium" header={`Palladium - ${toHumanFriendlyCurrency(0, selectedCurrency)}`} />
			</Collapse>
		</Fragment>
	) : null;
}
