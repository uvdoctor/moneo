import { withAuthenticator } from '@aws-amplify/ui-react';
import React from 'react';
import { NWContextProvider } from '../components/nw/NWContext';
import Amplify from 'aws-amplify';
import awsmobile from '../aws-exports';
import BasicPage from '../components/BasicPage';

Amplify.configure(awsmobile);

const Get = () => (
	<BasicPage title="Get Net Worth">
		<NWContextProvider />
	</BasicPage>
);

export default withAuthenticator(Get);
