import React, { useEffect, useState } from 'react';
import ItemDisplay from '../calc/ItemDisplay';
import SVGMoneyBag from '../calc/svgmoneybag';
import SVGMoneyBagPer from '../svgmoneybagper';
import Section from '../form/section';
import RadialInput from '../form/radialinput';
import NumberInput from '../form/numberinput';
import { toStringArr } from '../utils';
import { calculateSellPrice, calculateXIRR } from './cfutils';
import { getDuration } from './goalutils';

interface SellProps {
	price: number;
	startYear: number;
	endYear: number;
	sellAfter: number;
	sellPrice: number;
	sellPriceHandler: Function;
	sellAfterHandler: Function;
	currency: string;
	assetChgRate: number;
	assetChgRateHandler: Function;
	cfs: Array<number>;
}

export default function Sell(props: SellProps) {
	const [ annualReturnPer, setAnnualReturnPer ] = useState<number | null>(0);

	useEffect(
		() => {
			let duration = getDuration(props.sellAfter, props.startYear, props.endYear, 0, null, null, null);
			let sellPrice = calculateSellPrice(props.price, props.assetChgRate, duration);
			props.sellPriceHandler(sellPrice);
			setAnnualReturnPer(calculateXIRR(props.cfs, props.startYear, props.price, props.sellAfter, sellPrice));
		},
		[ props.cfs ]
	);

	return (
		<Section
			title="Sell After"
			insideForm
			left={
				<RadialInput
					info="Years after which You Plan to Sell this Purchase."
					label="Years"
					labelBottom={true}
					data={toStringArr(3, 30)}
					value={props.sellAfter}
					step={1}
					changeHandler={props.sellAfterHandler}
				/>
			}
			right={
				<NumberInput
					name="assetChgRate"
					info="Rate at which Price may change Yearly."
					pre="Sell Price"
					post="Changes"
					unit="%"
					note="Yearly"
					min={-20}
					max={20}
					step={0.5}
					value={props.assetChgRate}
					changeHandler={props.assetChgRateHandler}
				/>
			}
			bottom={
				<div className="flex justify-around w-full items-center">
					<ItemDisplay
						svg={<SVGMoneyBag disabled={false} selected />}
						label="You May Get"
						footer={`In ${props.startYear + props.sellAfter}`}
						result={Math.round(props.sellPrice)}
						currency={props.currency}
					/>
					{annualReturnPer && (
						<ItemDisplay
							svg={<SVGMoneyBagPer />}
							label={`You May ${annualReturnPer > 0 ? 'Gain' : 'Lose'}`}
							result={annualReturnPer}
							decimal={2}
							unit="%"
							footer="Yearly"
							pl
						/>
					)}
				</div>
			}
			footer="Sell Price above excludes taxes & fees."
		/>
	);
}
