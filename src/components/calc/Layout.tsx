import { useRouter } from 'next/router';
import React, { Fragment, useState } from 'react';
import { CreateGoalInput, GoalType } from '../../api/goals';
import { ROUTES } from '../../CONSTANTS';
import DDPage from '../DDPage';
import FFGoal from '../goals/ffgoal';
import Goal from '../goals/goal';
import { createNewGoalInput } from '../goals/goalutils';
import * as gtag from '../../lib/gtag';
import CalculatorTemplate from './CalculatorTemplate';
import { Button, Collapse, Space } from 'antd';
interface LayoutProps {
	title: string;
	type?: GoalType;
	features: Array<any>;
	assumptions: Array<any>;
	results: Array<any>;
	resultImg: string;
	calc?: any;
}

export default function Layout(props: LayoutProps) {
	const router = useRouter();
	const { Panel } = Collapse;
	const [ wipGoal, setWIPGoal ] = useState<any | null>(null);
	const [ ffResult, setFFResult ] = useState<any>({});
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
		setWIPGoal(g);
	};

	return (
		<DDPage title={props.title}>
			{!wipGoal ? (
				<Space align="center" direction="vertical" size="large">
					<h1>{props.title + ' Calculator'}</h1>
					<Collapse defaultActiveKey={[ '1' ]}>
						{Object.keys(sections).map((key, i) => (
							<Panel key={`${i + 1}`} header={key}>
								<Space align="center" size="large">{sections[key]}</Space>
								{sections[key] === props.results && (
									<p>
										<img style={{cursor: 'pointer'}} src={'/images/' + props.resultImg} onClick={createGoal} />
									</p>
								)}
							</Panel>
						))}
					</Collapse>
					<Button type="primary" onClick={() => createGoal()}>
						Start
					</Button>
				</Space>
			) : (
				<Fragment>
					{router.pathname === ROUTES.FI ? (
						<FFGoal
							goal={wipGoal as CreateGoalInput}
							mustCFs={[]}
							tryCFs={[]}
							mergedCfs={buildEmptyMergedCFs()}
							cancelCallback={() => setWIPGoal(null)}
							ffResult={ffResult}
							ffResultHandler={setFFResult}
						/>
					) : props.type ? (
						<Goal
							goal={wipGoal as CreateGoalInput}
							ffGoalEndYear={nowYear + 50}
							cancelCallback={() => setWIPGoal(null)}
						/>
					) : (
						<CalculatorTemplate
							calc={props.calc}
							title={props.title}
							cancelCallback={() => setWIPGoal(null)}
						/>
					)}
				</Fragment>
			)}
		</DDPage>
	);
}
