import { withAuthenticator } from '@aws-amplify/ui-react';
import React from 'react';
import Amplify from 'aws-amplify';
import awsmobile from '../aws-exports';
import BasicPage from '../components/BasicPage';
import UserSettings from '../components/settings/UserSettings';

Amplify.configure(awsmobile);

function Settings() {
	return (
		<BasicPage title="Settings">
        <UserSettings />
		</BasicPage>
	);
}

export default withAuthenticator(Settings);
