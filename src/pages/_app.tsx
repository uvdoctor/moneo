import "@aws-amplify/ui/dist/style.css";
import { AppProps } from "next/app";
import "../styles/index.less";
import * as gtag from "../lib/gtag";
import { Router } from "next/router";
import {
  AmplifyAuthenticator,
  AmplifySignUp,
} from "@aws-amplify/ui-react";
import React from "react";

Router.events.on("routeChangeComplete", (url) => gtag.pageview(url));

export default function MyApp({ Component, pageProps }: AppProps) {

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
     
      <Component {...pageProps} />
    </AmplifyAuthenticator>
  );
}
