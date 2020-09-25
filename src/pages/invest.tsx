import { withAuthenticator } from "@aws-amplify/ui-react";
import Amplify from "aws-amplify";
import React from "react";
import awsmobile from "../aws-exports";
import DDPage from "../components/ddpage";

Amplify.configure(awsmobile);

const Invest = () => {
  return (
    <DDPage secure>
      <div />
    </DDPage>
  );
};

export default withAuthenticator(Invest);
