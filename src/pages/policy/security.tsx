import React from 'react';
import Amplify from 'aws-amplify';
import awsmobile from '../../aws-exports';
import PrivacyPolicy from '../../components/privacy/PrivacyPolicy';
import BasicPage from '../../components/BasicPage';

Amplify.configure(awsmobile);

export default function POLICYSECURITY() {
	return (
		<BasicPage
      title="Privacy Policy"
      hideMenu
      noFooter
      hidMenuTitle={"Policies"}
    >
        <PrivacyPolicy stringParams={'security'} />
		</BasicPage>
	);
}

