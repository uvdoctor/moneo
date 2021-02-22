import React, { Fragment, useContext } from "react";
import BasicLineChart from "./BasicLineChart";
import { getGoalTypes, getImpLevels } from "./goalutils";
import { GoalType, LMH } from "../../api/goals";
import { COLORS } from "../../CONSTANTS";
import { Card, Row, Col, Badge } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import DefaultOppCostResult from "../calc/DefaultOppCostResult";
import FIImpact from "./FIImpact";
import { PlanContext } from "./PlanContext";
import { CalcContext } from "../calc/CalcContext";

import "./SummaryView.less";

export default function SummaryView() {
	const { removeGoal, editGoal }: any = useContext(PlanContext);
	const { goal }: any = useContext(CalcContext);
	const bgColor =
		goal.imp === LMH.H
			? COLORS.BLUE
			: goal.imp === LMH.M
			? COLORS.ORANGE
			: COLORS.GREEN;
	const nowYear = new Date().getFullYear();
	const goalTypes: any = getGoalTypes();
	const impLevels: any = getImpLevels();

	return (
		<Card
			className="goals-card"
			//headStyle={{ backgroundColor: bgColor, color: COLORS.WHITE }}
			title={
				<Row justify="space-between">
					<Col>
						{`${goalTypes[goal.type as GoalType]} ${goal.name}`}{" "}
						<Badge
							count={impLevels[goal.imp]}
							style={{ backgroundColor: bgColor, color: COLORS.WHITE }}
						/>
					</Col>
					<Col>
						<Row justify="space-around">
							<Col
								style={{ cursor: "pointer" }}
								onClick={() => editGoal(goal.id)}
							>
								<EditOutlined />
							</Col>
							<Col>&nbsp;&nbsp;</Col>
							<Col
								style={{ cursor: "pointer" }}
								onClick={() => removeGoal(goal.id)}
							>
								<DeleteOutlined />
							</Col>
						</Row>
					</Col>
				</Row>
			}
		>
			<Fragment>
				{(goal.sy as number) > nowYear && (
					<Row justify="space-around">
						<Col>
							<FIImpact />
						</Col>
						<Col>
							<DefaultOppCostResult />
						</Col>
					</Row>
				)}
				<Row justify="center" style={{ marginTop: "20px" }}>
					<Col span={24}>
						<BasicLineChart chartTitle={`Cash Flows in ${goal.ccy}`} />
					</Col>
				</Row>
			</Fragment>
		</Card>
	);
}
