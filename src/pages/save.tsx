import { withAuthenticator } from "@aws-amplify/ui-react";
import Amplify from "aws-amplify";
import React from "react";
import awsmobile from "../aws-exports";
import BasicPage from "../components/BasicPage";

Amplify.configure(awsmobile);

const Save = () => {
	return (
		<BasicPage title="Save">
			<div />
		</BasicPage>
	);
};

export default withAuthenticator(Save);
