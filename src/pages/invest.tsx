import { withAuthenticator } from "@aws-amplify/ui-react";
import Amplify from "aws-amplify";
import React from "react";
import awsexports from "../aws-exports";
import BasicPage from "../components/BasicPage";

Amplify.configure({...awsexports, ssr: true});

const Invest = () => {
	return (
		<BasicPage title="Invest">
			<div />
		</BasicPage>
	);
};

export default withAuthenticator(Invest);
