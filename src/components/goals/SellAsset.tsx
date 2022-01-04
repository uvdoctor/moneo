import React, { useContext } from 'react';
import Section from '../form/section';
import RadialInput from '../form/radialinput';
import NumberInput from '../form/numberinput';
import { toHumanFriendlyCurrency, toStringArr } from '../utils';
import { GoalContext } from './GoalContext';
import { CalcContext } from '../calc/CalcContext';

export default function SellAsset() {
	const { currency }: any = useContext(CalcContext);
	const { sellPrice, assetChgRate, setAssetChgRate, sellAfter, setSellAfter }: any = useContext(GoalContext);

	return (
		<Section title="Sell Details">
			<RadialInput
				info="Years after which You Plan to Sell this Purchase."
				label="Years"
				pre="Sell After"
				labelBottom={true}
				data={toStringArr(3, 30)}
				value={sellAfter}
				step={1}
				changeHandler={setSellAfter}
			/>
			<NumberInput
				info="Rate at which Price may change yearly."
				pre="Yearly price change"
				unit="%"
				post={`Sell price ${toHumanFriendlyCurrency(sellPrice, currency)}`}
				min={-20}
				max={20}
				step={0.5}
				value={assetChgRate}
				changeHandler={setAssetChgRate}
			/>
		</Section>
	);
}
