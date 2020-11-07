import React from 'react';
import Layout from '../components/calc/Layout';
import { Statistic } from 'antd';
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
			assumptions={[ 'adfas', 'asdfsad' ]}
			features={[ 'fsdgdf', 'fgdssdf' ]}
			results={[
				<Statistic key="s1" title="" value="Option that costs lesser" />,
				<Statistic
					key="s2"
					title=""
					value="Time till which the Option costs lesser"
				/>
			]}
			resultImg="kick-start.jpg"
		/>
	);
}
