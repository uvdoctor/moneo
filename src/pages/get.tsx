import { withAuthenticator } from "@aws-amplify/ui-react";
import React from "react";
import NW from "../components/nw/nw";
import Amplify from "aws-amplify";
import awsmobile from "../aws-exports";
import DDBasicPage from "../components/DDBasicPage";

Amplify.configure(awsmobile);

const Get = () => {
	return (
		<DDBasicPage title="Get Net Worth" secure>
			<NW />
		</DDBasicPage>
	);
};

export default withAuthenticator(Get);
