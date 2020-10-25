import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { GoalType } from '../../api/goals';
import { ROUTES } from '../../CONSTANTS';
import DDPage from '../DDPage';
import FFGoal from '../goals/ffgoal';
import { createNewGoalInput } from '../goals/goalutils';
import * as gtag from '../../lib/gtag';
import { Button, Collapse, Row, Col } from 'antd';

import './Layout.less';
import GoalContent from '../goals/GoalContent';
interface LayoutProps {
	tabOptions?: Array<any>;
	resultTabOptions?: Array<any>;
	calc: any;
	type?: GoalType;
	title: string;
	features: Array<any>;
	assumptions: Array<any>;
	results: Array<any>;
	resultImg: string;
}

export default function Layout(props: LayoutProps) {
	const router = useRouter();
	const { Panel } = Collapse;
	const [ ffResult, setFFResult ] = useState<any>({});
	const [ wip, setWIP ] = useState<any | null>(null);
	const nowYear = new Date().getFullYear();
	const sections: any = {
		'Expected Results': props.results,
		'Key Features': props.features,
		'Major Assumptions': props.assumptions
	};

	const buildEmptyMergedCFs = () => {
		let mCFs = {};
		for (let year = nowYear + 1; year <= nowYear + 80; year++)
			//@ts-ignore
			mCFs[year] = 0;
		return mCFs;
	};

	const createGoal = () => {
		let g: any = null;
		if (props.type) g = createNewGoalInput(props.type, 'USD');
		else g = {};
		g.name = props.title;
		gtag.event({
			category: 'Calculator',
			action: 'Start',
			label: 'type',
			value: props.type ? props.type : props.title
		});
		setWIP(g);
	};

	return (
		<DDPage className="calculator-container" title={props.title} onBack={() => setWIP(null)}>
			{!wip ? (
				<Row align="middle" justify="center">
					<Col><h2>{props.title + ' Calculator'}</h2></Col>
					<Col span={24}>
					<Collapse defaultActiveKey={[ '1' ]}>
						{Object.keys(sections).map((key, i) => (
							<Panel key={`${i + 1}`} header={key}>
								<Col span={24}>{sections[key]}</Col>
								{sections[key] === props.results && (
									<Col span={24}>
										<img
											style={{ cursor: 'pointer' }}
											src={'/images/' + props.resultImg}
											onClick={createGoal}
										/>
									</Col>
								)}
							</Panel>
						))}
						</Collapse>
					</Col>
					<Col>
						<Button type="primary" onClick={() => createGoal()}>
							Start
						</Button>
					</Col>
				</Row>
			) : (
					router.pathname === ROUTES.FI ? (
						<FFGoal
							mustCFs={[]}
							tryCFs={[]}
							mergedCfs={buildEmptyMergedCFs()}
							ffResult={ffResult}
							ffResultHandler={setFFResult}
						/>
						) : props.type ? (
							<props.calc goal={wip}>
								<GoalContent />
							</props.calc>
					) : (
								<props.calc title={props.title} tabOptions={props.tabOptions}
									resultTabOptions={props.resultTabOptions} />
					)
			)}
		</DDPage>
	);
}
