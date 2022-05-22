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
import { Row, Skeleton } from "antd";
import Title from "antd/lib/typography/Title";
import { createUserinfo, doesEmailExist } from "./userinfoutils";
import { AppContext } from "./AppContext";
import { Button } from "antd";
import { RiskProfile, TaxLiability } from "../api/goals";
import StepOne from "./StepOne";
import StepTwo from "./StepTwo";
require("./BasicAuthenticator.less");

interface BasicAuthenticatorProps {
  children: React.ReactNode;
}

Auth.configure({ authenticationFlowType: "USER_PASSWORD_AUTH" });

export default function BasicAuthenticator({
  children,
}: BasicAuthenticatorProps) {
  const { validateCaptcha, appContextLoaded }: any = useContext(AppContext);
  const [emailError, setEmailError] = useState<any>("");
  const [passwordError, setPasswordError] = useState<any>("");
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
    setEmailError("");
    if (await doesEmailExist(email, "AWS_IAM")) {
      setEmailError(
        "Please use another email address as this one is already used by another account."
      );
    } else {
      Hub.dispatch("UI Auth", {
        event: "AuthStateChange",
        message: AuthState.SignUp,
      });
    }
    setDisable(true);
  };

  const forgotPassword = () => {
    Hub.dispatch("UI Auth", {
      event: "AuthStateChange",
      message: AuthState.ForgotPassword,
    });
  };

  const signIn = () => {
    setLoading(true);
    validateCaptcha("registration_step").then(async (success: boolean) => {
      if (!success) return;
      try {
        const user = await Auth.signIn(email, password);
        console.log(user);
      } catch {
        const isValidEmail =
          /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
            email
          );
        const isValidPassword =
          /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/.test(
            password
          );

        if (!isValidEmail || !isValidPassword) {
          if (!isValidEmail) setEmailError("This is not a valid email address");
          if (!isValidPassword)
            setPasswordError(
              "Passwords must have at least 8 characters and contain at least two of the following: uppercase, letters, lowercase letters, numbers, and symbols"
            );
          setError("jdjfsdjfidkf o s ");
          setLoading(false);
          setDisable(true);
          return;
        }
        await verifyEmail();
      }
      setLoading(false);
      setDisable(true);
    });
  };

  useEffect(() => {
    return onAuthUIStateChange((nextAuthState) => {
      setAuthState(nextAuthState);
    });
  }, []);

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
            <Title level={5}>{Translations.SIGN_IN_HEADER_TEXT}</Title>
            <div className="steps-content">
              <StepOne
                setPasswordError={setPasswordError}
                setEmailError={setEmailError}
                passwordError={passwordError}
                setEmail={setEmail}
                setPassword={setPassword}
                emailError={emailError}
                setDisable={setDisable}
              />
            </div>
            <div className="steps-action">
              <Row justify="space-between">
                <Button type="link" onClick={forgotPassword}>
                  {Translations.FORGOT_PASSWORD_TEXT}
                </Button>
                <Button
                  type="primary"
                  disabled={disable}
                  onClick={signIn}
                  loading={loading}>
                  {Translations.SIGN_IN_TEXT}
                </Button>
              </Row>
            </div>
          </AmplifySection>
        )}
        {authState === AuthState.SignUp && (
          <AmplifySection slot="sign-up">
            <Title level={5}>{Translations.SIGN_UP_HEADER_TEXT}</Title>
            <div className="steps-content">
              {
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
              }
            </div>
            <div className="steps-action">
              <Row justify="end">
                <Button type="link" onClick={onCancel}>
                  Back
                </Button>
                <Button
                  type="primary"
                  disabled={disable}
                  onClick={handleRegistrationSubmit}>
                  Done
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
