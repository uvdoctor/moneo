import {
  AmplifyAuthenticator,
  AmplifyCheckbox,
  AmplifyAuthFields,
  AmplifyFormSection,
} from "@aws-amplify/ui-react";
import React from "react";
import { NWContextProvider } from "../components/nw/NWContext";
import Amplify from "aws-amplify";
import awsmobile from "../aws-exports";
import BasicPage from "../components/BasicPage";

Amplify.configure(awsmobile);

function Get(this: any) {
  // const [accept, setAccept] = useState<Boolean>(true);

  // const handleRegistrationSubmit = (e: any) => {
  //   console.log(e);

  //   e.preventDefault();
  //   const { username, password, email } = e.target;
  //   if (accept) {
  //     Auth.signUp({
  //       username: username.value,
  //       password: password.value,
  //       attributes: {
  //         email: email.value,
  //       },
  //     })
  //       .then((response) => {
  //         console.log("Auth.signIn success", response);
  //       })
  //       .catch((error) => {
  //         console.log(error.message);
  //       });
  //   } else alert("Please accept the terms and conditions.");
  // };

  return (
    <AmplifyAuthenticator>
      <AmplifyFormSection slot="sign-up">
        <div slot="amplify-form-section-header">
          <AmplifyAuthFields
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
        </div>
        <div slot="amplify-form-section-footer">
          <AmplifyCheckbox label="Terms and Conditions" checked={true} />
          <AmplifyCheckbox label="Offer Letters" checked={true} />
        </div>
      </AmplifyFormSection>
      <BasicPage title="Get Real-time Analysis">
        <NWContextProvider />
      </BasicPage>
    </AmplifyAuthenticator>
  );
}

export default Get;
