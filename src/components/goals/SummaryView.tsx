import React, { useContext, useEffect, useState } from 'react';
import { getGoalTypes, getImpLevels } from './goalutils';
import { GoalType, LMH, UpdateGoalInput } from '../../api/goals';
import { COLORS } from '../../CONSTANTS';
import { Card, Row, Col, Badge, Button } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { PlanContext } from './PlanContext';
import FIImpactView from './FIImpactView';
import { getCommonMeta, getCommonXAxis, getCommonYAxis, getDefaultSliderProps } from '../chartutils';
import dynamic from 'next/dynamic';

import './SummaryView.less';

interface SummaryViewProps {
	goal: UpdateGoalInput;
}

const LineChart = dynamic(() => import('bizcharts/lib/plots/LineChart'), {
	ssr: false
});
const Slider = dynamic(() => import('bizcharts/lib/components/Slider'), {
	ssr: false
});

export default function SummaryView({ goal }: SummaryViewProps) {
	const { removeGoal, editGoal, allCFs }: any = useContext(PlanContext);
	const bgColor = goal.imp === LMH.H ? COLORS.BLUE : goal.imp === LMH.M ? COLORS.ORANGE : COLORS.GREEN;
	const nowYear = new Date().getFullYear();
	const goalTypes: any = getGoalTypes();
	const impLevels: any = getImpLevels();
	const currency = goal.ccy as string;
	const ffImpactYears = allCFs[goal.id as string].ffImpactYears;
	const cfs = allCFs[goal.id as string].cfs;
	const [ chartData, setChartData ] = useState<Array<any>>([]);

	useEffect(
		() => {
			let data: Array<any> = [];
			for (let i = 0; i < cfs.length; i++)
				data.push({
					year: '' + ((goal.sy as number) + i),
					value: cfs[i]
				});
			setChartData([ ...data ]);
		},
		[ cfs ]
	);

	return (
		<Card
			className="goals-card"
			title={
				<Row>
					<Col flex="auto">
						<strong>{`${goalTypes[goal.type as GoalType]} ${goal.name}`}&nbsp;</strong>
						<Badge
							count={impLevels[goal.imp as LMH]}
							style={{ backgroundColor: bgColor, color: COLORS.WHITE }}
						/>
					</Col>
				</Row>
			}
			extra={[
				<Button key="editbtn" type="link" icon={<EditOutlined />} onClick={() => editGoal(goal.id)} />,
				<Button
					key="linkbtn"
					type="link"
					icon={<DeleteOutlined />}
					danger
					onClick={() => removeGoal(goal.id)}
				/>
			]}
		>
			{(goal.sy as number) > nowYear && <FIImpactView impactYears={ffImpactYears} />}
			<Row justify="center" style={{ marginTop: '10px', marginBottom: '10px' }}>
				<Col>
					<strong>Cash Flows in {currency}</strong>
				</Col>
			</Row>
			<Row justify="center" style={{ minHeight: '300px' }}>
				<Col span={24}>
					<LineChart
						data={chartData}
						xField="year"
						yField="value"
						yAxis={getCommonYAxis()}
						xAxis={getCommonXAxis('Year')}
						meta={getCommonMeta(currency)}
						point={true}
						autoFit
					>
						<Slider {...getDefaultSliderProps()} />
					</LineChart>
				</Col>
			</Row>
		</Card>
	);
}
