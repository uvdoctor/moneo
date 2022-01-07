import React from 'react';
import Layout from '../components/calc/Layout';
import { CALC_NAMES } from '../CONSTANTS';
import Spend from '../components/calc/Spend';
import BasicLineChart from '../components/goals/BasicLineChart';
import { TrueCostContextProvider } from '../components/calc/TrueCostContext';
import { faChartLine, faCog, faMoneyBillWave } from '@fortawesome/free-solid-svg-icons';
import Save from '../components/calc/Save';

export default function TrueCost() {
	const assumptions = [
		{
			title: 'Steady savings from income',
			content: `While analyzing recurring spends that span across years, this calculation assumes that savings amount from your income remains unchanged across these years.`
		}
	];

	const features = [
		{
			title: 'Analyze single and recurring spends',
			content: `Analysis works for single spends as well as spends that are those that are recurring monthly or yearly.`
		},
	];

	const results = [ 
		'Time cost, i.e. time it takes for you to earn the spend amount.'
	];

	const terms = [
		{
			title: 'Term 1',
			content: `Definition...`
		}
	];

	return (
		<Layout
			tabOptions={[
				{ label: 'Basic', active: true, svg: faMoneyBillWave, content: <Spend /> },
				{ label: 'Advanced', active: true, svg: faCog, content: <Save /> }
			]}
			resultTabOptions={[
				{
					label: 'Yearly cash flows if money is invested instead of spending',
					active: true,
					svg: faChartLine,
					content: <BasicLineChart numberOfYears showRange showFromYear={1} />
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
