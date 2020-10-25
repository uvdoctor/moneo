import React from 'react';
import Layout from '../components/calc/Layout';
import SVGBalance from '../components/calc/svgbalance';
import SVGMoneyBag from '../components/calc/svgmoneybag';
import SVGHourGlass from '../components/svghourglass';
import SVGPay from '../components/svgpay';
import SVGPiggy from '../components/svgpiggy';
import { Statistic } from 'antd';
import SVGChart from '../components/svgchart';
import { CALC_NAMES } from '../CONSTANTS';
import Spend from '../components/calc/Spend';
import Save from '../components/calc/Save';
import InvestOption from '../components/calc/InvestOption';
import DDLineChart from '../components/goals/DDLineChart';
import { TrueCostContextProvider } from '../components/calc/TrueCostContext';

export const SPEND = 'Spend';
export const SAVE = 'Save';
export const INVEST = 'Invest';
export const CHART = 'Yearly Cash Flows If Invested';

export default function TrueCost() {
	return (
		<Layout
			tabOptions={[
				{ label: SPEND, active: true, svg: SVGPay, content: <Spend /> },
				{ label: SAVE, active: true, svg: SVGPiggy, content: <Save /> },
				{ label: INVEST, active: true, svg: SVGMoneyBag, content: <InvestOption /> }
			]}
			resultTabOptions={[
				{
					label: CHART,
					active: true,
					svg: SVGChart,
					content: <DDLineChart numberOfYears />
				}
			]}
			title={CALC_NAMES.TC}
			calc={TrueCostContextProvider}
			assumptions={[ 'adfas', 'asdfsad' ]}
			features={[ 'fsdgdf', 'fgdssdf' ]}
			results={[
				<Statistic key="s1" title="" value="Option that costs lesser" prefix={<SVGBalance />} />,
				<Statistic
					key="s2"
					title=""
					value="Time till which the Option costs lesser"
					prefix={<SVGHourGlass />}
				/>
			]}
			resultImg="kick-start.jpg"
		/>
	);
}
