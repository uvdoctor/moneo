import { Collapse } from 'antd';
import React, { Fragment, useContext } from 'react';
import { toHumanFriendlyCurrency } from '../utils';
import { NWContext } from './NWContext';

export default function PMValuation() {
	const { Panel } = Collapse;
	const { selectedCurrency }: any = useContext(NWContext);
	
    /*const GOLD = 'GC';
    const SILVER = 'SI';
    const PLATINUM = 'PL';
    const PALLADIUM = 'PA';*/

    /*const getPMHolding = (id: string, member: string, type: string) => {
        let newPMHolding = {id: type, fIds: [member], qty: 0, type: type};
        if(!holdings.pm.length) {
            holdings.pm.push(newPMHolding);
            return newPMHolding;
        }
        let filteredHolding = (holdings.pm.filter((holding: HoldingInput) => holding.id === type && holding.fIds[0] === member && type === type))[0];
        if(!filteredHolding) {
            holdings.pm.push(newPMHolding);
            return newPMHolding;
        }
    };*/

	return (
		<Fragment>
			<Collapse>
				<Panel key="gold" header={`Gold - ${toHumanFriendlyCurrency(0, selectedCurrency)}`}>
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
	);
}
