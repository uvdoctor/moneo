import React, { useState, useEffect, useContext, Fragment } from 'react';
import dynamic from 'next/dynamic';
import { getCommonMeta, getCommonXAxis, getCommonYAxis, getDefaultSliderProps } from '../chartutils';
import { CalcContext } from '../calc/CalcContext';
import { GoalType, UpdateGoalInput } from '../../api/goals';
import { Col, Row } from 'antd';
import NumberInput from '../form/numberinput';
import { COLORS } from '../../CONSTANTS';
import { PlanContext } from './PlanContext';
import { getGoalTypes } from './goalutils';
import { appendValue, toHumanFriendlyCurrency } from '../utils';
import { isFFPossible } from './cfutils';
import { FIGoalContext } from './FIGoalContext';

interface BasicLineChartProps {
	numberOfYears?: boolean;
	chartTitle?: string;
	title?: string;
	showRange?: boolean;
	showAnnotation?: boolean;
}

const LineChart = dynamic(() => import('bizcharts/lib/plots/LineChart'), { ssr: false });
const Slider = dynamic(() => import('bizcharts/lib/components/Slider'), { ssr: false });
const Annotation = dynamic(() => import('bizcharts/lib/components/Annotation/dataMarker'), { ssr: false });
const AnnotationLine = dynamic(() => import('bizcharts/lib/components/Annotation/line'), { ssr: false });

export default function BasicLineChart({
	numberOfYears,
	chartTitle,
	title,
	showRange,
	showAnnotation
}: BasicLineChartProps) {
	const { allGoals, ffResult }: any = useContext(PlanContext);
	const { goal, startYear, currency, cfs, analyzeFor, setAnalyzeFor }: any = useContext(CalcContext);
	const { leaveBehind, planDuration }: any = useContext(FIGoalContext);
	const [ data, setData ] = useState<Array<any>>([]);
	const [ annotations, setAnnotations ] = useState<Array<string>>([]);
	const [ startingGoalsContent, setStartingGoalsContent ] = useState<any>({});
	const [ runningGoalsContent, setRunningGoalsContent ] = useState<any>({});
	const [ endingGoalsContent, setEndingGoalsContent ] = useState<any>({});

	useEffect(
		() => {
			let data: Array<any> = [];
			let startVal = numberOfYears ? 1 : goal.type === GoalType.FF ? new Date().getFullYear() : startYear;
			for (let i = 0; i < cfs.length; i++)
				data.push({
					year: '' + (startVal + i),
					value: cfs[i]
				});
			setData([ ...data ]);
		},
		[ cfs ]
	);

	const getCF = (year: number) => cfs[year - new Date().getFullYear()];

	const getAnnotationContent = (g: UpdateGoalInput) => `${getGoalTypes()[g.type as GoalType]} ${g.name}`;

	const getAnnotationEndYearContent = (g: UpdateGoalInput) => {
		if (g.type === GoalType.B) return 'SELL' + g.name;
		return getAnnotationContent(g);
	};

	const getAnnotationRunningYearContent = (g: UpdateGoalInput) => {
		if (g.type === GoalType.B) return 'MAINTAIN ' + g.name;
		return getAnnotationContent(g);
	};

	useEffect(
		() => {
			if (!showAnnotation || !allGoals.length) {
				setStartingGoalsContent({});
				setEndingGoalsContent({});
				setRunningGoalsContent({});
				setAnnotations([...[]]);
			}
			let startingGoalsContent: any = {};
			let endingGoalsContent: any = {};
			let runningGoalsContent: any = {};
			let allAnnotations: Array<string> = [];
			allGoals.map((g: UpdateGoalInput) => {
				let startYear = g.sy as number;
				let endYear = g.ey as number;
				for (let y = startYear + 1; y < endYear; y++) {
					appendValue(runningGoalsContent, y, getAnnotationRunningYearContent(g));
				}
				appendValue(startingGoalsContent, startYear, getAnnotationContent(g));
				appendValue(endingGoalsContent, endYear, getAnnotationEndYearContent(g));
			});
			Object.keys(startingGoalsContent).map((key: string) => allAnnotations.push(key));
			Object.keys(endingGoalsContent).map((key: string) => {
				if (!startingGoalsContent.hasOwnProperty(key)) allAnnotations.push(key);
			});
			setStartingGoalsContent(startingGoalsContent);
			setEndingGoalsContent(endingGoalsContent);
			setRunningGoalsContent(runningGoalsContent);
			setAnnotations([ ...allAnnotations ]);
		},
		[ showAnnotation, allGoals ]
	);

	return (
		<Fragment>
			{showRange ? <Row align="middle" className="chart-options-row" justify="center">
					<Col xs={24} sm={24} md={24} lg={12}>
						<NumberInput
							pre="Compare from 1 to "
							value={analyzeFor}
							changeHandler={setAnalyzeFor}
							min={5}
							max={50}
							step={1}
							unit="Years"
							additionalMarks={[ 10, 15, 20, 25, 30, 35, 40, 45 ]}
						/>
					</Col>
				</Row>
			: null}
			{chartTitle && (
				<Row justify="center">
					<Col>
						<strong>{chartTitle}</strong>
					</Col>
				</Row>
			)}
			<Row style={{ minHeight: showAnnotation ? '500px' : '400px' }}>
				<Col span={24}>
					<LineChart
						data={data}
						xField="year"
						yField="value"
						yAxis={getCommonYAxis()}
						xAxis={getCommonXAxis(title ? title : numberOfYears ? 'Number of Years' : 'Year')}
						meta={getCommonMeta(currency)}
						point={!showAnnotation}
						tooltip={{
							visible: true,
							title: (title: string) => {
								let content = '';
								if (startingGoalsContent[title]) {
									content += `\n\n\u27A3 Goals Starting:\n${startingGoalsContent[title]}`;
								}
								if (runningGoalsContent[title]) {
									content += `\n\n\u27A2 Goals On-going:\n${runningGoalsContent[title]}`;
								}
								if (endingGoalsContent[title]) {
									content += `\n\n\u27A4 Goals Ending:\n${endingGoalsContent[title]}`;
								}
								if (!startingGoalsContent.hasOwnProperty(title)
									&& !runningGoalsContent.hasOwnProperty(title)
									&& !endingGoalsContent.hasOwnProperty(title)) {
									content += '\n\nNo Goal defined.\n'
									}
								return `Key Milestones in Year ${title}${content}`;
							},
							formatter: ({ value }: any) => {
								return {
									name: `Portfolio Value`,
									value: toHumanFriendlyCurrency(value, currency)
								};
							},
						}}
					>
						{showAnnotation &&
							annotations.map((year: string) => (
								<Annotation
									position={[ year, getCF(parseInt(year)) ]}
									text={{
										content: '\u2691',
										style: {
											fontSize: 20,
											fill: COLORS.GREEN
										}
									}}
									point={{
										style: { stroke: COLORS.GREEN }
									}}
									line={{ length: 0 }}
								/>
							))}
						{showAnnotation && isFFPossible(ffResult, leaveBehind) &&
							<Fragment>
							<AnnotationLine
								start={['' + ffResult.ffYear, 'min']}
								end={['' + ffResult.ffYear, 'max']}
								text={{
									content: `Financial Independence at Age of ${ffResult.ffYear - startYear}`,
									position: '5%',
									style: {
										fontSize: 13,
										fontFamily: "'Jost', sans-serif"
									}
								}}
								style={{
									lineWidth: 3,
									lineCap: "round",
									stroke: COLORS.GREEN
								}}
							/>
							<AnnotationLine
								start={['' + (startYear + planDuration) , 'min']}
								end={['' + (startYear + planDuration), 'max']}
								text={{
									content: `Plan ends at Age of ${planDuration}`,
									position: '20%',
									style: {
										fontSize: 13,
										fontFamily: "'Jost', sans-serif"
									}
								}}
								style={{
									lineWidth: 3,
									lineCap: "round",
									stroke: COLORS.ORANGE
								}}
							/>
						</Fragment>}
						<Slider {...getDefaultSliderProps()} />
					</LineChart>
				</Col>
			</Row>
		</Fragment>
	);
}
