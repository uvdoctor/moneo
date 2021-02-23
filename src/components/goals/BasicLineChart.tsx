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

export default function BasicLineChart({
	numberOfYears,
	chartTitle,
	title,
	showRange,
	showAnnotation
}: BasicLineChartProps) {
	const { goal, allGoals }: any = useContext(PlanContext);
	const { startYear, currency, cfs, analyzeFor, setAnalyzeFor }: any = useContext(CalcContext);
	const [ data, setData ] = useState<Array<any>>([]);
	const [ annotations, setAnnotations ] = useState<Array<string>>([]);
	const [ annotationContent, setAnnotationContent ] = useState<any>({});

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

	const getAnnotationContent = (g: UpdateGoalInput) => `&#9873;&nbsp;${getGoalTypes()[g.type as GoalType]} ${g.name}`;

	const getAnnotationEndYearContent = (g: UpdateGoalInput) => {
		if (g.type === GoalType.B) return '&#9873;&nbsp;SELL ' + g.name;
		return '&#10004;&nbsp;' + getAnnotationContent(g);
	};

	useEffect(
		() => {
			if (!showAnnotation || !allGoals.length) setAnnotations([ ...[] ]);
			let goalEventsMap: any = {};
			allGoals.map((g: UpdateGoalInput) => {
				let startYear = g.sy as number;
				let endYear = g.ey as number;
				appendValue(goalEventsMap, startYear, getAnnotationContent(g), '<br/>', 2);
				appendValue(goalEventsMap, endYear, getAnnotationEndYearContent(g), '<br/>', 2);
			});
			let allAnnotations: Array<string> = [];
			Object.keys(goalEventsMap).map((key: string) => allAnnotations.push(key));
			setAnnotationContent(goalEventsMap);
			setAnnotations([ ...allAnnotations ]);
		},
		[ showAnnotation, allGoals ]
	);

	return (
		<Fragment>
			{showRange ? (
				<Row align="middle" className="chart-options-row" justify="center">
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
			) : null}
			{chartTitle && (
				<Row justify="center">
					<Col>
						<strong>{chartTitle}</strong>
					</Col>
				</Row>
			)}
			<Row style={{ minHeight: '400px' }}>
				<Col span={24}>
					<LineChart
						data={data}
						xField="year"
						yField="value"
						yAxis={getCommonYAxis()}
						xAxis={getCommonXAxis(title ? title : numberOfYears ? 'Number of Years' : 'Year')}
						meta={getCommonMeta(currency)}
						point={!showAnnotation}
						autoFit
						tooltip={{
							visible: true,
							showTitle: false,
							formatter: ({ year, value }: any) => {
								let content = `<strong>${toHumanFriendlyCurrency(value, currency)}`;
								if (annotationContent[year])
									content += `<br/><br/><u>Key Milestones</u>:<br/><br/>${annotationContent[year]}`;
								content += '</strong>';
								return {
									name: 'Year ' + year,
									value: content
								};
							}
						}}
					>
						{showAnnotation &&
							annotations.map((year: string) => (
								<Annotation
									position={[ year, getCF(parseInt(year)) ]}
									text={{ content: '\u2691' }}
									point={{
										style: { stroke: COLORS.ORANGE }
									}}
									top
									animate
									autoAdjust
									line={{length: 0}}
								/>
							))}
						<Slider {...getDefaultSliderProps()} />
					</LineChart>
				</Col>
			</Row>
		</Fragment>
	);
}
