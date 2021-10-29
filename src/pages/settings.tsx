import React from 'react';
import Amplify from 'aws-amplify';
import awsmobile from '../aws-exports';
import BasicPage from '../components/BasicPage';
import UserSettings from '../components/settings/UserSettings';

Amplify.configure(awsmobile);

export default function Settings() {
	return (
		<BasicPage title="Settings" isSecured={true}>
        <UserSettings />
		</BasicPage>
	);
}
