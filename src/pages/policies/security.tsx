import React from 'react';
import Policies from '../../components/policies/Policies';
import BasicPage from '../../components/BasicPage';

export default function PolicySecurity() {
	return (
		<BasicPage
      title="Security Policy"
      hideMenu
      noFooter
      menuTitle={"Policies"}
    >
        <Policies type='Security' />
		</BasicPage>
	);
}

