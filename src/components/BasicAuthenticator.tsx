import { AmplifyAuthenticator, AmplifySection } from '@aws-amplify/ui-react';
import { useForm } from 'antd/lib/form/Form';
import { Auth, Hub } from 'aws-amplify';
import React, { Fragment, useEffect, useState } from 'react';
import { AuthState, Translations, onAuthUIStateChange } from '@aws-amplify/ui-components';
import { Alert, Checkbox, Row } from 'antd';
import { ROUTES } from '../CONSTANTS';
import Title from 'antd/lib/typography/Title';
import { doesEmailExist } from './registrationutils';
import Nav from './Nav';
import { AppContextProvider } from './AppContext';
import { Form, Input, Button } from 'antd';
import router from 'next/router';
interface BasicAuthenticatorProps {
	children: React.ReactNode;
}

export default function BasicAuthenticator({ children }: BasicAuthenticatorProps) {
	const [ disabledSubmit, setDisabledSubmit ] = useState<boolean>(false);
	const [ error, setError ] = useState<string>('');
	const [ emailError, setEmailError ] = useState<any>('');
	const [ user, setUser ] = useState<any | null>(null);
	const [ password, setPassword ] = useState<string>('');
	const [ email, setEmail ] = useState<string>('');
	const [ notify, setNotify ] = useState<boolean>(true); 
	const [ disabledNext, setDisabledNext] = useState<boolean>(true);
	const [ back, setBack ] = useState<boolean>(true);
	const [ next, setNext ] = useState<boolean>(false);
	const [ loading, setLoading ] = useState<boolean>(false);
	const [ authState, setAuthState] = useState<string>('');
	const [ form ] = useForm();

	const initUser = async () => setUser(await Auth.currentAuthenticatedUser());

	const handleLogout = async () => {
		try {
			await Auth.signOut();
			Hub.dispatch('auth', { event: 'signOut' });
		} catch (error) {
			console.log('error signing out: ', error);
		} finally {
			router.reload();
		}
	};

	const generateFromEmail = (email: string) => {
		// Retrive name from email address
		const nameParts = email.replace(/@.+/, '');
		// Replace all special characters like "@ . _ ";
		let name = nameParts.replace(/[&/\\#,+()$~%._@'":*?<>{}]/g, '');
		if (name.length > 5) name = name.substring(0, 5);
		return name + ('' + Math.random()).substring(2, 7);
	};

	useEffect(() => {
		Hub.listen('auth', initUser);
		initUser();
		return () => Hub.remove('auth', initUser);
	}, []);

	const verifyEmail = async() => {
		setLoading(true);
		setEmailError('');
		let exists = await doesEmailExist(email, 'AWS_IAM');
		if (!exists) {
			setBack(false)
			setNext(true);
		}
		else{
			setNext(false);
			setEmailError('Please use another email address as this one is already used by another account.')
		}
		setLoading(false);
	}

	const onBackClick = () => {
		setLoading(false);
		setNext(false); 
		setBack(true)
	} 

	const handleRegistrationSubmit = async () => {
		setLoading(true);
		const username = generateFromEmail(email);
		Auth.signUp({
			username: username,
			password: password,
			attributes: {
				email: email,
				'custom:tc': new Date().toISOString(),
				'custom:notify': notify ? new Date().toISOString() : 'N'
			}
		})
			.then(async (response) => {
				setLoading(false);
				Hub.dispatch('UI Auth', {
					event: 'AuthStateChange',
					message: AuthState.ConfirmSignUp,
					data: {
						...response.user,
						username: username,
						password: password,
						attributes: {
							email: email,
							'custom:tc': new Date().toISOString(),
							'custom:notify': notify ? new Date().toISOString() : 'N'
						}
					}
				});
			})
			.catch((error) => {
				setLoading(false);
				setError(error.message);
			});
	};

	const handleFormChange = () => {
		const fieldErr = (name: string) => form.getFieldError(name).length > 0;
		const fieldTouch = (name: string) => !form.isFieldTouched(name);
		setDisabledSubmit(fieldErr('password') || fieldErr('terms') || fieldTouch('password') || fieldTouch('terms'));
		setDisabledNext(fieldErr('email') || fieldTouch('email') || form.getFieldValue('email').length===0);
	};

	useEffect(() => {
		return onAuthUIStateChange((nextAuthState) => {
		  setAuthState(nextAuthState);
		});
	  }, []);
	  
	return (
		<Fragment>
			{!user && <Nav hideMenu title="Almost there..." />}
			<AmplifyAuthenticator>
				{authState === AuthState.SignUp &&
				<AmplifySection slot="sign-up">
					<Title level={5}>{Translations.SIGN_UP_HEADER_TEXT}</Title>
					<Form name="signup" form={form} onFieldsChange={handleFormChange} layout="vertical">
					{ back && <>
					<h4>Step 1/2</h4>
					<p>&nbsp;</p>
					<Form.Item
						name="email"
						label={Translations.EMAIL_LABEL}
						validateStatus={emailError ? 'error' : undefined}
						help={emailError ? emailError : null}
						rules={[
							{
								pattern: /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
								message: 'This is not a valid email address'
							},
						]}
						hasFeedback
					>
						<Input onChange={(e) => setEmail(e.currentTarget.value)} />
					</Form.Item> </>}

					{ next && <>
					<h4>Step 2/2</h4>
					<p>&nbsp;</p>
					<Row>{error ? <Alert type="error" message={error} /> : null}</Row>
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
						hasFeedback
					>
						<Input.Password allowClear onChange={(e) => setPassword(e.currentTarget.value)} />
					</Form.Item>
					<Form.Item
						name="terms"
						valuePropName="checked"
						rules={[
							{
								validator: (_, value) => value
									? Promise.resolve()
									: Promise.reject(new Error('Please verify that you agree to the policies'))
							},
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
					<Checkbox
						defaultChecked={true}
						onChange={(e) => (e.target.checked ? setNotify(true) : setNotify(false))}
						>
						<strong>Get 20% off</strong>&nbsp; by signing up for emails and text
					</Checkbox><p>&nbsp;</p><Row justify="end">
					<Form.Item>
						<Button
							type="link"
							htmlType="button"
							onClick={() => Hub.dispatch('UI Auth', {
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
							loading={loading}
						>
							Submit
						</Button>
					</Form.Item>
				</Row></>
					}

            	{back ? <Button type="primary" onClick={verifyEmail} disabled={disabledNext} loading={loading}>Next</Button>
              	    : <Button type="link" onClick={onBackClick} >Back</Button>
				}
				</Form>
			</AmplifySection>}
			{user ? (
				<AppContextProvider user={user} handleLogout={handleLogout}>
					{children}
				</AppContextProvider>
				) : null}
			</AmplifyAuthenticator>
		</Fragment>
	);
}
