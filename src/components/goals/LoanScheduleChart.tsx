import React, { useContext, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { getCommonMeta, getCommonXAxis, getCommonYAxis } from '../chartutils';
import { GoalContext } from './GoalContext';
import { Col, Row } from 'antd';
import { getLoanPaidForMonths } from './cfutils';
import ItemDisplay from '../calc/ItemDisplay';

const StackedColumnChart = dynamic(() => import('bizcharts/lib/plots/StackedColumnChart'), { ssr: false });

export default function LoanScheduleChart() {
	const {
		pSchedule,
		iSchedule,
		currency,
		loanRepaymentSY,
		totalIntAmt,
		startYear,
		duration,
		loanYears
	}: any = useContext(GoalContext);
	const [ data, setData ] = useState<Array<any>>([]);

	useEffect(
		() => {
			let data: Array<any> = [];
			for (let year = loanRepaymentSY; year < loanRepaymentSY + pSchedule.length; year++) {
				data.push({
					name: 'Principal',
					year: year,
					value: pSchedule[year - loanRepaymentSY]
				});
				data.push({
					name: 'Interest',
					year: year,
					value: iSchedule[year - loanRepaymentSY]
				});
			}
			setData([ ...data ]);
		},
		[ loanRepaymentSY, pSchedule, iSchedule ]
	);

	return (
		<Row>
			<Col xs={24} sm={24} md={4}>
				<ItemDisplay
					label="Total Interest"
					result={totalIntAmt}
					currency={currency}
					footer={`Over ${getLoanPaidForMonths(startYear + duration - 1, loanRepaymentSY, loanYears) /
						12} Years`}
				/>
			</Col>
			<Col xs={24} sm={24} md={20} style={{minHeight: '400px'}}>
				<StackedColumnChart
					meta={getCommonMeta(currency)}
					xField="year"
					yField="value"
					stackField="name"
					yAxis={getCommonYAxis()}
					xAxis={getCommonXAxis('Year')}
					data={data}
				/>
			</Col>
		</Row>
	);
}
