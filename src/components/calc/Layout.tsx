import React, { useState } from "react";
import { GoalType } from "../../api/goals";
import BasicPage from "../BasicPage";
import { CalcContextProvider } from "./CalcContext";
import { GoalContextProvider } from "../goals/GoalContext";
import { FIGoalContextProvider } from "../goals/FIGoalContext";
import { FeedbackContextProvider } from "../feedback/FeedbackContext";
import { PlanContextProvider } from "../goals/PlanContext";
import PublicCalcView from "./PublicCalcView";
require("./Layout.less");

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
	const [wip, setWIP] = useState<any | null>(null);

	return (
		<BasicPage
			className="calculator-container steps-landing"
			title={props.title}
			onBack={wip ? () => setWIP(null) : null}
			navScrollable
			fixedNav
		>
			{!wip ? (
				<PublicCalcView
					type={props.type}
					title={props.title}
					features={props.features}
					setWIP={setWIP}
					assumptions={props.assumptions}
					results={props.results}
					terms={props.terms}
					demoUrl={props.demoUrl}
				/>
			) : (
				<PlanContextProvider goal={wip} setGoal={setWIP}>
					<FeedbackContextProvider>
						<CalcContextProvider
							tabOptions={props.tabOptions}
							resultTabOptions={props.resultTabOptions}
						>
							{props.type ? (
								props.type === GoalType.FF ? (
									<FIGoalContextProvider />
								) : (
									<GoalContextProvider />
								)
							) : (
								<props.calc />
							)}
						</CalcContextProvider>
					</FeedbackContextProvider>
				</PlanContextProvider>
			)}
		</BasicPage>
	);
}
