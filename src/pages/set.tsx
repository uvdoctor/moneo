import { withAuthenticator } from "@aws-amplify/ui-react";
import React from "react";
import SetPlan from "../components/goals/SetPlan";
import Amplify from "aws-amplify";
import awsmobile from "../aws-exports";
import DDPage from "../components/DDPage";

Amplify.configure(awsmobile);

const Set = () => {
	return (
		<DDPage title="Set Plan" secure>
			<SetPlan />
		</DDPage>
	);
};

export default withAuthenticator(Set);
