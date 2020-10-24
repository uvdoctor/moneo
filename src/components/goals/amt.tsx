import React, { useState } from 'react';
import { GoalType, TargetInput } from '../../api/goals';
import SelectInput from '../form/selectinput';
import { initYearOptions } from '../utils';
import Cost from './cost';
import { Row, Col } from 'antd';
interface AmtProps {
	goalType: GoalType;
	goalBY: number;
	ffGoalEndYear: number;
	currency: string;
	rangeFactor: number;
	startYear: number;
	startYearHandler: Function;
	endYear: number;
	endYearHandler: Function;
	manualMode: number;
	manualModeHandler: Function;
	manualTgts: Array<TargetInput>;
	manualTgtsHandler: Function;
	startingPrice: number;
	startingPriceHandler: Function;
	priceChgRate: number;
	priceChgRateHandler: Function;
	price: number;
	eyOptions: any;
}

export default function Amt({
	goalType,
	goalBY,
	ffGoalEndYear,
	currency,
	rangeFactor,
	startYear,
	startYearHandler,
	endYear,
	endYearHandler,
	manualMode,
	manualModeHandler,
	manualTgts,
	manualTgtsHandler,
	startingPrice,
	startingPriceHandler,
	priceChgRate,
	priceChgRateHandler,
	price,
	eyOptions
}: AmtProps) {
	const [ syOptions ] = useState(initYearOptions(goalBY + 1, ffGoalEndYear - 20 - (goalBY + 1)));

	return (
		<Row align="middle">
			<Col span={24}>
				<Row align="middle" justify="space-between" style={{margin: '1rem'}}>
					<Col span={10}>
						<SelectInput
							pre="When?"
							info="Year in which You Start Paying for the Goal"
							value={startYear}
							changeHandler={startYearHandler}
							options={syOptions}
						/>
					</Col>
					<Col span={10}>
						<SelectInput
							pre={`Pay Until`}
							value={endYear}
							info="Year in which You End Paying for the Goal"
							disabled={goalType === GoalType.B && manualMode < 1}
							changeHandler={endYearHandler}
							options={eyOptions}
						/>
					</Col>
				</Row>
			</Col>
			<Col span={24}>
				<Cost
					startingCost={startingPrice}
					startingCostHandler={startingPriceHandler}
					rangeFactor={rangeFactor}
					manualTargets={manualTgts}
					manualTargetsHandler={manualTgtsHandler}
					currency={currency}
					cost={price}
					costChgRate={priceChgRate}
					costChgRateHandler={priceChgRateHandler}
					endYear={endYear}
					manualMode={manualMode}
					manualModeHandler={manualModeHandler}
					startYear={startYear}
					baseYear={goalBY}
					leftMax={goalType === GoalType.B ? 1500000 : 50000}
					leftNote={goalType !== GoalType.D ? 'including taxes & fees' : ''}
				/>
			</Col>
		</Row>
	);
}
