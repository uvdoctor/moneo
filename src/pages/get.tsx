import React from "react";
import { NWContextProvider } from "../components/nw/NWContext";
import Amplify from "aws-amplify";
import awsmobile from "../aws-exports";
import BasicPage from "../components/BasicPage";

Amplify.configure(awsmobile);

export default function Get() {
  return (
    <BasicPage title="Get Real-time Analysis" isSecured={true}>
      <NWContextProvider />
    </BasicPage>
  );
}

