import { withAuthenticator } from "@aws-amplify/ui-react";
import React from "react";
import SetPlan from "../components/goals/SetPlan";
import Amplify from "aws-amplify";
import awsmobile from "../aws-exports";
import DDBasicPage from "../components/DDBasicPage";

Amplify.configure(awsmobile);

const Set = () => {
	return (
		<DDBasicPage title="Set Plan" secure>
			<SetPlan />
		</DDBasicPage>
	);
};

export default withAuthenticator(Set);
