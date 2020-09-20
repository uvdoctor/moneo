import { withAuthenticator } from "@aws-amplify/ui-react";
import React from "react";
import NW from "../components/nw/nw";
import Amplify from "aws-amplify";
import awsmobile from "../aws-exports";
import SecurePage from "../components/securepage";

Amplify.configure(awsmobile);

const Get = () => {
  return (
    <SecurePage>
      <NW />
    </SecurePage>
  );
};

export default withAuthenticator(Get);
