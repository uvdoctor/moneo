import { useRouter } from "next/router";
import React from "react";
import Amplify from "aws-amplify";
import awsexports from "../../aws-exports";
import BasicPage from "../../components/BasicPage";
import { StockDetailContextProvider } from "../../components/stockDetail/StockDetailContext";
import StockDetail from "../../components/stockDetail/StockDetail";

Amplify.configure({ ...awsexports, ssr: true });

export default function LookupPage() {
  const router = useRouter();
  const { name } = router.query;

  return (
    <BasicPage title={`Moneo - ${name}`} secure>
      <StockDetailContextProvider name={name}>
        <StockDetail />
      </StockDetailContextProvider>
    </BasicPage>
  );
}
