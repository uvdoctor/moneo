import React from "react";
import { NWContextProvider } from "../components/nw/NWContext";
import Amplify from "aws-amplify";
import awsexports from "../aws-exports";
import BasicPage from "../components/BasicPage";
import { InferGetStaticPropsType } from "next";
import { getFXData } from "../components/utils";

Amplify.configure({ ...awsexports, ssr: true });

function Get({ fxRates }: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <BasicPage title="Moneo - Get" secure>
      <NWContextProvider fxRates={fxRates} />
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

export default Get;
