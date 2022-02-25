import { useContext } from "react";
import StockDetailContext from "./StockDetailContext";
import CommonStock from "./CommonStock";
import ETF from "./ETF";
import Currency from "./Currency";
import Fund from "./Fund";
import Crypto from "./Crypto";

export default function RenderDetails() {
	/* @ts-ignore */
	const { state } = useContext(StockDetailContext);

	switch (state.data.General?.Type) {
		case "Common Stock":
			return <CommonStock />;

		case "ETF":
			return <ETF />;

		case "Currency":
			return <Currency />;

		case "FUND":
			return <Fund />;

		case "Crypto":
			return <Crypto />;

		default:
			return null;
	}
}
