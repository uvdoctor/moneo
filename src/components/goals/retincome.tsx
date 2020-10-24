import React, { useEffect } from 'react';
import { MAX_RETIREMENT_AGE, PLAN_DURATION } from '../../CONSTANTS';
import NumberInput from '../form/numberinput';
import Section from '../form/section';
import SelectInput from '../form/selectinput';
import { changeSelection, initYearOptions } from '../utils';
import { getLastPossibleFFYear } from './goalutils';
interface RetIncomeProps {
	currency: string;
	rangeFactor: number;
	endYear: number;
	retirementIncome: number;
	retirementIncomeHandler: Function;
	retirementIncomePer: number;
	retirementIncomePerHandler: Function;
	retirementIncomeSY: number;
	retirementIncomeSYHandler: Function;
}

export default function RetIncome({
	currency,
	rangeFactor,
	endYear,
	retirementIncome,
	retirementIncomeHandler,
	retirementIncomePer,
	retirementIncomePerHandler,
	retirementIncomeSY,
	retirementIncomeSYHandler
}: RetIncomeProps) {
	useEffect(
		() => {
			let lastPossibleFFYear = getLastPossibleFFYear(endYear);
			if (retirementIncomeSY > lastPossibleFFYear - 2 || retirementIncomeSY < lastPossibleFFYear + 5)
				retirementIncomeSYHandler(lastPossibleFFYear);
		},
		[ endYear ]
	);

	return (
		<Section
			title="Retirement Income Benefit (eg: Pension, Social Security, etc.)">
				<NumberInput
					value={retirementIncome}
					changeHandler={retirementIncomeHandler}
					rangeFactor={rangeFactor}
					pre="Yearly"
					post="Benefit"
					min={0}
					max={50000}
					step={500}
					currency={currency}
				/>
				{retirementIncome && (
					<NumberInput
						value={retirementIncomePer}
						changeHandler={retirementIncomePerHandler}
						pre="Benefit"
						post="Increases"
						note="Yearly"
						min={0}
						max={3}
						step={0.1}
						unit="%"
					/>
				)
			}
			{retirementIncome && (
					<SelectInput
						info="When do You Plan to Receive the Benefit? Around 70 years of age is preferable for optimal benefit."
						value={retirementIncomeSY - (endYear - PLAN_DURATION)}
						options={initYearOptions(MAX_RETIREMENT_AGE - 5, 7)}
						pre="Withdrawal Age"
						unit="Onwards"
						changeHandler={(val: string) => {
							changeSelection(val, retirementIncomeSYHandler, endYear - PLAN_DURATION);
						}}
					/>
				)
			}
		</Section>
	);
}
