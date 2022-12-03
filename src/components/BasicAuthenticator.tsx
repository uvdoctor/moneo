import {
  Authenticator,
} from "@aws-amplify/ui-react";
import { Auth, Hub } from "aws-amplify";
import React, { useContext, useEffect, useState } from "react";
import { Alert, Row, Skeleton } from "antd";
import Title from "antd/lib/typography/Title";
import { createUserinfo, doesEmailExist } from "./userinfoutils";
import { AppContext } from "./AppContext";
import { Button } from "antd";
import { RiskProfile, TaxLiability } from "../api/goals";
import PasswordInput from "./form/PasswordInput";
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
  const [authState, setAuthState] = useState<string>("signin");
  const [riskProfile, setRiskProfile] = useState<RiskProfile>(RiskProfile.M);
  const [taxLiability, setTaxLiability] = useState<TaxLiability>(
    TaxLiability.M
  );
  const [uname, setUname] = useState<string>("");
  const [DOB, setDOB] = useState<string>(
    `${new Date().getFullYear() - 25}-06-01`
  );

  const generateFromEmail = (email: string) => {
    // Retrive name from email address
    const nameParts = email.replace(/@.+/, "");
    // Replace all special characters like "@ . _ ";
    let name = nameParts.replace(/[&/\\#,+()$~%._@'":*?<>{}]/g, "");
    if (name.length > 5) name = name.substring(0, 5);
    name = name + ("" + Math.random()).substring(2, 7);
    return name.toLocaleLowerCase();
  };

  const handleRegistrationSubmit = async () => {
    setLoading(true);
    const success = await validateCaptcha("registration");
    if (!success) return;
    const username = generateFromEmail(email);
    setUname(username);
    Auth.signUp({
      username: username,
      password: password,
      attributes: { email: email },
      autoSignIn: {
        enabled: true
      }
    })
      .then(async() => {
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
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        setError(error.message);
      });
  };

  const onCancel = () => {
    Hub.dispatch("UI Auth", {
      event: "AuthStateChange",
      message: "signin",
    });
  };

  const verifyEmail = async () => {
    setLoading(true);
    const success = await validateCaptcha("verify_email");
    if (!success) return;
    if (await doesEmailExist(email, "AWS_IAM")) {
      setShowPassword(true);
    } else {
      Hub.dispatch("UI Auth", {
        event: "AuthStateChange",
        message: "signup",
      });
      setShowPassword(true);
    }
    setLoading(false);
    setDisable(true);
  };

  const forgotPassword = () => {
    Hub.dispatch("UI Auth", {
      event: "AuthStateChange",
      message: "forgotpassword",
    });
  };

  const signIn = async () => {
    setLoading(true);
    const success = await validateCaptcha("sign_in");
    if (!success) return;
    try {
      const user = await Auth.signIn(email, password);
      console.log(user);
    } catch (error: any) {
      setError(error.message);
      console.log(error);
    }
    setLoading(false);
  };

  useEffect(() => {
  //   return onAuthUIStateChange((nextAuthState) => {
  //     if (nextAuthState === "signin") setShowPassword(false);
  //     setAuthState(nextAuthState);
  //   });
    Hub.listen('auth', (data) => setAuthState(data.payload.event));
  }, []);

  useEffect(() => {
    if (authState === "signin") setShowPassword(false);
  }, [authState]);

  const CancelButton = () => {
    return showPassword || authState === "signup" ? (
      <Button
        type="link"
        onClick={() => {
          showPassword ? setShowPassword(false) : setShowPassword(true);
          if (showPassword && authState === "signup") onCancel();
        }}
      >
        Cancel
      </Button>
    ) : (
      <></>
    );
  };

  return (
      <Authenticator>
        {authState === "signin" && (
          <div slot="sign-in">
            <Title level={5}>My Account</Title>
            <div className="steps-content">
              {!showPassword ? (
                <EmailInput
                  setEmail={setEmail}
                  label="Email Address *"
                  setDisable={setDisable}
                />
              ) : (
                <>
                  <PasswordInput
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
                    Forgot your password
                  </Button>
                )}
                <CancelButton />
                <Button
                  id="login"
                  type="primary"
                  disabled={showPassword ? passwordError : !email || disable}
                  onClick={async () => showPassword ? await signIn() : await verifyEmail()}
                  loading={loading}
                >
                  {showPassword ? "Sign in" : "Next"}
                </Button>
              </Row>
            </div>
          </div>
        )}

        {authState === "signup" && (
          <div slot="sign-up">
            <Title level={5}>Create a new account</Title>
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
                <PasswordInput
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
          </div>
        )}
        {appContextLoaded ? children : <Skeleton active />}
      </Authenticator>
  );
}
