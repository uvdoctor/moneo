import React, { useState } from "react";
import { GoalType } from "../../api/goals";
import DDBasicPage from "../DDBasicPage";
import { createNewGoalInput } from "../goals/goalutils";
import * as gtag from "../../lib/gtag";
import { Button, Row, Col, PageHeader, Collapse } from "antd";
import { RocketOutlined } from "@ant-design/icons";
import { CalcContextProvider } from "./CalcContext";
import { GoalContextProvider } from "../goals/GoalContext";
import { FIGoalContextProvider } from "../goals/FIGoalContext";

import "./Layout.less";
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
	const { Panel } = Collapse;
	const [wip, setWIP] = useState<any | null>(null);
	const nowYear = new Date().getFullYear();
	const sections: any = {
		"Expected Results": props.results,
		"Key Features": props.features,
		"Major Assumptions": props.assumptions,
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
									className="steps-start-btn"
									onClick={() => createGoal()}
								>
									<RocketOutlined /> Start
								</Button>,
							]}
						/>
					</Col>
					<Col className="steps-content" span={24}>
						<Collapse defaultActiveKey={["1"]}>
							{Object.keys(sections).map((key, i) => (
								<Panel key={`${i + 1}`} header={key}>
									{sections[key]}
								</Panel>
							))}
						</Collapse>
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
