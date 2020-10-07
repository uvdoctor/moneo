import React, { useState, useEffect } from 'react';
import ItemDisplay from '../calc/ItemDisplay';
import SVGBalance from '../calc/svgbalance';
import NumberInput from '../form/numberinput';
import Section from '../form/section';
import HToggle from '../horizontaltoggle';

interface RentComparisonProps {
	currency: string;
	rangeFactor: number;
	rentAmt: number;
	rentAmtHandler: Function;
	rentChgPer: number;
	rentChgPerHandler: Function;
	taxRate: number;
	rentTaxBenefit: number;
	rentTaxBenefitHandler: Function;
	sellAfter: number;
	brChartData: Array<any>;
	analyzeFor: number;
	analyzeForHandler: Function;
}
export default function RentComparison({
	currency,
	rangeFactor,
	rentAmt,
	rentAmtHandler,
	rentChgPer,
	rentChgPerHandler,
	taxRate,
	rentTaxBenefit,
	rentTaxBenefitHandler,
	sellAfter,
	brChartData,
	analyzeFor,
	analyzeForHandler
}: RentComparisonProps) {
	const [ rentDiff, setRentDiff ] = useState<number | null>(null);

	const provideRentAns = () => {
		if (!sellAfter || !brChartData || brChartData.length === 0 || brChartData[0].values.length < sellAfter) {
			setRentDiff(null);
			return;
		}
		setRentDiff(brChartData[1].values[sellAfter - 1] - brChartData[0].values[sellAfter - 1]);
	};

	useEffect(
		() => {
			provideRentAns();
		},
		[ brChartData, sellAfter ]
	);

	return (
		<Section
			title="If You Rent Instead of Buying"
			insideForm
			left={
				<NumberInput
					name="rentAmt"
					pre="Yearly"
					post="Rent"
					value={rentAmt as number}
					changeHandler={rentAmtHandler}
					min={0}
					max={100000}
					step={1000}
					currency={currency}
					rangeFactor={rangeFactor}
				/>
			}
			right={
				rentAmt > 0 && (
					<NumberInput
						name="rentChg"
						pre="Yearly"
						post="Change"
						value={rentChgPer as number}
						changeHandler={rentChgPerHandler}
						min={-10}
						max={10}
						step={0.5}
						unit="%"
					/>
				)
			}
			bottom={
				!!rentAmt && (
					<div className="flex flex-col justify-center">
						<NumberInput
							name="af"
							pre="Analyze from 1 to "
							value={analyzeFor}
							changeHandler={analyzeForHandler}
							min={10}
							max={50}
							step={5}
							unit="Years"
						/>
						{rentDiff && (
							<ItemDisplay
								svg={<SVGBalance />}
								result={rentDiff}
								label={`Rent is ${rentDiff < 0 ? 'Costlier' : 'Cheaper'} by`}
								footer={`Over ${sellAfter} Years`}
								currency={currency}
								pl
							/>
						)}
					</div>
				)
			}
			toggle={
				taxRate ? (
					<HToggle rightText="Claim Tax Deduction" value={rentTaxBenefit} setter={rentTaxBenefitHandler} />
				) : (
					<div />
				)
			}
		/>
	);
}
