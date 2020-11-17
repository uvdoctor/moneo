import React, { useState } from "react";
import { GoalType } from "../../api/goals";
import DDBasicPage from "../DDBasicPage";
import { createNewGoalInput } from "../goals/goalutils";
import * as gtag from "../../lib/gtag";
import { Button, Row, Col, PageHeader, Tabs } from "antd";
import { useFullScreenBrowser } from "react-browser-hooks";
import { RocketOutlined } from "@ant-design/icons";
import { CalcContextProvider } from "./CalcContext";
import { GoalContextProvider } from "../goals/GoalContext";
import { FIGoalContextProvider } from "../goals/FIGoalContext";
import { isMobileDevice } from "../utils";
import DDVideoPlayer from "../DDVideoPlayer";
import ExpectedResults from "./blog/ExpectedResults";

import "./Layout.less";
import KeyFeatures from "./blog/KeyFeatures";
import MajorAssumptions from "./blog/MajorAssumptions";
import CommonTerms from "./blog/CommonTerms";

export interface BlogInputProps {
	elements: Array<any>;
}
interface LayoutProps {
	tabOptions?: Array<any>;
	resultTabOptions?: Array<any>;
	calc?: any;
	type?: GoalType;
	title: string;
	features: Array<any>;
	assumptions: Array<any>;
	results: Array<any>;
	terms: Array<any>;
	demoUrl: string;
}

export default function Layout(props: LayoutProps) {
	const fsb = useFullScreenBrowser();
	const { TabPane } = Tabs;
	const [wip, setWIP] = useState<any | null>(null);
	const nowYear = new Date().getFullYear();
	const startingAssumptions = [
		{
			title: 'Estimates Only. No Advice.',
			content: `Financial estimates, though not 100% accurate, are useful for what-if analysis. Please consult a registered financial / tax advisor for specific advice.`
		}
	];
	const endingAssumptions = [
		{
			title: 'Tax benefit quantified as positive cash flow for next year.',
			content: `As you pay lesser tax next year due to eligible tax benefit, cash flow analysis quantifies this as positive cash flow in next year.`
		},
		{
			title: 'Non-financial aspects are out of scope.',
			content: `Please consider other factors such as emotions, convenience, etc so that it is the right decision for You.`
		}
	];

	const genericTerms = [
		{
			title: "Cash Flow",
			content: "Cash flow indicates flow of money. Positive cash flow indicates You Receive money, while Negative cash flow indicates You Pay money."
		}
	];

	const sections: any = {
		"Demo": <DDVideoPlayer url={props.demoUrl} />,
		"Expected Results": <ExpectedResults elements={props.results} />,
		"Key Features": <KeyFeatures elements={props.features} />,
		"Major Assumptions": <MajorAssumptions elements={[...startingAssumptions, ...props.assumptions, ...endingAssumptions]} />,
		"Common Terms": <CommonTerms elements={[...props.terms, ...genericTerms]} />
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
		const defaultCurrency = "USD";
		if (props.type) g = createNewGoalInput(props.type, defaultCurrency);
		else g = { ccy: defaultCurrency };
		g.name = props.title;
		gtag.event({
			category: "Calculator",
			action: "Start",
			label: "type",
			value: props.type ? props.type : props.title,
		});
		setWIP(g);
	};

	return (
		<DDBasicPage
			className="calculator-container steps-landing"
			title={props.title}
			onBack={() => setWIP(null)}
			navScrollable
			fixedNav
		>
			{!wip ? (
				<Row>
					<Col span={24} className="primary-header">
						<PageHeader
							title={props.title}
							extra={[
								<Button
									key="startbtn"
									className="steps-start-btn"
									onClick={() => createGoal()}
								>
									<RocketOutlined /> Start
								</Button>,
							]}
						/>
					</Col>
					<Col className="steps-content" span={24}>
						<Tabs
							tabPosition={isMobileDevice(fsb) ? "top" : "left"}
							type={isMobileDevice(fsb) ? "card" : "line"}
						>
							{Object.keys(sections).map((key, i) => (
								<TabPane key={`${i + 1}`} tab={key}>
									{sections[key]}
								</TabPane>
							))}
						</Tabs>
					</Col>
				</Row>
			) : (
				<CalcContextProvider
					goal={wip}
					tabOptions={props.tabOptions}
					resultTabOptions={props.resultTabOptions}
				>
					{props.type ? (
						props.type === GoalType.FF ? (
							<FIGoalContextProvider
								mustCFs={[]}
								tryCFs={[]}
								mergedCFs={buildEmptyMergedCFs()}
							/>
						) : (
							<GoalContextProvider ffGoalEndYear={nowYear + 50} />
						)
					) : (
						<props.calc />
					)}
				</CalcContextProvider>
			)}
		</DDBasicPage>
	);
}
