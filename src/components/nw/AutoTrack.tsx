import React from 'react';
import { GoogleLogin } from 'react-google-login';

const clientId = '1017151147601-s7mh9osmkajm4dg2pevtu76ck62dt4up.apps.googleusercontent.com';

export default function AutoTrack() {
	const onSuccess = (res: any) => {
		console.log("Gmail login successful...", res);
	};

	const onFailure = (res: any) => {
		console.log("Gmail login failed...", res);
	};

	return (
		<GoogleLogin
			clientId={clientId}
			onSuccess={onSuccess}
			onFailure={onFailure}
			buttonText="Track Gmail"
			cookiePolicy="single_host_origin"
			isSignedIn
		/>
	);
}
