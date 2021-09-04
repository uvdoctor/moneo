import React, { useState } from "react";
import { Button } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { AssetSubType } from "../../../api/goals";
import { initOptions, toCurrency } from "../../utils";

export default function PreciousMetalsForm({
	silver,
	platinum,
	palladium,
	onAdd,
}) {
	const [assetType, setAssetType] = useState(AssetSubType.Gold);
	const [purity, setPurity] = useState("");
	const [qty, setQty] = useState("");
	const [pan, setPan] = useState("");

	const config = [
		{
			type: "selectGroupLinked",
			childrens: [
				{
					type: "select",
					value: AssetSubType.Gold,
					options: {
						[AssetSubType.Gold]: "Gold",
						[silver]: "Silver",
						[platinum]: "Platinum",
						[palladium]: "Palladium",
					},
				},
				{
					type: "select",
					value: "",
					options: {
						[AssetSubType.Gold]: initOptions(8, 16),
						[silver]: {
							100: "Pure",
							95.8: "Brittania (95.8%)",
							92.5: "Sterling (92.5%)",
							90: "Coin (90%)",
							80: "Jewellery (80%)",
						},
						[platinum]: {
							100: "Pure",
							95: "95%",
							90: "90%",
							85: "85%",
							80: "80%",
							50: "50%",
						},
						[palladium]: {
							100: "Pure",
							95: "95%",
							"90%": "90%",
							85: "85%",
							80: "80%",
							50: "50%",
						},
					},
					suffix: {
						[AssetSubType.Gold]: "karat",
					},
				},
			],
		},
		{
			type: "inputNumber",
			name: "qty",
			min: 0,
			max: 1000,
			step: 0.1,
			size: "small",
			suffix: function () {},
		},
		{
			type: "select",
			name: "fIds",
			value: "",
			pre: UserOutlined,
		},
		// {
		// 	type: "selectGroup",
		// 	repeat: true,
		// 	childrens: [
		// 		{
		// 			type: "select",
		// 			name: "fIds",
		// 			value: "",
		// 			pre: UserOutlined,
		// 		},
		// 		{
		// 			type: "input",

		// 		},
		// 	],
		// },
	];

	function onAddHoldings() {
		onAdd({
			qty: 25,
			subt: "Gold",
			name: "25",
			fIds: "ANZPR7781D",
		});
	}

	return (
		<div>
			This is precious metals form...{" "}
			<Button shape="circle" type="primary" onClick={onAddHoldings}>
				Add
			</Button>
		</div>
	);
}
