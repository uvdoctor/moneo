import "@aws-amplify/ui/dist/style.css";
import { AppProps } from "next/app";
import "../styles/index.less";
import * as gtag from "../lib/gtag";
import { Router } from "next/router";
import React from "react";
import {
  AmplifyAuthenticator,
  AmplifySignUp,
} from "@aws-amplify/ui-react";

Router.events.on("routeChangeComplete", (url) => gtag.pageview(url));

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AmplifyAuthenticator>
      <AmplifySignUp
        slot="sign-up"
        // usernameAlias="email"
        formFields={[
					{
            type: "username",
            label: "Custom User Name",
            placeholder: "Enter",
						inputProps: { required: true, autocomplete: "username" },
          },
          {
            type: "email",
            label: "Custom Email Label",
            placeholder: "Enter",
            inputProps: { required: true, autocomplete: "email" , hint: "MAx length- 8"},
          },
          {
            type: "password",
            label: "Custom Password Label",
            placeholder: "Enter",
            inputProps: { required: true, autocomplete: "new-password" , hint: "MAx length- 8"},
          },
         
        ]}
      />
      {/* <AmplifySignIn/> */}
      <Component {...pageProps} />
    </AmplifyAuthenticator>
  );
}
