import React from 'react';
import Layout from '../components/calc/Layout';
import { CALC_NAMES } from '../CONSTANTS';
import Spend from '../components/calc/Spend';
import Save from '../components/calc/Save';
import InvestOption from '../components/calc/InvestOption';
import DDLineChart from '../components/goals/DDLineChart';
import { TrueCostContextProvider } from '../components/calc/TrueCostContext';
import { faChartLine, faPiggyBank, faMoneyBillWave, faSearchDollar } from '@fortawesome/free-solid-svg-icons';

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
		{
			title: "What is Lorem Ipsum?",
			content: `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum
			has been the industry's standard dummy text ever since the 1500s, when an unknown
			printer took a galley of type and scrambled it to make a type specimen book. It has
			survived not only five centuries, but also the leap into electronic typesetting,
			remaining essentially unchanged. It was popularised in the 1960s with the release of
			Letraset sheets containing Lorem Ipsum passages, and more recently with desktop
			publishing software like Aldus PageMaker including versions of Lorem Ipsum.`,
			imgSrc: '/images/step1.jpg',
			imgWidth: 300,
			imgHeight: 300,
			imgAlt: 'Calculation Result'
		},
	];

	return (
		<Layout
			tabOptions={[
				{ label: SPEND, active: true, svg: faMoneyBillWave, content: <Spend /> },
				{ label: SAVE, active: true, svg: faPiggyBank, content: <Save /> },
				{ label: INVEST, active: true, svg: faSearchDollar, content: <InvestOption /> }
			]}
			resultTabOptions={[
				{
					label: CHART,
					active: true,
					svg: faChartLine,
					content: <DDLineChart numberOfYears />
				}
			]}
			title={CALC_NAMES.TC}
			calc={TrueCostContextProvider}
			assumptions={assumptions}
			features={features}
			demoUrl="https://www.youtube.com/watch?v=M_4cdKdKYiw"
			results={results}
		/>
	);
}
