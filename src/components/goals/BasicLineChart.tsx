import React, { useState, useEffect, useContext, Fragment } from 'react';
import dynamic from 'next/dynamic';
import { getCommonMeta, getCommonXAxis, getCommonYAxis, getDefaultSliderProps } from '../chartutils';
import { CalcContext } from '../calc/CalcContext';
import { GoalType } from '../../api/goals';
import { Col, Row } from 'antd';
import NumberInput from '../form/numberinput';
import { COLORS } from '../../CONSTANTS';
import { toHumanFriendlyCurrency } from '../utils';
import { PlanContext } from './PlanContext';

interface BasicLineChartProps {
	numberOfYears?: boolean;
	chartTitle?: string;
	title?: string;
	showRange?: boolean;
	summaryView?: boolean;
	dataMarkers?: Array<string>;
	lineAnnotations?: Array<any>;
	tooltips?: any;
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
	summaryView,
	dataMarkers,
	lineAnnotations,
	tooltips
}: BasicLineChartProps) {
	const { goal, rr, ffResult }: any = useContext(PlanContext);
	const { wipGoal, startYear, currency, cfs, analyzeFor, setAnalyzeFor }: any = useContext(CalcContext);
	const [ data, setData ] = useState<Array<any>>([]);

	const getCF = (year: number) => {
		if (!goal && wipGoal.type === GoalType.FF && ffResult.ffCfs)
			return ffResult.ffCfs[year];
		let startYear = wipGoal.type === GoalType.FF ? new Date().getFullYear() : wipGoal.sy;
		return cfs[year - startYear];
	};

	useEffect(() => {
		let data: Array<any> = [];
		let startVal = numberOfYears ? 1 : wipGoal.type === GoalType.FF ? new Date().getFullYear() : startYear;
		let endLength = !goal && wipGoal.type === GoalType.FF && ffResult.ffCfs ? Object.keys(ffResult.ffCfs).length : cfs.length;
		for (let i = 0; i < endLength; i++)
				data.push({
					year: '' + (startVal + i),
					value: getCF(startVal + i)
			});
		setData([...data]);
	}, [ cfs, rr ]);


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
			<Row style={{ minHeight: summaryView ? '250px' : '400px' }}>
				<Col span={24}>
					<LineChart
						data={data}
						xField="year"
						yField="value"
						yAxis={getCommonYAxis()}
						xAxis={getCommonXAxis(title ? title : numberOfYears ? 'Number of Years' : 'Year')}
						meta={getCommonMeta(currency)}
						point={!dataMarkers}
						tooltip={{
							visible: true,
							title: (title: string) => {
								if (!tooltips || !tooltips[title]) return title;
								return tooltips[title];
							},
							formatter: ({ value }: any) => {
								return {
									name: wipGoal.type === GoalType.FF ? 'Portfolio' : value < 0 ? 'Pay' : 'Receive',
									value: toHumanFriendlyCurrency(Math.abs(value), currency)
								};
							},
						}}
					>
						{dataMarkers?.map((year: string) => (
								<Annotation key={year}
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
						{lineAnnotations?.map((la: any) =>
							<AnnotationLine key={la.year}
								start={['' + la.year, 'min']}
								end={['' + la.year, 'max']}
								text={{
									content: la.content,
									position: la.position,
									style: {
										fontSize: 13,
										fontFamily: "'Jost', sans-serif"
									}
								}}
								style={{
									lineWidth: 3,
									lineCap: "round",
									stroke: la.color
								}}
							/>)}
						<Slider {...getDefaultSliderProps()} />
					</LineChart>
				</Col>
			</Row>
		</Fragment>
	);
}
