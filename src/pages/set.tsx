import { withAuthenticator } from "@aws-amplify/ui-react";
import React from "react";
import SetPlan from "../components/goals/SetPlan";
import Amplify from "aws-amplify";
import awsmobile from "../aws-exports";

Amplify.configure(awsmobile);

const Set = () => <SetPlan />

export default withAuthenticator(Set);
