import { AmplifyAuthenticator, AmplifySection } from '@aws-amplify/ui-react';
import { useForm } from 'antd/lib/form/Form';
import { Auth, Hub } from 'aws-amplify';
import React, { Fragment, useEffect, useState } from 'react';
import { AuthState, Translations } from '@aws-amplify/ui-components';
import { Alert, Button, Checkbox, Form, Input, Row } from 'antd';
import { ROUTES } from '../CONSTANTS';
import Title from 'antd/lib/typography/Title';
import { addEmailPostSignup, doesEmailExist } from './registrationutils';
import Nav from './Nav';
import { AppContextProvider } from './AppContext';

interface BasicAuthenticatorProps {
	children: React.ReactNode;
}

export default function BasicAuthenticator({ children }: BasicAuthenticatorProps) {
	const [
		disabledSubmit,
		setDisabledSubmit
	] = useState<boolean>(false);
	const [
		error,
		setError
	] = useState<string>('');
	const [
		user,
		setUser
	] = useState<any | null>(null);
	const [
		password,
		setPassword
	] = useState<string>('');
	const [
		email,
		setEmail
	] = useState<string>('');
	const [
		form
	] = useForm();

	const listener = async (capsule: any) => {
		let eventType: string = capsule.payload.event;
		let user = null;
		if (eventType === 'signIn') user = capsule.payload.data;
		else if (eventType === 'tokenRefresh' || eventType === 'configured')
			user = await Auth.currentAuthenticatedUser();
		setUser(user);
	};

	const handleLogout = async () => {
		try {
			await Auth.signOut();
			Hub.dispatch('auth', { event: 'signOut' });
		} catch (error) {
			console.log('error signing out: ', error);
		}
	};

	const generateFromEmail = (email: string) => {
		// Retrive name from email address
		const nameParts = email.replace(/@.+/, "");
		// Replace all special characters like "@ . _ ";
		let name = nameParts.replace(/[&/\\#,+()$~%._@'":*?<>{}]/g, "");
		if(name.length > 5) name = name.substring(0, 5);
		return name + ("" + Math.random()).substring(2, 6);
	  }

	useEffect(() => {
		Hub.listen('auth', listener);
		return () => Hub.remove('auth', listener);
	}, []);

	const handleRegistrationSubmit = async () => {
		const username = generateFromEmail(email);
		Auth.signUp({
			username: username,
			password: password,
			attributes: { email: email }
		})
			.then(async (response) => {
				Hub.dispatch('UI Auth', {
					event: 'AuthStateChange',
					message: AuthState.ConfirmSignUp,
					data: {
						...response.user,
						username: username,
						password: password,
						attributes: { email: email }
					}
				});
				await addEmailPostSignup(email, username);
				console.log('Auth.signIn success', response);
			})
			.catch((error) => {
				setError(error.message);
			});
	};

	const handleFormChange = () => {
		setDisabledSubmit(form.getFieldsError().some(({ errors }) => errors.length) || !form.isFieldsTouched(true));
	};

	return (
		<Fragment>
			{!user && <Nav hideMenu title="Almost there..." />}
			<AmplifyAuthenticator initialAuthState={AuthState.SignIn}>
				<AmplifySection slot="sign-up">
					<Title level={5}>{Translations.SIGN_UP_HEADER_TEXT}</Title>
					<p>&nbsp;</p>
					<Row>{error ? <Alert type="error" message={error} /> : null}</Row>
					<Form name="signup" form={form} onFieldsChange={handleFormChange} layout="vertical">
						<Form.Item
							name="email"
							label={Translations.EMAIL_LABEL}
							validateStatus={error ? 'error' : undefined}
							help={error ? error : null}
							validateFirst
							validateTrigger="onBlur"
							rules={[
								{
									pattern: /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
									message: 'This is not a valid email address'
								},
								({ getFieldValue }) => ({
									async validator() {
										if (!await doesEmailExist(getFieldValue('email'))) {
											return Promise.resolve();
										}
										return Promise.reject(
											new Error(
												'Please use another email address as this one is already used by another account.'
											)
										);
									}
								})
							]}
							hasFeedback>
							<Input onChange={(e) => setEmail(e.currentTarget.value)} />
						</Form.Item>
						<Form.Item
							name="password"
							label={Translations.PASSWORD_LABEL}
							rules={[
								{
									min: 8,
									max: 20,
									message: 'Password must be between 8-20 characters'
								},
								{
									pattern: new RegExp('(?=.*[a-z])'),
									message: 'At least one lowercase'
								},
								{
									pattern: new RegExp('(?=.*[A-Z])'),
									message: 'At least one uppercase'
								},
								{
									pattern: new RegExp('.*[0-9].*'),
									message: 'At least one digit'
								},
								{
									pattern: new RegExp('(?=.*[!@#$%^&*])'),
									message: 'At least one special character'
								}
							]}
							hasFeedback>
							<Input.Password allowClear onChange={(e) => setPassword(e.currentTarget.value)} />
						</Form.Item>
						<Form.Item
							name="terms"
							valuePropName="checked"
							rules={[
								{
									validator: (_, value) =>
										value
											? Promise.resolve()
											: Promise.reject(new Error('Please verify that you agree to the policies'))
								}
							]}>
							<Checkbox defaultChecked={true}>
								I accept the{' '}
								<a target="_blank" href={ROUTES.POLICYTC}>
									Terms & Conditions
								</a>
								,&nbsp;
								<a target="_blank" href={ROUTES.POLICYPRIVACY}>
									Privacy Policy
								</a>{' '}
								&nbsp;and&nbsp;
								<a target="_blank" href={ROUTES.POLICYSECURITY}>
									Security Policy
								</a>
							</Checkbox>
						</Form.Item>
						<Checkbox defaultChecked={true}>
							<strong>Get 20% off</strong>
							&nbsp; by signing up for emails and text
						</Checkbox>
						<p>&nbsp;</p>
						<Row justify="end">
							<Form.Item>
								<Button
									type="link"
									htmlType="button"
									onClick={() =>
										Hub.dispatch('UI Auth', {
											event: 'AuthStateChange',
											message: AuthState.SignIn
										})}>
									Cancel
								</Button>
								<Button
									type="primary"
									htmlType="submit"
									disabled={disabledSubmit}
									onClick={handleRegistrationSubmit}>
									Submit
								</Button>
							</Form.Item>
						</Row>
					</Form>
				</AmplifySection>
				{user ? (
					<AppContextProvider user={user} handleLogout={handleLogout}>
						{children}
					</AppContextProvider>
				) : null}
			</AmplifyAuthenticator>
		</Fragment>
	);
}
