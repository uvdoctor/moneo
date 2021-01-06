import { withAuthenticator } from "@aws-amplify/ui-react";
import React from "react";
import SetPlan from "../components/goals/SetPlan";
import Amplify from "aws-amplify";
import awsmobile from "../aws-exports";
import BasicPage from "../components/BasicPage";

Amplify.configure(awsmobile);

const Set = () => {
	return (
		<BasicPage title="Set Plan" secure>
			<SetPlan />
		</BasicPage>
	);
};

export default withAuthenticator(Set);
