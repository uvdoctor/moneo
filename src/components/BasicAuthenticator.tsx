import {
  AmplifyAuthContainer,
  AmplifyAuthenticator,
  AmplifyConfirmSignUp,
  AmplifySection,
} from "@aws-amplify/ui-react";
import { Auth, Hub } from "aws-amplify";
import React, { useContext, useEffect, useState } from "react";
import {
  AuthState,
  Translations,
  onAuthUIStateChange,
} from "@aws-amplify/ui-components";
import { Alert, Row, Skeleton } from "antd";
import Title from "antd/lib/typography/Title";
import { createUserinfo, doesEmailExist } from "./userinfoutils";
import { AppContext } from "./AppContext";
import { Button } from "antd";
import { RiskProfile, TaxLiability } from "../api/goals";
import StepOne from "./StepOne";
import StepTwo from "./StepTwo";
import EmailInput from "./form/EmailInput";
require("./BasicAuthenticator.less");

interface BasicAuthenticatorProps {
  children: React.ReactNode;
}

Auth.configure({ authenticationFlowType: "USER_PASSWORD_AUTH" });

export default function BasicAuthenticator({
  children,
}: BasicAuthenticatorProps) {
  const { validateCaptcha, appContextLoaded }: any = useContext(AppContext);
  const [passwordError, setPasswordError] = useState<any>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [disable, setDisable] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [notify, setNotify] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [authState, setAuthState] = useState<string>(AuthState.SignIn);
  const [riskProfile, setRiskProfile] = useState<RiskProfile>(RiskProfile.M);
  const [taxLiability, setTaxLiability] = useState<TaxLiability>(
    TaxLiability.M
  );
  const [uname, setUname] = useState<string>("");
  const [DOB, setDOB] = useState<string>(
    `${new Date().getFullYear() - 25}-06-01`
  );
  const [cognitoUser, setCognitoUser] = useState<any | null>(null);

  const generateFromEmail = (email: string) => {
    // Retrive name from email address
    const nameParts = email.replace(/@.+/, "");
    // Replace all special characters like "@ . _ ";
    let name = nameParts.replace(/[&/\\#,+()$~%._@'":*?<>{}]/g, "");
    if (name.length > 5) name = name.substring(0, 5);
    name = name + ("" + Math.random()).substring(2, 7);
    return name.toLocaleLowerCase();
  };

  const handleConfirmSignUp = async () => {
    const user = await Auth.signIn(uname, password);
    await createUserinfo({
      uname,
      email,
      notify,
      dob: DOB,
      tax: taxLiability,
      rp: riskProfile,
      dr: 0,
      tc: new Date().toISOString(),
    });
    Hub.dispatch("UI Auth", {
      event: "AuthStateChange",
      message: AuthState.SignedIn,
      data: user,
    });
  };

  const handleRegistrationSubmit = async () => {
    setLoading(true);
    validateCaptcha("registration").then(async (success: boolean) => {
      if (!success) return;
      const username = generateFromEmail(email);
      setUname(username);
      Auth.signUp({
        username: username,
        password: password,
        attributes: { email: email },
      })
        .then((response) => {
          setCognitoUser(response.user);
          Hub.dispatch("UI Auth", {
            event: "AuthStateChange",
            message: AuthState.ConfirmSignUp,
            data: {
              ...response.user,
              username: username,
              password: password,
              attributes: { email: email },
            },
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
    Hub.dispatch("UI Auth", {
      event: "AuthStateChange",
      message: AuthState.SignIn,
    });
  };

  const verifyEmail = async () => {
    setLoading(true);
    validateCaptcha("verify_email").then(async (success: boolean) => {
      if (!success) return;
      if (await doesEmailExist(email, "AWS_IAM")) {
        setShowPassword(true);
      } else {
        Hub.dispatch("UI Auth", {
          event: "AuthStateChange",
          message: AuthState.SignUp,
        });
        setShowPassword(true);
      }
      setLoading(false);
      setDisable(true);
    });
  };

  const forgotPassword = () => {
    Hub.dispatch("UI Auth", {
      event: "AuthStateChange",
      message: AuthState.ForgotPassword,
    });
  };

  const signIn = () => {
    setLoading(true);
    validateCaptcha("sign_in").then(async (success: boolean) => {
      if (!success) return;
      try {
        const user = await Auth.signIn(email, password);
        console.log(user);
      } catch (error: any) {
        setError(error.message);
        console.log(error);
      }
      setLoading(false);
    });
  };

  useEffect(() => {
    return onAuthUIStateChange((nextAuthState) => {
      if (nextAuthState === AuthState.SignIn) setShowPassword(false);
      setAuthState(nextAuthState);
    });
  }, []);

  useEffect(() => {
    if (authState === AuthState.SignIn) setShowPassword(false);
  }, [authState]);

  const CancelButton = () => {
    return showPassword || authState === AuthState.SignUp ? (
      <Button
        type="link"
        onClick={() => {
          showPassword ? setShowPassword(false) : setShowPassword(true);
          if (showPassword && authState === AuthState.SignUp) onCancel();
        }}
      >
        Cancel
      </Button>
    ) : (
      <></>
    );
  };

  return (
    <AmplifyAuthContainer>
      <AmplifyAuthenticator>
        {authState === AuthState.ConfirmSignUp && (
          <AmplifyConfirmSignUp
            slot="confirm-sign-up"
            user={cognitoUser}
            handleAuthStateChange={async () => await handleConfirmSignUp()}
            formFields={[
              {
                type: "code",
              },
            ]}
          />
        )}

        {authState === AuthState.SignIn && (
          <AmplifySection slot="sign-in">
            <Title level={5}>My Account</Title>
            <div className="steps-content">
              {!showPassword ? (
                <EmailInput
                  setEmail={setEmail}
                  label={Translations.EMAIL_LABEL}
                  setDisable={setDisable}
                />
              ) : (
                <>
                  <StepOne
                    setPassword={setPassword}
                    setPasswordError={setPasswordError}
                    setError={setError}
                  />
                  {error ? <Alert type="error" message={error} /> : null}
                </>
              )}
            </div>
            
            <div className="steps-action">
              <Row justify={showPassword ? "space-between" : "end"}>
                {showPassword && (
                  <Button type="link" onClick={forgotPassword}>
                    {Translations.FORGOT_PASSWORD_TEXT}
                  </Button>
                )}
                <CancelButton />
                <Button
                  type="primary"
                  disabled={showPassword ? passwordError : !email || disable}
                  onClick={showPassword ? signIn : verifyEmail}
                  loading={loading}
                >
                  {showPassword ? Translations.SIGN_IN_TEXT : "Next"}
                </Button>
              </Row>
            </div>
          </AmplifySection>
        )}

        {authState === AuthState.SignUp && (
          <AmplifySection slot="sign-up">
            <Title level={5}>{Translations.SIGN_UP_HEADER_TEXT}</Title>
            <div className="steps-content">
              {!showPassword ? (
                <StepTwo
                  setDOB={setDOB}
                  error={error}
                  setNotify={setNotify}
                  setDisable={setDisable}
                  riskProfile={riskProfile}
                  setRiskProfile={setRiskProfile}
                  taxLiability={taxLiability}
                  setTaxLiability={setTaxLiability}
                />
              ) : (
                <StepOne
                  setPassword={setPassword}
                  setPasswordError={setPasswordError}
                />
              )}
            </div>

            <div className="steps-action">
              <Row justify={"end"}>
                <CancelButton />
                <Button
                  type="primary"
                  disabled={showPassword ? passwordError : disable}
                  onClick={() =>
                    showPassword
                      ? setShowPassword(false)
                      : handleRegistrationSubmit()
                  }
                  loading={loading}
                >
                  {showPassword ? "Next" : "Done"}
                </Button>
              </Row>
            </div>
          </AmplifySection>
        )}
        {appContextLoaded ? children : <Skeleton active />}
      </AmplifyAuthenticator>
    </AmplifyAuthContainer>
  );
}
