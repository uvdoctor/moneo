import React from 'react';
import Amplify from 'aws-amplify';
import awsmobile from '../../aws-exports';
import Policies from '../../components/policies/Policies';
import BasicPage from '../../components/BasicPage';

Amplify.configure(awsmobile);

export default function POLICYSECURITY() {
	return (
		<BasicPage
      title="Security Policy"
      hideMenu
      noFooter
      hidMenuTitle={"Policies"}
    >
        <Policies stringParams={'security'} />
		</BasicPage>
	);
}

