import { AmplifyAuthenticator, AmplifySignUp, withAuthenticator } from "@aws-amplify/ui-react";
import React from "react";
import { NWContextProvider } from "../components/nw/NWContext";
import Amplify from "aws-amplify";
import awsmobile from "../aws-exports";
import BasicPage from "../components/BasicPage";

Amplify.configure(awsmobile);

function Get() {
  return (
    <AmplifyAuthenticator>
      <AmplifySignUp
        slot="sign-up"
        formFields={[
          {
            type: "username",
            label: "Username",
            placeholder: "Enter",
            inputProps: { required: true, autocomplete: "username" },
            hint: "Your username is permanent and cannot be changed later",
          },
          {
            type: "email",
            label: "Email",
            placeholder: "abc@xyz.com",
            inputProps: { required: true, autocomplete: "email" },
            hint: "Enter a valid email address",
          },
          {
            type: "password",
            label: "Password",
            placeholder: "Enter",
            inputProps: { required: true, autocomplete: "password" },
            hint: "At least 8 characters. Must contain a number, lower and uppercase and a symbol.",
          },
        ]}
      />
      <BasicPage title="Get Real-time Analysis">
        <NWContextProvider />
      </BasicPage>
    </AmplifyAuthenticator>
  );
}

export default withAuthenticator(Get);
