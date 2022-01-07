import React from 'react';
import Layout from '../components/calc/Layout';
import { CALC_NAMES } from '../CONSTANTS';
import { GoalType } from '../api/goals';

export default function FI() {
	const assumptions = [
		{
			title: 'Potential returns for different asset classes',
			content: `Calculation makes educated assumptions about potential returns for different asset classes. It is possible that real returns can vary significantly due to the volatile nature of financial markets, macro-economic environment and many other factors.`
		}
	];

	const features = [
		{
			title: 'Inheritance',
			content: `Allows you to configure how much money you want to leave behind for your loved ones.`
		}
	];

	const results = [ 
		'Amount of money needed to achieve FI',
		'Earliest year when FI can be achieved',
		'Asset allocation plan',
		'Yearly portfolio values',
		'Monthly investment targets' 
	];

	const terms = [
		{
			title: 'Term 1',
			content: `Definition...`
		}
	];

	return (
		<Layout
			title={CALC_NAMES.FI}
			type={GoalType.FF}
			assumptions={assumptions}
			features={features}
			demoUrl="https://www.youtube.com/watch?v=M_4cdKdKYiw"
			results={results}
			terms={terms}
		/>
	);
}
