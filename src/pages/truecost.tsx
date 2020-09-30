import React from 'react';
import Layout from '../components/calc/Layout';
import ItemDisplay from '../components/calc/ItemDisplay';
import SVGBalance from '../components/calc/svgbalance';
import SVGMoneyBag from '../components/calc/svgmoneybag';
import TrueCostCalc from '../components/calc/TrueCostCalc';
import SVGChart from '../components/svgchart';
import SVGHourGlass from '../components/svghourglass';
import SVGPay from '../components/svgpay';
import SVGScale from '../components/svgscale';

export const SPEND = 'Spend';
export const EARN = 'Earn';
export const CHART = 'Yearly Cash Flows If Invested';

export default function TrueCost() {
	return (
		<Layout
			calc={{
				type: TrueCostCalc,
				tabOptions: [
					{ label: SPEND, order: 1, active: true, svg: SVGPay },
					{ label: EARN, order: 4, active: true, svg: SVGMoneyBag }
				],
				resultTabOptions: [
					{
						label: CHART,
						order: 1,
						active: true,
						svg: SVGChart
					}
        ]
			}}
			title="True Cost"
			titleSVG={<SVGScale selected />}
			assumptions={[ 'adfas', 'asdfsad' ]}
			features={[ 'fsdgdf', 'fgdssdf' ]}
			results={[
				<ItemDisplay result="Option that costs lesser" svg={<SVGBalance />} />,
				<ItemDisplay result="Time till which the Option costs lesser" svg={<SVGHourGlass />} />
			]}
			resultImg="step1.png"
		/>
	);
}
