import React, { useContext } from "react";
import ItemDisplay from "../calc/ItemDisplay";
import { NWContext } from "./NWContext";

export default function TotalNetWorth() {
	const { nw, selectedCurrency }: any = useContext(NWContext);

	return (
		<div className="dd-stat">
			<ItemDisplay
				label="Net Worth"
				result={nw}
				currency={selectedCurrency}
				pl
				info={"Net Worth equals what you own minus what you owe."}
			/>
		</div>
	);
}
