import React, { Fragment, useContext } from 'react';
import { GoalType } from '../../api/goals';
import SelectInput from '../form/selectinput';
import { CalcContext } from './CalcContext';
import ItemDisplay from './ItemDisplay';
import { initOptions, toHumanFriendlyCurrency } from '../utils';
import { Row } from 'antd';
import { PlanContext } from '../goals/PlanContext';

interface OppCostResultProps {
	oppCost: number;
	numOfYears: number;
	numOfYearsOptions: any;
	oppCostHandler: Function;
}

export default function OppCostResult({ oppCost, numOfYears, numOfYearsOptions, oppCostHandler }: OppCostResultProps) {
	const drOptions = initOptions(1, 9);
	const { dr, setDR, isPublicCalc }: any = useContext(PlanContext);
	const { goal, startYear, currency }: any = useContext(CalcContext);

	return (
		<ItemDisplay
			result={oppCost}
			currency={currency}
			label={
				<Fragment>
					{`${goal.type === GoalType.B ? 'Buy' : 'Spend'} v/s Invest`}
					{isPublicCalc && (
						<Fragment>
							{` @`}
							<SelectInput
								pre=""
								value={Math.round(dr)}
								changeHandler={(val: string) => setDR(parseInt(val))}
								unit="%"
								options={drOptions}
							/>
						</Fragment>
					)}
				</Fragment>
			}
			pl
			unit={
				goal.type !== GoalType.FF &&
				isPublicCalc && (
					<Row align="middle">
						<SelectInput
							pre="in"
							value={numOfYears}
							unit="years"
							options={numOfYearsOptions}
							changeHandler={(val: string) => oppCostHandler(parseInt(val))}
						/>
					</Row>
				)
			}
			info={`${dr ? `Given that Investment earns ${dr}% Yearly, ` : ''}You ${oppCost < 0
				? 'Lose'
				: 'Gain'} about ${toHumanFriendlyCurrency(Math.abs(oppCost), currency)} in ${numOfYears} Years
    by ${goal.type === GoalType.B ? 'Buying' : 'Spending'} instead of Investing.
	${!isPublicCalc ? ` This calculation assumes that cash flows are invested according to the the target asset allocation until ${startYear + numOfYears}. ` : ''}`}
		/>
	);
}
