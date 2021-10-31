import { AmplifyAuthenticator, AmplifySection } from '@aws-amplify/ui-react';
import { useForm } from 'antd/lib/form/Form';
import { Auth, Hub } from 'aws-amplify';
import React, { useEffect, useState } from 'react';
import { AuthState, Translations } from '@aws-amplify/ui-components';
import { Alert, Button, Checkbox, Form, Input, Row } from 'antd';
import { ROUTES } from '../CONSTANTS';
import Title from 'antd/lib/typography/Title';
import { addEmailPostSignup, doesEmailExist } from './registrationutils';

interface BasicAuthenticatorProps {
	children: React.ReactNode;
}

export default function BasicAuthenticator(props: BasicAuthenticatorProps) {
	const [ disabledSubmit, setDisabledSubmit ] = useState<boolean>(false);
	const [ error, setError ] = useState<string>('');
	const [ user, setUser ] = useState<any | null>(null);
	const [ username, setUsername ] = useState<string>('');
	const [ password, setPassword ] = useState<string>('');
	const [ email, setEmail ] = useState<string>('');
	const [ form ] = useForm();

	const handleRegistrationSubmit = async() => {
    const uniqueEmail = await doesEmailExist(email)
    uniqueEmail ? setError(uniqueEmail) : setError(''); 
		if(uniqueEmail)return; 
		Auth.signUp({
			username: username,
			password: password,
			attributes: { email: email }
		})
			.then(async(response) => {
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
        await addEmailPostSignup(email)
				console.log('Auth.signIn success', response);
			})
			.catch((error) => {
				setError(error.message);
			});
	};

	const handleFormChange = () => {
		setDisabledSubmit(form.getFieldsError().some(({ errors }) => errors.length) || !form.isFieldsTouched(true));
	};

	const initialize = async () => setUser(await Auth.currentAuthenticatedUser());

	useEffect(() => {
		initialize();
	}, []);

	return (
		<AmplifyAuthenticator initialAuthState={AuthState.SignIn}>
			<AmplifySection slot="sign-up">
				<Title level={5}>{Translations.SIGN_UP_HEADER_TEXT}</Title>
				<p>&nbsp;</p>
				<Row>{error ? <Alert type="error" message={error} /> : null}</Row>
				<Form name="signup" layout="vertical" size="large" form={form} onFieldsChange={handleFormChange}>
					<Form.Item
						name="email"
						label={Translations.EMAIL_LABEL}
            validateStatus={error ? 'error' : undefined}
						help={error ? error : null}
						rules={[
							{
								pattern: /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
								message: 'Enter a valid email address'
							}
						]}
						hasFeedback
					>
						<Input onChange={(e) => setEmail(e.currentTarget.value)} />
					</Form.Item>
					<Form.Item
						name="password"
						label={Translations.PASSWORD_LABEL}
						rules={[
							{
								min: 8,
								max: 20,
								message: 'Password must be between 8-20 length'
							},
							{
								pattern: new RegExp('(?=.*[a-z])'),
								message: 'Atleast one lowercase'
							},
							{
								pattern: new RegExp('(?=.*[A-Z])'),
								message: 'Atleast one uppercase'
							},
							{
								pattern: new RegExp('.*[0-9].*'),
								message: 'Atleast one digit'
							},
							{
								pattern: new RegExp('(?=.*[!@#$%^&*])'),
								message: 'Atleast one special characters'
							}
						]}
						hasFeedback
					>
						<Input.Password allowClear onChange={(e) => setPassword(e.currentTarget.value)} />
					</Form.Item>
					<Form.Item
						name="username"
						label={Translations.USERNAME_LABEL}
						validateStatus={error ? 'error' : undefined}
						help={error ? error : null}
					>
						<Input onChange={(e) => setUsername(e.currentTarget.value)} />
					</Form.Item>
					<Form.Item
						name="terms"
						valuePropName="checked"
						rules={[
							{
								validator: (_, value) =>
									value
										? Promise.resolve()
										: Promise.reject(new Error('Please accept the terms and conditions'))
							}
						]}
					>
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
					<Checkbox defaultChecked={true}>Subscribe to Offer and NewsLetters</Checkbox>
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
									})}
							>
								Cancel
							</Button>
							<Button
								type="primary"
								htmlType="submit"
								disabled={disabledSubmit}
								onClick={handleRegistrationSubmit}
							>
								Submit
							</Button>
						</Form.Item>
					</Row>
				</Form>
			</AmplifySection>
			{user ? props.children : null}
		</AmplifyAuthenticator>
	);
}
