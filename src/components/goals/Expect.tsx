import React, { Fragment } from 'react';
import DynamicTgtInput from '../form/dynamictgtinput';
import Section from '../form/section';

export default function Expect() {
	return (
		<Fragment>
			<Section
				title="Potential Gains (eg: Inheritance, Selling Investments, etc.)"
				footer="Exclude taxes & fees."
			>
				<DynamicTgtInput />
			</Section>

			<Section
				title="Potential Losses (eg: Inheritance, Selling Investments, etc.)"
				footer="Include taxes & fees."
			>
				<DynamicTgtInput lossInput />
			</Section>
		</Fragment>
	);
}
