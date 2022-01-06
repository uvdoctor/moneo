import {
	AmplifyAuthContainer,
	AmplifyAuthenticator,
	AmplifyConfirmSignUp,
	AmplifySection
} from '@aws-amplify/ui-react';
import { Auth, Hub } from 'aws-amplify';
import React, { Fragment, useContext, useEffect, useReducer, useState } from 'react';
import { AuthState, Translations, onAuthUIStateChange } from '@aws-amplify/ui-components';
import { Row, Steps } from 'antd';
import Title from 'antd/lib/typography/Title';
import { createUserinfo, doesEmailExist } from './userinfoutils';
import Nav from './Nav';
import { AppContext } from './AppContext';
import { Button } from 'antd';
import { RiskProfile, TaxLiability } from '../api/goals';
import StepOne from './StepOne';
import StepTwo from './StepTwo';
import StepThree from './StepThree';
require('./BasicAuthenticator.less');

interface BasicAuthenticatorProps {
	children: React.ReactNode;
}

Auth.configure({ authenticationFlowType: 'USER_PASSWORD_AUTH' });

const stepReducer = (state: any, { type }: { type: string }) => {
	switch (type) {
		case 'increment':
			return { step: state.step + 1 };
		case 'decrement':
			return { step: state.step - 1 };
		default:
			return { step: 0 };
	}
};

export default function BasicAuthenticator({ children }: BasicAuthenticatorProps) {
	const { user, validateCaptcha }: any = useContext(AppContext);
	const [ emailError, setEmailError ] = useState<any>('');
	const [ disable, setDisable ] = useState<boolean>(true);
	const [ error, setError ] = useState<string>('');
	const [ password, setPassword ] = useState<string>('');
	const [ email, setEmail ] = useState<string>('');
	const [ notify, setNotify ] = useState<boolean>(true);
	const [ loading, setLoading ] = useState<boolean>(false);
	const [ authState, setAuthState ] = useState<string>(AuthState.SignIn);
	const [ riskProfile, setRiskProfile ] = useState<RiskProfile>(RiskProfile.VC);
	const [ taxLiability, setTaxLiability ] = useState<TaxLiability>(TaxLiability.M);
	const [ uname, setUname ] = useState<string>('');
	const [ state, dispatch ] = useReducer(stepReducer, { step: 0 });
	const [ cognitoUser, setCognitoUser ] = useState<any>();
	const [ DOB, setDOB ] = useState<string>('');
	const [ lifeExpectancy, setLifeExpectancy ] = useState<number>(70);
	const { Step } = Steps;

	const steps = [
		{
			title: 'Step 1',
			content: (
				<StepOne
					setEmail={setEmail}
					setPassword={setPassword}
					emailError={emailError}
					setDisable={setDisable}
				/>
			)
		},
		{
			title: 'Step 2',
			content: (
				<StepTwo
					setDOB={setDOB}
					lifeExpectancy={lifeExpectancy}
					setLifeExpectancy={setLifeExpectancy}
				/>
			)
		},
		{
			title: 'Step 3',
			content: (
				<StepThree
					error={error}
					setNotify={setNotify}
					setDisable={setDisable}
					riskProfile={riskProfile}
					setRiskProfile={setRiskProfile}
					taxLiability={taxLiability}
					setTaxLiability={setTaxLiability}
				/>
			)
		}
	];

	const next = () => dispatch({ type: 'increment' });

	const prev = () => dispatch({ type: 'decrement' });

	const generateFromEmail = (email: string) => {
		// Retrive name from email address
		const nameParts = email.replace(/@.+/, '');
		// Replace all special characters like "@ . _ ";
		let name = nameParts.replace(/[&/\\#,+()$~%._@'":*?<>{}]/g, '');
		if (name.length > 5) name = name.substring(0, 5);
		return name + ('' + Math.random()).substring(2, 7);
	};

	const handleConfirmSignUp = async () => {
		await Auth.signIn(uname, password).then((user) => {
			Hub.dispatch('UI Auth', {
				event: 'AuthStateChange',
				message: AuthState.SignedIn,
				data: user
			});
		});
		await createUserinfo({
			uname,
			email,
			notify,
			tax: taxLiability,
			rp: riskProfile,
			dr: 0,
			tc: new Date().toISOString(),
			le: lifeExpectancy
		});
	};

	const handleRegistrationSubmit = async () => {
		setLoading(true);
		validateCaptcha('OnSubmit_change').then(async (success: boolean) => {
			if (!success) return;
			const username = generateFromEmail(email);
			setUname(username);
			Auth.signUp({
				username: username,
				password: password,
				attributes: { email: email, birthdate: DOB }
			})
				.then((response) => {
					setCognitoUser(response.user);
					Hub.dispatch('UI Auth', {
						event: 'AuthStateChange',
						message: AuthState.ConfirmSignUp,
						data: {
							...response.user,
							username: username,
							password: password,
							attributes: { email: email, birthdate: DOB }
						}
					});
					setLoading(false);
				})
				.catch((error) => {
					setLoading(false);
					setError(error.message);
				});
		});
	};

	const onCancel = () => {
		Hub.dispatch('UI Auth', { event: 'AuthStateChange', message: AuthState.SignIn });
	};

	const verifyEmail = () => {
		setLoading(true);
		validateCaptcha('NextButton_change').then(async (success: boolean) => {
			if (!success) return;
			setEmailError('');
			if (await doesEmailExist(email, 'AWS_IAM')) {
				setEmailError('Please use another email address as this one is already used by another account.');
			} else {
				next();
			}
			setLoading(false);
			setDisable(true);
		});
	};

	useEffect(() => {
		return onAuthUIStateChange((nextAuthState, authData) => {
			console.log('Next auth state: ', nextAuthState, authData);
			setAuthState(nextAuthState);
		});
	}, []);

	return (
		<Fragment>
			{!user && <Nav hideMenu title="Almost there..." />}
			<AmplifyAuthContainer>
				<AmplifyAuthenticator>
					{authState === AuthState.ConfirmSignUp && (
						<AmplifyConfirmSignUp
							slot="confirm-sign-up"
							user={cognitoUser}
							handleAuthStateChange={handleConfirmSignUp}
							formFields={[
								{
									type: 'code'
								}
							]}
						/>
					)}
					{authState !== AuthState.SignIn && (
						<AmplifySection slot="sign-up">
							<Title level={5}>{Translations.SIGN_UP_HEADER_TEXT}</Title>
							<Steps current={state.step} size="small">
								{steps.map((item) => <Step key={item.title} title={item.title} />)}
							</Steps>
							<div className="steps-content">{steps[state.step].content}</div>
							<div className="steps-action">
								<Row justify="end">
									{state.step === 0 && (
										<Button type="link" htmlType="button" onClick={onCancel}>
											Cancel
										</Button>
									)}
									{state.step > 0 && (
										<Button type="link" onClick={() => prev()}>
											Back
										</Button>
									)}
									{state.step < 2 && (
										<Button
											type="primary"
											disabled={state.step === 0 && disable}
											onClick={state.step === 0 ? verifyEmail : next}
											loading={loading}
										>
											Next
										</Button>
									)}
									{state.step === 2 && (
										<Button type="primary" disabled={disable} onClick={handleRegistrationSubmit}>
											Done
										</Button>
									)}
								</Row>
							</div>
						</AmplifySection>
					)}
					{children}
				</AmplifyAuthenticator>
			</AmplifyAuthContainer>
		</Fragment>
	);
}
