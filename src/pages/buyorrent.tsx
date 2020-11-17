import React from 'react';
import { GoalType } from '../api/goals';
import Layout from '../components/calc/Layout';
import { CALC_NAMES } from '../CONSTANTS';

export default function BuyOrRent() {
	const assumptions = [
		{
			title: 'Money saved from not Buying is immediately Invested.',
			content: `For Buy v/s Rent comparison, Calculation assumes that Money saved due to Renting instead of Buying is immediately Invested. For instance, consider furniture worth $9,000 with Yearly Rent of $1,000. This means that if You Pay $1,000 for Yearly Rent, then remaining $8,000 will be immediately Invested.`
		},
	];

	const features = [
		{
			title: "Amortization",
			content: "We bring all of your money to one place, from balances and bills to credit score and more."
		},
		{
			title: "Simple Savings",
			content: "Easily create budgets, and see our suggestions based on your spending."
		},
		{
			title: "Cost-of-living",
			content: "We bring all of your money to one place, from balances and bills to credit score and more."
		},
		{
			title: "CD calculator",
			content: "Easily create budgets, and see our suggestions based on your spending."
		},
		{
			title: "Home affordability",
			content: "Check your free credit score as many times as you like, and get tips to help improve it."
		},
	];

	const results = [
		"Which option is cheaper - buy or rent? Up to how many years? Analysis available for up to 50 years.",
		"Yearly Gain or Loss for Buy option.",
		"Total Cost of Maintaining the Asset.",
		"Total Income that can be expected from the Asset."
	];

	const terms = [
		{
			title: 'Custom Payment Plan',
			content: 'Default payment option allows for a single payment for buying an asset, or down-payment followed by monthly payments in case of Loan. However, it is possible that You want to input a multi-year payment plan where payment amount and schedule vary. For instance, in case of buying an off-plan property, there may be a payment plan spread over multiple years and linked to percentage completion of the property. In such a case, You can use Custom Payment Plan option to input specific payments for specific years.'
		}
	];

	return (
		<Layout
			title={CALC_NAMES.BR}
			type={GoalType.B}
			assumptions={assumptions}
			features={features}
			demoUrl="https://www.youtube.com/watch?v=M_4cdKdKYiw"
			results={results}
			terms={terms}
		/>
	);
}
