import { withAuthenticator } from "@aws-amplify/ui-react";
import React from "react";
import Goals from "../components/goals/goals";
import Amplify from "aws-amplify";
import awsmobile from "../aws-exports"
import SecurePage from "../components/securepage";

Amplify.configure(awsmobile)

const Set = () => {
  return (
    <SecurePage>
        <Goals />
    </SecurePage>
  );
}

export default withAuthenticator(Set)
