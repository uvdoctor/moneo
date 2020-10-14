import React from 'react';
import OppCost from '../calc/oppcost';
import FFImpact from './ffimpact';
import NumberInput from '../form/numberinput';
import { Space, Card } from 'antd';
interface GoalResultProps {
	cfs: Array<number>;
	ffOOM: Array<number> | null;
	ffImpactYears: number | null;
	currency: string;
	startYear: number;
	ffGoalEndYear: number;
	rr: Array<number>;
	buyGoal: boolean;
	dr?: number | null;
	drHandler?: Function;
}

export default function GoalResult(props: GoalResultProps) {
	return (
		<Space align="center" size="large">
			{props.dr === null || props.dr === undefined ? (
				<FFImpact ffGoalEndYear={props.ffGoalEndYear} ffOOM={props.ffOOM} ffImpactYears={props.ffImpactYears} />
			) : (
				<Card>
					<NumberInput
						value={props.dr as number}
						changeHandler={props.drHandler}
						min={0}
						max={15}
						step={0.1}
						pre="Investment"
						post="Earns Yearly"
						unit="%"
						note="After taxes & fees"
					/>
				</Card>
			)}
			<OppCost
				discountRate={props.dr === null || props.dr === undefined ? props.rr : props.dr}
				cfs={props.cfs}
				currency={props.currency}
				startYear={props.startYear}
				buyGoal={props.buyGoal}
				ffGoalEndYear={props.ffGoalEndYear}
			/>
		</Space>
	);
}
