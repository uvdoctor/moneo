import React from "react";
import { NWContextProvider } from "../components/nw/NWContext";
import Amplify from "aws-amplify";
import awsexports from "../aws-exports";
import BasicPage from "../components/BasicPage";

Amplify.configure({...awsexports, ssr: true});

export default function Get() {
  return (
    <BasicPage title="Get Real-time Analysis" secure>
      <NWContextProvider />
    </BasicPage>
  );
}
