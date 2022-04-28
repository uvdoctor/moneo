import React from "react";
import Amplify from "aws-amplify";
import awsexports from "../aws-exports";
import BasicPage from "../components/BasicPage";
import { InferGetStaticPropsType } from "next";
import { getFXData } from "../components/utils";
import { DBContextProvider } from "../components/dashboard/DBContext";

Amplify.configure({ ...awsexports, ssr: true });

function Dashboard({
  fxRates,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <BasicPage title="Moneo - Overview" secure>
      <DBContextProvider fxRates={fxRates} />
    </BasicPage>
  );
}

export const getStaticProps = async () => {
  return {
    props: {
      fxRates: await getFXData("61ff9bf3d40797.93512142"),
    },
  };
};

export default Dashboard;
