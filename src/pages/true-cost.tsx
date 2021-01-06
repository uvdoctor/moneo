import React from 'react';
import Layout from '../components/calc/Layout';
import { CALC_NAMES } from '../CONSTANTS';
import Spend from '../components/calc/Spend';
import Save from '../components/calc/Save';
import DDLineChart from '../components/goals/BasicLineChart';
import { TrueCostContextProvider } from '../components/calc/TrueCostContext';
import { faChartLine, faPiggyBank, faMoneyBillWave } from '@fortawesome/free-solid-svg-icons';

export const SPEND = 'Spend';
export const SAVE = 'Save';
export const INVEST = 'Invest';
export const CHART = 'Yearly Cash Flows If Invested';

export default function TrueCost() {
	const assumptions = [
		{
			title: 'All your money in one place',
			content: `We bring together all of your accounts, bills and more, so you can
		conveniently manage your finances from one dashboard.`
		},
		{
			title: 'Effortlessly stay on top of bills',
			content: `Bills are now easier than ever to track. Simply add them to your
		dashboard to see and monitor them all at once.`
		}
	];

	const features = [
		{
			title: 'Amortization',
			content: 'We bring all of your money to one place, from balances and bills to credit score and more.'
		},
		{
			title: 'Simple Savings',
			content: 'Easily create budgets, and see our suggestions based on your spending.'
		},
		{
			title: 'Cost-of-living',
			content: 'We bring all of your money to one place, from balances and bills to credit score and more.'
		},
		{
			title: 'CD calculator',
			content: 'Easily create budgets, and see our suggestions based on your spending.'
		},
		{
			title: 'Home affordability',
			content: 'Check your free credit score as many times as you like, and get tips to help improve it.'
		}
	];

	const results = [ 'What is Lorem Ipsum?' ];

	const terms = [
		{
			title: 'Term 1',
			content: 'Definition...'
		}
	];

	return (
		<Layout
			tabOptions={[
				{ label: SPEND, active: true, svg: faMoneyBillWave, content: <Spend /> },
				{ label: SAVE, active: true, svg: faPiggyBank, content: <Save /> },
			]}
			resultTabOptions={[
				{
					label: CHART,
					active: true,
					svg: faChartLine,
					content: <DDLineChart numberOfYears showRange />
				}
			]}
			title={CALC_NAMES.TC}
			calc={TrueCostContextProvider}
			assumptions={assumptions}
			features={features}
			demoUrl="https://www.youtube.com/watch?v=M_4cdKdKYiw"
			results={results}
			terms={terms}
		/>
	);
}
