import React, { useState, useEffect, useContext, Fragment } from 'react';
import { getCompoundedIncome } from './finance';
import ItemDisplay from './ItemDisplay';
import { initOptions, toCurrency } from '../utils';
import { getMinRetirementDuration } from '../goals/goalutils';
import { GoalType } from '../../api/goals';
import { CalcContext } from './CalcContext';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import SelectInput from '../form/selectinput';
import { Row } from 'antd';

interface OppCostProps {
	calculateFor?: number;
}

export default function OppCost({ calculateFor }: OppCostProps) {
	const { cfs, currency, dr, setDR, rr, startYear, startMonth, goal }: any = useContext(CalcContext);
	const [ oppCost, setOppCost ] = useState<number>(0);
	const isDRNumber = dr !== null;
	const drOptions = initOptions(1, 9);
	const [ numOfYears, setNumOfYears ] = useState<number>(
		calculateFor && calculateFor > cfs.length ? calculateFor : cfs.length
	);
	const [ numOfYearsOptions, setNumOfYearsOptions ] = useState<any>(
		initOptions(startMonth > 1 ? cfs.length - 1 : cfs.length, 20)
	);

	const calculateOppCost = (yearsNum: number) => {
		let yearsForCalculation = yearsNum;
		if (yearsForCalculation === cfs.length - 1 && startMonth > 1) yearsForCalculation++;
		else if (yearsForCalculation < cfs.length) {
			yearsForCalculation = cfs.length;
			setNumOfYears(yearsForCalculation);
		} else if (yearsForCalculation !== numOfYears) setNumOfYears(yearsForCalculation);
		const discountRate = dr ? dr : rr;
		if (!cfs || !cfs.length) {
			setOppCost(0);
			return;
		}
		let oppCost = 0;
		let startIndex = 0;
		if (startYear) startIndex = startYear - (new Date().getFullYear() + 1);
		cfs.forEach((cf: number, index: number) => {
			let yearFactor = 1;
			if (startMonth > 1 && goal.type !== GoalType.FF) {
				if (index === 0) yearFactor = (12 - (startMonth - 1)) / 12;
				else if (index === cfs.length - 1) yearFactor = (startMonth - 1) / 12;
			}
			oppCost += cf;
			if (index < cfs.length - 1 && oppCost < 0) {
				oppCost *= 1 + (isDRNumber ? discountRate : discountRate[startIndex + index]) * yearFactor / 100;
			}
		});
		if (!isDRNumber) {
			let year = (startYear as number) + cfs.length - 1;
			for (
				let i = startIndex + cfs.length - 1;
				i < discountRate.length - (getMinRetirementDuration() + 1);
				i++, year++
			)
				if (oppCost < 0) oppCost *= 1 + discountRate[i] / 100;
		} else if (cfs.length - 1 < yearsForCalculation && oppCost < 0)
			oppCost = getCompoundedIncome(discountRate, oppCost, yearsForCalculation - (cfs.length - 1));
		setOppCost(oppCost);
	};

	useEffect(
		() => {
			calculateOppCost(cfs.length);
			setNumOfYearsOptions(initOptions(startMonth > 1 ? cfs.length - 1 : cfs.length, cfs.length + 20, 1));
		},
		[ cfs ]
	);

	useEffect(() => calculateOppCost(numOfYears), [ dr, rr ]);

	useEffect(() => calculateOppCost(calculateFor as number), [ calculateFor ]);

	return (
		<ItemDisplay
			result={oppCost}
			currency={currency}
			label={
				<Fragment>
					{`${goal.type === GoalType.B ? 'Buy' : 'Spend'} v/s Invest`}
					{dr && (
						<Fragment>
							{` @ `}
							<SelectInput
								pre=""
								value={Math.round(dr)}
								changeHandler={(val: string) => setDR(parseInt(val))}
								post="%"
								options={drOptions}
							/>
						</Fragment>
					)}
				</Fragment>
			}
			svg={oppCost < 0 ? <ArrowDownOutlined /> : <ArrowUpOutlined />}
			pl
			unit={
				<Row align="middle">
					{`in `}
					{goal.type !== GoalType.FF && (
						<SelectInput
							pre=""
							value={numOfYears}
							unit="Years"
							options={numOfYearsOptions}
							changeHandler={(val: string) => {
								let years = parseInt(val);
								calculateOppCost(years);
							}}
						/>
					)}
				</Row>
			}
			info={`You May Have ${toCurrency(Math.abs(oppCost), currency)} More in ${numOfYears} Years
      if You ${oppCost < 0 ? 'Invest' : 'Buy'} instead of ${oppCost < 0
				? goal.type === GoalType.B ? 'Buying' : 'Spending'
				: 'Investing'}.`}
		/>
	);
}
