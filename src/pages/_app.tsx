import "@aws-amplify/ui/dist/style.css";
import { AppProps } from "next/app";
import "../styles/index.less";
import * as gtag from "../lib/gtag";
import { Router } from "next/router";
import {
  AmplifyAuthenticator,
  AmplifySignUp,
} from "@aws-amplify/ui-react";
import * as Sentry from "@sentry/react";
import { Integrations } from "@sentry/tracing";
import React from "react";

Router.events.on("routeChangeComplete", (url) => gtag.pageview(url));

Sentry.init({
  dsn: "https://1602dc188f824b5a8866649405d5246b@o1048380.ingest.sentry.io/6027644",
  integrations: [new Integrations.BrowserTracing()],

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,
});

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
