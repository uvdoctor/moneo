import {
	AmplifyAuthContainer,
	AmplifyAuthenticator,
	AmplifyConfirmSignUp,
	AmplifySection
} from '@aws-amplify/ui-react';
import { useForm } from 'antd/lib/form/Form';
import { Auth, Hub } from 'aws-amplify';
import React, { Fragment, useContext, useEffect, useState } from 'react';
import { AuthState, Translations, onAuthUIStateChange } from '@aws-amplify/ui-components';
import { Alert, Checkbox, Col, Row } from 'antd';
import { ROUTES } from '../CONSTANTS';
import Title from 'antd/lib/typography/Title';
import { createUserinfo, doesEmailExist } from './userinfoutils';
import Nav from './Nav';
import { AppContext } from './AppContext';
import { Form, Input, Button } from 'antd';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import SelectInput from './form/selectinput';
import { getRiskProfileOptions, getTaxLiabilityOptions } from './utils';
import { RiskProfile, TaxLiability } from '../api/goals';

interface BasicAuthenticatorProps {
	children: React.ReactNode;
}

Auth.configure({ authenticationFlowType: 'USER_PASSWORD_AUTH' });

export default function BasicAuthenticator({ children }: BasicAuthenticatorProps) {
	const { user }: any = useContext(AppContext);
	const { executeRecaptcha }: any = useGoogleReCaptcha();
	const [ disabledSubmit, setDisabledSubmit ] = useState<boolean>(false);
	const [ error, setError ] = useState<string>('');
	const [ emailError, setEmailError ] = useState<any>('');
	const [ password, setPassword ] = useState<string>('');
	const [ email, setEmail ] = useState<string>('');
	const [ notify, setNotify ] = useState<boolean>(true);
	const [ disabledNext, setDisabledNext ] = useState<boolean>(true);
  const [ step, setStep ] = useState<number>(1);
	const [ loading, setLoading ] = useState<boolean>(false);
	const [ authState, setAuthState ] = useState<string>('signin');
	const [ riskProfile, setRiskProfile ] = useState<RiskProfile>(RiskProfile.VC);
  const [ taxLiability, setTaxLiability ] = useState<TaxLiability>(TaxLiability.M);
	const [ uname, setUname ] = useState<string>('');
	const [ form ] = useForm();

	const validateCaptcha = async (action: string) => {
		const token = await executeRecaptcha(action);
		let result = await fetch('/api/verifycaptcha', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json;charset=utf-8'
			},
			body: JSON.stringify({
				token: token
			})
		})
			.then((captchRes: any) => captchRes.json())
			.then((data: any) => data.success)
			.catch((e: any) => {
				console.log('error while validating captcha ', e);
				return false;
			});
		return result;
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
		return onAuthUIStateChange((nextAuthState, authData) => {
			console.log('Next auth state: ', nextAuthState, authData);
			setAuthState(nextAuthState);
		});
	}, []);

	const verifyEmail = () => {
		validateCaptcha('NextButton_change').then(async (success: boolean) => {
			if (!success) return;
			setLoading(true);
			setEmailError('');
			let exists = await doesEmailExist(email, 'AWS_IAM');
			if (!exists) {
				setStep(step + 1);
			} else {
				setEmailError('Please use another email address as this one is already used by another account.');
			}
			setLoading(false);
		});
	};

	const handleConfirmSignUp = async () => {
		await Auth.signIn(uname, password).then((user) => {
			Hub.dispatch('UI Auth', {
				event: 'AuthStateChange',
				message: AuthState.SignedIn,
				data: user
			});
		});
		await createUserinfo(uname, email, notify, riskProfile, 0, new Date().toISOString(), taxLiability);
	};

	const handleRegistrationSubmit = async () => {
		validateCaptcha('OnSubmit_change').then(async (success: boolean) => {
			if (!success) return;
			setLoading(true);
			const username = generateFromEmail(email);
			setUname(username);
			Auth.signUp({
				username: username,
				password: password,
				attributes: { email: email }
			})
				.then((response) => {
					setLoading(false);
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
				})
				.catch((error) => {
					setLoading(false);
					setError(error.message);
				});
		});
	};

	const handleFormChange = () => {
		const fieldErr = (name: string) => form.getFieldError(name).length > 0;
		const fieldTouch = (name: string) => !form.isFieldTouched(name);
		setDisabledSubmit(fieldErr('password') || fieldErr('terms') || fieldTouch('password') || fieldTouch('terms'));
		setDisabledNext(fieldErr('email') || fieldTouch('email') || form.getFieldValue('email').length === 0);
	};

	const onCancel = () => {
		Hub.dispatch('UI Auth', { event: 'AuthStateChange', message: AuthState.SignIn });
	};

	return (
		<Fragment>
			{!user && <Nav hideMenu title="Almost there..." />}
      <AmplifyAuthContainer>
      <AmplifyAuthenticator>
      { authState === AuthState.ConfirmSignUp && (
       <AmplifyConfirmSignUp slot='confirm-sign-up'
       handleAuthStateChange={handleConfirmSignUp}
       formFields={[
        {
          type: "username",
          hint: `Your username:- ${uname}`
        },
        {
          type: "code"
        }
       ]}/> 
      )}
      {authState !== 'signin' && 
        <AmplifySection slot="sign-up">
          <Title level={5}>{Translations.SIGN_UP_HEADER_TEXT}</Title>
            <Form
              name="signup"
              form={form}
              onFieldsChange={handleFormChange}
              layout="vertical"
            >
              {step === 1 && (
                <>
                  <h4>Step 1/3</h4>
                  <p>&nbsp;</p>
                  <Form.Item
                    name="email"
                    label={Translations.EMAIL_LABEL}
                    validateStatus={emailError ? "error" : undefined}
                    help={emailError ? emailError : null}
                    rules={[
                      {
                        pattern:
                          /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                        message: "This is not a valid email address",
                      },
                    ]}
                    hasFeedback
                  >
                    <Input onChange={(e) => setEmail(e.currentTarget.value)} />
                  </Form.Item>{" "}
                  <Row justify="end">
                    <Button type="link" htmlType="button" onClick={onCancel}>
                      Cancel
                    </Button>
                    <Button
                      type="primary"
                      onClick={verifyEmail}
                      disabled={disabledNext}
                      loading={loading}
                    >
                      Next
                    </Button>
                  </Row>
                </>
              )}
              {step === 2 && ( 
                <><h4>Step 2/3</h4>
                <p>&nbsp;</p>
                <Row align="middle">
                  <Col>
                  <SelectInput
                    info="How much Risk are You willing to take in order to achieve higher Investment Return?"
                    pre="Can Tolerate"
                    unit="Loss"
                    value={riskProfile}
                    changeHandler={setRiskProfile}
                    options={getRiskProfileOptions()}
                  />
                  </Col>
                </Row>
                <Row align="middle">
                  <Col>
                  <SelectInput
                    info="How much do you earn in a year?"
                    pre="Yearly Income"
                    value={taxLiability}
                    changeHandler={setTaxLiability}
                    options={getTaxLiabilityOptions()}
                  />
                  </Col>
                </Row>
                <p>&nbsp;</p>
                <Row justify="end">
                  <Button type="link" htmlType="button" onClick={()=> setStep(1)}>
                    Back
                  </Button>
                  <Button
                    type="primary"
                    onClick={()=> setStep(2)}
                    loading={loading}
                  >
                    Next
                  </Button>
                </Row>
                </>
              )}
              {step === 3 && (
                <>
                  <h4>Step 3/3</h4>
                  <p>&nbsp;</p>
                  <Row>
                    {error ? <Alert type="error" message={error} /> : null}
                  </Row>
                  <Form.Item
                    name="password"
                    label={Translations.PASSWORD_LABEL}
                    rules={[
                      {
                        min: 8,
                        max: 20,
                        message: "Password must be between 8-20 characters",
                      },
                      {
                        pattern: new RegExp("(?=.*[a-z])"),
                        message: "At least one lowercase",
                      },
                      {
                        pattern: new RegExp("(?=.*[A-Z])"),
                        message: "At least one uppercase",
                      },
                      {
                        pattern: new RegExp(".*[0-9].*"),
                        message: "At least one digit",
                      },
                      {
                        pattern: new RegExp("(?=.*[!@#$%^&*])"),
                        message: "At least one special character",
                      },
                    ]}
                    hasFeedback
                  >
                    <Input.Password
                      allowClear
                      onChange={(e) => setPassword(e.currentTarget.value)}
                    />
                  </Form.Item>
                  <Form.Item
                    name="terms"
                    valuePropName="checked"
                    rules={[
                      {
                        validator: (_, value) =>
                          value
                            ? Promise.resolve()
                            : Promise.reject(
                                new Error(
                                  "Please verify that you agree to the policies"
                                )
                              ),
                      },
                    ]}
                  >
                    <Checkbox defaultChecked={true}>
                      I accept the{" "}
                      <a
                        target="_blank"
                        href={ROUTES.TC}
                        rel="noreferrer"
                      >
                        Terms & Conditions
                      </a>
                      ,&nbsp;
                      <a
                        target="_blank"
                        href={ROUTES.PRIVACY}
                        rel="noreferrer"
                      >
                        Privacy Policy
                      </a>{" "}
                      &nbsp;and&nbsp;
                      <a
                        target="_blank"
                        href={ROUTES.SECURITY}
                        rel="noreferrer"
                      >
                        Security Policy
                      </a>
                    </Checkbox>
                  </Form.Item>
                  <Checkbox
                    defaultChecked={true}
                    onChange={(e) =>
                      e.target.checked ? setNotify(true) : setNotify(false)
                    }
                  >
                    <strong>Get 20% off</strong>&nbsp; by signing up for emails
                    and text
                  </Checkbox>
                  <p>&nbsp;</p>
                  <Row justify="end">
                    <Form.Item>
                      <Button type="link" htmlType="button" onClick={onCancel}>
                        Cancel
                      </Button>
                      <Button type="link" onClick={()=> setStep(2)}>
                        Back
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
                  </Row>
                </>
              )}
            </Form>
        </AmplifySection>}
      {children}
      </AmplifyAuthenticator>
			</AmplifyAuthContainer>
		</Fragment>
	);
}
