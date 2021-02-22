import React, { useContext, useState, Fragment } from "react";
import { getImpOptions, getGoalTypes, createNewGoalInput } from "./goalutils";
import SelectInput from "../form/selectinput";
import PlanStart from "./PlanStart";
import FISummaryHeader from "./FISummaryHeader";
import { Button, Col, Dropdown, Menu, Row, Tabs, Alert } from "antd";
import {
	faChartLine,
	faChartPie,
	faBullseye,
} from "@fortawesome/free-solid-svg-icons";
import GoalSummary from "./GoalSummary";
import { PlanContext } from "./PlanContext";
import YearlyCFChart from "./YearlyCFChart";
import { CalcContextProvider } from "../calc/CalcContext";
import MenuItem from "antd/lib/menu/MenuItem";
import { GoalType } from "../../api/goals";
import { DownOutlined } from "@ant-design/icons";
import { FIGoalContextProvider } from "./FIGoalContext";
import DynamicAAChart from "./DynamicAAChart";

export default function PlanView() {
	const { allGoals, ffGoal, goalsLoaded, setGoal }: any = useContext(
		PlanContext
	);
	const { TabPane } = Tabs;
	const goalsLabel = "Goals";
	const cfLabel = "Cash Flows";
	const aaLabel = "Target Asset Allocation";
	const [impFilter, setImpFilter] = useState<string>("");

	const tabOptions = [
		{
			label: goalsLabel,
			svg: faBullseye,
			content: <GoalSummary impFilter={impFilter} />,
		},
		{
			label: aaLabel,
			svg: faChartPie,
			content: (
				<CalcContextProvider goal={ffGoal}>
					<FIGoalContextProvider>
						<DynamicAAChart />
					</FIGoalContextProvider>
				</CalcContextProvider>
			),
		},
		{
			label: cfLabel,
			svg: faChartLine,
			content: <YearlyCFChart />,
		},
	];

	const goalTypesMenuItems = (
		<Menu>
			{Object.keys(getGoalTypes()).map(
				(key: string) =>
					key !== GoalType.FF && (
						<MenuItem
							key={key}
							onClick={() =>
								setGoal(createNewGoalInput(key as GoalType, ffGoal.ccy))
							}
						>
							{getGoalTypes()[key as GoalType]}
						</MenuItem>
					)
			)}
		</Menu>
	);

	return goalsLoaded ? (
		ffGoal ? (
			<Fragment>
				<FISummaryHeader />
				<Row
					justify="center"
					style={{ marginTop: "20px", marginBottom: "20px" }}
				>
					<Col>
						<Dropdown overlay={goalTypesMenuItems}>
							<Button>
								Define Your Dreams <DownOutlined />
							</Button>
						</Dropdown>
					</Col>
				</Row>
				{allGoals && allGoals.length ? (
					<Row>
						<Col className="steps-content" span={24}>
							<Tabs type="card">
								{tabOptions.map((t: any) => (
									<TabPane key={t.label} tab={t.label}>
										<Row
											align="middle"
											gutter={[
												{ xs: 0, sm: 15, md: 30, lg: 50 },
												{ xs: 15, sm: 15, md: 30, lg: 50 },
											]}
										>
											<Col span={18}>
												{t.label !== aaLabel && (
													<Alert
														message="Negative values imply You Pay, while Positive values imply You Receive"
														type="success"
													/>
												)}
											</Col>
											<Col className="text-right" span={6}>
												{t.label === goalsLabel && (
													<SelectInput
														pre=""
														post=""
														options={getImpOptions()}
														value={impFilter as string}
														changeHandler={setImpFilter}
													/>
												)}
											</Col>
											<Col span={24}>{t.content}</Col>
										</Row>
									</TabPane>
								))}
							</Tabs>
						</Col>
					</Row>
				) : null}
			</Fragment>
		) : (
			<PlanStart />
		)
	) : null;
}
