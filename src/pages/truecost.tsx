import React from 'react';
import Layout from '../components/calc/Layout';
import SVGBalance from '../components/calc/svgbalance';
import SVGMoneyBag from '../components/calc/svgmoneybag';
import TrueCostCalc from '../components/calc/TrueCostCalc';
import SVGHourGlass from '../components/svghourglass';
import SVGPay from '../components/svgpay';
import SVGPiggy from '../components/svgpiggy';
import { Statistic } from 'antd';

export const SPEND = 'Spend';
export const SAVE = 'Save';
export const INVEST = 'Invest';
export const CHART = 'Yearly Cash Flows If Invested';

export default function TrueCost() {
	return (
		<Layout
			calc={{
				type: TrueCostCalc,
				tabOptions: [
					{ label: SPEND, active: true, svg: SVGPay },
					{ label: SAVE, active: true, svg: SVGPiggy },
					{ label: INVEST, active: true, svg: SVGMoneyBag }
				]
			}}
			title="True Cost"
			assumptions={[ 'adfas', 'asdfsad' ]}
			features={[ 'fsdgdf', 'fgdssdf' ]}
			results={[
				<Statistic key="s1" title="" value="Option that costs lesser" prefix={<SVGBalance />} />,
				<Statistic key="s2" title="" value="Time till which the Option costs lesser" prefix={<SVGHourGlass />} />
			]}
			resultImg="kick-start.jpg"
		/>
	);
}
