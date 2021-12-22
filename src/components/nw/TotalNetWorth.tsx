import { Col, Row } from 'antd';
import React, { useContext } from 'react';
import ItemDisplay from '../calc/ItemDisplay';
import { NWContext } from './NWContext';

export default function TotalNetWorth() {
	const { nw, selectedCurrency }: any = useContext(NWContext);

	return (
		<Row justify="center">
			<Col xs={24} sm={24} md={16} lg={8} className='dd-stat'>
					<ItemDisplay
						label="Net Worth"
						result={nw}
						currency={selectedCurrency}
						pl
						info={'Net Worth equals what you own minus what you owe.'}
					/>
			</Col>
		</Row>
	);
}
