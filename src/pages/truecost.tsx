import React from 'react';
import Layout from '../components/calc/Layout';
import ItemDisplay from '../components/calc/ItemDisplay';
import SVGBalance from '../components/calc/svgbalance';
import SVGMoneyBag from '../components/calc/svgmoneybag';
import TrueCostCalc from '../components/calc/TrueCostCalc';
import SVGHourGlass from '../components/svghourglass';
import SVGPay from '../components/svgpay';
import SVGScale from '../components/svgscale';
import SVGPiggy from '../components/svgpiggy';

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
					{ label: SPEND, order: 0, active: true, svg: SVGPay },
					{ label: SAVE, order: 3, active: true, svg: SVGPiggy },
					{ label: INVEST, order: 6, active: true, svg: SVGMoneyBag }
				],
				endOrder: 9
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
