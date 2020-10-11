import React from 'react';
import Layout from '../components/calc/Layout';
import ItemDisplay from '../components/calc/ItemDisplay';
import SVGBalance from '../components/calc/svgbalance';
import SVGMoneyBag from '../components/calc/svgmoneybag';
import TrueCostCalc from '../components/calc/TrueCostCalc';
import SVGHourGlass from '../components/svghourglass';
import SVGPay from '../components/svgpay';
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
					{ label: SPEND, active: true, svg: SVGPay },
					{ label: SAVE, active: true, svg: SVGPiggy },
					{ label: INVEST, active: true, svg: SVGMoneyBag }
				],
				endOrder: 9
			}}
			title="True Cost"
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
