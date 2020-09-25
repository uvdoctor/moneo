import { withAuthenticator } from "@aws-amplify/ui-react";
import React from "react";
import Goals from "../components/goals/goals";
import Amplify from "aws-amplify";
import awsmobile from "../aws-exports"
import DDPage from "../components/ddpage";

Amplify.configure(awsmobile)

const Set = () => {
  return (
    <DDPage secure>
        <Goals />
    </DDPage>
  );
}

export default withAuthenticator(Set)
