import { useRouter } from "next/router";
import React from "react";
import Amplify from "aws-amplify";
import awsexports from "../../aws-exports";
import BasicPage from "../../components/BasicPage";
import { StockDetailContextProvider } from "../../components/stockDetail/StockDetailContext";
import StockDetail from "../../components/stockDetail/StockDetail";

Amplify.configure({ ...awsexports, ssr: true });

export default function StockDetailPage() {
	const router = useRouter();
	const { stock } = router.query;

	return (
		<BasicPage title={`Moneo - Stock Detail | ${stock}`} secure>
			<StockDetailContextProvider stock={stock}>
				<StockDetail />
			</StockDetailContextProvider>
		</BasicPage>
	);
}
