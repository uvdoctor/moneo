import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { GoalType } from '../../api/goals';
import { ROUTES } from '../../CONSTANTS';
import DDPage from '../DDPage';
import FFGoal from '../goals/ffgoal';
import Goal from '../goals/goal';
import { createNewGoalInput } from '../goals/goalutils';
import * as gtag from '../../lib/gtag';
import { Button, Collapse, Space } from 'antd';
import { CalcContextProvider } from './CalcContext';

import './Layout.less';
interface LayoutProps {
	tabOptions?: Array<any>;
	resultTabOptions?: Array<any>;
	calc?: any;
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
		<DDPage className="calculator-container" title={props.title} onBack={() => setWIP(null)} > 
			{!wip ? (
				<Space align="center" direction="vertical" size="large">
					<h1>{props.title + ' Calculator'}</h1>
					<Collapse defaultActiveKey={[ '1' ]}>
						{Object.keys(sections).map((key, i) => (
							<Panel key={`${i + 1}`} header={key}>
								<Space align="center" size="large">
									{sections[key]}
								</Space>
								{sections[key] === props.results && (
									<p>
										<img
											style={{ cursor: 'pointer' }}
											src={'/images/' + props.resultImg}
											onClick={createGoal}
										/>
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
				<CalcContextProvider
					goal={wip}
					title={props.title}
					tabOptions={props.tabOptions}
					resultTabOptions={props.resultTabOptions}
					type={props.type}
					>
					{router.pathname === ROUTES.FI ? (
						<FFGoal
							mustCFs={[]}
							tryCFs={[]}
							mergedCfs={buildEmptyMergedCFs()}
							ffResult={ffResult}
							ffResultHandler={setFFResult}
						/>
					) : props.type ? (
						<Goal ffGoalEndYear={nowYear + 50} />
					) : (
						<props.calc />
					)}
				</CalcContextProvider>
			)}
		</DDPage>
	);
}
