import React, { Fragment } from 'react';
import DynamicTargetInput from '../form/DynamicTargetInput';
import Section from '../form/section';

export default function Expect() {
	return (
		<Fragment>
			<Section
				title="Potential Gains (eg: Inheritance, Selling Investments, etc.) excluding taxes & fees"
			>
				<DynamicTargetInput />
			</Section>

			<Section
				title="Potential Losses (eg: Inheritance, Selling Investments, etc.) including taxes & fees"
			>
				<DynamicTargetInput lossInput />
			</Section>
		</Fragment>
	);
}
