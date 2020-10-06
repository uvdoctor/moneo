import { withAuthenticator } from "@aws-amplify/ui-react";
import React from "react";
import Goals from "../components/goals/goals";
import Amplify from "aws-amplify";
import awsmobile from "../aws-exports";
import DDPage from "../components/DDPage";

Amplify.configure(awsmobile);

const Set = () => {
	return (
		<DDPage title="Set Plan" secure>
			<Goals />
		</DDPage>
	);
};

export default withAuthenticator(Set);
