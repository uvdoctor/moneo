import React from 'react';
import Amplify from 'aws-amplify';
import awsmobile from '../../aws-exports';
import Policies from '../../components/policies/Policies';
import BasicPage from '../../components/BasicPage';

Amplify.configure(awsmobile);

export default function PolicySecurity() {
	return (
		<BasicPage
      title="Security Policy"
      hideMenu
      noFooter
      menuTitle={"Policies"}
    >
        <Policies type='security' />
		</BasicPage>
	);
}

