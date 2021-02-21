import React, { Fragment, useContext, useEffect, useState } from 'react';
import { getGoalTypes, getImpLevels } from './goalutils';
import { GoalType, LMH, UpdateGoalInput } from '../../api/goals';
import { COLORS } from '../../CONSTANTS';
import { Card, Row, Col } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import { PlanContext } from './PlanContext';
import FIImpactView from './FIImpactView';
import ItemDisplay from '../calc/ItemDisplay';
import { toHumanFriendlyCurrency } from '../utils';
import { getCommonMeta, getCommonXAxis, getCommonYAxis, getDefaultSliderProps } from '../chartutils';
import dynamic from 'next/dynamic';

interface SummaryViewProps {
	goal: UpdateGoalInput;
}

const LineChart = dynamic(() => import('bizcharts/lib/plots/LineChart'), { ssr: false });
const Slider = dynamic(() => import('bizcharts/lib/components/Slider'), { ssr: false });

export default function SummaryView({ goal }: SummaryViewProps) {
	const { removeGoal, editGoal, allGoals, allCFs }: any = useContext(PlanContext);
	const bgColor = goal.imp === LMH.H ? COLORS.BLUE : goal.imp === LMH.M ? COLORS.ORANGE : COLORS.GREEN;
	const nowYear = new Date().getFullYear();
	const goalTypes: any = getGoalTypes();
	const impLevels: any = getImpLevels();
	const currency = goal.ccy as string;
	const [ ffImpactYears, setFFImpactYears ] = useState<number | null>(allCFs[goal.id as string].ffImpactYears);
	const [ oppCost, setOppCost ] = useState<number>(allCFs[goal.id as string].oppCost);
	const [ cfs, setCFs ] = useState<Array<number>>(allCFs[goal.id as string].cfs);
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

	useEffect(
		() => {
			let goalMetrics: any = allCFs[goal.id as string];
			setFFImpactYears(goalMetrics.ffImpactYears);
			setOppCost(goalMetrics.oppCost);
			setCFs([ ...goalMetrics.cfs ]);
		},
		[ allGoals ]
	);

	return (
		<Card
			headStyle={{ backgroundColor: bgColor, color: COLORS.WHITE }}
			title={
				<Row justify="space-between">
					<Col>{`${goalTypes[goal.type as GoalType]} ${goal.name}`}</Col>
					<Col>
						<Row justify="space-around">
							<Col>{impLevels[goal.imp as LMH]}</Col>
							<Col>&nbsp;&nbsp;</Col>
							<Col style={{ cursor: 'pointer' }} onClick={() => editGoal(goal.id)}>
								<EditOutlined />
							</Col>
							<Col>&nbsp;&nbsp;</Col>
							<Col style={{ cursor: 'pointer' }} onClick={() => removeGoal(goal.id)}>
								<DeleteOutlined />
							</Col>
						</Row>
					</Col>
				</Row>
			}
		>
			<Fragment>
				{(goal.sy as number) > nowYear && (
					<Row justify="space-around">
						<Col>
							<FIImpactView impactYears={ffImpactYears} />
						</Col>
						<Col>
							<ItemDisplay
								result={oppCost}
								currency={currency}
								label={`${goal.type === GoalType.B ? 'Buy' : 'Spend'} v/s Invest`}
								svg={oppCost < 0 ? <ArrowDownOutlined /> : <ArrowUpOutlined />}
								pl
								info={`You ${oppCost < 0 ? 'Lose' : 'Gain'} about ${toHumanFriendlyCurrency(
									Math.abs(oppCost),
									currency
								)} because of this Goal.`}
							/>
						</Col>
					</Row>
				)}
				<Row justify="center" style={{ marginTop: '10px', marginBottom: '10px'}}>
					<Col>
						<strong>Cash Flows in {currency}</strong>
					</Col>
				</Row>
				<Row justify="center" style={{ minHeight: '400px' }}>
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
			</Fragment>
		</Card>
	);
}
