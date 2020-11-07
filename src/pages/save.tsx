import { withAuthenticator } from "@aws-amplify/ui-react";
import Amplify from "aws-amplify";
import React from "react";
import awsmobile from "../aws-exports";
import DDBasicPage from "../components/DDBasicPage";

Amplify.configure(awsmobile);

const Save = () => {
	return (
		<DDBasicPage title="Save" secure>
			<div />
		</DDBasicPage>
	);
};

export default withAuthenticator(Save);
