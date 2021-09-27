import { withAuthenticator } from '@aws-amplify/ui-react';
import React from 'react';
import Amplify from 'aws-amplify';
import awsmobile from '../aws-exports';
import BasicPage from '../components/BasicPage';
import Setting from '../components/settings/Settings';

Amplify.configure(awsmobile);

function Settings() {
	return (
		<BasicPage title="Settings">
        <Setting />
		</BasicPage>
	);
}

export default withAuthenticator(Settings);
