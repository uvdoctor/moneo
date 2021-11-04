import React from 'react';
import { GoalType } from '../api/goals';
import Layout from '../components/calc/Layout';
import { CALC_NAMES } from '../CONSTANTS';

export default function BuyOrRent() {
	const assumptions = [
		{
			title: 'Money saved from not Buying is immediately Invested',
			content: `For Buy v/s Rent comparison, Calculation assumes that Money saved due to Renting instead of Buying is immediately Invested. For instance, consider furniture worth $9,000 with Yearly Rent of $1,000. This means that if You Pay $1,000 for Yearly Rent, then remaining $8,000 will be immediately Invested.`
		},
	];

	const features = [
		{
			title: "Works for any Asset",
			content: `Calculation will work for any Asset that can be bought / rented (eg: property, car, furniture, gadget, etc)`
		},
		{
			title: "Supports custom payment plan",
			content: `Works even for multiple payments across different timelines (eg: progress-linked payments for off-plan properties)`
		},
		{
			title: "XIRR for loss / gain calculation",
			content: `Uses industry standard Extended Internal Rate of Return (XIRR) method to calculate loss / gain as multiple cash flows happen at different times`
		},
		{
			title: "NPV for buy vs rent comparison",
			content: `Compares Net Present Value (NPV) of both options from 1 to upto 50 years to identify the cheaper option`
		}
	];

	const results = [
		`Which option is cheaper - buy or rent? Up to how many years? Analysis available for up to 50 years`,
		"Yearly Gain or Loss for Buy option",
		"Total Maintenance Cost",
		"Total Income that can be expected"
	];

	const terms = [
		{
			title: 'Custom Payment Plan',
			content: `Default payment option allows for a single payment for buying an asset, or down-payment followed by monthly payments in case of Loan. However, it is possible that You want to input a multi-year payment plan where payment amount and schedule vary. For instance, in case of buying an off-plan property, there may be a payment plan spread over multiple years and linked to percentage completion of the property. In such a case, You can use Custom Payment Plan option to input specific payments for specific years.`
		}
	];

	return (
		<Layout
			title={CALC_NAMES.BR}
			type={GoalType.B}
			assumptions={assumptions}
			features={features}
			demoUrl={`https://www.youtube.com/watch?v=M_4cdKdKYiw`}
			results={results}
			terms={terms}
		/>
	);
}
