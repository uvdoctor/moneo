import { withAuthenticator } from "@aws-amplify/ui-react";
import Amplify from "aws-amplify";
import React from "react";
import awsmobile from "../aws-exports";
import DDBasicPage from "../components/DDBasicPage";

Amplify.configure(awsmobile);

const Invest = () => {
	return (
		<DDBasicPage title="Invest" secure>
			<div />
		</DDBasicPage>
	);
};

export default withAuthenticator(Invest);
