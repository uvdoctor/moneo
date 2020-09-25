import { withAuthenticator } from "@aws-amplify/ui-react";
import React from "react";
import NW from "../components/nw/nw";
import Amplify from "aws-amplify";
import awsmobile from "../aws-exports";
import DDPage from "../components/ddpage";

Amplify.configure(awsmobile);

const Get = () => {
  return (
    <DDPage secure>
      <NW />
    </DDPage>
  );
};

export default withAuthenticator(Get);

