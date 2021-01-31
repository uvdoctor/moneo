import { withAuthenticator } from "@aws-amplify/ui-react";
import React from "react";
import NW from "../components/nw/nw";
import Amplify from "aws-amplify";
import awsmobile from "../aws-exports";
import BasicPage from "../components/BasicPage";

Amplify.configure(awsmobile);

const Get = () => {
	return (
		<BasicPage title="Get Net Worth">
			<NW />
		</BasicPage>
	);
};

export default withAuthenticator(Get);
