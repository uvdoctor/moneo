import React, { useState } from "react";
import { GoalType } from "../../api/goals";
import DDPage from "../DDPage";
import { createNewGoalInput } from "../goals/goalutils";
import * as gtag from "../../lib/gtag";
import { Button, Collapse, Row, Col, PageHeader } from "antd";
import { RocketOutlined } from "@ant-design/icons";

import "./Layout.less";
import GoalContent from "../goals/GoalContent";
import { CalcContextProvider } from "./CalcContext";
import { GoalContextProvider } from "../goals/GoalContext";
import { FIGoalContextProvider } from "../goals/FIGoalContext";
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
		g.name = props.title + " Calculator";
		gtag.event({
			category: "Calculator",
			action: "Start",
			label: "type",
			value: props.type ? props.type : props.title,
		});
		setWIP(g);
	};

	return (
		<DDPage
			className="calculator-container"
			title={props.title}
			onBack={() => setWIP(null)}
		>
			{!wip ? (
				<Row align="middle" justify="center">
					<Col span={24}>
						<PageHeader
							className="calculator-header"
							title={props.title + " Calculator"}
						/>
					</Col>
					<Col className="steps-landing" span={24}>
						<Collapse defaultActiveKey={["1"]}>
							{Object.keys(sections).map((key, i) => (
								<Panel key={`${i + 1}`} header={key}>
									<Col span={24}>{sections[key]}</Col>
									{sections[key] === props.results && (
										<Col span={24}>
											<img
												style={{ cursor: "pointer" }}
												src={"/images/" + props.resultImg}
												onClick={createGoal}
											/>
										</Col>
									)}
								</Panel>
							))}
						</Collapse>
					</Col>
					<Col>
						<Button
							className="steps-start-btn"
							type="primary"
							onClick={() => createGoal()}
						>
							<RocketOutlined /> Start
						</Button>
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
								<FIGoalContextProvider mustCFs={[]}
								tryCFs={[]}
								mergedCFs={buildEmptyMergedCFs()}>
									</FIGoalContextProvider>
						) : (
							<GoalContextProvider ffGoalEndYear={nowYear + 50}>
								<GoalContent />
							</GoalContextProvider>
						)
					) : (
						<props.calc />
					)}
				</CalcContextProvider>
			)}
		</DDPage>
	);
}
